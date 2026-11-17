-- PROPOSAL ONLY: validated in isolated PostgreSQL; not applied to production.
-- Generate an official migration with the Supabase CLI after review.
begin;

create table public.cia_businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.cia_profiles(id),
  name text not null check (char_length(name) between 1 and 100),
  category text not null,
  description text not null default '',
  country text not null check (country ~ '^[A-Z]{2}$'),
  city text not null,
  address text not null,
  phone text not null default '',
  contact_email text not null,
  brand_color text not null default '#C99B4C' check (brand_color ~ '^#[0-9A-Fa-f]{6}$'),
  timezone text not null default 'America/Tijuana',
  hours text not null default '',
  service_description text not null default '',
  uses_points boolean not null default false,
  uses_rewards boolean not null default false,
  accepts_bookings boolean not null default false,
  status text not null default 'private' check (status in ('private','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index cia_businesses_owner_idx on public.cia_businesses(owner_id);

create table public.cia_business_members (
  business_id uuid not null references public.cia_businesses(id),
  user_id uuid not null references public.cia_profiles(id),
  role text not null check (role in ('owner','admin','staff')),
  created_at timestamptz not null default now(),
  primary key(business_id,user_id)
);
create index cia_business_members_user_idx on public.cia_business_members(user_id);

create table public.cia_locations (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.cia_businesses(id),
  name text not null check (char_length(name) between 1 and 100),
  address text not null,
  city text not null,
  hours text not null default '',
  timezone text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create index cia_locations_business_idx on public.cia_locations(business_id);

create table public.cia_business_drafts (
  owner_id uuid primary key references public.cia_profiles(id),
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload)='object'),
  step integer not null default 1 check (step between 1 and 4),
  revision integer not null default 0 check (revision >= 0),
  business_id uuid unique references public.cia_businesses(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.cia_business_activity (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.cia_businesses(id),
  actor_id uuid not null references public.cia_profiles(id),
  action text not null,
  created_at timestamptz not null default now()
);
create index cia_business_activity_business_idx on public.cia_business_activity(business_id,created_at desc);

alter table public.cia_businesses enable row level security;
alter table public.cia_business_members enable row level security;
alter table public.cia_locations enable row level security;
alter table public.cia_business_drafts enable row level security;
alter table public.cia_business_activity enable row level security;
revoke all on public.cia_businesses,public.cia_business_members,public.cia_locations,
  public.cia_business_drafts,public.cia_business_activity from anon,authenticated;
grant select on public.cia_businesses,public.cia_business_members,public.cia_locations,
  public.cia_business_drafts,public.cia_business_activity to authenticated;
create policy cia_businesses_owner_read on public.cia_businesses for select to authenticated
  using (owner_id=(select auth.uid()));
create policy cia_members_self_read on public.cia_business_members for select to authenticated
  using (user_id=(select auth.uid()));
create policy cia_drafts_owner_read on public.cia_business_drafts for select to authenticated
  using (owner_id=(select auth.uid()));
create policy cia_locations_owner_read on public.cia_locations for select to authenticated
  using (exists(select 1 from public.cia_businesses b where b.id=business_id and b.owner_id=(select auth.uid())));
create policy cia_activity_owner_read on public.cia_business_activity for select to authenticated
  using (exists(select 1 from public.cia_businesses b where b.id=business_id and b.owner_id=(select auth.uid())));

create function cia_private.require_company() returns uuid
language plpgsql security invoker set search_path='' as $$
declare actor uuid := auth.uid();
begin
  if actor is null or not exists(select 1 from public.cia_profiles where id=actor and account_type='company') then
    raise exception using errcode='42501', message='company_account_required';
  end if;
  return actor;
end;
$$;
revoke all on function cia_private.require_company() from public,anon,authenticated;

create function cia_private.normalize_business_payload(input jsonb, strict boolean)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare result jsonb := '{}'::jsonb; field text; value text; limit_length integer;
begin
  if input is null or jsonb_typeof(input)<>'object' or octet_length(input::text)>16000 then
    raise exception using errcode='22023',message='invalid_business_payload';
  end if;
  if exists(select 1 from jsonb_object_keys(input) k where k not in (
    'name','category','description','country','city','address','phone','contact_email',
    'brand_color','timezone','hours','service_description','uses_points','uses_rewards','accepts_bookings')) then
    raise exception using errcode='22023',message='unknown_business_field';
  end if;
  foreach field in array array['name','category','description','country','city','address','phone','contact_email','brand_color','timezone','hours','service_description'] loop
    if input ? field and jsonb_typeof(input->field)<>'string' then
      raise exception using errcode='22023',message='invalid_business_field_type';
    end if;
    value := btrim(coalesce(input->>field,''));
    limit_length := case field when 'name' then 100 when 'category' then 60 when 'country' then 2
      when 'city' then 80 when 'address' then 180 when 'phone' then 35 when 'contact_email' then 255
      when 'brand_color' then 7 when 'timezone' then 80 else 500 end;
    if char_length(value)>limit_length then raise exception using errcode='22023',message='business_field_too_long'; end if;
    if field='country' then value:=upper(value); end if;
    if field='brand_color' and value='' then value:='#C99B4C'; end if;
    if field='timezone' and value='' then value:='America/Tijuana'; end if;
    result:=result||jsonb_build_object(field,value);
  end loop;
  foreach field in array array['uses_points','uses_rewards','accepts_bookings'] loop
    if input ? field and jsonb_typeof(input->field)<>'boolean' then
      raise exception using errcode='22023',message='invalid_business_field_type';
    end if;
    result:=result||jsonb_build_object(field,coalesce((input->>field)::boolean,false));
  end loop;
  if result->>'brand_color' !~ '^#[0-9A-Fa-f]{6}$' then raise exception using errcode='22023',message='invalid_brand_color'; end if;
  if not exists(select 1 from pg_catalog.pg_timezone_names where name=result->>'timezone') then
    raise exception using errcode='22023',message='invalid_timezone';
  end if;
  if result->>'country'<>'' and result->>'country' !~ '^[A-Z]{2}$' then raise exception using errcode='22023',message='invalid_country'; end if;
  if result->>'category'<>'' and result->>'category' not in ('cafeteria','restaurante','belleza','bienestar','comercio','servicios','experiencias','otro') then
    raise exception using errcode='22023',message='invalid_category';
  end if;
  if result->>'contact_email'<>'' and result->>'contact_email' !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
    raise exception using errcode='22023',message='invalid_contact_email';
  end if;
  if strict then
    foreach field in array array['name','category','country','city','address','contact_email'] loop
      if result->>field='' then raise exception using errcode='22023',message='incomplete_business'; end if;
    end loop;
  end if;
  return result;
end;
$$;
revoke all on function cia_private.normalize_business_payload(jsonb,boolean) from public,anon,authenticated;

-- Deliberate privileged API: narrowly scoped, explicit actor validation and grants.
-- Clients cannot write tables or choose owner/member/status through these functions.
create function public.cia_save_business_draft(p_payload jsonb,p_step integer,p_revision integer)
returns jsonb language plpgsql security definer set search_path='' as $$
declare actor uuid; draft public.cia_business_drafts; normalized jsonb;
begin
  actor:=cia_private.require_company();
  if p_step is null or p_step not between 1 and 4 or p_revision is null or p_revision<0 then
    raise exception using errcode='22023',message='invalid_draft_version';
  end if;
  normalized:=cia_private.normalize_business_payload(p_payload,false);
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(actor::text,0));
  select * into draft from public.cia_business_drafts where owner_id=actor for update;
  if not found then
    if p_revision<>0 then raise exception using errcode='40001',message='draft_conflict'; end if;
    insert into public.cia_business_drafts(owner_id,payload,step,revision) values(actor,normalized,p_step,1) returning * into draft;
  else
    if draft.business_id is not null then raise exception using errcode='22023',message='onboarding_finished'; end if;
    if draft.revision<>p_revision then
      if draft.revision=p_revision+1 and draft.payload=normalized and draft.step=p_step then return to_jsonb(draft); end if;
      raise exception using errcode='40001',message='draft_conflict';
    end if;
    update public.cia_business_drafts set payload=normalized,step=p_step,revision=revision+1,updated_at=now()
      where owner_id=actor returning * into draft;
  end if;
  return to_jsonb(draft);
end;
$$;
revoke all on function public.cia_save_business_draft(jsonb,integer,integer) from public,anon;
grant execute on function public.cia_save_business_draft(jsonb,integer,integer) to authenticated;

create function public.cia_finish_business_onboarding(p_revision integer)
returns uuid language plpgsql security definer set search_path='' as $$
declare actor uuid; draft public.cia_business_drafts; p jsonb; business uuid;
begin
  actor:=cia_private.require_company();
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(actor::text,0));
  select * into draft from public.cia_business_drafts where owner_id=actor for update;
  if not found then raise exception using errcode='22023',message='business_draft_missing'; end if;
  if draft.business_id is not null then return draft.business_id; end if;
  if p_revision is null or draft.revision<>p_revision then raise exception using errcode='40001',message='draft_conflict'; end if;
  p:=cia_private.normalize_business_payload(draft.payload,true);
  insert into public.cia_businesses(owner_id,name,category,description,country,city,address,phone,contact_email,
    brand_color,timezone,hours,service_description,uses_points,uses_rewards,accepts_bookings)
  values(actor,p->>'name',p->>'category',p->>'description',p->>'country',p->>'city',p->>'address',p->>'phone',p->>'contact_email',
    p->>'brand_color',p->>'timezone',p->>'hours',p->>'service_description',(p->>'uses_points')::boolean,
    (p->>'uses_rewards')::boolean,(p->>'accepts_bookings')::boolean) returning id into business;
  insert into public.cia_business_members(business_id,user_id,role) values(business,actor,'owner');
  insert into public.cia_locations(business_id,name,address,city,hours,timezone)
    values(business,'Sucursal principal',p->>'address',p->>'city',p->>'hours',p->>'timezone');
  insert into public.cia_business_activity(business_id,actor_id,action) values(business,actor,'business_created');
  update public.cia_business_drafts set business_id=business,step=4,revision=revision+1,updated_at=now() where owner_id=actor;
  return business;
end;
$$;
revoke all on function public.cia_finish_business_onboarding(integer) from public,anon;
grant execute on function public.cia_finish_business_onboarding(integer) to authenticated;
commit;

-- Centro I.A. 3.2 · feature migration. Prepared/tested locally, not deployed automatically.
begin;
create table public.cia_club_settings(
 club_id uuid primary key references public.cia_clubs(id),
 business_kind text not null default 'other' check(business_kind in('salon','food','retail','wellness','fitness','professional','organization','other')),
 business_scale text not null default 'independent' check(business_scale in('independent','small','multi-site','organization')),
 theme text not null default 'midnight' check(theme in('midnight','ocean','sky','gold')),
 timezone text not null default 'America/Tijuana',
 logo_data text not null default '' check(char_length(logo_data)<=600000),
 booking_enabled boolean not null default false,
 phone text not null default '' check(char_length(phone)<=40),
 address text not null default '' check(char_length(address)<=250),
 hours text not null default '' check(char_length(hours)<=500),
 updated_at timestamptz not null default now()
);
create table public.cia_catalog_items(
 id uuid primary key default gen_random_uuid(),club_id uuid not null references public.cia_clubs(id),
 title text not null check(char_length(title) between 2 and 120),
 description text not null default '' check(char_length(description)<=1000),
 category text not null default 'General' check(char_length(category)<=80),
 item_kind text not null default 'product' check(item_kind in('product','service')),
 price numeric(12,2) not null default 0 check(price>=0 and price<=10000000),
 currency text not null default 'MXN' check(currency in('MXN','USD','EUR')),
 duration_minutes integer check(duration_minutes between 5 and 1440),
 active boolean not null default true,position integer not null default 0,
 request_key text not null,created_at timestamptz not null default now(),updated_at timestamptz not null default now(),
 unique(club_id,request_key)
);
create index cia_catalog_club_idx on public.cia_catalog_items(club_id);
create table public.cia_promotions(
 id uuid primary key default gen_random_uuid(),club_id uuid not null references public.cia_clubs(id),
 title text not null check(char_length(title) between 2 and 120),description text not null default '' check(char_length(description)<=1000),
 promotion_kind text not null check(promotion_kind in('discount','bundle','special','announcement')),
 value numeric(10,2) not null default 0 check(value between 0 and 1000000),
 starts_at timestamptz not null,ends_at timestamptz not null,active boolean not null default true,
 request_id uuid not null,created_at timestamptz not null default now(),unique(club_id,request_id),check(ends_at>starts_at)
);
create index cia_promotions_club_idx on public.cia_promotions(club_id);
create table public.cia_point_movements(
 id uuid primary key default gen_random_uuid(),club_id uuid not null,user_id uuid not null,
 amount integer not null check(amount<>0),reason text not null check(char_length(reason) between 3 and 250),
 actor_id uuid references public.cia_profiles(id),source_key text not null,
 created_at timestamptz not null default now(),foreign key(club_id,user_id) references public.cia_club_members(club_id,user_id),
 unique(club_id,user_id,source_key)
);
create index cia_movements_user_idx on public.cia_point_movements(user_id);
create index cia_movements_club_idx on public.cia_point_movements(club_id,created_at desc);
create table public.cia_appointments(
 id uuid primary key default gen_random_uuid(),club_id uuid not null,user_id uuid,
 catalog_id uuid references public.cia_catalog_items(id),title text not null check(char_length(title) between 2 and 120),
 starts_at timestamptz not null,ends_at timestamptz not null,resource text not null default 'Principal' check(char_length(resource) between 1 and 60),
 state text not null check(state in('requested','confirmed','completed','cancelled')),
 note text not null default '' check(char_length(note)<=500),request_id uuid not null,
 created_at timestamptz not null default now(),updated_at timestamptz not null default now(),
 foreign key(club_id,user_id) references public.cia_club_members(club_id,user_id),
 unique(club_id,request_id),check(ends_at>starts_at and ends_at<=starts_at+interval '24 hours')
);
create index cia_appointments_club_idx on public.cia_appointments(club_id,starts_at);
create index cia_appointments_user_idx on public.cia_appointments(user_id);
create index cia_appointments_catalog_idx on public.cia_appointments(catalog_id);
create table public.cia_inbox_notices(
 id uuid primary key default gen_random_uuid(),recipient_id uuid not null references public.cia_profiles(id),
 club_id uuid references public.cia_clubs(id),notice_kind text not null,
 title text not null,body text not null,source_key text not null,
 created_at timestamptz not null default now(),read_at timestamptz,unique(recipient_id,source_key)
);
create index cia_notices_recipient_idx on public.cia_inbox_notices(recipient_id,created_at desc);
create index cia_notices_club_idx on public.cia_inbox_notices(club_id);
create table public.cia_challenges(
 id uuid primary key default gen_random_uuid(),club_id uuid not null references public.cia_clubs(id),
 title text not null check(char_length(title) between 2 and 120),target_visits integer not null check(target_visits between 1 and 50),
 bonus_points integer not null check(bonus_points between 1 and 10000),
 starts_at timestamptz not null,ends_at timestamptz not null,active boolean not null default true,
 request_id uuid not null,unique(club_id,request_id),check(ends_at>starts_at)
);
create index cia_challenges_club_idx on public.cia_challenges(club_id);
create table public.cia_challenge_claims(
 challenge_id uuid not null references public.cia_challenges(id),user_id uuid not null references public.cia_profiles(id),
 bonus_points integer not null,claimed_at timestamptz not null default now(),primary key(challenge_id,user_id)
);
create index cia_claims_user_idx on public.cia_challenge_claims(user_id);

alter table public.cia_rewards add column reward_kind text not null default 'product' check(reward_kind in('product','discount','service','experience','gift'));
alter table public.cia_rewards add column terms text not null default '' check(char_length(terms)<=1000);
alter table public.cia_rewards add column valid_until timestamptz;

create function cia_private.studio_owner(p_club uuid) returns uuid language plpgsql security invoker set search_path='' as $$
#variable_conflict use_variable
declare actor uuid;
begin
 actor:=cia_private.loyalty_actor('company');
 if not exists(select 1 from public.cia_clubs where id=p_club and owner_id=actor) then raise exception using errcode='42501',message='club_not_owned';end if;
 return actor;
end;$$;
revoke all on function cia_private.studio_owner(uuid) from public,anon,authenticated;
create function cia_private.studio_text(p jsonb,k text,n integer,required boolean default false) returns text
language plpgsql security invoker set search_path='' as $$
#variable_conflict use_variable
declare v text;
begin
 if p is null or jsonb_typeof(p)<>'object' or octet_length(p::text)>900000 then raise exception using errcode='22023',message='invalid_document';end if;
 if p ? k and jsonb_typeof(p->k)<>'string' then raise exception using errcode='22023',message='invalid_field_type';end if;
 v:=btrim(coalesce(p->>k,''));
 if char_length(v)>n or (required and char_length(v)<2) then raise exception using errcode='22023',message='invalid_field';end if;return v;
end;$$;
revoke all on function cia_private.studio_text(jsonb,text,integer,boolean) from public,anon,authenticated;
create function cia_private.studio_notice(recipient uuid,club uuid,kind text,title text,body text,source text) returns void
language sql security invoker set search_path='' as $$
 insert into public.cia_inbox_notices(recipient_id,club_id,notice_kind,title,body,source_key) select recipient,club,kind,title,body,source where recipient is not null on conflict(recipient_id,source_key) do nothing;
$$;
revoke all on function cia_private.studio_notice(uuid,uuid,text,text,text,text) from public,anon,authenticated;

-- No direct writes; authenticated reads are filtered, then RPCs provide narrow mutations.
do $$declare table_name text;begin
 foreach table_name in array array['cia_club_settings','cia_catalog_items','cia_promotions','cia_point_movements','cia_appointments','cia_inbox_notices','cia_challenges','cia_challenge_claims'] loop
 execute format('alter table public.%I enable row level security',table_name);
 execute format('revoke all on public.%I from public,anon,authenticated',table_name);
 execute format('grant select on public.%I to authenticated',table_name);
 end loop;
end$$;
create policy cia_settings_owner on public.cia_club_settings for select to authenticated using(exists(select 1 from public.cia_clubs c where c.id=club_id and c.owner_id=(select auth.uid())));
create policy cia_catalog_owner on public.cia_catalog_items for select to authenticated using(exists(select 1 from public.cia_clubs c where c.id=club_id and c.owner_id=(select auth.uid())));
create policy cia_promotions_owner on public.cia_promotions for select to authenticated using(exists(select 1 from public.cia_clubs c where c.id=club_id and c.owner_id=(select auth.uid())));
create policy cia_movements_read on public.cia_point_movements for select to authenticated using(user_id=(select auth.uid()) or exists(select 1 from public.cia_clubs c where c.id=club_id and c.owner_id=(select auth.uid())));
create policy cia_appointments_read on public.cia_appointments for select to authenticated using(user_id=(select auth.uid()) or exists(select 1 from public.cia_clubs c where c.id=club_id and c.owner_id=(select auth.uid())));
create policy cia_notices_read on public.cia_inbox_notices for select to authenticated using(recipient_id=(select auth.uid()));
create policy cia_challenges_owner on public.cia_challenges for select to authenticated using(exists(select 1 from public.cia_clubs c where c.id=club_id and c.owner_id=(select auth.uid())));
create policy cia_claims_read on public.cia_challenge_claims for select to authenticated using(user_id=(select auth.uid()));

create function public.cia_studio_save_business(p_club uuid,p_business jsonb,p_settings jsonb) returns uuid
language plpgsql security definer set search_path='' as $$
#variable_conflict use_variable
declare actor uuid; club uuid:=p_club; name text;category text;city text;description text;points integer;kind text;scale text;theme text;zone text;logo text;bookings boolean;
begin
 actor:=cia_private.loyalty_actor('company');
 name:=cia_private.studio_text(p_business,'name',100,true);category:=cia_private.studio_text(p_business,'category',60,true);
 city:=cia_private.studio_text(p_business,'city',80,true);description:=cia_private.studio_text(p_business,'description',500);
 points:=(p_business->>'points_per_visit')::integer;if points is null or points not between 1 and 1000 then raise exception using errcode='22023',message='invalid_club';end if;
 kind:=cia_private.studio_text(p_settings,'business_kind',30,true);scale:=cia_private.studio_text(p_settings,'business_scale',30,true);theme:=cia_private.studio_text(p_settings,'theme',20,true);
 zone:=cia_private.studio_text(p_settings,'timezone',80,true);logo:=cia_private.studio_text(p_settings,'logo_data',600000);
 if kind not in('salon','food','retail','wellness','fitness','professional','organization','other') or scale not in('independent','small','multi-site','organization') or theme not in('midnight','ocean','sky','gold') or not exists(select 1 from pg_catalog.pg_timezone_names tz where tz.name=zone) then raise exception using errcode='22023',message='invalid_settings';end if;
 if logo<>'' and logo !~ '^data:image/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$' then raise exception using errcode='22023',message='invalid_logo';end if;
 if jsonb_typeof(p_settings->'booking_enabled') is distinct from 'boolean' then raise exception using errcode='22023',message='invalid_settings';end if;bookings:=(p_settings->>'booking_enabled')::boolean;
 if club is null then club:=public.cia_create_club(name,category,city,description,points);end if;
 perform cia_private.studio_owner(club);
 update public.cia_clubs set name=name,category=category,city=city,description=description,points_per_visit=points where id=club;
 insert into public.cia_club_settings(club_id,business_kind,business_scale,theme,timezone,logo_data,booking_enabled,phone,address,hours)
 values(club,kind,scale,theme,zone,logo,bookings,cia_private.studio_text(p_settings,'phone',40),cia_private.studio_text(p_settings,'address',250),cia_private.studio_text(p_settings,'hours',500))
 on conflict(club_id) do update set business_kind=excluded.business_kind,business_scale=excluded.business_scale,theme=excluded.theme,timezone=excluded.timezone,logo_data=excluded.logo_data,booking_enabled=excluded.booking_enabled,phone=excluded.phone,address=excluded.address,hours=excluded.hours,updated_at=now();
 return club;
end;$$;

create function public.cia_studio_save_catalog(p_club uuid,p_items jsonb,p_request uuid) returns integer
language plpgsql security definer set search_path='' as $$
#variable_conflict use_variable
declare item jsonb;ordinal integer:=0;v_id uuid;v_title text;v_description text;v_category text;v_kind text;v_price numeric;v_currency text;v_duration integer;v_active boolean;
begin
 perform cia_private.studio_owner(p_club);
 if p_request is null or p_items is null or jsonb_typeof(p_items)<>'array' or jsonb_array_length(p_items) not between 1 and 250 or octet_length(p_items::text)>900000 then raise exception using errcode='22023',message='invalid_catalog';end if;
 for item in select value from jsonb_array_elements(p_items) loop
  ordinal:=ordinal+1;v_id:=nullif(item->>'id','')::uuid;v_title:=cia_private.studio_text(item,'title',120,true);v_description:=cia_private.studio_text(item,'description',1000);v_category:=coalesce(nullif(cia_private.studio_text(item,'category',80),''),'General');
  v_kind:=coalesce(nullif(cia_private.studio_text(item,'item_kind',20),''),'product');v_currency:=coalesce(nullif(cia_private.studio_text(item,'currency',3),''),'MXN');v_price:=coalesce((item->>'price')::numeric,0);v_duration:=nullif(item->>'duration_minutes','')::integer;
  if v_kind not in('product','service') or v_currency not in('MXN','USD','EUR') or v_price<0 or v_price>10000000 or (v_duration is not null and v_duration not between 5 and 1440) then raise exception using errcode='22023',message='invalid_catalog';end if;
  v_active:=coalesce((item->>'active')::boolean,true);
  if v_id is null then
   insert into public.cia_catalog_items(club_id,title,description,category,item_kind,price,currency,duration_minutes,active,position,request_key)
   values(p_club,v_title,v_description,v_category,v_kind,v_price,v_currency,v_duration,v_active,ordinal,p_request::text||':'||ordinal) on conflict(club_id,request_key) do nothing;
  else
   update public.cia_catalog_items set title=v_title,description=v_description,category=v_category,item_kind=v_kind,price=v_price,currency=v_currency,duration_minutes=v_duration,active=v_active,updated_at=now() where id=v_id and club_id=p_club;
   if not found then raise exception using errcode='42501',message='catalog_not_owned';end if;
  end if;
 end loop;return ordinal;
end;$$;

create function public.cia_studio_save_promotion(p_club uuid,p_payload jsonb,p_request uuid) returns uuid
language plpgsql security definer set search_path='' as $$
#variable_conflict use_variable
declare result uuid;title text;description text;kind text;v numeric;starts timestamptz;ends timestamptz;active boolean;
begin
 perform cia_private.studio_owner(p_club);if p_request is null then raise exception using errcode='22023',message='request_required';end if;
 title:=cia_private.studio_text(p_payload,'title',120,true);description:=cia_private.studio_text(p_payload,'description',1000);
 kind:=cia_private.studio_text(p_payload,'promotion_kind',20,true);v:=coalesce((p_payload->>'value')::numeric,0);starts:=(p_payload->>'starts_at')::timestamptz;ends:=(p_payload->>'ends_at')::timestamptz;active:=coalesce((p_payload->>'active')::boolean,true);
 if kind not in('discount','bundle','special','announcement') or v<0 or v>1000000 or(kind='discount' and v>100) or starts is null or ends is null or ends<=starts then raise exception using errcode='22023',message='invalid_promotion';end if;
 result:=nullif(p_payload->>'id','')::uuid;
 if result is null then
  insert into public.cia_promotions(club_id,title,description,promotion_kind,value,starts_at,ends_at,active,request_id) values(p_club,title,description,kind,v,starts,ends,active,p_request)
  on conflict(club_id,request_id) do update set request_id=excluded.request_id returning id into result;
 else
  update public.cia_promotions set title=title,description=description,promotion_kind=kind,value=v,starts_at=starts,ends_at=ends,active=active where id=result and club_id=p_club;
  if not found then raise exception using errcode='42501',message='club_not_owned';end if;
 end if;
 return result;
end;$$;

create function public.cia_studio_adjust_points(p_club uuid,p_user uuid,p_amount integer,p_reason text,p_request uuid) returns integer
language plpgsql security definer set search_path='' as $$
#variable_conflict use_variable
declare actor uuid;balance integer;existing public.cia_point_movements;
begin
 actor:=cia_private.studio_owner(p_club);
 if p_amount is null or p_amount=0 or abs(p_amount::bigint)>100000 or p_reason is null or char_length(btrim(p_reason)) not between 3 and 250 or p_request is null then raise exception using errcode='22023',message='invalid_adjustment';end if;
 select points into balance from public.cia_club_members where club_id=p_club and user_id=p_user for update;
 if not found then raise exception using errcode='22023',message='member_unavailable';end if;
 select * into existing from public.cia_point_movements where club_id=p_club and user_id=p_user and source_key='adjust:'||p_request::text;
 if found then
  if existing.amount<>p_amount or existing.reason<>btrim(p_reason) then raise exception using errcode='22023',message='request_conflict';end if;return balance;
 end if;
 if balance+p_amount<0 then raise exception using errcode='22023',message='negative_balance';end if;
 update public.cia_club_members set points=points+p_amount where club_id=p_club and user_id=p_user returning points into balance;
 insert into public.cia_point_movements(club_id,user_id,amount,reason,actor_id,source_key) values(p_club,p_user,p_amount,btrim(p_reason),actor,'adjust:'||p_request::text);
 perform cia_private.studio_notice(p_user,p_club,'points','Tus puntos se actualizaron',p_amount::text||' puntos. Motivo: '||btrim(p_reason),'adjust:'||p_club::text||':'||p_request::text);
 return balance;
end;$$;

create function public.cia_studio_save_appointment(p_club uuid,p_payload jsonb,p_request uuid) returns uuid
language plpgsql security definer set search_path='' as $$
#variable_conflict use_variable
declare actor uuid;is_owner boolean;customer uuid;service uuid;title text;note text;resource text;starts timestamptz;ends timestamptz;result uuid;owner uuid;
begin
 actor:=cia_private.loyalty_actor();select owner_id into owner from public.cia_clubs where id=p_club;if owner is null then raise exception using errcode='22023',message='club_unavailable';end if;is_owner:=actor=owner;
 if p_request is null then raise exception using errcode='22023',message='request_required';end if;
 customer:=case when is_owner then nullif(p_payload->>'user_id','')::uuid else actor end;
 if customer is not null and not exists(select 1 from public.cia_club_members where club_id=p_club and user_id=customer) then raise exception using errcode='42501',message='join_first';end if;
 if not is_owner and not exists(select 1 from public.cia_club_settings where club_id=p_club and booking_enabled) then raise exception using errcode='22023',message='bookings_disabled';end if;
 service:=nullif(p_payload->>'catalog_id','')::uuid;
 if service is not null and not exists(select 1 from public.cia_catalog_items where id=service and club_id=p_club and active) then raise exception using errcode='22023',message='invalid_service';end if;
 title:=cia_private.studio_text(p_payload,'title',120,true);note:=cia_private.studio_text(p_payload,'note',500);resource:=coalesce(nullif(cia_private.studio_text(p_payload,'resource',60),''),'Principal');
 starts:=(p_payload->>'starts_at')::timestamptz;ends:=(p_payload->>'ends_at')::timestamptz;
 if starts is null or ends is null or ends<=starts or ends>starts+interval '24 hours' or(not is_owner and starts<now()) then raise exception using errcode='22023',message='invalid_appointment';end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('calendar:'||p_club::text,0));
 select id into result from public.cia_appointments where club_id=p_club and request_id=p_request;
 if found then return result;end if;
 if is_owner and exists(select 1 from public.cia_appointments a where a.club_id=p_club and a.resource=resource and a.state='confirmed' and a.starts_at<ends and a.ends_at>starts) then raise exception using errcode='22023',message='appointment_conflict';end if;
 insert into public.cia_appointments(club_id,user_id,catalog_id,title,starts_at,ends_at,resource,state,note,request_id)
 values(p_club,customer,service,title,starts,ends,resource,case when is_owner then 'confirmed' else 'requested' end,note,p_request) returning id into result;
 perform cia_private.studio_notice(case when is_owner then customer else owner end,p_club,'appointment',case when is_owner then 'Tu cita está confirmada' else 'Nueva solicitud de cita' end,title,'appointment:'||result::text);
 return result;
end;$$;

create function public.cia_studio_update_appointment(p_id uuid,p_state text) returns void
language plpgsql security definer set search_path='' as $$
#variable_conflict use_variable
declare actor uuid;v public.cia_appointments;owner uuid;
begin
 actor:=cia_private.loyalty_actor();select * into v from public.cia_appointments where id=p_id;if not found then raise exception using errcode='22023',message='appointment_unavailable';end if;
 select owner_id into owner from public.cia_clubs where id=v.club_id;
 if actor<>owner and not(actor=v.user_id and p_state='cancelled') then raise exception using errcode='42501',message='club_not_owned';end if;
 if p_state is null or p_state not in('confirmed','completed','cancelled') then raise exception using errcode='22023',message='invalid_appointment_state';end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('calendar:'||v.club_id::text,0));
 select * into v from public.cia_appointments where id=p_id for update;
 if v.state=p_state then return;end if;
 if v.state in('completed','cancelled') or(p_state='completed' and v.state<>'confirmed') then raise exception using errcode='22023',message='invalid_appointment_state';end if;
 if p_state='confirmed' and exists(select 1 from public.cia_appointments a where a.club_id=v.club_id and a.id<>v.id and a.resource=v.resource and a.state='confirmed' and a.starts_at<v.ends_at and a.ends_at>v.starts_at) then raise exception using errcode='22023',message='appointment_conflict';end if;
 update public.cia_appointments set state=p_state,updated_at=now() where id=p_id;
 if v.user_id is not null then perform cia_private.studio_notice(v.user_id,v.club_id,'appointment','Tu cita cambió de estado',v.title||': '||case p_state when 'confirmed' then 'confirmada' when 'completed' then 'completada' when 'cancelled' then 'cancelada' else p_state end,'appointment:'||p_id::text||':'||p_state);end if;
end;$$;

create function public.cia_studio_read_notice(p_id uuid) returns void language plpgsql security definer set search_path='' as $$
#variable_conflict use_variable
begin
 perform cia_private.loyalty_actor();update public.cia_inbox_notices set read_at=coalesce(read_at,now()) where id=p_id and recipient_id=auth.uid();
 if not found then raise exception using errcode='42501',message='notice_not_owned';end if;
end;$$;

create function public.cia_studio_save_challenge(p_club uuid,p_payload jsonb,p_request uuid) returns uuid
language plpgsql security definer set search_path='' as $$
#variable_conflict use_variable
declare title text;target integer;bonus integer;starts timestamptz;ends timestamptz;result uuid;
begin
 perform cia_private.studio_owner(p_club);title:=cia_private.studio_text(p_payload,'title',120,true);target:=(p_payload->>'target_visits')::integer;bonus:=(p_payload->>'bonus_points')::integer;starts:=(p_payload->>'starts_at')::timestamptz;ends:=(p_payload->>'ends_at')::timestamptz;
 if target is null or target not between 1 and 50 or bonus is null or bonus not between 1 and 10000 or starts is null or ends is null or ends<=starts or p_request is null then raise exception using errcode='22023',message='invalid_challenge';end if;
 insert into public.cia_challenges(club_id,title,target_visits,bonus_points,starts_at,ends_at,request_id) values(p_club,title,target,bonus,starts,ends,p_request) on conflict(club_id,request_id) do update set request_id=excluded.request_id returning id into result;return result;
end;$$;
create function public.cia_studio_claim_challenge(p_id uuid) returns integer
language plpgsql security definer set search_path='' as $$
#variable_conflict use_variable
declare actor uuid;v public.cia_challenges;balance integer;visits integer;
begin
 actor:=cia_private.loyalty_actor('user');select * into v from public.cia_challenges where id=p_id;
 if not found then raise exception using errcode='22023',message='challenge_unavailable';end if;
 select points into balance from public.cia_club_members where club_id=v.club_id and user_id=actor for update;
 if not found then raise exception using errcode='42501',message='join_first';end if;
 if exists(select 1 from public.cia_challenge_claims where challenge_id=p_id and user_id=actor) then return balance;end if;
 if not v.active or now()<v.starts_at or now()>v.ends_at then raise exception using errcode='22023',message='challenge_unavailable';end if;
 select count(*) into visits from public.cia_visits where club_id=v.club_id and user_id=actor and confirmed_at is not null and arrived_at>=v.starts_at and arrived_at<=v.ends_at;
 if visits<v.target_visits then raise exception using errcode='22023',message='challenge_incomplete';end if;
 insert into public.cia_challenge_claims(challenge_id,user_id,bonus_points) values(p_id,actor,v.bonus_points);
 update public.cia_club_members set points=points+v.bonus_points where club_id=v.club_id and user_id=actor returning points into balance;
 insert into public.cia_point_movements(club_id,user_id,amount,reason,actor_id,source_key) values(v.club_id,actor,v.bonus_points,v.title,actor,'challenge:'||p_id::text);
 perform cia_private.studio_notice(actor,v.club_id,'challenge','¡Reto completado!',v.title||': +'||v.bonus_points::text||' puntos','challenge:'||p_id::text);
 return balance;
end;$$;

create function public.cia_studio_save_reward(p_club uuid,p_payload jsonb,p_request uuid) returns uuid
language plpgsql security definer set search_path='' as $$
#variable_conflict use_variable
declare result uuid;title text;description text;kind text;terms text;cost integer;stock integer;expiry timestamptz;
begin
 perform cia_private.studio_owner(p_club);title:=cia_private.studio_text(p_payload,'title',100,true);description:=cia_private.studio_text(p_payload,'description',500);kind:=cia_private.studio_text(p_payload,'reward_kind',20,true);terms:=cia_private.studio_text(p_payload,'terms',1000);cost:=(p_payload->>'points_cost')::integer;stock:=nullif(p_payload->>'stock','')::integer;expiry:=nullif(p_payload->>'valid_until','')::timestamptz;
 if kind not in('product','discount','service','experience','gift') or cost is null or cost not between 1 and 1000000 or stock<0 then raise exception using errcode='22023',message='invalid_reward';end if;
 result:=nullif(p_payload->>'id','')::uuid;
 if result is null then result:=public.cia_save_reward(p_club,title,description,cost,stock,p_request);else
 update public.cia_rewards set title=title,description=description,points_cost=cost,stock=stock where id=result and club_id=p_club;if not found then raise exception using errcode='42501',message='club_not_owned';end if;end if;
 update public.cia_rewards set reward_kind=kind,terms=terms,valid_until=expiry where id=result;
 return result;
end;$$;

create function cia_private.studio_visit_event() returns trigger language plpgsql security definer set search_path='' as $$
#variable_conflict use_variable
begin
 if new.confirmed_at is not null and old.confirmed_at is null and new.awarded_points>0 then
 insert into public.cia_point_movements(club_id,user_id,amount,reason,actor_id,source_key) values(new.club_id,new.user_id,new.awarded_points,'Visita confirmada',auth.uid(),'visit:'||new.id::text) on conflict do nothing;
 perform cia_private.studio_notice(new.user_id,new.club_id,'points','Tu visita ya sumó puntos','Recibiste '||new.awarded_points::text||' puntos por volver.','visit:'||new.id::text);
 end if;return new;
end;$$;
revoke all on function cia_private.studio_visit_event() from public,anon,authenticated;
create trigger cia_studio_visit_event after update of confirmed_at on public.cia_visits for each row execute function cia_private.studio_visit_event();
create function cia_private.studio_redemption_event() returns trigger language plpgsql security definer set search_path='' as $$
#variable_conflict use_variable
declare owner uuid;
begin
 if TG_OP='INSERT' then
 insert into public.cia_point_movements(club_id,user_id,amount,reason,actor_id,source_key) values(new.club_id,new.user_id,-new.points_cost,'Canje: '||new.reward_title,auth.uid(),'redemption:'||new.id::text) on conflict do nothing;
 select owner_id into owner from public.cia_clubs where id=new.club_id;
 perform cia_private.studio_notice(owner,new.club_id,'redemption','Un premio está por entregar',new.reward_title,'redemption:'||new.id::text);
 elsif new.state='delivered' and old.state<>'delivered' then
 perform cia_private.studio_notice(new.user_id,new.club_id,'redemption','¡Disfruta tu premio!',new.reward_title||' quedó entregado.','delivered:'||new.id::text);
 end if;return new;
end;$$;
revoke all on function cia_private.studio_redemption_event() from public,anon,authenticated;
create trigger cia_studio_redemption_event after insert or update of state on public.cia_redemptions for each row execute function cia_private.studio_redemption_event();

-- Baseline only for pre-existing balances. No fixture data.
insert into public.cia_point_movements(club_id,user_id,amount,reason,source_key) select club_id,user_id,points,'Saldo anterior a versión 3.2','opening' from public.cia_club_members where points<>0;

create or replace function public.cia_redeem_reward(p_reward uuid,p_request uuid) returns uuid
language plpgsql security definer set search_path='' as $$
declare actor uuid; reward public.cia_rewards; member public.cia_club_members; existing public.cia_redemptions; result uuid; club uuid;
begin
 actor:=cia_private.loyalty_actor('user');
 if p_request is null then raise exception using errcode='22023',message='request_required';end if;
 select club_id into club from public.cia_rewards where id=p_reward;
 if club is null then raise exception using errcode='22023',message='reward_unavailable';end if;
 select * into member from public.cia_club_members where club_id=club and user_id=actor for update;
 if not found then raise exception using errcode='42501',message='join_first';end if;
 select * into existing from public.cia_redemptions where user_id=actor and request_id=p_request;
 if found then
  if existing.reward_id<>p_reward then raise exception using errcode='22023',message='request_conflict';end if;
  return existing.id;
 end if;
 select * into reward from public.cia_rewards where id=p_reward for update;
 if not reward.active or reward.stock=0 or (reward.valid_until is not null and reward.valid_until<now()) then raise exception using errcode='22023',message='reward_unavailable';end if;
 if member.points<reward.points_cost then raise exception using errcode='22023',message='not_enough_points';end if;
 update public.cia_club_members set points=points-reward.points_cost where club_id=club and user_id=actor;
 update public.cia_rewards set stock=stock-1 where id=p_reward and stock is not null;
 insert into public.cia_redemptions(reward_id,club_id,user_id,request_id,points_cost,reward_title)
 values(p_reward,club,actor,p_request,reward.points_cost,reward.title) returning id into result;
 return result;
end;$$;


create function public.cia_studio_snapshot() returns jsonb language plpgsql security definer set search_path='' as $$
#variable_conflict use_variable
declare actor uuid;
begin
 actor:=cia_private.loyalty_actor();
 return jsonb_build_object(
 'settings',coalesce((select jsonb_agg(x) from(select s.* from public.cia_club_settings s join public.cia_clubs c on c.id=s.club_id where c.owner_id=actor or exists(select 1 from public.cia_club_members m where m.club_id=c.id and m.user_id=actor) limit 120)x),'[]'),
 'catalog',coalesce((select jsonb_agg(x) from(select i.* from public.cia_catalog_items i join public.cia_clubs c on c.id=i.club_id where c.owner_id=actor or(i.active and exists(select 1 from public.cia_club_members m where m.club_id=c.id and m.user_id=actor)) order by i.position,i.category,i.title limit 500)x),'[]'),
 'promotions',coalesce((select jsonb_agg(x) from(select p.* from public.cia_promotions p join public.cia_clubs c on c.id=p.club_id where c.owner_id=actor or(p.active and p.starts_at<=now() and p.ends_at>=now() and exists(select 1 from public.cia_club_members m where m.club_id=c.id and m.user_id=actor)) order by p.starts_at desc limit 100)x),'[]'),
 'appointments',coalesce((select jsonb_agg(x) from(select a.*,p.name as customer_name,c.name as club_name from public.cia_appointments a join public.cia_clubs c on c.id=a.club_id left join public.cia_profiles p on p.id=a.user_id where c.owner_id=actor or a.user_id=actor order by a.starts_at desc limit 300)x),'[]'),
 'notices',coalesce((select jsonb_agg(x) from(select n.* from public.cia_inbox_notices n where n.recipient_id=actor order by n.created_at desc limit 100)x),'[]'),
 'movements',coalesce((select jsonb_agg(x) from(select v.*,p.name as customer_name,c.name as club_name from public.cia_point_movements v join public.cia_clubs c on c.id=v.club_id join public.cia_profiles p on p.id=v.user_id where c.owner_id=actor or v.user_id=actor order by v.created_at desc limit 300)x),'[]'),
 'challenges',coalesce((select jsonb_agg(x) from(select h.*,(select count(*) from public.cia_visits vv where vv.club_id=h.club_id and vv.user_id=actor and vv.confirmed_at is not null and vv.arrived_at>=h.starts_at and vv.arrived_at<=h.ends_at) as progress_count from public.cia_challenges h join public.cia_clubs c on c.id=h.club_id where c.owner_id=actor or(h.active and exists(select 1 from public.cia_club_members m where m.club_id=c.id and m.user_id=actor)) order by h.ends_at limit 100)x),'[]'),
 'claims',coalesce((select jsonb_agg(x) from(select * from public.cia_challenge_claims where user_id=actor)x),'[]'),
 'server_time',now());
end;$$;

revoke all on function public.cia_studio_save_business(uuid,jsonb,jsonb),public.cia_studio_save_catalog(uuid,jsonb,uuid),public.cia_studio_save_promotion(uuid,jsonb,uuid),public.cia_studio_adjust_points(uuid,uuid,integer,text,uuid),public.cia_studio_save_appointment(uuid,jsonb,uuid),public.cia_studio_update_appointment(uuid,text),public.cia_studio_read_notice(uuid),public.cia_studio_save_challenge(uuid,jsonb,uuid),public.cia_studio_claim_challenge(uuid),public.cia_studio_save_reward(uuid,jsonb,uuid),public.cia_studio_snapshot() from public,anon,authenticated;
grant execute on function public.cia_studio_save_business(uuid,jsonb,jsonb),public.cia_studio_save_catalog(uuid,jsonb,uuid),public.cia_studio_save_promotion(uuid,jsonb,uuid),public.cia_studio_adjust_points(uuid,uuid,integer,text,uuid),public.cia_studio_save_appointment(uuid,jsonb,uuid),public.cia_studio_update_appointment(uuid,text),public.cia_studio_read_notice(uuid),public.cia_studio_save_challenge(uuid,jsonb,uuid),public.cia_studio_claim_challenge(uuid),public.cia_studio_save_reward(uuid,jsonb,uuid),public.cia_studio_snapshot() to authenticated;
commit;

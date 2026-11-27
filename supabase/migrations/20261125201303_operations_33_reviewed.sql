-- Operations 3.3 and permission correction deploy atomically.
begin;
-- Centro I.A. Operations 3.3. LOCAL ONLY until separately reviewed for deployment.

create table public.cia_locations(
 id uuid primary key default gen_random_uuid(),club_id uuid not null references public.cia_clubs(id),
 name text not null check(char_length(name) between 2 and 100),address text not null default '' check(char_length(address)<=250),
 timezone text not null default 'America/Tijuana',active boolean not null default true,is_primary boolean not null default false,
 request_id uuid not null default gen_random_uuid(),created_at timestamptz not null default now(),unique(club_id,request_id),unique(id,club_id)
);
create unique index cia_locations_primary on public.cia_locations(club_id) where is_primary;
create table public.cia_team_members(
 id uuid primary key default gen_random_uuid(),club_id uuid not null,location_id uuid not null,user_id uuid not null references public.cia_profiles(id),
 role text not null check(role in('manager','reception','professional')),active boolean not null default true,created_at timestamptz not null default now(),
 foreign key(location_id,club_id) references public.cia_locations(id,club_id),unique(location_id,user_id)
);
create index cia_team_user on public.cia_team_members(user_id) where active;
create table public.cia_team_invites(
 id uuid primary key default gen_random_uuid(),club_id uuid not null,location_id uuid not null,role text not null check(role in('manager','reception','professional')),
 reference text not null default '' check(char_length(reference)<=100),code uuid not null unique default gen_random_uuid(),
 expires_at timestamptz not null default now()+interval '7 days',revoked boolean not null default false,accepted_by uuid references public.cia_profiles(id),
 request_id uuid not null,foreign key(location_id,club_id) references public.cia_locations(id,club_id),unique(club_id,request_id)
);
create table public.cia_resources(
 id uuid primary key default gen_random_uuid(),club_id uuid not null,location_id uuid not null,name text not null check(char_length(name) between 2 and 80),
 kind text not null check(kind in('professional','space','table','equipment','other')),staff_user_id uuid references public.cia_profiles(id),
 active boolean not null default true,request_id uuid not null,foreign key(location_id,club_id) references public.cia_locations(id,club_id),
 unique(location_id,request_id),unique(id,location_id),created_at timestamptz not null default now()
);
create unique index cia_resource_name on public.cia_resources(location_id,lower(name));
create table public.cia_resource_hours(
 id uuid primary key default gen_random_uuid(),resource_id uuid not null references public.cia_resources(id),
 weekday integer not null check(weekday between 0 and 6),starts_at time not null,ends_at time not null,check(ends_at>starts_at)
);
create index cia_resource_hours_resource on public.cia_resource_hours(resource_id,weekday);
create table public.cia_resource_timeoff(
 id uuid primary key default gen_random_uuid(),resource_id uuid not null references public.cia_resources(id),
 title text not null check(char_length(title) between 2 and 120),starts_at timestamptz not null,ends_at timestamptz not null,
 active boolean not null default true,request_id uuid not null,check(ends_at>starts_at),unique(resource_id,request_id)
);
alter table public.cia_appointments add column location_id uuid references public.cia_locations(id),
 add column resource_id uuid references public.cia_resources(id),add column created_by uuid references public.cia_profiles(id),
 add column series_id uuid,add column revision integer not null default 0;
create table public.cia_appointment_events(
 id uuid primary key default gen_random_uuid(),appointment_id uuid not null references public.cia_appointments(id),
 actor_id uuid not null references public.cia_profiles(id),kind text not null,
 before_value jsonb,after_value jsonb,request_id uuid,created_at timestamptz not null default now(),unique(actor_id,request_id)
);
create index cia_ops_appointments_resource on public.cia_appointments(resource_id,starts_at) where state in('requested','confirmed');
create index cia_ops_events_appointment on public.cia_appointment_events(appointment_id,created_at desc);
insert into public.cia_locations(club_id,name,address,timezone,is_primary)
 select c.id,'Sede principal',coalesce(s.address,''),coalesce(s.timezone,'America/Tijuana'),true from public.cia_clubs c left join public.cia_club_settings s on s.club_id=c.id;
update public.cia_appointments a set location_id=l.id from public.cia_locations l where a.club_id=l.club_id and l.is_primary;
create function cia_private.ops_default_location() returns trigger language plpgsql security definer set search_path='' as $$
begin insert into public.cia_locations(club_id,name,is_primary) values(new.id,'Sede principal',true);return new;end;$$;
create trigger cia_ops_default_location after insert on public.cia_clubs for each row execute function cia_private.ops_default_location();
create function cia_private.ops_role(p_location uuid) returns text language sql stable security invoker set search_path='' as $$
 select case when c.owner_id=auth.uid() then 'owner' else (select t.role from public.cia_team_members t where t.location_id=l.id and t.user_id=auth.uid() and t.active) end
 from public.cia_locations l join public.cia_clubs c on c.id=l.club_id where l.id=p_location;
$$;
create function cia_private.ops_owner(p_club uuid) returns uuid language plpgsql security invoker set search_path='' as $$
declare actor uuid:=cia_private.loyalty_actor('company');begin
 if not exists(select 1 from public.cia_clubs where id=p_club and owner_id=actor) then raise exception using errcode='42501',message='club_not_owned';end if;return actor;end;$$;
create function cia_private.ops_resource_access(p_resource uuid,p_manage boolean default false) returns boolean language sql stable security invoker set search_path='' as $$
 select coalesce(cia_private.ops_role(r.location_id) in('owner','manager') or
 (not p_manage and cia_private.ops_role(r.location_id)='reception') or
 (cia_private.ops_role(r.location_id)='professional' and r.staff_user_id=auth.uid()),false)
 from public.cia_resources r where r.id=p_resource;
$$;
create function cia_private.ops_appointment_access(p_id uuid) returns boolean language sql stable security invoker set search_path='' as $$
 select coalesce(a.user_id=auth.uid() or cia_private.ops_role(a.location_id) in('owner','manager','reception') or
 (cia_private.ops_role(a.location_id)='professional' and exists(select 1 from public.cia_resources r where r.id=a.resource_id and r.staff_user_id=auth.uid())),false)
 from public.cia_appointments a where a.id=p_id;
$$;
create function public.cia_ops_save_location(p_club uuid,p_payload jsonb,p_request uuid) returns uuid language plpgsql security definer set search_path='' as $$
declare actor uuid;result uuid;label text;zone text;enabled boolean;begin
 actor:=cia_private.ops_owner(p_club);if p_request is null then raise exception 'request_required';end if;
 label:=cia_private.studio_text(p_payload,'name',100,true);zone:=coalesce(nullif(p_payload->>'timezone',''),'America/Tijuana');enabled:=coalesce((p_payload->>'active')::boolean,true);
 if not exists(select 1 from pg_catalog.pg_timezone_names z where z.name=zone) then raise exception 'invalid_timezone';end if;
 result:=nullif(p_payload->>'id','')::uuid;
 if result is null then insert into public.cia_locations(club_id,name,address,timezone,active,request_id)
 values(p_club,label,cia_private.studio_text(p_payload,'address',250),zone,enabled,p_request)
 on conflict(club_id,request_id) do update set request_id=excluded.request_id returning id into result;
 else
  if not exists(select 1 from public.cia_locations where id=result and club_id=p_club) then raise exception 'location_unavailable';end if;
  if not enabled and exists(select 1 from public.cia_locations where id=result and is_primary) then raise exception 'primary_location_required';end if;
  update public.cia_locations set name=label,address=cia_private.studio_text(p_payload,'address',250),timezone=zone,active=enabled where id=result and club_id=p_club;
 end if;return result;
end;$$;
create function public.cia_ops_invite(p_location uuid,p_role text,p_reference text,p_request uuid) returns uuid language plpgsql security definer set search_path='' as $$
declare club uuid;result uuid;begin
 select club_id into club from public.cia_locations where id=p_location and active;if club is null then raise exception 'location_unavailable';end if;
 perform cia_private.ops_owner(club);if p_request is null or p_role is null or p_role not in('manager','reception','professional') or char_length(coalesce(p_reference,''))>100 then raise exception 'invalid_invitation';end if;
 insert into public.cia_team_invites(club_id,location_id,role,reference,request_id) values(club,p_location,p_role,btrim(coalesce(p_reference,'')),p_request)
 on conflict(club_id,request_id) do update set request_id=excluded.request_id returning id into result;return result;
end;$$;
create function public.cia_ops_accept_invite(p_code uuid) returns uuid language plpgsql security definer set search_path='' as $$
declare actor uuid:=cia_private.loyalty_actor();v public.cia_team_invites;result uuid;begin
 select * into v from public.cia_team_invites where code=p_code for update;
 if not found or v.revoked or v.expires_at<now() or(v.accepted_by is not null and v.accepted_by<>actor) then raise exception 'invitation_unavailable';end if;
 if exists(select 1 from public.cia_clubs where id=v.club_id and owner_id=actor) then raise exception 'already_owner';end if;
 if not exists(select 1 from public.cia_locations where id=v.location_id and active) then raise exception 'location_unavailable';end if;
 if v.accepted_by=actor then select id into result from public.cia_team_members where location_id=v.location_id and user_id=actor;return result;end if;
 insert into public.cia_team_members(club_id,location_id,user_id,role) values(v.club_id,v.location_id,actor,v.role)
 on conflict(location_id,user_id) do update set role=excluded.role,active=true returning id into result;
 update public.cia_team_invites set accepted_by=actor where id=v.id;return result;
end;$$;
create function public.cia_ops_set_team(p_id uuid,p_active boolean,p_role text) returns void language plpgsql security definer set search_path='' as $$
declare v public.cia_team_members;begin
 select * into v from public.cia_team_members where id=p_id for update;if not found then raise exception 'member_unavailable';end if;
 perform cia_private.ops_owner(v.club_id);if p_active is null or p_role is null or p_role not in('manager','reception','professional') then raise exception 'invalid_team_role';end if;
 update public.cia_team_members set active=p_active,role=p_role where id=p_id;
 if not p_active then update public.cia_resources set active=false where location_id=v.location_id and staff_user_id=v.user_id;end if;
end;$$;
create function public.cia_ops_revoke_invite(p_id uuid) returns void language plpgsql security definer set search_path='' as $$
declare club uuid;begin select club_id into club from public.cia_team_invites where id=p_id;if club is null then raise exception 'invitation_unavailable';end if;perform cia_private.ops_owner(club);update public.cia_team_invites set revoked=true where id=p_id;end;$$;
create function public.cia_ops_save_resource(p_location uuid,p_payload jsonb,p_request uuid) returns uuid language plpgsql security definer set search_path='' as $$
declare v public.cia_locations;result uuid;staff uuid;kind text;begin
 perform cia_private.loyalty_actor();select * into v from public.cia_locations where id=p_location and active;
 if not found or coalesce(cia_private.ops_role(p_location),'') not in('owner','manager') then raise exception using errcode='42501',message='operation_not_allowed';end if;
 if p_request is null then raise exception 'request_required';end if;
 staff:=nullif(p_payload->>'staff_user_id','')::uuid;kind:=coalesce(p_payload->>'kind','professional');
 if kind not in('professional','space','table','equipment','other') then raise exception 'invalid_resource';end if;
 if staff is not null and not exists(select 1 from public.cia_clubs where id=v.club_id and owner_id=staff) and not exists(select 1 from public.cia_team_members where location_id=v.id and user_id=staff and active) then raise exception 'invalid_staff_assignment';end if;
 result:=nullif(p_payload->>'id','')::uuid;
 if result is null then insert into public.cia_resources(club_id,location_id,name,kind,staff_user_id,active,request_id)
 values(v.club_id,v.id,cia_private.studio_text(p_payload,'name',80,true),kind,staff,coalesce((p_payload->>'active')::boolean,true),p_request)
 on conflict(location_id,request_id) do update set request_id=excluded.request_id returning id into result;
 else
  if not exists(select 1 from public.cia_resources where id=result and location_id=v.id) then raise exception 'resource_unavailable';end if;
  update public.cia_resources set name=cia_private.studio_text(p_payload,'name',80,true),kind=cia_ops_save_resource.kind,staff_user_id=staff,active=coalesce((p_payload->>'active')::boolean,true) where id=result and location_id=v.id;
 end if;return result;
end;$$;
create function public.cia_ops_save_hours(p_resource uuid,p_windows jsonb) returns void language plpgsql security definer set search_path='' as $$
declare item jsonb;wd integer;opening time;closing time;club uuid;begin
 perform cia_private.loyalty_actor();if not coalesce(cia_private.ops_resource_access(p_resource,true),false) then raise exception using errcode='42501',message='operation_not_allowed';end if;
 if jsonb_typeof(p_windows)<>'array' or jsonb_array_length(p_windows)>28 then raise exception 'invalid_hours';end if;
 select club_id into club from public.cia_resources where id=p_resource;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('calendar:'||club::text,0));
 delete from public.cia_resource_hours where resource_id=p_resource;
 for item in select value from jsonb_array_elements(p_windows) loop
  wd:=(item->>'weekday')::integer;opening:=(item->>'starts_at')::time;closing:=(item->>'ends_at')::time;
  if wd is null or wd not between 0 and 6 or opening is null or closing is null or closing<=opening then raise exception 'invalid_hours';end if;
  if exists(select 1 from public.cia_resource_hours where resource_id=p_resource and weekday=wd and starts_at<closing and ends_at>opening) then raise exception 'overlapping_hours';end if;
  insert into public.cia_resource_hours(resource_id,weekday,starts_at,ends_at) values(p_resource,wd,opening,closing);
 end loop;
end;$$;
create function public.cia_ops_timeoff(p_resource uuid,p_payload jsonb,p_request uuid) returns uuid language plpgsql security definer set search_path='' as $$
declare club uuid;result uuid;begins timestamptz;finishes timestamptz;begin
 perform cia_private.loyalty_actor();if not coalesce(cia_private.ops_resource_access(p_resource,true),false) then raise exception using errcode='42501',message='operation_not_allowed';end if;
 select club_id into club from public.cia_resources where id=p_resource;perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('calendar:'||club::text,0));
 result:=nullif(p_payload->>'id','')::uuid;
 if result is not null then
  update public.cia_resource_timeoff set active=false where id=result and resource_id=p_resource;if not found then raise exception 'timeoff_unavailable';end if;return result;
 end if;
 if p_request is null then raise exception 'request_required';end if;
 select id into result from public.cia_resource_timeoff where resource_id=p_resource and request_id=p_request;if found then return result;end if;
 begins:=(p_payload->>'starts_at')::timestamptz;finishes:=(p_payload->>'ends_at')::timestamptz;
 if begins is null or finishes is null or finishes<=begins then raise exception 'invalid_timeoff';end if;
 if exists(select 1 from public.cia_appointments where resource_id=p_resource and state='confirmed' and starts_at<finishes and ends_at>begins) then raise exception 'timeoff_has_appointments';end if;
 insert into public.cia_resource_timeoff(resource_id,title,starts_at,ends_at,request_id) values(p_resource,cia_private.studio_text(p_payload,'title',120,true),begins,finishes,p_request) returning id into result;return result;
end;$$;
create function cia_private.ops_valid_slot(p_resource uuid,p_start timestamptz,p_end timestamptz,p_ignore uuid default null) returns void language plpgsql security invoker set search_path='' as $$
declare r public.cia_resources;l public.cia_locations;localstart timestamp;localend timestamp;begin
 select * into r from public.cia_resources where id=p_resource and active;select * into l from public.cia_locations where id=r.location_id and active;
 if r.id is null or l.id is null then raise exception 'resource_unavailable';end if;
 if p_start is null or p_end is null or p_start<now() or p_end<=p_start or p_end>p_start+interval '12 hours' or p_start>now()+interval '366 days' then raise exception 'invalid_appointment';end if;
 localstart:=p_start at time zone l.timezone;localend:=p_end at time zone l.timezone;
 if localstart::date<>localend::date or not exists(select 1 from public.cia_resource_hours h where h.resource_id=r.id and h.weekday=extract(dow from localstart)::integer and h.starts_at<=localstart::time and h.ends_at>=localend::time) then raise exception 'outside_working_hours';end if;
 if exists(select 1 from public.cia_resource_timeoff where resource_id=r.id and active and starts_at<p_end and ends_at>p_start) then raise exception 'resource_timeoff';end if;
 if exists(select 1 from public.cia_appointments a where a.club_id=r.club_id and a.location_id=r.location_id and a.state='confirmed' and(a.resource_id=r.id or(a.resource_id is null and lower(a.resource)=lower(r.name))) and a.id is distinct from p_ignore and a.starts_at<p_end and a.ends_at>p_start) then raise exception 'appointment_conflict';end if;
end;$$;
create function public.cia_ops_slots(p_resource uuid,p_day date,p_minutes integer) returns jsonb language plpgsql security definer set search_path='' as $$
declare actor uuid:=cia_private.loyalty_actor();r public.cia_resources;l public.cia_locations;slot timestamptz;items jsonb:='[]';begin
 select * into r from public.cia_resources where id=p_resource and active;select * into l from public.cia_locations where id=r.location_id and active;
 if r.id is null or l.id is null then raise exception 'resource_unavailable';end if;
 if not coalesce(cia_private.ops_resource_access(r.id),false) and not(exists(select 1 from public.cia_club_members where club_id=r.club_id and user_id=actor) and exists(select 1 from public.cia_club_settings where club_id=r.club_id and booking_enabled)) then raise exception using errcode='42501',message='operation_not_allowed';end if;
 if p_day is null or p_minutes is null or p_minutes not between 5 and 720 then raise exception 'invalid_duration';end if;
 for slot in select distinct g from public.cia_resource_hours h cross join lateral generate_series((p_day+h.starts_at) at time zone l.timezone,((p_day+h.ends_at) at time zone l.timezone)-p_minutes*interval '1 minute',interval '15 minutes') g where h.resource_id=r.id and h.weekday=extract(dow from p_day)::integer order by g loop
  begin perform cia_private.ops_valid_slot(r.id,slot,slot+p_minutes*interval '1 minute');items:=items||jsonb_build_array(jsonb_build_object('starts_at',slot,'ends_at',slot+p_minutes*interval '1 minute'));
  exception when sqlstate 'P0001' then null;end;
 end loop;return jsonb_build_object('slots',items,'timezone',l.timezone,'day',p_day);
end;$$;
create function public.cia_ops_book(p_resource uuid,p_payload jsonb,p_request uuid) returns uuid language plpgsql security definer set search_path='' as $$
declare actor uuid:=cia_private.loyalty_actor();r public.cia_resources;role text;customer uuid;service uuid;mins integer;repeat_count integer;start0 timestamptz;begins timestamptz;finishes timestamptz;zone text;result uuid;created uuid;existing public.cia_appointments;label text;begin
 select * into r from public.cia_resources where id=p_resource and active;if not found then raise exception 'resource_unavailable';end if;
 role:=cia_private.ops_role(r.location_id);
 if role='professional' and r.staff_user_id is distinct from actor then raise exception using errcode='42501',message='operation_not_allowed';end if;
 if role is null and not(exists(select 1 from public.cia_club_members where club_id=r.club_id and user_id=actor) and exists(select 1 from public.cia_club_settings where club_id=r.club_id and booking_enabled)) then raise exception using errcode='42501',message='operation_not_allowed';end if;
 if p_request is null then raise exception 'request_required';end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('calendar:'||r.club_id::text,0));
 select * into existing from public.cia_appointments where club_id=r.club_id and request_id=p_request;
 if found then if existing.created_by is distinct from actor or existing.resource_id is distinct from r.id or existing.starts_at is distinct from (p_payload->>'starts_at')::timestamptz or existing.title is distinct from btrim(p_payload->>'title') then raise exception 'request_conflict';end if;return existing.id;end if;
 customer:=case when role is null then actor else nullif(p_payload->>'user_id','')::uuid end;
 if customer is not null and not exists(select 1 from public.cia_club_members where club_id=r.club_id and user_id=customer) then raise exception 'join_first';end if;
 service:=nullif(p_payload->>'catalog_id','')::uuid;
 if service is not null and not exists(select 1 from public.cia_catalog_items where id=service and club_id=r.club_id and active and item_kind='service') then raise exception 'invalid_service';end if;
 mins:=coalesce((select duration_minutes from public.cia_catalog_items where id=service),nullif(p_payload->>'duration_minutes','')::integer,30);
 repeat_count:=coalesce(nullif(p_payload->>'repeat_count','')::integer,1);
 if mins not between 5 and 720 or repeat_count not between 1 and 8 then raise exception 'invalid_duration';end if;
 start0:=(p_payload->>'starts_at')::timestamptz;select timezone into zone from public.cia_locations where id=r.location_id;
 label:=cia_private.studio_text(p_payload,'title',120,true);
 for n in 0..repeat_count-1 loop
  begins:=((start0 at time zone zone)+n*interval '7 days') at time zone zone;finishes:=begins+mins*interval '1 minute';
  perform cia_private.ops_valid_slot(r.id,begins,finishes);
  insert into public.cia_appointments(club_id,user_id,catalog_id,title,starts_at,ends_at,resource,state,note,request_id,location_id,resource_id,created_by,series_id)
   values(r.club_id,customer,service,label,begins,finishes,r.name,case when role is null then 'requested' else 'confirmed' end,cia_private.studio_text(p_payload,'note',500),case when n=0 then p_request else gen_random_uuid() end,r.location_id,r.id,actor,case when repeat_count>1 then p_request end) returning id into created;
  if n=0 then result:=created;end if;
  insert into public.cia_appointment_events(appointment_id,actor_id,kind,after_value) values(created,actor,'created',jsonb_build_object('starts_at',begins,'ends_at',finishes,'resource_id',r.id));
  perform cia_private.studio_notice(case when role is null then (select owner_id from public.cia_clubs where id=r.club_id) else customer end,r.club_id,'appointment',case when role is null then 'Nueva solicitud de cita' else 'Tu cita está confirmada' end,label,'ops:book:'||created::text);
 end loop;return result;
end;$$;
create function public.cia_ops_update_appointment(p_id uuid,p_state text) returns void language plpgsql security definer set search_path='' as $$
declare actor uuid:=cia_private.loyalty_actor();v public.cia_appointments;role text;begin
 select * into v from public.cia_appointments where id=p_id;if not found or not coalesce(cia_private.ops_appointment_access(p_id),false) then raise exception using errcode='42501',message='operation_not_allowed';end if;
 role:=cia_private.ops_role(v.location_id);
 if p_state is null or p_state not in('confirmed','completed','cancelled') or(role is null and p_state<>'cancelled') then raise exception using errcode='42501',message='operation_not_allowed';end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('calendar:'||v.club_id::text,0));select * into v from public.cia_appointments where id=p_id for update;
 if v.state=p_state then return;end if;
 if v.state in('completed','cancelled') or(p_state='completed' and v.state<>'confirmed') then raise exception 'invalid_appointment_state';end if;
 if p_state='confirmed' then perform cia_private.ops_valid_slot(v.resource_id,v.starts_at,v.ends_at,v.id);end if;
 update public.cia_appointments set state=p_state,revision=revision+1,updated_at=now() where id=p_id;
 insert into public.cia_appointment_events(appointment_id,actor_id,kind,before_value,after_value) values(p_id,actor,p_state,jsonb_build_object('state',v.state),jsonb_build_object('state',p_state));
 perform cia_private.studio_notice(v.user_id,v.club_id,'appointment','Tu cita cambió de estado',v.title||': '||case p_state when 'confirmed' then 'confirmada' when 'completed' then 'completada' else 'cancelada' end,'ops:state:'||p_id::text||':'||(v.revision+1)::text);
end;$$;
create function public.cia_ops_reschedule(p_id uuid,p_start timestamptz,p_revision integer,p_request uuid) returns void language plpgsql security definer set search_path='' as $$
declare actor uuid:=cia_private.loyalty_actor();v public.cia_appointments;newend timestamptz;role text;begin
 select * into v from public.cia_appointments where id=p_id;if not found or v.resource_id is null or not coalesce(cia_private.ops_appointment_access(p_id),false) then raise exception using errcode='42501',message='operation_not_allowed';end if;
 if p_request is null then raise exception 'request_required';end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('calendar:'||v.club_id::text,0));select * into v from public.cia_appointments where id=p_id for update;
 if exists(select 1 from public.cia_appointment_events where actor_id=actor and request_id=p_request and appointment_id=p_id and kind='rescheduled') then if not exists(select 1 from public.cia_appointment_events where actor_id=actor and request_id=p_request and (after_value->>'starts_at')::timestamptz=p_start) then raise exception 'request_conflict';end if;return;end if;
 if v.state not in('requested','confirmed') or v.revision is distinct from p_revision then raise exception 'appointment_changed';end if;
 newend:=p_start+(v.ends_at-v.starts_at);perform cia_private.ops_valid_slot(v.resource_id,p_start,newend,v.id);role:=cia_private.ops_role(v.location_id);
 update public.cia_appointments set starts_at=p_start,ends_at=newend,state=case when role is null then 'requested' else 'confirmed' end,revision=revision+1,updated_at=now() where id=p_id;
 insert into public.cia_appointment_events(appointment_id,actor_id,kind,before_value,after_value,request_id) values(p_id,actor,'rescheduled',jsonb_build_object('starts_at',v.starts_at,'ends_at',v.ends_at),jsonb_build_object('starts_at',p_start,'ends_at',newend),p_request);
 perform cia_private.studio_notice(case when role is null then(select owner_id from public.cia_clubs where id=v.club_id) else v.user_id end,v.club_id,'appointment','Cambio de horario',v.title||case when role is null then ': pendiente de confirmación' else ': nuevo horario confirmado' end,'ops:reschedule:'||p_request::text);
end;$$;
-- Compatibility: linked appointments always use the operational permission/availability boundary.
alter function public.cia_studio_save_appointment(uuid,jsonb,uuid) set schema cia_private;
alter function cia_private.cia_studio_save_appointment(uuid,jsonb,uuid) rename to studio_save_appointment_32;
revoke all on function cia_private.studio_save_appointment_32(uuid,jsonb,uuid) from public,anon,authenticated;
create function public.cia_studio_save_appointment(p_club uuid,p_payload jsonb,p_request uuid) returns uuid language plpgsql security definer set search_path='' as $$
begin
 if nullif(p_payload->>'resource_id','') is not null then return public.cia_ops_book((p_payload->>'resource_id')::uuid,p_payload,p_request);end if;
 if exists(select 1 from public.cia_resources where club_id=p_club and active) and not exists(select 1 from public.cia_clubs where id=p_club and owner_id=auth.uid()) then raise exception 'resource_required';end if;
 return cia_private.studio_save_appointment_32(p_club,p_payload,p_request);
end;$$;
alter function public.cia_studio_update_appointment(uuid,text) set schema cia_private;
alter function cia_private.cia_studio_update_appointment(uuid,text) rename to studio_update_appointment_32;
revoke all on function cia_private.studio_update_appointment_32(uuid,text) from public,anon,authenticated;
create function public.cia_studio_update_appointment(p_id uuid,p_state text) returns void language plpgsql security definer set search_path='' as $$
begin
 if exists(select 1 from public.cia_appointments where id=p_id and resource_id is not null) then perform public.cia_ops_update_appointment(p_id,p_state);
 else perform cia_private.studio_update_appointment_32(p_id,p_state);end if;
end;$$;
create function public.cia_ops_snapshot() returns jsonb language plpgsql security definer set search_path='' as $$
declare actor uuid:=cia_private.loyalty_actor();begin
 return jsonb_build_object(
 'server_time',now(),
 'locations',coalesce((select jsonb_agg(x) from(select l.*,c.name as club_name,cia_private.ops_role(l.id) as access_role,c.owner_id=actor as is_owner
  from public.cia_locations l join public.cia_clubs c on c.id=l.club_id where c.owner_id=actor or cia_private.ops_role(l.id) is not null or(l.active and exists(select 1 from public.cia_club_members m join public.cia_club_settings s on s.club_id=m.club_id where m.club_id=l.club_id and m.user_id=actor and s.booking_enabled)) order by l.created_at limit 200)x),'[]'::jsonb),
 'team',coalesce((select jsonb_agg(x) from(select t.*,p.name as person_name from public.cia_team_members t join public.cia_profiles p on p.id=t.user_id where cia_private.ops_role(t.location_id) in('owner','manager','reception') or t.user_id=actor order by t.created_at limit 200)x),'[]'::jsonb),
 'invites',coalesce((select jsonb_agg(x) from(select i.* from public.cia_team_invites i where exists(select 1 from public.cia_clubs c where c.id=i.club_id and c.owner_id=actor) and i.accepted_by is null and not i.revoked and i.expires_at>now() order by i.expires_at limit 100)x),'[]'::jsonb),
 'resources',coalesce((select jsonb_agg(x) from(select r.id,r.club_id,r.location_id,r.name,r.kind,r.active,
 case when cia_private.ops_role(r.location_id) is not null then r.staff_user_id end as staff_user_id,
 case when cia_private.ops_role(r.location_id) is not null then (select p.name from public.cia_profiles p where p.id=r.staff_user_id) end as staff_name,
 cia_private.ops_resource_access(r.id,true) as can_manage,cia_private.ops_resource_access(r.id) as can_operate
 from public.cia_resources r where cia_private.ops_role(r.location_id) in('owner','manager','reception') or(cia_private.ops_role(r.location_id)='professional' and r.staff_user_id=actor) or(r.active and exists(select 1 from public.cia_club_members m join public.cia_club_settings s on s.club_id=m.club_id where m.club_id=r.club_id and m.user_id=actor and s.booking_enabled)) order by r.created_at limit 300)x),'[]'::jsonb),
 'hours',coalesce((select jsonb_agg(h) from public.cia_resource_hours h join public.cia_resources r on r.id=h.resource_id where cia_private.ops_resource_access(r.id) or(r.active and exists(select 1 from public.cia_club_members m join public.cia_club_settings s on s.club_id=m.club_id where m.club_id=r.club_id and m.user_id=actor and s.booking_enabled))),'[]'::jsonb),
 'timeoff',coalesce((select jsonb_agg(x) from(select b.* from public.cia_resource_timeoff b where cia_private.ops_resource_access(b.resource_id) and b.active order by b.starts_at limit 200)x),'[]'::jsonb),
 'appointments',coalesce((select jsonb_agg(x) from(select a.*,l.name as location_name,l.timezone,c.name as club_name,p.name as customer_name from public.cia_appointments a left join public.cia_locations l on l.id=a.location_id join public.cia_clubs c on c.id=a.club_id left join public.cia_profiles p on p.id=a.user_id where cia_private.ops_appointment_access(a.id) order by a.starts_at desc limit 300)x),'[]'::jsonb),
 'events',coalesce((select jsonb_agg(x) from(select ev.* from public.cia_appointment_events ev where cia_private.ops_appointment_access(ev.appointment_id) order by ev.created_at desc limit 300)x),'[]'::jsonb),
 'customers',coalesce((select jsonb_agg(x) from(select m.club_id,m.user_id,p.name from public.cia_club_members m join public.cia_profiles p on p.id=m.user_id where exists(select 1 from public.cia_locations l where l.club_id=m.club_id and cia_private.ops_role(l.id) in('owner','manager','reception')) order by p.name limit 300)x),'[]'::jsonb),
 'catalog',coalesce((select jsonb_agg(x) from(select k.id,k.club_id,k.title,k.duration_minutes from public.cia_catalog_items k where k.active and k.item_kind='service' and exists(select 1 from public.cia_locations l where l.club_id=k.club_id and(cia_private.ops_role(l.id) is not null or exists(select 1 from public.cia_club_members m where m.club_id=k.club_id and m.user_id=actor))) order by k.title limit 300)x),'[]'::jsonb)
 );
end;$$;
do $$declare t text;fn record;begin
 foreach t in array array['cia_locations','cia_team_members','cia_team_invites','cia_resources','cia_resource_hours','cia_resource_timeoff','cia_appointment_events'] loop
 execute format('alter table public.%I enable row level security',t);execute format('revoke all on public.%I from public,anon,authenticated',t);
 end loop;
 for fn in select p.oid::regprocedure as signature from pg_proc p join pg_namespace n on n.oid=p.pronamespace where(n.nspname='public' and p.proname like 'cia_ops_%')or(n.nspname='public' and p.proname in('cia_studio_save_appointment','cia_studio_update_appointment')) loop
 execute format('revoke all on function %s from public,anon,authenticated',fn.signature);execute format('grant execute on function %s to authenticated',fn.signature);
 end loop;
 for fn in select p.oid::regprocedure as signature from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='cia_private' and p.proname like 'ops_%' loop execute format('revoke all on function %s from public,anon,authenticated',fn.signature);end loop;
end;$$;

-- Operations 3.3: separate customer visibility from staff authority.

alter table public.cia_appointments drop constraint cia_appointments_resource_check;
alter table public.cia_appointments add constraint cia_appointments_resource_check check(char_length(resource) between 1 and 80);
create function cia_private.ops_can_operate_appointment(p_id uuid) returns boolean language sql stable security invoker set search_path='' as $$
 select coalesce(cia_private.ops_role(a.location_id) in('owner','manager','reception') or
 (cia_private.ops_role(a.location_id)='professional' and exists(select 1 from public.cia_resources r where r.id=a.resource_id and r.staff_user_id=auth.uid())),false)
 from public.cia_appointments a where a.id=p_id;
$$;
revoke all on function cia_private.ops_can_operate_appointment(uuid) from public,anon,authenticated;

create or replace function public.cia_ops_update_appointment(p_id uuid,p_state text) returns void language plpgsql security definer set search_path='' as $$
declare actor uuid:=cia_private.loyalty_actor();v public.cia_appointments;can_operate boolean;begin
 select * into v from public.cia_appointments where id=p_id;if not found or not coalesce(cia_private.ops_appointment_access(p_id),false) then raise exception using errcode='42501',message='operation_not_allowed';end if;
 can_operate:=coalesce(cia_private.ops_can_operate_appointment(p_id),false);
 if p_state is null or p_state not in('confirmed','completed','cancelled') or(not can_operate and p_state<>'cancelled') then raise exception using errcode='42501',message='operation_not_allowed';end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('calendar:'||v.club_id::text,0));select * into v from public.cia_appointments where id=p_id for update;
 if v.state=p_state then return;end if;
 if v.state in('completed','cancelled') or(p_state='completed' and v.state<>'confirmed') then raise exception 'invalid_appointment_state';end if;
 if p_state='confirmed' then perform cia_private.ops_valid_slot(v.resource_id,v.starts_at,v.ends_at,v.id);end if;
 update public.cia_appointments set state=p_state,revision=revision+1,updated_at=now() where id=p_id;
 insert into public.cia_appointment_events(appointment_id,actor_id,kind,before_value,after_value) values(p_id,actor,p_state,jsonb_build_object('state',v.state),jsonb_build_object('state',p_state));
 perform cia_private.studio_notice(v.user_id,v.club_id,'appointment','Tu cita cambió de estado',v.title||': '||case p_state when 'confirmed' then 'confirmada' when 'completed' then 'completada' else 'cancelada' end,'ops:state:'||p_id::text||':'||(v.revision+1)::text);
end;$$;

create or replace function public.cia_ops_reschedule(p_id uuid,p_start timestamptz,p_revision integer,p_request uuid) returns void language plpgsql security definer set search_path='' as $$
declare actor uuid:=cia_private.loyalty_actor();v public.cia_appointments;newend timestamptz;can_operate boolean;begin
 select * into v from public.cia_appointments where id=p_id;if not found or v.resource_id is null or not coalesce(cia_private.ops_appointment_access(p_id),false) then raise exception using errcode='42501',message='operation_not_allowed';end if;
 if p_request is null then raise exception 'request_required';end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('calendar:'||v.club_id::text,0));select * into v from public.cia_appointments where id=p_id for update;
 if exists(select 1 from public.cia_appointment_events where actor_id=actor and request_id=p_request and appointment_id=p_id and kind='rescheduled') then if not exists(select 1 from public.cia_appointment_events where actor_id=actor and request_id=p_request and (after_value->>'starts_at')::timestamptz=p_start) then raise exception 'request_conflict';end if;return;end if;
 if v.state not in('requested','confirmed') or v.revision is distinct from p_revision then raise exception 'appointment_changed';end if;
 newend:=p_start+(v.ends_at-v.starts_at);perform cia_private.ops_valid_slot(v.resource_id,p_start,newend,v.id);can_operate:=coalesce(cia_private.ops_can_operate_appointment(p_id),false);
 update public.cia_appointments set starts_at=p_start,ends_at=newend,state=case when not can_operate then 'requested' else 'confirmed' end,revision=revision+1,updated_at=now() where id=p_id;
 insert into public.cia_appointment_events(appointment_id,actor_id,kind,before_value,after_value,request_id) values(p_id,actor,'rescheduled',jsonb_build_object('starts_at',v.starts_at,'ends_at',v.ends_at),jsonb_build_object('starts_at',p_start,'ends_at',newend),p_request);
 perform cia_private.studio_notice(case when not can_operate then(select owner_id from public.cia_clubs where id=v.club_id) else v.user_id end,v.club_id,'appointment','Cambio de horario',v.title||case when not can_operate then ': pendiente de confirmación' else ': nuevo horario confirmado' end,'ops:reschedule:'||p_request::text);
end;$$;

create or replace function public.cia_studio_save_appointment(p_club uuid,p_payload jsonb,p_request uuid) returns uuid language plpgsql security definer set search_path='' as $$
declare result uuid;begin
 if nullif(p_payload->>'resource_id','') is not null then return public.cia_ops_book((p_payload->>'resource_id')::uuid,p_payload,p_request);end if;
 if exists(select 1 from public.cia_resources where club_id=p_club and active) and not exists(select 1 from public.cia_clubs where id=p_club and owner_id=auth.uid()) then raise exception 'resource_required';end if;
 result:=cia_private.studio_save_appointment_32(p_club,p_payload,p_request);
 update public.cia_appointments a set location_id=l.id,created_by=coalesce(a.created_by,auth.uid()) from public.cia_locations l where a.id=result and l.club_id=a.club_id and l.is_primary and a.location_id is null;
 return result;
end;$$;

create or replace function public.cia_ops_save_hours(p_resource uuid,p_windows jsonb) returns void language plpgsql security definer set search_path='' as $$
declare item jsonb;wd integer;opening time;closing time;club uuid;begin
 perform cia_private.loyalty_actor();if not coalesce(cia_private.ops_resource_access(p_resource,true),false) then raise exception using errcode='42501',message='operation_not_allowed';end if;
 if p_windows is null or jsonb_typeof(p_windows)<>'array' or jsonb_array_length(p_windows)>28 then raise exception 'invalid_hours';end if;
 select club_id into club from public.cia_resources where id=p_resource;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('calendar:'||club::text,0));
 delete from public.cia_resource_hours where resource_id=p_resource;
 for item in select value from jsonb_array_elements(p_windows) loop
  wd:=(item->>'weekday')::integer;opening:=(item->>'starts_at')::time;closing:=(item->>'ends_at')::time;
  if wd is null or wd not between 0 and 6 or opening is null or closing is null or closing<=opening then raise exception 'invalid_hours';end if;
  if exists(select 1 from public.cia_resource_hours where resource_id=p_resource and weekday=wd and starts_at<closing and ends_at>opening) then raise exception 'overlapping_hours';end if;
  insert into public.cia_resource_hours(resource_id,weekday,starts_at,ends_at) values(p_resource,wd,opening,closing);
 end loop;
end;$$;

create or replace function public.cia_ops_snapshot() returns jsonb language plpgsql security definer set search_path='' as $$
declare actor uuid:=cia_private.loyalty_actor();begin
 return jsonb_build_object(
 'server_time',now(),
 'locations',coalesce((select jsonb_agg(x) from(select l.*,c.name as club_name,cia_private.ops_role(l.id) as access_role,c.owner_id=actor as is_owner
  from public.cia_locations l join public.cia_clubs c on c.id=l.club_id where c.owner_id=actor or cia_private.ops_role(l.id) is not null or(l.active and exists(select 1 from public.cia_club_members m join public.cia_club_settings s on s.club_id=m.club_id where m.club_id=l.club_id and m.user_id=actor and s.booking_enabled)) order by l.created_at limit 200)x),'[]'::jsonb),
 'team',coalesce((select jsonb_agg(x) from(select t.*,p.name as person_name from public.cia_team_members t join public.cia_profiles p on p.id=t.user_id where cia_private.ops_role(t.location_id) in('owner','manager','reception') or t.user_id=actor order by t.created_at limit 200)x),'[]'::jsonb),
 'invites',coalesce((select jsonb_agg(x) from(select i.* from public.cia_team_invites i where exists(select 1 from public.cia_clubs c where c.id=i.club_id and c.owner_id=actor) and i.accepted_by is null and not i.revoked and i.expires_at>now() order by i.expires_at limit 100)x),'[]'::jsonb),
 'resources',coalesce((select jsonb_agg(x) from(select r.id,r.club_id,r.location_id,r.name,r.kind,r.active,
 case when cia_private.ops_role(r.location_id) is not null then r.staff_user_id end as staff_user_id,
 case when cia_private.ops_role(r.location_id) is not null then (select p.name from public.cia_profiles p where p.id=r.staff_user_id) end as staff_name,
 cia_private.ops_resource_access(r.id,true) as can_manage,cia_private.ops_resource_access(r.id) as can_operate
 from public.cia_resources r where cia_private.ops_role(r.location_id) in('owner','manager','reception') or(cia_private.ops_role(r.location_id)='professional' and r.staff_user_id=actor) or(r.active and exists(select 1 from public.cia_locations active_location where active_location.id=r.location_id and active_location.active) and exists(select 1 from public.cia_club_members m join public.cia_club_settings s on s.club_id=m.club_id where m.club_id=r.club_id and m.user_id=actor and s.booking_enabled)) order by r.created_at limit 300)x),'[]'::jsonb),
 'hours',coalesce((select jsonb_agg(h) from public.cia_resource_hours h join public.cia_resources r on r.id=h.resource_id where cia_private.ops_resource_access(r.id) or(r.active and exists(select 1 from public.cia_locations active_location where active_location.id=r.location_id and active_location.active) and exists(select 1 from public.cia_club_members m join public.cia_club_settings s on s.club_id=m.club_id where m.club_id=r.club_id and m.user_id=actor and s.booking_enabled))),'[]'::jsonb),
 'timeoff',coalesce((select jsonb_agg(x) from(select b.* from public.cia_resource_timeoff b where cia_private.ops_resource_access(b.resource_id) and b.active order by b.starts_at limit 200)x),'[]'::jsonb),
 'appointments',coalesce((select jsonb_agg(x) from(select a.*,l.name as location_name,l.timezone,c.name as club_name,p.name as customer_name from public.cia_appointments a left join public.cia_locations l on l.id=a.location_id join public.cia_clubs c on c.id=a.club_id left join public.cia_profiles p on p.id=a.user_id where cia_private.ops_appointment_access(a.id) order by a.starts_at desc limit 300)x),'[]'::jsonb),
 'events',coalesce((select jsonb_agg(x) from(select ev.* from public.cia_appointment_events ev where cia_private.ops_appointment_access(ev.appointment_id) order by ev.created_at desc limit 300)x),'[]'::jsonb),
 'customers',coalesce((select jsonb_agg(x) from(select m.club_id,m.user_id,p.name from public.cia_club_members m join public.cia_profiles p on p.id=m.user_id where exists(select 1 from public.cia_locations l where l.club_id=m.club_id and cia_private.ops_role(l.id) in('owner','manager','reception')) order by p.name limit 300)x),'[]'::jsonb),
 'catalog',coalesce((select jsonb_agg(x) from(select k.id,k.club_id,k.title,k.duration_minutes from public.cia_catalog_items k where k.active and k.item_kind='service' and exists(select 1 from public.cia_locations l where l.club_id=k.club_id and(cia_private.ops_role(l.id) is not null or exists(select 1 from public.cia_club_members m where m.club_id=k.club_id and m.user_id=actor))) order by k.title limit 300)x),'[]'::jsonb)
 );
end;$$;

commit;

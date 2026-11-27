-- Operations 3.3: separate customer visibility from staff authority.
begin;
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

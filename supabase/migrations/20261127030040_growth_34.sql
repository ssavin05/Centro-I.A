-- Growth 3.4: reversible operations and authorized, cursor-based data access.
begin;
alter table public.cia_club_members add column active boolean not null default true, add column left_at timestamptz;
alter table public.cia_redemptions drop constraint cia_redemptions_state_check;
alter table public.cia_redemptions add constraint cia_redemptions_state_check check(state in('requested','delivered','cancelled'));
alter table public.cia_redemptions add column cancelled_at timestamptz, add column cancel_reason text,
 add column cancelled_by uuid references public.cia_profiles(id), add column cancel_request uuid unique, add column stock_reserved boolean;
create table public.cia_notification_preferences(
 user_id uuid primary key references public.cia_profiles(id),internal_marketing boolean not null default false,
 updated_at timestamptz not null default now()
);
alter table public.cia_notification_preferences enable row level security;
revoke all on public.cia_notification_preferences from public,anon,authenticated;
create index cia_members_active_user on public.cia_club_members(user_id,club_id) where active;
create index cia_redemptions_user_cursor on public.cia_redemptions(user_id,created_at desc,id desc);
create index cia_visits_user_cursor on public.cia_visits(user_id,arrived_at desc,id desc);
create index cia_notices_user_cursor on public.cia_inbox_notices(recipient_id,created_at desc,id desc);

create function cia_private.growth_member_guard() returns trigger language plpgsql security definer set search_path='' as $$
declare club uuid;begin
 if TG_TABLE_NAME='cia_challenge_claims' then select club_id into club from public.cia_challenges where id=new.challenge_id;
 else club:=new.club_id;end if;
 if new.user_id is not null then
  perform 1 from public.cia_club_members where club_id=club and user_id=new.user_id and active for share;
  if not found then raise exception using errcode='42501',message='membership_inactive';end if;
 end if;
 if TG_TABLE_NAME='cia_redemptions' then select stock is not null into new.stock_reserved from public.cia_rewards where id=new.reward_id;end if;
 return new;
end;$$;
revoke all on function cia_private.growth_member_guard() from public,anon,authenticated;
create trigger cia_growth_visit_guard before insert on public.cia_visits for each row execute function cia_private.growth_member_guard();
create trigger cia_growth_redeem_guard before insert on public.cia_redemptions for each row execute function cia_private.growth_member_guard();
create trigger cia_growth_booking_guard before insert on public.cia_appointments for each row execute function cia_private.growth_member_guard();
create trigger cia_growth_challenge_guard before insert on public.cia_challenge_claims for each row execute function cia_private.growth_member_guard();

create function public.cia_growth_memberships() returns jsonb language plpgsql security definer set search_path='' as $$
declare actor uuid:=cia_private.loyalty_actor();begin
 return coalesce((select jsonb_agg(x) from(select m.*,c.name,c.city from public.cia_club_members m join public.cia_clubs c on c.id=m.club_id where m.user_id=actor order by m.joined_at)x),'[]');
end;$$;
create or replace function public.cia_join_club(p_code text) returns uuid language plpgsql security definer set search_path='' as $$
declare actor uuid:=cia_private.loyalty_actor('user');club uuid;begin
 if p_code is null or char_length(p_code)>80 then raise exception 'invalid_club_code';end if;
 select id into club from public.cia_clubs where join_code=upper(btrim(p_code));if club is null then raise exception 'invalid_club_code';end if;
 insert into public.cia_club_members(club_id,user_id) values(club,actor) on conflict(club_id,user_id) do update set active=true,left_at=null;
 return club;
end;$$;
create or replace function public.cia_join_listed_club(p_club uuid) returns uuid language plpgsql security definer set search_path='' as $$
declare actor uuid:=cia_private.loyalty_actor('user');begin
 if not exists(select 1 from public.cia_clubs where id=p_club and is_listed) then raise exception 'club_unavailable';end if;
 insert into public.cia_club_members(club_id,user_id) values(p_club,actor) on conflict(club_id,user_id) do update set active=true,left_at=null;
 return p_club;
end;$$;
create function public.cia_growth_set_membership(p_club uuid,p_active boolean) returns void language plpgsql security definer set search_path='' as $$
declare actor uuid:=cia_private.loyalty_actor('user');begin
 if p_active is null then raise exception 'invalid_membership';end if;
 perform 1 from public.cia_club_members where club_id=p_club and user_id=actor for update;
 if not found then raise exception 'join_first';end if;
 if not p_active and(exists(select 1 from public.cia_visits where club_id=p_club and user_id=actor and departed_at is null)
  or exists(select 1 from public.cia_redemptions where club_id=p_club and user_id=actor and state='requested')
  or exists(select 1 from public.cia_appointments where club_id=p_club and user_id=actor and state in('requested','confirmed') and ends_at>now())) then raise exception 'membership_has_pending';end if;
 update public.cia_club_members set active=p_active,left_at=case when p_active then null else coalesce(left_at,now()) end where club_id=p_club and user_id=actor;
end;$$;

create function public.cia_growth_cancel_redemption(p_id uuid,p_reason text,p_request uuid) returns void language plpgsql security definer set search_path='' as $$
declare actor uuid:=cia_private.loyalty_actor('company');r public.cia_redemptions;begin
 select * into r from public.cia_redemptions where id=p_id;
 if not found or not exists(select 1 from public.cia_clubs where id=r.club_id and owner_id=actor) then raise exception using errcode='42501',message='club_not_owned';end if;
 if p_request is null or char_length(btrim(coalesce(p_reason,''))) not between 3 and 250 then raise exception 'refund_reason_required';end if;
 perform 1 from public.cia_club_members where club_id=r.club_id and user_id=r.user_id for update;
 perform 1 from public.cia_rewards where id=r.reward_id for update;
 select * into r from public.cia_redemptions where id=p_id for update;
 if r.state='cancelled' then return;end if;
 if r.state<>'requested' then raise exception 'redemption_already_delivered';end if;
 update public.cia_club_members set points=points+r.points_cost where club_id=r.club_id and user_id=r.user_id;
 if r.stock_reserved is true then update public.cia_rewards set stock=stock+1 where id=r.reward_id and stock is not null;end if;
 update public.cia_redemptions set state='cancelled',cancelled_at=now(),cancelled_by=actor,cancel_reason=btrim(p_reason),cancel_request=p_request where id=p_id;
 insert into public.cia_point_movements(club_id,user_id,amount,reason,actor_id,source_key) values(r.club_id,r.user_id,r.points_cost,'Devolución: '||left(btrim(p_reason),220),actor,'refund:'||r.id::text);
 perform cia_private.studio_notice(r.user_id,r.club_id,'redemption','Puntos devueltos',r.reward_title||': '||r.points_cost::text||' puntos devueltos. Motivo: '||btrim(p_reason),'refund:'||r.id::text);
end;$$;
create or replace function public.cia_deliver_redemption(p_redemption uuid) returns void language plpgsql security definer set search_path='' as $$
declare actor uuid:=cia_private.loyalty_actor('company');r public.cia_redemptions;begin
 select * into r from public.cia_redemptions where id=p_redemption for update;
 if not found or not exists(select 1 from public.cia_clubs where id=r.club_id and owner_id=actor) then raise exception using errcode='42501',message='club_not_owned';end if;
 if r.state='delivered' then return;end if;
 if r.state<>'requested' then raise exception 'redemption_cancelled';end if;
 update public.cia_redemptions set state='delivered',delivered_at=now() where id=p_redemption;
end;$$;

create function public.cia_growth_preferences(p_marketing boolean default null) returns jsonb language plpgsql security definer set search_path='' as $$
declare actor uuid:=cia_private.loyalty_actor();begin
 if p_marketing is not null then insert into public.cia_notification_preferences(user_id,internal_marketing) values(actor,p_marketing) on conflict(user_id) do update set internal_marketing=excluded.internal_marketing,updated_at=now();end if;
 return jsonb_build_object('internal_marketing',coalesce((select internal_marketing from public.cia_notification_preferences where user_id=actor),false));
end;$$;

create function public.cia_history_page(p_kind text,p_club uuid default null,p_after jsonb default null,p_limit integer default 50,p_query text default '') returns jsonb language plpgsql security definer set search_path='' as $$
declare actor uuid:=cia_private.loyalty_actor();base text;items jsonb;shown jsonb:='[]';more boolean;lastitem jsonb;lim integer:=least(200,greatest(1,coalesce(p_limit,50)));atime timestamptz;aid uuid;begin
 if p_after is not null then
  if jsonb_typeof(p_after)<>'object' or p_after->>'at' is null or p_after->>'id' is null then raise exception 'invalid_cursor';end if;
  atime:=(p_after->>'at')::timestamptz;aid:=(p_after->>'id')::uuid;
 end if;
 if char_length(coalesce(p_query,''))>120 then raise exception 'invalid_search';end if;
 case p_kind
 when 'visits' then base:='select v.*,v.arrived_at as _at,c.name as club_name,p.name as customer_name from public.cia_visits v join public.cia_clubs c on c.id=v.club_id join public.cia_profiles p on p.id=v.user_id where v.user_id=$1 or c.owner_id=$1';
 when 'redemptions' then base:='select r.*,r.created_at as _at,c.name as club_name,p.name as customer_name from public.cia_redemptions r join public.cia_clubs c on c.id=r.club_id join public.cia_profiles p on p.id=r.user_id where r.user_id=$1 or c.owner_id=$1';
 when 'movements' then base:='select m.*,m.created_at as _at,c.name as club_name,p.name as customer_name from public.cia_point_movements m join public.cia_clubs c on c.id=m.club_id join public.cia_profiles p on p.id=m.user_id where m.user_id=$1 or c.owner_id=$1';
 when 'members' then base:='select m.*,m.user_id as id,m.joined_at as _at,p.name as customer_name from public.cia_club_members m join public.cia_clubs c on c.id=m.club_id join public.cia_profiles p on p.id=m.user_id where c.owner_id=$1';
 when 'catalog' then base:='select i.*,i.created_at as _at,c.name as club_name from public.cia_catalog_items i join public.cia_clubs c on c.id=i.club_id where c.owner_id=$1 or(i.active and exists(select 1 from public.cia_club_members m where m.club_id=i.club_id and m.user_id=$1 and m.active))';
 when 'appointments' then base:='select a.*,a.starts_at as _at,c.name as club_name,p.name as customer_name from public.cia_appointments a join public.cia_clubs c on c.id=a.club_id left join public.cia_profiles p on p.id=a.user_id where cia_private.ops_appointment_access(a.id)';
 when 'notices' then base:='select n.*,n.created_at as _at from public.cia_inbox_notices n where n.recipient_id=$1';
 when 'explore' then base:='select c.id,c.id as club_id,c.name,c.category,c.city,c.description,c.points_per_visit,c.created_at as _at from public.cia_clubs c where c.is_listed and not exists(select 1 from public.cia_club_members m where m.club_id=c.id and m.user_id=$1 and m.active)';
 else raise exception 'invalid_history_kind';end case;
 execute 'select coalesce(jsonb_agg(to_jsonb(z)),''[]''::jsonb) from(select * from('||base||') r where($2::uuid is null or r.club_id=$2) and($3::timestamptz is null or(r._at,r.id)<($3,$4::uuid)) and($5='''' or to_jsonb(r)::text ilike ''%''||$5||''%'') order by r._at desc,r.id desc limit $6) z'
 into items using actor,p_club,atime,aid,coalesce(btrim(p_query),''),lim+1;
 more:=jsonb_array_length(items)>lim;
 select coalesce(jsonb_agg(value-'_at'),'[]') into shown from jsonb_array_elements(items) with ordinality e(value,n) where n<=lim;
 lastitem:=items->(least(lim,jsonb_array_length(items))-1);
 return jsonb_build_object('items',shown,'next',case when more then jsonb_build_object('at',lastitem->'_at','id',lastitem->'id') else null end,'server_time',now());
end;$$;

create function public.cia_growth_insights(p_club uuid,p_days integer default 30) returns jsonb language plpgsql security definer set search_path='' as $$
declare actor uuid:=cia_private.ops_owner(p_club);since timestamptz:=now()-make_interval(days=>least(365,greatest(7,coalesce(p_days,30))));begin
 return jsonb_build_object('since',since,'until',now(),
 'members',(select count(*) from public.cia_club_members where club_id=p_club and active),
 'visits',(select count(*) from public.cia_visits where club_id=p_club and confirmed_at is not null and arrived_at>=since),
 'unique_visitors',(select count(distinct user_id) from public.cia_visits where club_id=p_club and confirmed_at is not null and arrived_at>=since),
 'returning_visitors',(select count(*) from(select user_id from public.cia_visits where club_id=p_club and confirmed_at is not null and arrived_at>=since group by user_id having count(*)>=2)r),
 'redemptions',(select count(*) from public.cia_redemptions where club_id=p_club and state<>'cancelled' and created_at>=since),
 'dormant',(select count(*) from public.cia_club_members m where club_id=p_club and active and coalesce((select max(arrived_at) from public.cia_visits v where v.club_id=m.club_id and v.user_id=m.user_id and confirmed_at is not null),m.joined_at)<now()-interval '30 days'),
 'daily',coalesce((select jsonb_agg(r) from(select (arrived_at at time zone 'UTC')::date as day,count(*) as visits from public.cia_visits where club_id=p_club and confirmed_at is not null and arrived_at>=since group by (arrived_at at time zone 'UTC')::date order by day)r),'[]'));
end;$$;

-- Preserve histories and balances when a member leaves; hide only active program cards.
alter function public.cia_loyalty_snapshot() set schema cia_private;
alter function cia_private.cia_loyalty_snapshot() rename to growth_core_snapshot_33;
revoke all on function cia_private.growth_core_snapshot_33() from public,anon,authenticated;
create function public.cia_loyalty_snapshot() returns jsonb language plpgsql security definer set search_path='' as $$
declare actor uuid:=cia_private.loyalty_actor();s jsonb;begin
 s:=cia_private.growth_core_snapshot_33();
 if s->>'account_type'='user' then
  s:=jsonb_set(s,'{clubs}',coalesce((select jsonb_agg(c) from jsonb_array_elements(s->'clubs')c where exists(select 1 from public.cia_club_members m where m.club_id=(c->>'id')::uuid and m.user_id=actor and m.active)),'[]'));
  s:=jsonb_set(s,'{rewards}',coalesce((select jsonb_agg(r) from jsonb_array_elements(s->'rewards')r where exists(select 1 from public.cia_club_members m where m.club_id=(r->>'club_id')::uuid and m.user_id=actor and m.active)),'[]'));
 end if;return s;
end;$$;
do $$declare f record;begin
 for f in select p.oid::regprocedure sig from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and(p.proname like 'cia_growth_%' or p.proname in('cia_history_page','cia_loyalty_snapshot','cia_deliver_redemption')) loop
 execute format('revoke all on function %s from public,anon,authenticated',f.sig);execute format('grant execute on function %s to authenticated',f.sig);
 end loop;
end;$$;
commit;

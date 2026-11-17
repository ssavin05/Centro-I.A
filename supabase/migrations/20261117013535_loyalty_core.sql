-- Loyalty core. Additive schema: no existing profile data or grants changed.
begin;
create table public.cia_clubs (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null unique references public.cia_profiles(id),
 name text not null check(char_length(name) between 2 and 100),
 category text not null check(char_length(category) between 2 and 60),
 city text not null check(char_length(city) between 2 and 80),
 description text not null default '' check(char_length(description)<=500),
 points_per_visit integer not null check(points_per_visit between 1 and 1000),
 join_code text not null unique default upper(substr(replace(gen_random_uuid()::text,'-',''),1,12)),
 is_listed boolean not null default false,
 created_at timestamptz not null default now()
);
create table public.cia_club_members (
 club_id uuid not null references public.cia_clubs(id),
 user_id uuid not null references public.cia_profiles(id),
 points integer not null default 0 check(points>=0),
 visits_count integer not null default 0 check(visits_count>=0),
 joined_at timestamptz not null default now(),
 primary key(club_id,user_id)
);
create index cia_club_members_user_idx on public.cia_club_members(user_id);
create table public.cia_visits (
 id uuid primary key default gen_random_uuid(),
 club_id uuid not null,
 user_id uuid not null,
 arrived_at timestamptz not null default now(),
 departed_at timestamptz,
 confirmed_at timestamptz,
 awarded_points integer not null default 0 check(awarded_points>=0),
 foreign key(club_id,user_id) references public.cia_club_members(club_id,user_id),
 check(departed_at is null or departed_at>=arrived_at)
);
create index cia_visits_club_idx on public.cia_visits(club_id,arrived_at desc);
create index cia_visits_user_idx on public.cia_visits(user_id,arrived_at desc);
create unique index cia_visits_one_open on public.cia_visits(club_id,user_id) where departed_at is null;
create table public.cia_rewards (
 id uuid primary key default gen_random_uuid(),
 club_id uuid not null references public.cia_clubs(id),
 title text not null check(char_length(title) between 2 and 100),
 description text not null default '' check(char_length(description)<=500),
 points_cost integer not null check(points_cost between 1 and 1000000),
 stock integer check(stock>=0),
 creation_key uuid not null default gen_random_uuid(),
 active boolean not null default true,
 created_at timestamptz not null default now()
);
create unique index cia_rewards_creation_idx on public.cia_rewards(club_id,creation_key);
create index cia_rewards_club_idx on public.cia_rewards(club_id);
create table public.cia_redemptions (
 id uuid primary key default gen_random_uuid(),
 reward_id uuid not null references public.cia_rewards(id),
 club_id uuid not null,
 user_id uuid not null,
 request_id uuid not null,
 points_cost integer not null check(points_cost>0),
 reward_title text not null,
 state text not null default 'requested' check(state in ('requested','delivered')),
 created_at timestamptz not null default now(),
 delivered_at timestamptz,
 foreign key(club_id,user_id) references public.cia_club_members(club_id,user_id),
 unique(user_id,request_id)
);
create index cia_redemptions_club_idx on public.cia_redemptions(club_id,created_at desc);
create index cia_redemptions_reward_idx on public.cia_redemptions(reward_id);
create index cia_redemptions_user_idx on public.cia_redemptions(user_id);

alter table public.cia_clubs enable row level security;
alter table public.cia_club_members enable row level security;
alter table public.cia_visits enable row level security;
alter table public.cia_rewards enable row level security;
alter table public.cia_redemptions enable row level security;
revoke all on public.cia_clubs,public.cia_club_members,public.cia_visits,public.cia_rewards,public.cia_redemptions from public,anon,authenticated;
grant select on public.cia_clubs,public.cia_club_members,public.cia_visits,public.cia_rewards,public.cia_redemptions to authenticated;

create policy cia_clubs_owner_read on public.cia_clubs for select to authenticated using(owner_id=(select auth.uid()));
create policy cia_club_members_read on public.cia_club_members for select to authenticated using(user_id=(select auth.uid()) or exists(select 1 from public.cia_clubs c where c.id=club_id and c.owner_id=(select auth.uid())));
create policy cia_visits_read on public.cia_visits for select to authenticated using(user_id=(select auth.uid()) or exists(select 1 from public.cia_clubs c where c.id=club_id and c.owner_id=(select auth.uid())));
create policy cia_rewards_owner_read on public.cia_rewards for select to authenticated using(exists(select 1 from public.cia_clubs c where c.id=club_id and c.owner_id=(select auth.uid())));
create policy cia_redemptions_read on public.cia_redemptions for select to authenticated using(user_id=(select auth.uid()) or exists(select 1 from public.cia_clubs c where c.id=club_id and c.owner_id=(select auth.uid())));

-- Helpers stay private. RPCs deliberately provide the only write boundary.
create function cia_private.loyalty_actor(required_type text default null) returns uuid
language plpgsql security invoker set search_path='' as $$
declare actor uuid:=auth.uid();
begin
 if actor is null or not exists(select 1 from public.cia_profiles p where p.id=actor and (required_type is null or p.account_type=required_type)) then
  raise exception using errcode='42501',message='account_not_allowed';
 end if;
 return actor;
end;$$;
revoke all on function cia_private.loyalty_actor(text) from public,anon,authenticated;

create function public.cia_create_club(p_name text,p_category text,p_city text,p_description text,p_points integer) returns uuid
language plpgsql security definer set search_path='' as $$
declare actor uuid; result uuid;
begin
 actor:=cia_private.loyalty_actor('company');
 if p_name is null or char_length(btrim(p_name)) not between 2 and 100 or
 p_category is null or char_length(btrim(p_category)) not between 2 and 60 or
 p_city is null or char_length(btrim(p_city)) not between 2 and 80 or
 p_description is null or char_length(p_description)>500 or p_points is null or p_points not between 1 and 1000 then
 raise exception using errcode='22023',message='invalid_club'; end if;
 insert into public.cia_clubs(owner_id,name,category,city,description,points_per_visit)
 values(actor,btrim(p_name),btrim(p_category),btrim(p_city),btrim(p_description),p_points)
 on conflict(owner_id) do nothing returning id into result;
 if result is null then select id into result from public.cia_clubs where owner_id=actor; end if;
 return result;
end;$$;

create function public.cia_set_club_listed(p_club uuid,p_listed boolean) returns void
language plpgsql security definer set search_path='' as $$
begin
 perform cia_private.loyalty_actor('company');
 if p_listed is null then raise exception using errcode='22023',message='invalid_visibility'; end if;
 update public.cia_clubs set is_listed=p_listed where id=p_club and owner_id=auth.uid();
 if not found then raise exception using errcode='42501',message='club_not_owned';end if;
end;$$;

create function public.cia_join_club(p_code text) returns uuid
language plpgsql security definer set search_path='' as $$
declare actor uuid; club uuid;
begin
 actor:=cia_private.loyalty_actor('user');
 if p_code is null or char_length(p_code)>80 then raise exception using errcode='22023',message='invalid_club_code';end if;
 select id into club from public.cia_clubs where join_code=upper(btrim(p_code));
 if club is null then raise exception using errcode='22023',message='invalid_club_code';end if;
 insert into public.cia_club_members(club_id,user_id) values(club,actor) on conflict do nothing;
 return club;
end;$$;

create function public.cia_join_listed_club(p_club uuid) returns uuid
language plpgsql security definer set search_path='' as $$
declare actor uuid;
begin
 actor:=cia_private.loyalty_actor('user');
 if not exists(select 1 from public.cia_clubs where id=p_club and is_listed) then raise exception using errcode='22023',message='club_unavailable';end if;
 insert into public.cia_club_members(club_id,user_id) values(p_club,actor) on conflict do nothing;
 return p_club;
end;$$;

create function public.cia_visit_action(p_club uuid,p_action text,p_visit uuid default null) returns uuid
language plpgsql security definer set search_path='' as $$
declare actor uuid; v public.cia_visits; award integer;
begin
 actor:=cia_private.loyalty_actor();
 if p_action='arrive' then
  perform cia_private.loyalty_actor('user');
  -- The member lock serializes arrivals, confirmations and balance operations.
  perform 1 from public.cia_club_members where club_id=p_club and user_id=actor for update;
  if not found then raise exception using errcode='42501',message='join_first';end if;
  select * into v from public.cia_visits where club_id=p_club and user_id=actor and departed_at is null;
  if found then return v.id;end if;
  if exists(select 1 from public.cia_visits where club_id=p_club and user_id=actor and arrived_at>now()-interval '18 hours') then
   raise exception using errcode='22023',message='visit_cooldown';end if;
  insert into public.cia_visits(club_id,user_id) values(p_club,actor) returning id into v.id;
  return v.id;
 elsif p_action in ('depart','confirm') then
  -- Read immutable ownership first, lock member before visit to keep lock order consistent.
  select * into v from public.cia_visits where id=p_visit and club_id=p_club;
  if not found then raise exception using errcode='22023',message='visit_unavailable';end if;
  if p_action='confirm' or v.user_id<>actor then
   if not exists(select 1 from public.cia_clubs where id=p_club and owner_id=actor) then
    raise exception using errcode='42501',message='club_not_owned';end if;
  end if;
  perform 1 from public.cia_club_members where club_id=p_club and user_id=v.user_id for update;
  select * into v from public.cia_visits where id=p_visit for update;
  if p_action='depart' then
   update public.cia_visits set departed_at=coalesce(departed_at,now()) where id=v.id;
  elsif v.confirmed_at is null then
   select points_per_visit into award from public.cia_clubs where id=p_club;
   update public.cia_visits set confirmed_at=now(),awarded_points=award where id=v.id;
   update public.cia_club_members set points=points+award,visits_count=visits_count+1 where club_id=p_club and user_id=v.user_id;
  end if;
  return v.id;
 end if;
 raise exception using errcode='22023',message='invalid_visit_action';
end;$$;

create function public.cia_save_reward(p_club uuid,p_title text,p_description text,p_cost integer,p_stock integer default null,p_request uuid default null) returns uuid
language plpgsql security definer set search_path='' as $$
declare result uuid; creation uuid:=coalesce(p_request,gen_random_uuid());
begin
 perform cia_private.loyalty_actor('company');
 if not exists(select 1 from public.cia_clubs where id=p_club and owner_id=auth.uid()) then raise exception using errcode='42501',message='club_not_owned';end if;
 if p_title is null or char_length(btrim(p_title)) not between 2 and 100 or p_description is null or char_length(p_description)>500 or
 p_cost is null or p_cost not between 1 and 1000000 or p_stock<0 then raise exception using errcode='22023',message='invalid_reward';end if;
 insert into public.cia_rewards(club_id,title,description,points_cost,stock,creation_key) values(p_club,btrim(p_title),btrim(p_description),p_cost,p_stock,creation) on conflict(club_id,creation_key) do nothing returning id into result;
 if result is null then select id into result from public.cia_rewards where club_id=p_club and creation_key=creation;end if;
 return result;
end;$$;

create function public.cia_set_reward_active(p_reward uuid,p_active boolean) returns void
language plpgsql security definer set search_path='' as $$
begin
 perform cia_private.loyalty_actor('company');
 if p_active is null then raise exception using errcode='22023',message='invalid_reward';end if;
 -- Lock club first to serialize owner edits without locking member rows.
 update public.cia_rewards r set active=p_active where r.id=p_reward and exists(select 1 from public.cia_clubs c where c.id=r.club_id and c.owner_id=auth.uid());
 if not found then raise exception using errcode='42501',message='club_not_owned';end if;
end;$$;

create function public.cia_redeem_reward(p_reward uuid,p_request uuid) returns uuid
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
 if not reward.active or reward.stock=0 then raise exception using errcode='22023',message='reward_unavailable';end if;
 if member.points<reward.points_cost then raise exception using errcode='22023',message='not_enough_points';end if;
 update public.cia_club_members set points=points-reward.points_cost where club_id=club and user_id=actor;
 update public.cia_rewards set stock=stock-1 where id=p_reward and stock is not null;
 insert into public.cia_redemptions(reward_id,club_id,user_id,request_id,points_cost,reward_title)
 values(p_reward,club,actor,p_request,reward.points_cost,reward.title) returning id into result;
 return result;
end;$$;

create function public.cia_deliver_redemption(p_redemption uuid) returns void
language plpgsql security definer set search_path='' as $$
begin
 perform cia_private.loyalty_actor('company');
 update public.cia_redemptions r set state='delivered',delivered_at=coalesce(delivered_at,now())
 where r.id=p_redemption and exists(select 1 from public.cia_clubs c where c.id=r.club_id and c.owner_id=auth.uid());
 if not found then raise exception using errcode='42501',message='club_not_owned';end if;
end;$$;

create function public.cia_loyalty_snapshot() returns jsonb
language plpgsql security definer set search_path='' as $$
declare actor uuid; kind text;
begin
 actor:=cia_private.loyalty_actor();
 select account_type into kind from public.cia_profiles where id=actor;
 return jsonb_build_object(
 'account_type',kind,
 'clubs',coalesce((select jsonb_agg(x) from (
  select c.id,c.name,c.category,c.city,c.description,c.points_per_visit,c.is_listed,
   case when c.owner_id=actor then c.join_code else null end as join_code,
   m.points,m.visits_count,m.joined_at
  from public.cia_clubs c left join public.cia_club_members m on m.club_id=c.id and m.user_id=actor
  where c.owner_id=actor or m.user_id=actor order by c.created_at desc limit 120
 )x),'[]'::jsonb),
 'explore',coalesce((select jsonb_agg(x) from (
  select c.id,c.name,c.category,c.city,c.description,c.points_per_visit,
  (select count(*) from public.cia_rewards r where r.club_id=c.id and r.active and (r.stock is null or r.stock>0)) as rewards_count
  from public.cia_clubs c where c.is_listed and not exists(select 1 from public.cia_club_members m where m.club_id=c.id and m.user_id=actor)
  order by c.created_at desc limit 60
 )x),'[]'::jsonb),
 'rewards',coalesce((select jsonb_agg(x) from (
  select r.* from public.cia_rewards r join public.cia_clubs c on c.id=r.club_id
  where c.owner_id=actor or (r.active and exists(select 1 from public.cia_club_members m where m.club_id=c.id and m.user_id=actor))
  order by r.points_cost,r.created_at limit 200
 )x),'[]'::jsonb),
 'visits',coalesce((select jsonb_agg(x) from (
  select v.*,p.name as customer_name,c.name as club_name from public.cia_visits v
  join public.cia_clubs c on c.id=v.club_id join public.cia_profiles p on p.id=v.user_id
  where v.user_id=actor or c.owner_id=actor order by v.arrived_at desc limit 200
 )x),'[]'::jsonb),
 'redemptions',coalesce((select jsonb_agg(x) from (
  select r.*,p.name as customer_name,c.name as club_name from public.cia_redemptions r
  join public.cia_clubs c on c.id=r.club_id join public.cia_profiles p on p.id=r.user_id
  where r.user_id=actor or c.owner_id=actor order by r.created_at desc limit 200
 )x),'[]'::jsonb),
 'members',coalesce((select jsonb_agg(x) from (
  select m.*,p.name as customer_name from public.cia_club_members m
  join public.cia_clubs c on c.id=m.club_id join public.cia_profiles p on p.id=m.user_id
  where c.owner_id=actor order by m.joined_at desc limit 200
 )x),'[]'::jsonb),
 'counts',jsonb_build_object(
  'members',(select count(*) from public.cia_club_members m join public.cia_clubs c on c.id=m.club_id where c.owner_id=actor),
  'visits',(select count(*) from public.cia_visits v join public.cia_clubs c on c.id=v.club_id where v.user_id=actor or c.owner_id=actor),
  'confirmed_visits',(select count(*) from public.cia_visits v join public.cia_clubs c on c.id=v.club_id where (v.user_id=actor or c.owner_id=actor) and v.confirmed_at is not null),
  'active_visits',(select count(*) from public.cia_visits v join public.cia_clubs c on c.id=v.club_id where (v.user_id=actor or c.owner_id=actor) and v.departed_at is null),
  'pending_redemptions',(select count(*) from public.cia_redemptions r join public.cia_clubs c on c.id=r.club_id where (r.user_id=actor or c.owner_id=actor) and r.state='requested')
 ),
 'server_time',now());
end;$$;

-- Explicit API allowlist; helpers remain inaccessible.
revoke all on function public.cia_create_club(text,text,text,text,integer),public.cia_set_club_listed(uuid,boolean),
 public.cia_join_club(text),public.cia_join_listed_club(uuid),public.cia_visit_action(uuid,text,uuid),
 public.cia_save_reward(uuid,text,text,integer,integer,uuid),public.cia_set_reward_active(uuid,boolean),
 public.cia_redeem_reward(uuid,uuid),public.cia_deliver_redemption(uuid),public.cia_loyalty_snapshot() from public,anon,authenticated;
grant execute on function public.cia_create_club(text,text,text,text,integer),public.cia_set_club_listed(uuid,boolean),
 public.cia_join_club(text),public.cia_join_listed_club(uuid),public.cia_visit_action(uuid,text,uuid),
 public.cia_save_reward(uuid,text,text,integer,integer,uuid),public.cia_set_reward_active(uuid,boolean),
 public.cia_redeem_reward(uuid,uuid),public.cia_deliver_redemption(uuid),public.cia_loyalty_snapshot() to authenticated;
commit;

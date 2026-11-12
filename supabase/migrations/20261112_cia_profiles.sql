-- Centro I.A. registration profiles (applied to Supabase project on 2026-11-12).
-- This is the source-controlled copy of the migration; never replay by hand on an existing project.
create table public.cia_profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 name text not null check (char_length(name) between 1 and 90),
 account_type text not null check (account_type in ('user','company')),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
alter table public.cia_profiles enable row level security;
revoke all on table public.cia_profiles from anon, authenticated;
grant select on table public.cia_profiles to authenticated;
grant update (name) on table public.cia_profiles to authenticated;
create policy "Read own CIA profile" on public.cia_profiles
 for select to authenticated using ((select auth.uid()) = id);
create policy "Update own CIA display name" on public.cia_profiles
 for update to authenticated using ((select auth.uid()) = id)
 with check ((select auth.uid()) = id);
create schema if not exists cia_private;
revoke all on schema cia_private from PUBLIC;
create function cia_private.create_cia_profile()
returns trigger language plpgsql security definer set search_path = '' as $$
declare profile_name text; profile_type text;
begin
 profile_name := left(coalesce(nullif(trim(new.raw_user_meta_data ->> 'name'), ''), 'Mi cuenta'), 90);
 profile_type := case when new.raw_user_meta_data ->> 'account_type' = 'company' then 'company' else 'user' end;
 insert into public.cia_profiles(id,name,account_type)
 values(new.id,profile_name,profile_type) on conflict(id) do nothing;
 return new;
end;
$$;
revoke all on function cia_private.create_cia_profile() from PUBLIC,anon,authenticated;
create trigger cia_auth_user_created after insert on auth.users
for each row execute function cia_private.create_cia_profile();

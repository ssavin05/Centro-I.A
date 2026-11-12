-- Read-only catalog checks. Does not create test users or mutate production records.
do $$
begin
  if not (select relrowsecurity from pg_class where oid='public.cia_profiles'::regclass) then
    raise exception 'cia_profiles must enforce RLS';
  end if;
  if has_table_privilege('anon','public.cia_profiles','SELECT') then
    raise exception 'Anonymous visitors must not read private profiles';
  end if;
  if has_table_privilege('authenticated','public.cia_profiles','INSERT,DELETE,UPDATE') then
    raise exception 'Authenticated clients must not insert/delete or update the whole profile';
  end if;
  if not has_column_privilege('authenticated','public.cia_profiles','name','UPDATE') then
    raise exception 'Name update must remain available';
  end if;
  if has_column_privilege('authenticated','public.cia_profiles','account_type','UPDATE') or
     has_column_privilege('authenticated','public.cia_profiles','id','UPDATE') then
    raise exception 'Clients must not change type or ownership';
  end if;
  if exists(select 1 from pg_policies where schemaname='public' and tablename='cia_profiles' and
    (coalesce(qual,'') like '%user_metadata%' or coalesce(with_check,'') like '%user_metadata%')) then
    raise exception 'Policies must not authorize through editable metadata';
  end if;
  if not exists(select 1 from pg_policies where schemaname='public' and tablename='cia_profiles'
    and cmd='SELECT' and qual like '%auth.uid()%id%') then
    raise exception 'Missing profile ownership policy';
  end if;
  if has_function_privilege('anon','cia_private.create_cia_profile()','EXECUTE') or
     has_function_privilege('authenticated','cia_private.create_cia_profile()','EXECUTE') then
    raise exception 'Profile creation trigger must not be a public RPC';
  end if;
end;
$$;
select 'Profile permission catalog checks passed' as result;

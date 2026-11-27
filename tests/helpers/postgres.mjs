import {PGlite} from '@electric-sql/pglite';
import {readFile} from 'node:fs/promises';
export const actors={owner:'00000000-0000-4000-8000-000000000001',other:'00000000-0000-4000-8000-000000000002',user:'00000000-0000-4000-8000-000000000003'};
export async function isolatedPostgres({businesses=false}={}) {
  const db=await PGlite.create();
  await db.exec(`create role anon nologin; create role authenticated nologin; create schema auth;
    create table auth.users(id uuid primary key,raw_user_meta_data jsonb not null default '{}');
    create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
    grant usage on schema auth to anon,authenticated; grant execute on function auth.uid() to anon,authenticated;`);
  await db.exec(await readFile(new URL('../../supabase/migrations/20261112_cia_profiles.sql',import.meta.url),'utf8'));
  if(businesses)await db.exec(await readFile(new URL('../../supabase/proposals/business_onboarding.sql',import.meta.url),'utf8'));
  for(const [name,id] of Object.entries(actors))await db.query('insert into auth.users(id,raw_user_meta_data) values($1,$2)',[id,{name:'Cuenta aislada '+name,account_type:name==='user'?'user':'company'}]);
  const asUser=(id,callback,role='authenticated')=>db.transaction(async tx=>{
    await tx.exec('set local role '+(role==='anon'?'anon':'authenticated'));
    await tx.query("select set_config('request.jwt.claim.sub',$1,true)",[id||'']);
    return callback(tx);
  });
  return {db,asUser,close:()=>db.close()};
}

import {PGlite} from 'pglite17';
import {readFile,readdir} from 'node:fs/promises';
export const studioActors={company:'00000000-0000-4000-8000-000000000001',other:'00000000-0000-4000-8000-000000000002',user:'00000000-0000-4000-8000-000000000003',second:'00000000-0000-4000-8000-000000000004'};
export const defaultSettings={business_kind:'salon',business_scale:'independent',theme:'midnight',timezone:'America/Tijuana',logo_data:'',booking_enabled:true,phone:'',address:'',hours:''};
export async function studioDatabase(t){
 const db=await PGlite.create();t.after(()=>db.close());
 await db.exec(`create role anon nologin;create role authenticated nologin;create schema auth;create table auth.users(id uuid primary key,raw_user_meta_data jsonb not null default '{}');create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;grant usage on schema auth to anon,authenticated;grant execute on function auth.uid() to anon,authenticated;`);
 for(const name of ['20261112_cia_profiles.sql','20261117013535_loyalty_core.sql',...(await readdir(new URL('../../supabase/migrations/',import.meta.url))).filter(n=>n.endsWith('_studio_32.sql'))]){const source=await readFile(new URL('../../supabase/migrations/'+name,import.meta.url),'utf8');try{await db.exec(source);}catch(error){throw new Error(name+': '+error.message+' · cerca de '+source.slice(Math.max(0,Number(error.position||1)-100),Number(error.position||1)+100));}}
 for(const [name,id]of Object.entries(studioActors))await db.query('insert into auth.users values($1,$2)',[id,{name:'Fixture '+name,account_type:['company','other'].includes(name)?'company':'user'}]);
 const rpc=(who,name,args=[])=>db.transaction(async tx=>{await tx.exec('set local role authenticated');await tx.query("select set_config('request.jwt.claim.sub',$1,true)",[studioActors[who]]);return (await tx.query('select public.'+name+'('+args.map((_,i)=>'$'+(i+1)).join(',')+') as value',args)).rows[0].value;});
 const business={name:'Salón de prueba',category:'Peluquería',city:'Ciudad aislada',description:'Solo prueba',points_per_visit:10};
 const club=await rpc('company','cia_studio_save_business',[null,business,defaultSettings]);
 const code=(await db.query('select join_code from cia_clubs where id=$1',[club])).rows[0].join_code;
 await rpc('user','cia_join_club',[code]);
 return {db,rpc,club,business,code};
}

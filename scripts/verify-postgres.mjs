// Real, independent PostgreSQL connections; never accepts a Supabase URL.
import {spawn} from 'node:child_process';
import {readFile,readdir} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
import assert from 'node:assert/strict';

if(process.env.CIA_NATIVE_TEST!=='1'||process.env.PGHOST!=='127.0.0.1'||process.env.PGPORT!=='55432'){
 console.error('Solo para PostgreSQL de pruebas: CIA_NATIVE_TEST=1, PGHOST=127.0.0.1 y PGPORT=55432. No admite proyectos remotos.');
 process.exit(1);
}
const database='cia_verify_'+randomUUID().replaceAll('-','');
let created=false;
function sql(source,db=database){
 return new Promise((resolve,reject)=>{
  const child=spawn('psql',['-X','-q','-A','-t','-v','ON_ERROR_STOP=1','-h','127.0.0.1','-p','55432','-U',process.env.PGUSER||'postgres','-d',db],{stdio:['pipe','pipe','pipe'],env:{...process.env,PGCONNECT_TIMEOUT:'10',PGOPTIONS:'-c statement_timeout=20000 -c lock_timeout=10000'}});
  let output='',error='';const timer=setTimeout(()=>child.kill(),30000);
  child.stdout.on('data',chunk=>output+=chunk);child.stderr.on('data',chunk=>error+=chunk);
  child.once('error',failure=>{clearTimeout(timer);reject(failure);});
  child.once('close',code=>{clearTimeout(timer);code===0?resolve(output.trim()):reject(Error(error.trim()||'psql terminó con código '+code));});
  child.stdin.on('error',()=>{});child.stdin.end(source);
 });
}
const literal=value=>value===null?'null':typeof value==='number'?String(value):typeof value==='boolean'?String(value):"'"+(typeof value==='object'?JSON.stringify(value):String(value)).replaceAll("'","''")+"'";
const rpc=async(actor,name,args=[])=>{
 if(!/^[a-z_]+$/.test(name)||!/^[a-f0-9-]{36}$/.test(actor))throw Error('Identidad o función de prueba inválida.');
 return JSON.parse(await sql('begin;set local role authenticated;set local request.jwt.claim.sub='+literal(actor)+';select jsonb_build_object(\'value\',public.'+name+'('+args.map(literal).join(',')+'));commit;')).value;
};
const json=async query=>JSON.parse(await sql(query));
const settings={business_kind:'other',business_scale:'independent',theme:'midnight',timezone:'UTC',booking_enabled:false,logo_data:'',phone:'',address:'',hours:''};
async function fixture(){
 const owner=randomUUID(),user=randomUUID(),second=randomUUID();
 await sql('insert into auth.users(id,raw_user_meta_data) values'+[[owner,'company'],[user,'user'],[second,'user']].map(([id,type])=>'('+literal(id)+','+literal({name:'Fixture PostgreSQL',account_type:type})+'::jsonb)').join(',')+';');
 const club=await rpc(owner,'cia_studio_save_business',[null,{name:'Prueba concurrente',category:'Otro',city:'Base efímera',description:'Fixture aislado',points_per_visit:10},settings]);
 const code=await sql('select join_code from public.cia_clubs where id='+literal(club)+';');
 await rpc(user,'cia_join_club',[code]);await rpc(second,'cia_join_club',[code]);
 for(const id of [user,second])await rpc(owner,'cia_studio_adjust_points',[club,id,100,'Saldo de prueba',randomUUID()]);
 return {owner,user,second,club};
}
// A separate session holds a row lock until both competing calls are connected and waiting.
async function contend(lockSql,work){
 const marker=randomUUID();
 const child=spawn('psql',['-X','-q','-A','-t','-v','ON_ERROR_STOP=1','-h','127.0.0.1','-p','55432','-U',process.env.PGUSER||'postgres','-d',database],{stdio:['pipe','pipe','pipe'],env:process.env});
 let error='',readyResolve,doneResolve,doneReject,readyReject;
 const ready=new Promise((resolve,reject)=>{readyResolve=resolve;readyReject=reject;});
 const done=new Promise((resolve,reject)=>{doneResolve=resolve;doneReject=reject;});
 const timer=setTimeout(()=>child.kill(),25000);let output='';
 child.stdout.on('data',chunk=>{output+=chunk;if(output.includes(marker))readyResolve();});child.stderr.on('data',chunk=>error+=chunk);
 child.on('error',err=>{readyReject(err);doneReject(err);});
 child.on('close',code=>{clearTimeout(timer);if(code===0)doneResolve();else{const err=Error(error||'No se pudo mantener el bloqueo de prueba.');readyReject(err);doneReject(err);}});
 // Observe rejection immediately even when an early readiness failure aborts the function.
 done.catch(()=>{});child.stdin.on('error',()=>{});
 child.stdin.write('begin;'+lockSql+';select '+literal(marker)+';\n');
 try{
  await ready;const pending=work();
  // Require at least two blocked sessions in this database before releasing the lock.
  const deadline=Date.now()+10000;let waiting=0;
  do{waiting=Number(await sql("select count(*) from pg_stat_activity where datname=current_database() and pid<>pg_backend_pid() and wait_event_type='Lock';"));if(waiting>=2)break;await new Promise(resolve=>setTimeout(resolve,25));}while(Date.now()<deadline);
  assert.ok(waiting>=2,'Las dos conexiones deben competir por un bloqueo real.');
  child.stdin.end('commit;\n');await done;return await pending;
 }finally{if(!child.stdin.destroyed)child.stdin.end('rollback;\n');}
}
try{
 await sql('create database "'+database+'";','postgres');created=true;
 const version=await sql('show server_version_num;');assert.ok(Number(version)>=170000&&Number(version)<180000,'Se requiere PostgreSQL17.');
 await sql("do $$begin if not exists(select 1 from pg_roles where rolname='anon')then create role anon nologin;end if;if not exists(select 1 from pg_roles where rolname='authenticated')then create role authenticated nologin;end if;end;$$;create schema auth;create table auth.users(id uuid primary key,raw_user_meta_data jsonb not null default '{}');create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;grant usage on schema auth to anon,authenticated;grant execute on function auth.uid() to anon,authenticated;");
 for(const name of (await readdir(new URL('../supabase/migrations/',import.meta.url))).filter(name=>name.endsWith('.sql')).sort())await sql(await readFile(new URL('../supabase/migrations/'+name,import.meta.url),'utf8'));

 const one=await fixture();const scarce=await rpc(one.owner,'cia_save_reward',[one.club,'Última unidad','Prueba',30,1,randomUUID()]);
 const race=await contend('select id from public.cia_rewards where id='+literal(scarce)+' for update',()=>Promise.allSettled([rpc(one.user,'cia_redeem_reward',[scarce,randomUUID()]),rpc(one.second,'cia_redeem_reward',[scarce,randomUUID()])]));
 assert.equal(race.filter(r=>r.status==='fulfilled').length,1);assert.match(race.find(r=>r.status==='rejected').reason.message,/reward_unavailable/);
 const stock=await json('select jsonb_build_object(\'stock\',(select stock from public.cia_rewards where id='+literal(scarce)+'),\'balance\',(select sum(points) from public.cia_club_members where club_id='+literal(one.club)+'),\'canjes\',(select count(*) from public.cia_redemptions where reward_id='+literal(scarce)+'));');
 assert.deepEqual(stock,{stock:0,balance:170,canjes:1});console.log('PASS: dos clientes compiten por una unidad sin saldo negativo ni sobreventa.');

 const two=await fixture();const reward=await rpc(two.owner,'cia_save_reward',[two.club,'Idempotencia','Prueba',30,2,randomUUID()]),request=randomUUID();
 const repeat=await contend('select user_id from public.cia_club_members where club_id='+literal(two.club)+' and user_id='+literal(two.user)+' for update',()=>Promise.all([rpc(two.user,'cia_redeem_reward',[reward,request]),rpc(two.user,'cia_redeem_reward',[reward,request])]));
 assert.equal(repeat[0],repeat[1]);
 const dedupe=await json('select jsonb_build_object(\'stock\',(select stock from public.cia_rewards where id='+literal(reward)+'),\'points\',(select points from public.cia_club_members where club_id='+literal(two.club)+' and user_id='+literal(two.user)+'),\'canjes\',(select count(*) from public.cia_redemptions where reward_id='+literal(reward)+'));');
 assert.deepEqual(dedupe,{stock:1,points:70,canjes:1});console.log('PASS: solicitudes simultáneas con la misma clave devuelven un solo canje.');

 for(let iteration=0;iteration<4;iteration++){
  const three=await fixture();const r=await rpc(three.owner,'cia_save_reward',[three.club,'Entrega o devolución','Prueba',30,1,randomUUID()]);const redemption=await rpc(three.user,'cia_redeem_reward',[r,randomUUID()]);
  const outcomes=await contend('select id from public.cia_redemptions where id='+literal(redemption)+' for update',()=>Promise.allSettled([rpc(three.owner,'cia_growth_cancel_redemption',[redemption,'Sin entregar',randomUUID()]),rpc(three.owner,'cia_deliver_redemption',[redemption])]));
  assert.equal(outcomes.filter(r=>r.status==='fulfilled').length,1);
  const result=await json('select jsonb_build_object(\'state\',(select state from public.cia_redemptions where id='+literal(redemption)+'),\'stock\',(select stock from public.cia_rewards where id='+literal(r)+'),\'points\',(select points from public.cia_club_members where club_id='+literal(three.club)+' and user_id='+literal(three.user)+'),\'refunds\',(select count(*) from public.cia_point_movements where source_key='+literal('refund:'+redemption)+'));');
  assert.deepEqual(result,result.state==='cancelled'?{state:'cancelled',stock:1,points:100,refunds:1}:{state:'delivered',stock:0,points:70,refunds:0});
 }
 console.log('PASS: cuatro carreras de entrega/devolución conservan un solo resultado y ledger exacto.');
 console.log('PostgreSQL17: contención comprobada con conexiones independientes.');
}finally{
 if(created&&/^cia_verify_[a-f0-9]{32}$/.test(database))await sql('drop database "'+database+'" with(force);','postgres');
}

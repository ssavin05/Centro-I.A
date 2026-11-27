import {createServer} from 'node:http';
import {readFile,mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve,extname} from 'node:path';
import {randomUUID,timingSafeEqual} from 'node:crypto';
import {PGlite} from 'pglite17';
import {pagesFiles} from './pages-files.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
export const previewActors={company:'00000000-0000-4000-8000-000000000001',user:'00000000-0000-4000-8000-000000000003',manager:'00000000-0000-4000-8000-000000000005',professional:'00000000-0000-4000-8000-000000000006',reception:'00000000-0000-4000-8000-000000000007'};
const rpcArguments={
 cia_history_page:['p_kind','p_club','p_after','p_limit','p_query'],cia_growth_memberships:[],cia_growth_set_membership:['p_club','p_active'],cia_growth_cancel_redemption:['p_id','p_reason','p_request'],cia_growth_preferences:['p_marketing'],cia_growth_insights:['p_club','p_days'],
 cia_ops_snapshot:[],cia_ops_save_location:['p_club','p_payload','p_request'],cia_ops_invite:['p_location','p_role','p_reference','p_request'],cia_ops_accept_invite:['p_code'],cia_ops_set_team:['p_id','p_active','p_role'],cia_ops_revoke_invite:['p_id'],cia_ops_save_resource:['p_location','p_payload','p_request'],cia_ops_save_hours:['p_resource','p_windows'],cia_ops_timeoff:['p_resource','p_payload','p_request'],cia_ops_slots:['p_resource','p_day','p_minutes'],cia_ops_book:['p_resource','p_payload','p_request'],cia_ops_update_appointment:['p_id','p_state'],cia_ops_reschedule:['p_id','p_start','p_revision','p_request'],
 cia_studio_snapshot:[],cia_studio_save_business:['p_club','p_business','p_settings'],cia_studio_save_catalog:['p_club','p_items','p_request'],cia_studio_save_promotion:['p_club','p_payload','p_request'],cia_studio_adjust_points:['p_club','p_user','p_amount','p_reason','p_request'],cia_studio_save_appointment:['p_club','p_payload','p_request'],cia_studio_update_appointment:['p_id','p_state'],cia_studio_read_notice:['p_id'],cia_studio_save_challenge:['p_club','p_payload','p_request'],cia_studio_claim_challenge:['p_id'],cia_studio_save_reward:['p_club','p_payload','p_request'],
 cia_loyalty_snapshot:[],cia_create_club:['p_name','p_category','p_city','p_description','p_points'],
 cia_set_club_listed:['p_club','p_listed'],cia_join_club:['p_code'],cia_join_listed_club:['p_club'],
 cia_visit_action:['p_club','p_action','p_visit'],cia_save_reward:['p_club','p_title','p_description','p_cost','p_stock','p_request'],
 cia_set_reward_active:['p_reward','p_active'],cia_redeem_reward:['p_reward','p_request'],cia_deliver_redemption:['p_redemption']
};
const knownErrors=new Set(['invalid_club_code','join_first','visit_cooldown','not_enough_points','reward_unavailable','account_not_allowed','club_not_owned','request_conflict','invalid_club','invalid_reward','request_required','invalid_visit_action','visit_unavailable','club_unavailable']);
export async function createLoyaltyPreview({dataDir=resolve(root,'../.local-centro-fidelidad'),port=4174,enableChecks=false,token=randomUUID()}={}){
 await mkdir(dataDir,{recursive:true});const db=await PGlite.create(dataDir);
 if(!(await db.query("select to_regclass('public.cia_profiles') as present")).rows[0].present){
  await db.exec(`create role anon nologin;create role authenticated nologin;create schema auth;
   create table auth.users(id uuid primary key,raw_user_meta_data jsonb not null default '{}');
   create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
   grant usage on schema auth to anon,authenticated;grant execute on function auth.uid() to anon,authenticated;`);
  await db.exec(await readFile(resolve(root,'supabase/migrations/20261112_cia_profiles.sql'),'utf8'));
 }
 if(!(await db.query("select to_regclass('public.cia_clubs') as present")).rows[0].present)
  await db.exec(await readFile(resolve(root,'supabase/migrations/20261117013535_loyalty_core.sql'),'utf8'));
 if(!(await db.query("select to_regclass('public.cia_club_settings') as present")).rows[0].present)
  await db.exec(await readFile(resolve(root,'supabase/migrations/20261125154520_studio_32.sql'),'utf8'));
 if(!(await db.query("select to_regclass('public.cia_locations') as present")).rows[0].present)await db.exec(await readFile(resolve(root,'supabase/migrations/20261125201303_operations_33_reviewed.sql'),'utf8'));
 if(!(await db.query("select to_regprocedure('cia_private.ops_can_operate_appointment(uuid)') as present")).rows[0].present)await db.exec(await readFile(resolve(root,'supabase/history/33/20261125175129_operations_33_hardening.sql'),'utf8'));
 if(!(await db.query("select to_regclass('public.cia_notification_preferences') as present")).rows[0].present)await db.exec(await readFile(resolve(root,'supabase/migrations/20261125201344_growth_34.sql'),'utf8'));
 for(const [role,id]of Object.entries(previewActors))await db.query('insert into auth.users(id,raw_user_meta_data) values($1,$2) on conflict(id) do nothing',[id,{name:({company:'Empresa de prueba',user:'Usuario de prueba',manager:'Gerente de prueba',professional:'Profesional de prueba',reception:'Recepción de prueba'})[role],account_type:role==='company'?'company':'user'}]);
 async function asActor(actor,work){return db.transaction(async tx=>{await tx.exec('set local role authenticated');await tx.query("select set_config('request.jwt.claim.sub',$1,true)",[previewActors[actor]]);return work(tx);});}
 const publicFiles=new Set(pagesFiles);if(enableChecks)for(const file of ['tests/browser/imports.html','tests/browser/imports.js','docs/GUIA-CENTRO-IA-3.2.html'])publicFiles.add(file);
 const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webmanifest':'application/manifest+json'};
 const send=(res,status,value,type='application/json')=>{res.writeHead(status,{'Content-Type':type+'; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'});res.end(type==='application/json'?JSON.stringify(value):value);};
 const server=createServer(async(req,res)=>{
  try{
   const host=req.headers.host;
   if(!host||!/^127\.0\.0\.1:\d+$/.test(host)){send(res,403,{message:'local_host_required'});return;}
   const url=new URL(req.url,'http://'+host);
   if(url.pathname==='/__local/health'){send(res,200,{mode:'isolated-local-preview',production:false});return;}
   if(url.pathname.startsWith('/__local/')){
    const supplied=String(req.headers['x-preview-token']||'');
    if(Buffer.byteLength(supplied)!==Buffer.byteLength(token)||!timingSafeEqual(Buffer.from(supplied),Buffer.from(token))){send(res,403,{message:'local_token_required'});return;}
    if(req.headers.origin&&req.headers.origin!=='http://'+host){send(res,403,{message:'local_origin_required'});return;}
    const actor=Object.hasOwn(previewActors,req.headers['x-preview-actor'])?req.headers['x-preview-actor']:'user';
    let payload={};
    if(req.method==='POST'){
     let body='';for await(const chunk of req){body+=chunk;if(Buffer.byteLength(body)>1048576){send(res,413,{message:'request_too_large'});return;}}
     try{payload=JSON.parse(body);}catch{send(res,400,{message:'invalid_json'});return;}
    }else if(req.method!=='GET'){send(res,405,{message:'method_not_allowed'});return;}
    if(url.pathname==='/__local/profile'){
     const value=await asActor(actor,async tx=>{
      if(req.method==='POST'){
       if(typeof payload.name!=='string'||payload.name.trim().length<1||payload.name.trim().length>90)throw Error('invalid_name');
       await tx.query('update public.cia_profiles set name=$1 where id=$2',[payload.name.trim(),previewActors[actor]]);
      }
      const profile=(await tx.query('select name,account_type,created_at from public.cia_profiles where id=$1',[previewActors[actor]])).rows[0];
      return {user:{id:previewActors[actor],email:actor+'@prueba.invalid'},profile};
     });send(res,200,value);return;
    }
    if(url.pathname==='/__local/rpc'&&req.method==='POST'){
     const parameters=rpcArguments[payload.name];
     if(!parameters){send(res,403,{message:'rpc_not_allowed'});return;}
     const args=parameters.map(name=>payload.args?.[name]??null);
     const value=await asActor(actor,async tx=>(await tx.query('select public.'+payload.name+'('+args.map((_,i)=>'$'+(i+1)).join(',')+') as value',args)).rows[0].value);
     send(res,200,value);return;
    }
    send(res,404,{message:'local_route_not_found'});return;
   }
   if(!['GET','HEAD'].includes(req.method)){send(res,405,{message:'method_not_allowed'});return;}
   if(url.pathname==='/'||url.pathname==='/index.html'||url.pathname==='/auth.html'){res.writeHead(302,{Location:'/workspace.html?as='+(url.searchParams.get('as')==='company'?'company':'user')});res.end();return;}
   const file=decodeURIComponent(url.pathname.slice(1));
   if(!publicFiles.has(file)){send(res,404,'No encontrado.','text/plain');return;}
   let data;
   if(file==='supabase-client.js'){
    data=(await readFile(resolve(root,'scripts/local-preview-client.mjs'),'utf8')).replace('__PREVIEW_TOKEN__',token);
   }else if(file==='workspace.html'){
    data=(await readFile(resolve(root,file),'utf8')).replace('class="workspace-layout app-layout"','class="workspace-layout app-layout is-local-preview"').replace('<a href="#workspace-content"','<div class="preview-bar"><strong>PRUEBA LOCAL</strong><span>Datos aislados en este equipo. No es tu cuenta real.</span><label>Vista de prueba<select aria-label="Vista de prueba" id="local-preview-actor"><option value="company">Empresa</option><option value="user">Usuario</option><option value="manager">Gerente</option><option value="professional">Profesional</option><option value="reception">Recepción</option></select></label></div><a href="#workspace-content"');
   }else data=await readFile(resolve(root,file));
   res.writeHead(200,{'Content-Type':(mime[extname(file)]||'application/octet-stream')+'; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:data);
  }catch(error){send(res,400,{code:error.code||'LOCAL_ERROR',message:knownErrors.has(error.message)||/^(invalid_|appointment_|challenge_|negative_balance|member_unavailable|bookings_disabled|notice_not_owned|membership_|refund_reason_required|redemption_|catalog_not_owned|operation_not_allowed|invitation_unavailable|already_owner|primary_location_required|location_unavailable|resource_|outside_working_hours|overlapping_hours|timeoff_|request_required|request_conflict)/.test(error.message)?error.message:'local_operation_failed'});}
 });
 try{await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',resolve);});}catch(error){await db.close();throw error;}
 return {server,db,token,port:server.address().port,close:async()=>{await new Promise(resolve=>server.close(resolve));await db.close();}};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const preview=await createLoyaltyPreview({port:Number(process.env.PORT||4174),enableChecks:process.env.CIA_PREVIEW_CHECKS==='1'});console.log(`PRUEBA LOCAL AISLADA · sin conexión a Supabase\nUsuario: http://127.0.0.1:${preview.port}/workspace.html?as=user\nEmpresa: http://127.0.0.1:${preview.port}/workspace.html?as=company`);
 for(const signal of ['SIGINT','SIGTERM'])process.once(signal,async()=>{await preview.close();process.exit(0);});
}

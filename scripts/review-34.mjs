// Isolated, explicitly synthetic review data. This script never connects to Supabase.
import {createLoyaltyPreview,previewActors} from './loyalty-preview.mjs';
import {fileURLToPath} from 'node:url';
import {randomUUID} from 'node:crypto';
const app=await createLoyaltyPreview({dataDir:fileURLToPath(new URL('../../.local-centro-34',import.meta.url)),port:4177});
const rpc=(who,name,args=[])=>app.db.transaction(async tx=>{await tx.exec('set local role authenticated');await tx.query("select set_config('request.jwt.claim.sub',$1,true)",[previewActors[who]]);return(await tx.query('select public.'+name+'('+args.map((_,i)=>'$'+(i+1)).join(',')+') value',args)).rows[0].value;});
if(!(await app.db.query('select 1 from cia_clubs limit 1')).rows.length){
 const club=await rpc('company','cia_studio_save_business',[null,{name:'Estudio Azul · prueba local',category:'Peluquería',city:'Ciudad de prueba',description:'Datos sintéticos para revisar Centro I.A.',points_per_visit:10},{business_kind:'salon',business_scale:'small',theme:'midnight',timezone:'America/Tijuana',booking_enabled:true,logo_data:'',phone:'',address:'Referencia de ejemplo',hours:'Lunes a sábado'}]);
 const code=(await app.db.query('select join_code from cia_clubs where id=$1',[club])).rows[0].join_code;await rpc('user','cia_join_club',[code]);
 await rpc('company','cia_studio_adjust_points',[club,previewActors.user,120,'Saldo sintético de revisión',randomUUID()]);
 const reward=await rpc('company','cia_save_reward',[club,'Tratamiento · prueba local','Recompensa de ejemplo',30,5,randomUUID()]);await rpc('user','cia_redeem_reward',[reward,randomUUID()]);
 await rpc('company','cia_studio_save_catalog',[club,[{title:'Corte · prueba local',description:'Servicio de ejemplo',category:'Cortes',price:180,currency:'MXN',item_kind:'service',duration_minutes:30,active:true}],randomUUID()]);
 const location=(await rpc('company','cia_ops_snapshot')).locations[0].id;
 const invite=await rpc('company','cia_ops_invite',[location,'professional','Profesional de prueba',randomUUID()]);const inviteCode=(await app.db.query('select code from cia_team_invites where id=$1',[invite])).rows[0].code;await rpc('professional','cia_ops_accept_invite',[inviteCode]);
 const resource=await rpc('company','cia_ops_save_resource',[location,{name:'Profesional Azul · prueba',kind:'professional',staff_user_id:previewActors.professional,active:true},randomUUID()]);await rpc('company','cia_ops_save_hours',[resource,Array.from({length:7},(_,weekday)=>({weekday,starts_at:'09:00',ends_at:'18:00'}))]);
 const start=(await app.db.query("select ((current_date+2+time '10:00') at time zone 'America/Tijuana') as value")).rows[0].value;
 await rpc('company','cia_ops_book',[resource,{title:'Corte · prueba local',user_id:previewActors.user,starts_at:new Date(start).toISOString(),duration_minutes:30},randomUUID()]);
 const visit=await rpc('user','cia_visit_action',[club,'arrive',null]);await rpc('user','cia_visit_action',[club,'depart',visit]);await rpc('company','cia_visit_action',[club,'confirm',visit]);
}
console.log('PRUEBA LOCAL 3.4 · fixtures sintéticos y base separada\nhttp://127.0.0.1:4177/workspace.html?as=company');
for(const signal of ['SIGINT','SIGTERM'])process.once(signal,async()=>{await app.close();process.exit(0);});

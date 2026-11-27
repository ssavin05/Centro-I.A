// Isolated, explicitly synthetic review data. This script never connects to Supabase.
import {createLoyaltyPreview,previewActors} from './loyalty-preview.mjs';
import {fileURLToPath} from 'node:url';
import {randomUUID} from 'node:crypto';
const app=await createLoyaltyPreview({dataDir:fileURLToPath(new URL('../../.local-centro-35',import.meta.url)),port:4178});
const rpc=(who,name,args=[])=>app.db.transaction(async tx=>{await tx.exec('set local role authenticated');await tx.query("select set_config('request.jwt.claim.sub',$1,true)",[(previewActors[who]||who)]);return(await tx.query('select public.'+name+'('+args.map((_,i)=>'$'+(i+1)).join(',')+') value',args)).rows[0].value;});
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
 await rpc('company','cia_save_reward',[club,'Experiencia de cuidado · prueba local','Un objetivo para tu próxima visita.',200,8,randomUUID()]);
 await rpc('company','cia_studio_save_promotion',[club,{title:'Tu siguiente visita tiene algo especial',description:'Promoción sintética: consulta las condiciones en el negocio.',promotion_kind:'discount',value:15,starts_at:new Date(Date.now()-86400000).toISOString(),ends_at:new Date(Date.now()+14*86400000).toISOString(),active:true},randomUUID()]);
 await rpc('company','cia_studio_save_challenge',[club,{title:'Tres motivos para volver',target_visits:3,bonus_points:25,starts_at:new Date(Date.now()-86400000).toISOString(),ends_at:new Date(Date.now()+30*86400000).toISOString()},randomUUID()]);
 const redemption=(await app.db.query('select id from cia_redemptions where club_id=$1 limit 1',[club])).rows[0].id;
 await rpc('company','cia_growth_cancel_redemption',[redemption,'Devolución de prueba local',randomUUID()]);
 const other='00000000-0000-4000-8000-000000000008';await app.db.query('insert into auth.users(id,raw_user_meta_data) values($1,$2) on conflict do nothing',[other,{name:'Cafetería de prueba',account_type:'company'}]);
 const cafe=await rpc(other,'cia_studio_save_business',[null,{name:'Café Cielo · prueba local',category:'Cafetería',city:'Ciudad de prueba',description:'Segundo negocio sintético para comprobar saldos separados.',points_per_visit:15},{business_kind:'food',business_scale:'small',theme:'ocean',timezone:'America/Tijuana',booking_enabled:false,logo_data:'',phone:'',address:'',hours:''}]);
 const cafeCode=(await app.db.query('select join_code from cia_clubs where id=$1',[cafe])).rows[0].join_code;await rpc('user','cia_join_club',[cafeCode]);
 await rpc(other,'cia_studio_adjust_points',[cafe,previewActors.user,45,'Saldo sintético del café',randomUUID()]);
 await rpc(other,'cia_save_reward',[cafe,'Tu bebida favorita · prueba local','Bebida de ejemplo.',100,10,randomUUID()]);
 const visit=await rpc('user','cia_visit_action',[club,'arrive',null]);await rpc('user','cia_visit_action',[club,'depart',visit]);await rpc('company','cia_visit_action',[club,'confirm',visit]);
}
console.log('PRUEBA LOCAL 3.5 · fixtures sintéticos y base separada\nhttp://127.0.0.1:4178/workspace.html?as=user');
for(const signal of ['SIGINT','SIGTERM'])process.once(signal,async()=>{await app.close();process.exit(0);});

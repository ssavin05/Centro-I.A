import test from 'node:test';
import assert from 'node:assert/strict';
import {studioDatabase,studioActors,defaultSettings} from './helpers/studio.mjs';
const key=n=>String(n).padStart(8,'0')+'-1111-4111-8111-111111111111';
test('3.2: creación personalizada, edición de negocio y aislamiento de configuración',async t=>{
 const {rpc,club,business}=await studioDatabase(t);
 await rpc('company','cia_studio_save_business',[club,{...business,name:'Nombre actualizado',points_per_visit:15},{...defaultSettings,business_kind:'organization',business_scale:'organization',theme:'ocean'}]);
 const core=await rpc('company','cia_loyalty_snapshot');assert.equal(core.clubs[0].name,'Nombre actualizado');assert.equal(core.clubs[0].points_per_visit,15);
 const studio=await rpc('user','cia_studio_snapshot');assert.equal(studio.settings[0].business_kind,'organization');
 assert.equal((await rpc('other','cia_studio_snapshot')).settings.length,0);
 await assert.rejects(rpc('user','cia_studio_save_business',[club,business,defaultSettings]),e=>e.code==='42501');
 await assert.rejects(rpc('company','cia_studio_save_business',[club,business,{...defaultSettings,logo_data:'<svg onload=evil()>'}]),e=>e.message==='invalid_logo');
});
test('3.2: catálogo editable, importación idempotente y rollback de lote inválido',async t=>{
 const {db,rpc,club}=await studioDatabase(t);
 const item={title:'Corte personalizado',description:'Incluye lavado',price:150,category:'Cortes',item_kind:'service',duration_minutes:30,currency:'MXN',active:true};
 await rpc('company','cia_studio_save_catalog',[club,[item],key(1)]);await rpc('company','cia_studio_save_catalog',[club,[item],key(1)]);
 let rows=(await rpc('user','cia_studio_snapshot')).catalog;assert.equal(rows.length,1);
 await rpc('company','cia_studio_save_catalog',[club,[{...item,id:rows[0].id,price:175}],key(2)]);
 rows=(await rpc('user','cia_studio_snapshot')).catalog;assert.equal(Number(rows[0].price),175);
 await assert.rejects(rpc('company','cia_studio_save_catalog',[club,[{...item,title:'Válido'},{...item,title:'X',price:-10}],key(3)]));
 assert.equal((await db.query('select count(*)::int as n from cia_catalog_items')).rows[0].n,1);
 await assert.rejects(rpc('other','cia_studio_save_catalog',[club,[item],key(4)]),e=>e.code==='42501');
});
test('3.2: solicitudes de citas, confirmación sin superposición y cancelación autorizada',async t=>{
 const {rpc,club}=await studioDatabase(t);
 const starts=new Date(Date.now()+86400000).toISOString(),ends=new Date(Date.now()+90000000).toISOString();
 const payload={title:'Cita de prueba',starts_at:starts,ends_at:ends,resource:'Silla 1',note:''};
 const first=await rpc('user','cia_studio_save_appointment',[club,payload,key(1)]);
 const second=await rpc('user','cia_studio_save_appointment',[club,payload,key(2)]);
 await rpc('company','cia_studio_update_appointment',[first,'confirmed']);
 await assert.rejects(rpc('company','cia_studio_update_appointment',[second,'confirmed']),e=>e.message==='appointment_conflict');
 await assert.rejects(rpc('second','cia_studio_update_appointment',[first,'cancelled']),e=>e.code==='42501');
 await rpc('user','cia_studio_update_appointment',[first,'cancelled']);await rpc('company','cia_studio_update_appointment',[second,'confirmed']);
 assert.equal((await rpc('user','cia_studio_snapshot')).appointments.filter(a=>a.state==='confirmed').length,1);
 const block=await rpc('company','cia_studio_save_appointment',[club,{...payload,resource:'Silla 2'},key(3)]);assert.ok(block);
});
test('3.2: ajustes con motivo, historial y notificaciones privadas sin doble abono',async t=>{
 const {rpc,club}=await studioDatabase(t);const user=studioActors.user;
 await rpc('company','cia_studio_adjust_points',[club,user,25,'Corrección documentada',key(1)]);
 await rpc('company','cia_studio_adjust_points',[club,user,25,'Corrección documentada',key(1)]);
 assert.equal((await rpc('user','cia_loyalty_snapshot')).clubs[0].points,25);
 await assert.rejects(rpc('company','cia_studio_adjust_points',[club,user,-100,'Error de saldo',key(2)]),e=>e.message==='negative_balance');
 const snap=await rpc('user','cia_studio_snapshot');assert.equal(snap.movements.length,1);assert.equal(snap.notices.length,1);
 await assert.rejects(rpc('other','cia_studio_read_notice',[snap.notices[0].id]),e=>e.code==='42501');
 await rpc('user','cia_studio_read_notice',[snap.notices[0].id]);assert.ok((await rpc('user','cia_studio_snapshot')).notices[0].read_at);
});
test('3.2: retos verifican visitas confirmadas y acreditan el bono una sola vez',async t=>{
 const {rpc,club}=await studioDatabase(t);
 const challenge=await rpc('company','cia_studio_save_challenge',[club,{title:'Volver tiene premio',target_visits:1,bonus_points:5,starts_at:new Date(Date.now()-86400000).toISOString(),ends_at:new Date(Date.now()+86400000).toISOString()},key(1)]);
 await assert.rejects(rpc('user','cia_studio_claim_challenge',[challenge]),e=>e.message==='challenge_incomplete');
 const visit=await rpc('user','cia_visit_action',[club,'arrive',null]);await rpc('company','cia_visit_action',[club,'confirm',visit]);
 assert.equal(await rpc('user','cia_studio_claim_challenge',[challenge]),15);assert.equal(await rpc('user','cia_studio_claim_challenge',[challenge]),15);
 const snap=await rpc('user','cia_studio_snapshot');assert.equal(snap.claims.length,1);assert.equal(snap.movements.length,2);
});
test('3.2: promociones por fecha y premios con tipos, condiciones y vencimiento',async t=>{
 const {rpc,club}=await studioDatabase(t);const starts=new Date(Date.now()-86400000).toISOString(),ends=new Date(Date.now()+86400000).toISOString();
 const promotion=await rpc('company','cia_studio_save_promotion',[club,{title:'Martes especial',description:'Sujeto a condiciones',promotion_kind:'discount',value:20,starts_at:starts,ends_at:ends},key(1)]);
 assert.equal((await rpc('user','cia_studio_snapshot')).promotions.length,1);
 await rpc('company','cia_studio_save_promotion',[club,{id:promotion,title:'Promoción actualizada',description:'',promotion_kind:'special',value:0,starts_at:starts,ends_at:ends,active:false},key(2)]);
 assert.equal((await rpc('user','cia_studio_snapshot')).promotions.length,0);
 await rpc('company','cia_studio_adjust_points',[club,studioActors.user,100,'Bono de prueba',key(3)]);
 const reward=await rpc('company','cia_studio_save_reward',[club,{title:'Servicio de prueba',description:'',reward_kind:'service',terms:'Con cita previa',points_cost:10,stock:2,valid_until:starts},key(4)]);
 await assert.rejects(rpc('user','cia_redeem_reward',[reward,key(5)]),e=>e.message==='reward_unavailable');
 assert.equal((await rpc('user','cia_loyalty_snapshot')).clubs[0].points,100);
});

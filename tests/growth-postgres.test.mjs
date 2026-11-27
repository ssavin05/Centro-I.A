import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {operationsDatabase,actors,key} from './helpers/operations.mjs';
async function setup(t){const h=await operationsDatabase(t);await h.db.exec(await readFile(new URL('../supabase/migrations/20261127030040_growth_34.sql',import.meta.url),'utf8'));return h;}
test('3.4: devolución pendiente, saldo/stock/historial exactos e idempotencia',async t=>{
 const h=await setup(t);await h.rpc('company','cia_studio_adjust_points',[h.club,actors.user,100,'Saldo prueba',key(101)]);
 const reward=await h.rpc('company','cia_save_reward',[h.club,'Premio prueba','',30,1,key(102)]);
 const id=await h.rpc('user','cia_redeem_reward',[reward,key(103)]);
 await assert.rejects(h.rpc('user','cia_growth_cancel_redemption',[id,'Sin entrega',key(104)]));
 await assert.rejects(h.rpc('other','cia_growth_cancel_redemption',[id,'Sin entrega',key(104)]));
 await h.rpc('company','cia_growth_cancel_redemption',[id,'Premio no disponible',key(104)]);
 await h.rpc('company','cia_growth_cancel_redemption',[id,'Premio no disponible',key(104)]);
 const s=await h.rpc('user','cia_loyalty_snapshot');assert.equal(s.clubs[0].points,100);assert.equal(s.rewards[0].stock,1);assert.equal(s.redemptions[0].state,'cancelled');
 assert.equal((await h.rpc('user','cia_history_page',['movements',null,null,50,'Devolución'])).items.length,1);
 await assert.rejects(h.rpc('company','cia_deliver_redemption',[id]),/redemption_cancelled/);
 const next=await h.rpc('user','cia_redeem_reward',[reward,key(105)]);await h.rpc('company','cia_deliver_redemption',[next]);
 await assert.rejects(h.rpc('company','cia_growth_cancel_redemption',[next,'Ya entregado',key(106)]),/redemption_already_delivered/);
});
test('3.4: baja reversible conserva saldo e historia y bloquea actividad nueva',async t=>{
 const h=await setup(t);await h.rpc('company','cia_studio_adjust_points',[h.club,actors.user,40,'Saldo prueba',key(110)]);
 const visit=await h.rpc('user','cia_visit_action',[h.club,'arrive',null]);
 await assert.rejects(h.rpc('user','cia_growth_set_membership',[h.club,false]),/membership_has_pending/);
 await h.rpc('user','cia_visit_action',[h.club,'depart',visit]);await h.rpc('company','cia_visit_action',[h.club,'confirm',visit]);
 await h.rpc('user','cia_growth_set_membership',[h.club,false]);assert.equal((await h.rpc('user','cia_loyalty_snapshot')).clubs.length,0);
 const memberships=await h.rpc('user','cia_growth_memberships');assert.equal(memberships[0].active,false);assert.equal(memberships[0].points,50);
 const reward=await h.rpc('company','cia_save_reward',[h.club,'Premio prueba','',10,null,key(111)]);
 await assert.rejects(h.rpc('user','cia_redeem_reward',[reward,key(112)]),/membership_inactive/);
 assert.equal((await h.db.query('select points from cia_club_members where club_id=$1 and user_id=$2',[h.club,actors.user])).rows[0].points,50);
 await h.rpc('user','cia_join_club',[h.code]);assert.equal((await h.rpc('user','cia_loyalty_snapshot')).clubs[0].points,50);
});
test('3.4: cursor estable sobre fechas iguales, búsqueda y aislamiento por negocio',async t=>{
 const h=await setup(t);
 for(let n=0;n<7;n++)await h.rpc('company','cia_studio_adjust_points',[h.club,actors.user,1,'Movimiento '+n,key(120+n)]);
 await h.db.exec("update cia_point_movements set created_at='2026-01-01T00:00:00Z'");
 let cursor=null,ids=[];do{const p=await h.rpc('user','cia_history_page',['movements',h.club,cursor,2,'Movimiento']);ids.push(...p.items.map(i=>i.id));cursor=p.next;}while(cursor);
 assert.equal(ids.length,7);assert.equal(new Set(ids).size,7);
 assert.equal((await h.rpc('other','cia_history_page',['movements',h.club,null,50,''])).items.length,0);
 assert.equal((await h.rpc('user','cia_history_page',['members',h.club,null,50,''])).items.length,0);
 await assert.rejects(h.rpc('user','cia_history_page',['invalid',null,null,50,'']));
 await assert.rejects(h.rpc('user','cia_history_page',['visits',null,{},50,'']),/invalid_cursor/);
});
test('3.4: preferencias privadas, indicadores completos y permisos RPC',async t=>{
 const h=await setup(t);assert.equal((await h.rpc('user','cia_growth_preferences',[null])).internal_marketing,false);
 await h.rpc('user','cia_growth_preferences',[true]);assert.equal((await h.rpc('second','cia_growth_preferences',[null])).internal_marketing,false);
 const v=await h.rpc('user','cia_visit_action',[h.club,'arrive',null]);await h.rpc('company','cia_visit_action',[h.club,'confirm',v]);
 const stats=await h.rpc('company','cia_growth_insights',[h.club,30]);assert.equal(stats.members,1);assert.equal(stats.visits,1);assert.equal(stats.unique_visitors,1);assert.equal(stats.returning_visitors,0);
 await assert.rejects(h.rpc('other','cia_growth_insights',[h.club,30]));
 const access=await h.db.query("select has_function_privilege('anon','public.cia_history_page(text,uuid,jsonb,integer,text)','execute') as anon,has_table_privilege('authenticated','public.cia_notification_preferences','select') as direct");assert.equal(access.rows[0].anon,false);assert.equal(access.rows[0].direct,false);
});

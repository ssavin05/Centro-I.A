import test from 'node:test';
import assert from 'node:assert/strict';
import {rewardProgress,chooseReward,levelProgress,filterCustomerRewards,customerActivity} from '../customer-rules.js';
const now='2026-11-25T20:00:00Z';
const clubs=[{id:'a',points:80},{id:'b',points:150}];
const rewards=[{id:'r1',club_id:'a',points_cost:100,active:true,stock:4},{id:'r2',club_id:'b',points_cost:120,active:true,stock:null}];
test('el avance y los filtros respetan el saldo de cada negocio',()=>{
 assert.equal(rewardProgress(rewards[0],clubs[0],now).remaining,20);
 assert.equal(rewardProgress(rewards[0],clubs[0],now).percent,80);
 assert.equal(rewardProgress(rewards[1],clubs[1],now).percent,100);
 assert.deepEqual(filterCustomerRewards(rewards,clubs,{kind:'ready',serverTime:now}).map(r=>r.id),['r2']);
 assert.deepEqual(filterCustomerRewards(rewards,clubs,{kind:'progress',serverTime:now}).map(r=>r.id),['r1']);
 assert.deepEqual(filterCustomerRewards(rewards,clubs,{kind:'ready',clubId:'a',serverTime:now}),[]);
 assert.equal(rewardProgress(rewards[0],{points:null},now).known,false);
 assert.equal(rewardProgress(rewards[0],undefined,now).ready,false);
});
test('el premio destacado descarta vencidos, pausados, agotados y preferencias ajenas',()=>{
 const list=[...rewards,{...rewards[0],id:'expired',points_cost:5,valid_until:'2026-11-24Z'},{...rewards[0],id:'paused',points_cost:5,active:false},{...rewards[0],id:'empty',points_cost:5,stock:0},{...rewards[0],id:'cheap',points_cost:40}];
 assert.equal(chooseReward(list,clubs[0],now,'r2').id,'cheap');
 assert.equal(chooseReward(list,clubs[0],now,'r1').id,'r1');
 assert.equal(chooseReward(list,clubs[0],now,'expired').id,'cheap');
 assert.equal(chooseReward(list,{id:'other',points:200},now),null);
 assert.equal(rewardProgress({...rewards[0],valid_until:'2026-11-24T00:00:00Z'},clubs[0],now).available,false);
});
test('los niveles dependen únicamente de visitas confirmadas y de sus umbrales',()=>{
 assert.deepEqual(levelProgress(0),{label:'Explorador',next:'Habitual',count:0,target:3,remaining:3,percent:0});
 assert.equal(levelProgress(2).remaining,1);assert.equal(levelProgress(3).label,'Habitual');
 assert.equal(levelProgress(9).remaining,1);assert.equal(levelProgress(10).label,'Preferente');
 assert.equal(levelProgress(15).percent,100);assert.equal(levelProgress(15).next,null);
});
test('la actividad muestra el estado final y no duplica visitas o devoluciones del ledger',()=>{
 const snapshot={visits:[{id:'v',club_id:'a',arrived_at:'2026-11-23T10:00Z',confirmed_at:'2026-11-23T11:00Z',awarded_points:10},{id:'hidden',club_id:'b',arrived_at:now}],redemptions:[{id:'r',club_id:'a',state:'cancelled',created_at:'2026-11-24T10:00Z',cancelled_at:'2026-11-25T10:00Z',reward_title:'Premio'}]};
 const studio={movements:[{id:'m1',club_id:'a',source_key:'visit:v',created_at:now,amount:10},{id:'m2',club_id:'a',source_key:'refund:r',created_at:now,amount:100},{id:'m3',club_id:'a',source_key:'challenge:c',created_at:now,amount:20,reason:'Reto completado'},{id:'invalid',club_id:'a',created_at:'invalid',amount:1}]};
 const list=customerActivity(snapshot,studio,'a');assert.deepEqual(list.map(r=>r.id),['movement:m3','redemption:r','visit:v']);
 assert.equal(list[1].title,'Puntos devueltos');assert.equal(list[2].title,'Visita confirmada');
});

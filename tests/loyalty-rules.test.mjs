import test from 'node:test';
import assert from 'node:assert/strict';
import {arrivalState,rewardState} from '../loyalty-rules.js';
test('la siguiente llegada respeta 18 horas y mantiene salida disponible mientras la visita siga abierta',()=>{
 const closed={id:'v',club_id:'a',arrived_at:'2026-11-16T10:00:00Z',departed_at:'2026-11-16T11:00:00Z'};
 assert.equal(arrivalState([closed],'a','2026-11-16T12:00:00Z').canArrive,false);
 assert.equal(arrivalState([closed],'a','2026-11-17T04:00:00Z').canArrive,true);
 assert.equal(arrivalState([{...closed,departed_at:null}],'a','2026-11-18T10:00:00Z').openVisit.id,'v');
 assert.equal(arrivalState([closed],'b','2026-11-16T12:00:00Z').canArrive,true);
});
test('el saldo de otro negocio no habilita un canje y un premio agotado permanece bloqueado',()=>{
 const reward={points_cost:10,active:true,stock:1};
 assert.equal(rewardState(reward,null).canRedeem,false);
 assert.equal(rewardState(reward,{points:9}).remaining,1);
 assert.equal(rewardState(reward,{points:10}).canRedeem,true);
 assert.equal(rewardState({...reward,stock:0},{points:100}).canRedeem,false);
});

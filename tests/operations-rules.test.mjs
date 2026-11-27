import test from 'node:test';
import assert from 'node:assert/strict';
import {weeklyWindows,dateInZone,canManageLocation,canOperateAppointment} from '../operations-rules.js';
test('3.3: horario semanal valida descansos sin inventar días de trabajo',()=>{
 assert.deepEqual(weeklyWindows({}),[]);
 const data=weeklyWindows({day_1:true,open_1:'09:00',close_1:'18:00',break_1:'13:00',resume_1:'14:00'});
 assert.deepEqual(data,[{weekday:1,starts_at:'09:00',ends_at:'13:00'},{weekday:1,starts_at:'14:00',ends_at:'18:00'}]);
 assert.throws(()=>weeklyWindows({day_1:true,open_1:'09:00',close_1:'18:00',break_1:'08:00',resume_1:'10:00'}),/descanso/);
});
test('3.3: fecha en zona de sede y acciones según responsable',()=>{
 assert.equal(dateInZone('2026-11-19T02:00:00Z','America/Los_Angeles'),'2026-11-18');
 assert.equal(canManageLocation('reception'),false);assert.equal(canManageLocation('manager'),true);
 assert.equal(canOperateAppointment({}, {access_role:'professional'}, {staff_user_id:'a'},'a'),true);
 assert.equal(canOperateAppointment({}, {access_role:'professional'}, {staff_user_id:'b'},'a'),false);
});

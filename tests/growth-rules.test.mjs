import test from 'node:test';
import assert from 'node:assert/strict';
import {recordsCSV,appointmentICS} from '../growth-rules.js';
test('3.4: CSV escapa fórmulas, comillas y líneas sin alterar cantidades numéricas',()=>{
 const csv=recordsCSV([{name:'=HYPERLINK("x")',amount:-20,note:'dos\nlíneas'},{name:' @SUM(A1)',amount:10,note:'normal'}]);
 assert.match(csv,/"'=HYPERLINK\(""x""\)"/);assert.match(csv,/"' @SUM\(A1\)"/);assert.match(csv,/"-20"/);assert.match(csv,/"dos\nlíneas"/);
});
test('3.4: ICS conserva hora UTC, estado y texto seguro incluso con saltos inyectados',()=>{
 const ics=appointmentICS({id:'id-prueba',title:'Corte, cabello\rATTENDEE:otro',starts_at:'2026-12-02T09:00:00-08:00',ends_at:'2026-12-02T09:30:00-08:00',state:'requested'},new Date('2026-11-25T00:00:00Z'));
 assert.match(ics,/DTSTART:20261202T170000Z/);assert.match(ics,/STATUS:TENTATIVE/);assert.doesNotMatch(ics,/\r\nATTENDEE:/);assert.match(ics,/SUMMARY:Corte\\, cabello\\nATTENDEE:otro/);
 assert.throws(()=>appointmentICS({id:'x',starts_at:'bad',ends_at:'bad'}),/invalid_calendar_date/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import vm from 'node:vm';

const src=readFileSync(resolve('app.js'),'utf8');
function start(){
 const mem=new Map();
 const elements={app:{innerHTML:''},toast:{innerHTML:'',className:''}};
 const document={getElementById:id=>elements[id]||null,addEventListener:()=>{},querySelector:()=>null};
 class TestFormData{constructor(form){this.v=form.values||{};}get(k){return this.v[k]??null;}}
 const context={document,window:{scrollTo:()=>{}},localStorage:{getItem:k=>mem.get(k)||null,setItem:(k,v)=>mem.set(k,v)},setTimeout:()=>0,clearTimeout:()=>{},FormData:TestFormData,Blob:class {},URL:{createObjectURL:()=>'',revokeObjectURL:()=>{}},confirm:()=>true,console};
 context.globalThis=context;
 const runnable=src.replace(/render\(\);\s*\}\)\(\);\s*$/,`globalThis.previewTest={get data(){return db},get ui(){return ui},get html(){return document.getElementById('app').innerHTML},visit,redeem,submit,goto,action,render,points}; render();\n})();`);
 assert.notEqual(runnable,src,'Se debe encontrar el punto de inicio de la demo');
 vm.runInNewContext(runnable,context,{filename:'app.js',timeout:1000});
 return context.previewTest;
}
test('la demo publica la experiencia cliente, CSS y navegación con datos de ejemplo',()=>{
 const s=start();
 assert.match(s.html,/Hola, Alex/);
 assert.match(s.html,/Casa Luma Café/);
 assert.match(s.html,/Recompensas/);
 s.goto('wallet');
 assert.match(s.html,/Tus puntos, tus beneficios/);
 s.goto('discover');
 assert.match(s.html,/Encuentra tu próximo lugar favorito/);
});
test('los puntos son por empresa, la visita acredita y el canje crea cupón',()=>{
 const s=start(),u=s.data.users[0];
 assert.equal(u.points.luma,330);
 assert.equal(u.points.pausa,210);
 s.redeem('r5');
 assert.equal(u.points.pausa,210,'No puede usar puntos de otra tienda');
 s.visit('luma','alex',45);
 assert.equal(u.points.luma,375);
 s.redeem('r1');
 assert.equal(u.points.luma,75);
 assert.equal(s.data.vouchers.length,1);
 assert.equal(s.data.vouchers[0].status,'active');
 assert.equal(s.data.rewards.find(r=>r.id==='r1').stock,19);
 assert.ok(s.data.ledger.some(x=>x.shopId==='luma'&&x.delta===-300));
});
test('el modo empresa puede crear recompensas y registrar puntos de usuarios',()=>{
 const s=start();
 s.action('toggle-mode');
 assert.equal(s.ui.mode,'company');
 s.submit({id:'reward-form',values:{name:'Desayuno especial',description:'Desayuno de prueba',points:'450',stock:'4'}});
 assert.ok(s.data.rewards.some(r=>r.name==='Desayuno especial'&&r.shopId==='luma'));
 const before=s.data.users[1].points.luma;
 s.submit({id:'issue-form',values:{userId:'mara',points:'70',note:'Visita'}});
 assert.equal(s.data.users[1].points.luma,before+70);
 s.goto('analytics');
 assert.match(s.html,/Puntos otorgados/);
});
test('la reserva cambia de estado y evita exceso de cupo',()=>{
 const s=start();
 const event=s.data.events[0];
 s.action('event-book','e1');
 assert.deepEqual([...event.booked],['alex']);
 s.action('event-book','e1');
 assert.equal(event.booked.length,0);
 event.attendees=event.capacity;
 s.action('event-book','e1');
 assert.equal(event.booked.length,0);
});
test('los contenidos editados se escapan y no ejecutan HTML',()=>{
 const s=start();
 s.action('toggle-mode');
 s.submit({id:'business-form',values:{name:'<img src=x onerror=alert(1)>',category:'Tiendas',city:'Ensenada',area:'Centro',earn:'45',description:'Prueba'}});
 assert.match(s.html,/&lt;img src=x onerror=alert\(1\)&gt;/);
 assert.doesNotMatch(s.html,/<img src=x onerror=alert\(1\)>/);
});
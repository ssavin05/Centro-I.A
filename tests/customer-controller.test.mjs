import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import * as rules from '../customer-rules.js';
import {escapeHTML,arrivalState} from '../loyalty-rules.js';
import {challengeProgress} from '../studio-rules.js';
function harness(){
 const nodes=new Map(),events={},classes=new Set(),timers=[],motions=[];
 const node=id=>{if(!nodes.has(id))nodes.set(id,{id,hidden:false,textContent:'',innerHTML:'',dataset:{},insertAdjacentHTML(){},closest(){return node('label');},querySelectorAll(){return [];},querySelector(){return null;},addEventListener(){},remove(){nodes.delete(id);}});return nodes.get(id);};
 const classList={add:k=>classes.add(k),remove:(...keys)=>keys.forEach(k=>classes.delete(k)),toggle:(k,on)=>on?classes.add(k):classes.delete(k)};
 const document={activeElement:null,hidden:false,body:{classList},getElementById:node,querySelector:node,addEventListener:(name,fn)=>events[name]=fn};
 let mount;const source=readFileSync(new URL('../customer-ui.js',import.meta.url),'utf8').replace(/^import .*\r?\n/gm,'').replace('export function mountCustomer','function mountCustomer')+'\nexpose(mountCustomer);';
 runInNewContext(source,{...rules,createCustomerMotion:()=>({hero(){motions.push('hero');},rewards(){motions.push('rewards');},gain(){motions.push('gain');},view(name){motions.push(name);},stop(){motions.push('stop');}}),e:escapeHTML,arrivalState,challengeProgress,document,Intl,Number,Date,Map,String,Object,Array,setTimeout:fn=>(timers.push(fn),timers.length),clearTimeout(){},matchMedia:()=>({matches:true}),expose:fn=>mount=fn});
 return {ui:mount({navigate(){},onFilter(){}}),node,classes,timers,events,motions};
}
const snapshot=points=>({server_time:'2026-11-25T20:00:00Z',clubs:[{id:'a',name:'Mi negocio',points,visits_count:1,points_per_visit:10}],rewards:[{id:'r',club_id:'a',title:'Mi premio',points_cost:100,active:true,stock:2}],redemptions:[],visits:[]});
const identity=(id,type='user')=>({user:{id},profile:{account_type:type}});
test('la primera carga y otra identidad no celebran saldos previos; solo subidas confirmadas de la misma cuenta',()=>{
 const h=harness();h.ui.update({identity:identity('one'),snapshot:snapshot(80)});assert.doesNotMatch(h.node('customer-hero').innerHTML,/customer-gain/);assert.equal(h.motions.includes('gain'),false);
 h.ui.update({identity:identity('one'),snapshot:snapshot(90)});assert.match(h.node('customer-hero').innerHTML,/\+10 puntos en tu saldo/);assert.equal(h.motions.filter(v=>v==='gain').length,1);h.ui.update({identity:identity('one'),snapshot:snapshot(90)});assert.equal(h.motions.filter(v=>v==='gain').length,1);
 h.ui.update({identity:identity('two'),snapshot:snapshot(120)});assert.doesNotMatch(h.node('customer-hero').innerHTML,/customer-gain/);
 h.ui.clear();for(const callback of h.timers)callback();assert.equal(h.node('customer-hero').hidden,true);assert.equal(h.classes.has('is-customer'),false);
});
test('un snapshot Studio de otra identidad no muestra citas y el cambio a Empresa limpia el inicio personal',()=>{
 const h=harness();h.ui.update({identity:identity('one'),snapshot:snapshot(80)});
 const state={settings:[],challenges:[],claims:[],promotions:[],movements:[],appointments:[{club_id:'a',title:'Cita privada de otra cuenta',state:'confirmed',starts_at:'2026-12-01T10:00:00Z'}]};
 h.ui.updateStudio({userId:'other',state});assert.doesNotMatch(h.node('customer-hero').innerHTML,/Cita privada/);
 h.ui.updateStudio({userId:'one',state});assert.match(h.node('customer-hero').innerHTML,/Cita privada/);
 h.ui.update({identity:identity('company','company'),snapshot:snapshot(0)});assert.equal(h.node('customer-hero').textContent,'');assert.equal(h.node('customer-hero').hidden,true);assert.equal(h.node('customer-reward-filters').hidden,true);assert.equal(h.classes.has('is-customer'),false);
});

test('la meta seleccionada es real, del negocio y vigente; la elección no escribe ni acepta premios ajenos',()=>{
 const h=harness(),state=snapshot(80);state.rewards.push({id:'r2',club_id:'a',title:'Meta <especial>',points_cost:200,active:true,stock:3},{id:'foreign',club_id:'b',title:'Otro negocio',points_cost:1,active:true,stock:3},{id:'expired',club_id:'a',title:'Vencido',points_cost:1,active:true,stock:3,valid_until:'2020-01-01T00:00:00Z'},{id:'empty',club_id:'a',title:'Sin stock',points_cost:1,active:true,stock:0});
 h.ui.update({identity:identity('one'),snapshot:state});assert.match(h.node('customer-hero').innerHTML,/customer-goal-options/);assert.match(h.node('customer-hero').innerHTML,/Meta &lt;especial&gt;/);assert.doesNotMatch(h.node('customer-hero').innerHTML,/Otro negocio|Vencido|Sin stock/);
 const choose=id=>h.events.click({target:{closest:()=>({dataset:{customer:'choose-goal',id}})}});
 choose('r2');assert.match(h.node('customer-hero').innerHTML,/Meta &lt;especial&gt;/);assert.match(h.node('customer-hero').innerHTML,/200 puntos en este negocio/);assert.equal(h.motions.at(-1),'hero');
 const selected=h.node('customer-hero').innerHTML;for(const id of ['foreign','expired','empty','unknown']){choose(id);assert.equal(h.node('customer-hero').innerHTML,selected);}
 h.ui.clear();assert.equal(h.node('customer-more').hidden,true);
});
test('cada cambio de sección de Usuario anima una vez y el mismo destino no reinicia el efecto',()=>{
 const h=harness();h.ui.update({identity:identity('one'),snapshot:snapshot(80)});h.ui.onNavigate('calendar');assert.equal(h.motions.at(-1),'calendar');const count=h.motions.length;h.ui.onNavigate('calendar');assert.equal(h.motions.length,count);h.ui.onNavigate('rewards');assert.equal(h.motions.at(-1),'rewards');h.ui.clear();h.ui.onNavigate('home');assert.equal(h.motions.at(-1),'stop');
});

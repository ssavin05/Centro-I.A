import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import * as rules from '../loyalty-rules.js';
const settle=()=>new Promise(resolve=>setImmediate(resolve));
const deferred=()=>{let resolve;return {promise:new Promise(r=>resolve=r),resolve:value=>resolve(value)};};
const sample=(type='user',name='Lugar seguro')=>({account_type:type,clubs:[{id:'club',name,category:'Prueba',city:'Ciudad',points:10,visits_count:1,points_per_visit:10}],explore:[],rewards:[],visits:[],redemptions:[],members:[],counts:{members:1,confirmed_visits:1,active_visits:0,pending_redemptions:0}});
function harness(client){
 const nodes=new Map(),events={};const node=id=>{
  if(!nodes.has(id)){const attrs=new Map(),n={id,hidden:false,textContent:'',innerHTML:'',value:'',disabled:false,dataset:{},open:false,listeners:{},elements:{},setAttribute(k,v){attrs.set(k,v);},removeAttribute(k){attrs.delete(k);},getAttribute(k){return attrs.get(k);},focus(){},addEventListener(k,v){this.listeners[k]=v;},reset(){},reportValidity(){return true;},showModal(){this.open=true;},close(){this.open=false;},querySelector(selector){return node(id+selector);}};nodes.set(id,n);}
  return nodes.get(id);
 };
 const panels=rules.loyaltySections.map(id=>{const n=node('panel-'+id);n.dataset.panel=id;return n;});
 const navs=rules.loyaltySections.map(id=>{const n=node('nav-'+id);n.dataset.view=id;return n;});
 const forms=['join-form','club-form','reward-form'].map(node);
 for(const form of forms)for(const key of ['code','name','category','city','description','points','title','cost','stock'])form.elements[key]=node(form.id+'-'+key);
 const document={getElementById:node,querySelector:selector=>node(selector),querySelectorAll:selector=>selector==='[data-panel]'?panels:selector==='[data-view]'?navs:selector==='.app-form'?forms:[],addEventListener(k,v){events[k]=v;}};
 let exported;const code=readFileSync('loyalty-ui.js','utf8').replace(/^import .*\r?\n/gm,'').replace('export function mountLoyalty','function mountLoyalty')+'\nexpose(mountLoyalty);';
 runInNewContext(code,{...rules,e:rules.escapeHTML,document,Intl,Date,Map,Number,String,mountCustomer:()=>({update(){},updateStudio(){},clear(){},filterRewards:list=>list,rewardDetails:()=>'',hasFilter:()=>false}),mountGrowth:()=>({update(){},clear(){}}),mountOperations:()=>({update(){},clear(){}}),mountStudio:()=>({update(){},clear(){},titleFor(){return 'Mi centro';},animateNavigation(next,apply){apply();},acknowledge(){}}),crypto:{randomUUID:()=> '11111111-1111-4111-8111-111111111111'},expose:value=>exported=value});
 return {ui:exported({supabase:client}),node,events,forms};
}
test('panel de fidelidad descarta una respuesta privada después de limpiar identidad',async()=>{
 const request=deferred();const h=harness({rpc:()=>request.promise});
 h.ui.load({user:{id:'a'},profile:{account_type:'company'}});h.ui.clear();
 request.resolve({data:sample('company','Dato anterior privado'),error:null});await settle();
 assert.equal(h.node('loyalty-content').hidden,true);assert.equal(h.node('club-list').innerHTML,'');
});
test('cambiar identidad impide que una respuesta antigua reemplace la cuenta nueva',async()=>{
 const old=deferred(),fresh=deferred();let count=0;const h=harness({rpc:()=>++count===1?old.promise:fresh.promise});
 h.ui.load({user:{id:'a'},profile:{account_type:'company'}});h.ui.load({user:{id:'b'},profile:{account_type:'user'}});
 fresh.resolve({data:sample('user','Negocio nuevo'),error:null});await settle();
 old.resolve({data:sample('company','Privado anterior'),error:null});await settle();
 assert.match(h.node('club-list').innerHTML,/Negocio nuevo/);assert.doesNotMatch(h.node('club-list').innerHTML,/Privado anterior/);
});
test('datos del negocio se escapan antes de renderizar HTML',async()=>{
 const h=harness({rpc:async()=>({data:sample('user','<img src=x onerror=alert(1)>'),error:null})});
 h.ui.load({user:{id:'a'},profile:{account_type:'user'}});await settle();
 assert.match(h.node('club-list').innerHTML,/&lt;img/);assert.doesNotMatch(h.node('club-list').innerHTML,/<img/);
});
test('módulo sin activar informa el límite y no inventa saldos',async()=>{
 const h=harness({rpc:async()=>({data:null,error:{code:'PGRST202'}})});
 h.ui.load({user:{id:'a'},profile:{account_type:'user'}});await settle();
 assert.equal(h.node('loyalty-error').hidden,false);assert.match(h.node('app-metrics').innerHTML,/—/);
 assert.doesNotMatch(h.node('app-metrics').innerHTML,/<dd>0<\/dd>/);
 assert.match(h.node('club-list').innerHTML,/pendiente de activación/);
});
test('doble clic no duplica una solicitud de visita y un resultado tardío no revive datos',async()=>{
 const mutation=deferred();let calls=0;const h=harness({rpc:async name=>{if(name==='cia_loyalty_snapshot')return {data:sample(),error:null};calls++;return mutation.promise;}});
 h.ui.load({user:{id:'a'},profile:{account_type:'user'}});await settle();
 const button={dataset:{action:'arrive',club:'club',id:''},disabled:false,textContent:'Estoy aquí'};
 const event={target:{closest:selector=>selector==='[data-action]'?button:null}};
 const first=h.events.click(event);await h.events.click(event);assert.equal(calls,1);h.ui.clear();
 mutation.resolve({data:'visit',error:null});await first;assert.equal(h.node('loyalty-content').hidden,true);assert.equal(h.node('loyalty-notice').textContent,'');
});

test('un fallo se anuncia como alerta y el siguiente éxito restaura el tono de confirmación',async()=>{
 let fail=true;const h=harness({rpc:async name=>name==='cia_loyalty_snapshot'?{data:sample(),error:null}:fail?{data:null,error:{message:'visit_cooldown'}}:{data:'visit',error:null}});
 h.ui.load({user:{id:'a'},profile:{account_type:'user'}});await settle();
 const button={dataset:{action:'arrive',club:'club',id:''},disabled:false,textContent:'Estoy aquí'};
 const event={target:{closest:selector=>selector==='[data-action]'?button:null}};
 await h.events.click(event);assert.equal(h.node('loyalty-notice').dataset.tone,'error');assert.equal(h.node('loyalty-notice').getAttribute('role'),'alert');
 fail=false;await h.events.click(event);assert.equal(h.node('loyalty-notice').dataset.tone,'success');assert.equal(h.node('loyalty-notice').getAttribute('role'),'status');
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import * as rules from '../studio-rules.js';
import {escapeHTML} from '../loyalty-rules.js';
const studio=()=>({settings:[],catalog:[],promotions:[],appointments:[],notices:[],movements:[],challenges:[],claims:[],server_time:new Date().toISOString()});
const settle=()=>new Promise(r=>setImmediate(r));
function harness(rpc){
 const nodes=new Map(),events={};
 const node=id=>{if(!nodes.has(id)){const n={dataset:{},hidden:false,innerHTML:'',textContent:'',classList:{add(){},remove(){}},style:{setProperty(){},removeProperty(){}},insertAdjacentHTML(){},setAttribute(){},querySelector(){return node(id+' child');},querySelectorAll(){return [];},hidePopover(){},focus(){},replaceChildren(){this.innerHTML='';}};nodes.set(id,n);}return nodes.get(id);};
 const document={body:node('body'),getElementById:node,querySelector:node,querySelectorAll:()=>[],addEventListener(k,v){(events[k]??=[]).push(v);}};
 let mount;const code=readFileSync('studio-ui.js','utf8').replace(/^import .*\r?\n/gm,'').replace('export function mountStudio','function mountStudio')+'\nexpose(mountStudio);';
 runInNewContext(code,{...rules,e:escapeHTML,document,Intl,Date,Number,String,Map,Set,Array,Math,clearTimeout,setTimeout,matchMedia:()=>({matches:true}),crypto:{randomUUID:()=> '11111111-1111-4111-8111-111111111111'},expose:value=>mount=value});
 const ui=mount({supabase:{rpc},refreshCore:async()=>{},navigate(){}});
 ui.update({identity:{user:{id:'u'},profile:{account_type:'user'}},snapshot:{clubs:[{id:'c',name:'Negocio',points:10,visits_count:1}],members:[],visits:[],rewards:[]}});
 return {ui,node,submit:async f=>{let prevented=false;await events.submit[0]({target:f,preventDefault(){prevented=true;}});return prevented;}};
}
function form(id,values){const attrs=new Map();return {id:{value:'control-id'},dataset:{},elements:{namedItem:key=>({value:values[key]??''})},getAttribute:key=>key==='id'?id:attrs.get(key),setAttribute(k,v){attrs.set(k,v);},reportValidity:()=>true,querySelector:()=>null,parentElement:{replaceChildren(){}}};}
test('3.2: un control llamado id no rompe el envío y no navega con datos en la URL',async()=>{
 const calls=[];const h=harness(async(name,args)=>{calls.push({name,args});return name==='cia_studio_snapshot'?{data:studio(),error:null}:{data:'saved',error:null};});await settle();
 const prevented=await h.submit(form('studio-promotion-form',{id:'p',title:'Oferta',promotion_kind:'discount',value:'10',active:'true',starts_at:'2026-12-01T10:00',ends_at:'2026-12-02T10:00'}));
 assert.equal(prevented,true);assert.equal(calls.filter(c=>c.name==='cia_studio_save_promotion').length,1);assert.equal(calls.find(c=>c.name==='cia_studio_save_promotion').args.p_payload.id,'p');
});
test('3.2: saldo cero es éxito y un error conserva el formulario',async()=>{
 let fail=false,cleared=0;const h=harness(async name=>name==='cia_studio_snapshot'?{data:studio(),error:null}:fail?{data:null,error:{message:'negative_balance'}}:{data:0,error:null});await settle();
 const f=form('studio-points-form',{user_id:'u',amount:'-10',reason:'Corrección documentada'});f.parentElement.replaceChildren=()=>cleared++;
 await h.submit(f);assert.equal(cleared,1);fail=true;await h.submit(f);assert.equal(cleared,1);
});
test('3.2: cerrar identidad invalida un guardado pendiente y bloquea envío nativo',async()=>{
 let resolve;const pending=new Promise(r=>resolve=r);const h=harness(async name=>name==='cia_studio_snapshot'?{data:studio(),error:null}:pending);await settle();
 let cleared=0;const f=form('studio-points-form',{user_id:'u',amount:'10',reason:'Bono'});f.parentElement.replaceChildren=()=>cleared++;
 const saving=h.submit(f);h.ui.clear();resolve({data:10,error:null});await saving;assert.equal(cleared,0);assert.equal(h.node('loyalty-notice').textContent,'');
 assert.equal(await h.submit(f),true);
});

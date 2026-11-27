import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import * as rules from '../growth-rules.js';
import {escapeHTML} from '../loyalty-rules.js';
const tick=()=>new Promise(r=>setImmediate(r));
function harness(client){const nodes=new Map(),events={};const node=id=>{if(!nodes.has(id))nodes.set(id,{id,dataset:{},innerHTML:'',textContent:'',setAttribute(){},insertAdjacentHTML(){},focus(){},querySelector(){return node(id+'-child');}});return nodes.get(id);};const document={getElementById:node,querySelector:node,querySelectorAll:()=>[],addEventListener:(type,fn)=>events[type]=fn};let ui;runInNewContext(readFileSync('growth-ui.js','utf8').replace(/^import .*\r?\n/gm,'').replace('export function mountGrowth','function mountGrowth')+'\nexpose(mountGrowth);',{...rules,e:escapeHTML,document,Intl,Date,Number,String,Map,Set,Array,Promise,setInterval:()=>1,clearInterval(){},expose:x=>ui=x});return {ui:ui({supabase:client,refreshCore:async()=>{}}),node,events};}
const context={identity:{user:{id:'user'},profile:{account_type:'user'}},snapshot:{clubs:[]}};
test('3.4: limpiar identidad descarta preferencias y datos privados pendientes',async()=>{let resolve;const pending=new Promise(r=>resolve=r),h=harness({rpc:()=>pending});const request=h.ui.update(context);h.ui.clear();resolve({data:[],error:null});await request;assert.equal(h.node('growth-body').innerHTML,'');assert.equal(h.node('growth-tabs').innerHTML,'');});
test('3.4: cambiar pestaña invalida un historial atrasado',async()=>{let resolve;const pending=new Promise(r=>resolve=r);const h=harness({rpc:async name=>name==='cia_history_page'?pending:{data:name==='cia_growth_memberships'?[]:{internal_marketing:false},error:null}});await h.ui.update(context);await h.events.click({target:{closest:()=>({dataset:{growth:'tab',id:'preferences'}})}});resolve({data:{items:[{id:'private',title:'privado'}],next:null},error:null});await tick();assert.match(h.node('growth-body').innerHTML,/Elige tus avisos/);assert.doesNotMatch(h.node('growth-body').innerHTML,/privado/);h.ui.clear();});

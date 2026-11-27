import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
function harness(fetch){let timed;runInNewContext(readFileSync('auth-request.js','utf8').replaceAll('export ', '')+';expose(timedFetch);',{AbortController,URL,Response,fetch,setTimeout,clearTimeout,Promise,Error,Object,expose:fn=>timed=fn});return timed;}

test('el límite de Auth cubre un cuerpo bloqueado después de recibir cabeceras',async()=>{
 let started=false;const timed=harness(async(_,{signal})=>({body:{},status:200,arrayBuffer:()=>new Promise((_,reject)=>{started=true;signal.addEventListener('abort',()=>reject(signal.reason),{once:true});})}));await assert.rejects(timed('https://example.test/auth/v1/signup',{},15),{name:'AbortError'});assert.equal(started,true);
});
test('una respuesta Auth completa conserva contenido, estado y cabeceras',async()=>{
 const timed=harness(async()=>new Response(JSON.stringify({error_code:'email_not_confirmed'}),{status:400,headers:{'content-type':'application/json','x-test':'preservado'}}));const result=await timed('https://example.test/auth/v1/token?grant_type=password');assert.equal(result.status,400);assert.equal(result.headers.get('x-test'),'preservado');assert.deepEqual(await result.json(),{error_code:'email_not_confirmed'});
});
test('una cancelación del llamador alcanza el cuerpo y los recursos no Auth conservan su respuesta',async()=>{
 const aborter=new AbortController();const timed=harness(async(_,{signal})=>({body:{},arrayBuffer:()=>new Promise((_,reject)=>signal.addEventListener('abort',()=>reject(signal.reason),{once:true}))}));const reading=timed('https://example.test/auth/v1/user',{signal:aborter.signal});await new Promise(resolve=>setImmediate(resolve));aborter.abort();await assert.rejects(reading,{name:'AbortError'});
 const original=new Response('contenido');const other=harness(async()=>original);assert.equal(await other('https://example.test/rest/v1/rpc/cia_loyalty_snapshot'),original);
});

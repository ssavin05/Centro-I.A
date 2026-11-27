import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
test('3.4: worker no intercepta API, escrituras ni recursos privados',async()=>{
 const events={},cacheCalls=[];runInNewContext(readFileSync('sw.js','utf8'),{self:{location:{href:'https://example.test/Centro-I.A/sw.js'},addEventListener:(t,f)=>events[t]=f},URL,Set,caches:{open:async()=>({match:async url=>{cacheCalls.push(String(url));return 'offline';}})},fetch:async()=>{throw Error('offline');}});
 for(const request of [{url:'https://project.supabase.co/rest/v1/rpc/cia_redeem_reward',method:'POST',mode:'cors'},{url:'https://example.test/Centro-I.A/__local/profile',method:'GET',mode:'cors'},{url:'https://example.test/Centro-I.A/supabase-client.js',method:'GET',mode:'cors'}])events.fetch({request,respondWith(){assert.fail('No debe interceptar datos privados');}});
 let result;events.fetch({request:{url:'https://example.test/Centro-I.A/workspace.html',method:'GET',mode:'navigate'},respondWith:p=>result=p});assert.equal(await result,'offline');assert.deepEqual(cacheCalls,['https://example.test/Centro-I.A/offline.html']);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {profileExport} from '../profile-export.js';
test('exportación solo contiene datos explícitos del perfil',()=>{
  const data=profileExport({id:'a',email:'a@example.test',access_token:'secret',user_metadata:{private:'secret'}},
    {name:'Ana',account_type:'user',created_at:'2026-11-12T00:00:00Z',secret:'hidden'},'2026-11-16T00:00:00Z');
  assert.deepEqual(Object.keys(data.profile),['id','name','account_type','email','created_at']);
  assert.equal(data.profile.email,'a@example.test');
  assert.doesNotMatch(JSON.stringify(data),/secret|hidden|access_token|user_metadata/);
  assert.equal(data.exported_at,'2026-11-16T00:00:00Z');
  assert.throws(()=>profileExport(null,null));
});

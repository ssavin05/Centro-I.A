import test from 'node:test';
import assert from 'node:assert/strict';
import {pageHarness,settle} from './helpers/browser.mjs';

function profileAdapter({type='user',failSave=false,failLoad=false}={}) {
  let row={name:'Ana Rivera',account_type:type,created_at:'2026-11-12T12:00:00Z'};
  const updates=[],filters=[];
  return {
    updates,filters,
    auth:{getUser:async()=>({data:{user:{id:'user-a',email:'ana@example.test'}},error:null}),signOut:async()=>({error:null})},
    from(table) {
      assert.equal(table,'cia_profiles');let pending;
      return {
        select(){return this;},
        eq(column,value){filters.push([column,value]);return this;},
        update(value){pending=value;updates.push(value);return this;},
        async single(){
          if(failLoad || (pending && failSave))return {data:null,error:{code:'unavailable'}};
          if(pending)row={...row,...pending};
          return {data:{...row},error:null};
        },
      };
    },
  };
}

test('perfil privado usa el identificador verificado y guarda solo el nombre', async () => {
  const client=profileAdapter({type:'company'});
  const page=pageHarness('workspace.js',{client});await settle();
  assert.equal(page.element('account-pill').textContent,'Cuenta Empresa');
  page.set({'profile-name':'Ana Nueva'});await page.submit('profile-form');
  assert.equal(JSON.stringify(client.updates),JSON.stringify([{name:'Ana Nueva'}]));
  assert.ok(client.filters.every(([column,value])=>column==='id' && value==='user-a'));
  assert.equal(page.element('profile-status').textContent,'Nombre guardado.');
  const reload=pageHarness('workspace.js',{client});await settle();
  assert.equal(reload.element('profile-name').value,'Ana Nueva');
  assert.equal(reload.element('account-pill').textContent,'Cuenta Empresa');
});

test('fallo de guardado conserva el nombre editado y permite reintentar', async () => {
  const page=pageHarness('workspace.js',{client:profileAdapter({failSave:true})});await settle();
  page.set({'profile-name':'Mi nombre editado'});await page.submit('profile-form');
  assert.equal(page.element('profile-name').value,'Mi nombre editado');
  assert.equal(page.element('profile-error').hidden,false);
  assert.equal(page.element('save-profile').disabled,false);
  assert.equal(page.element('profile-status').textContent,'');
});

test('sesión inexistente redirige y no consulta perfiles', async () => {
  const page=pageHarness('workspace.js',{client:{auth:{getUser:async()=>({data:{user:null},error:null})},from(){assert.fail('No debe consultar perfiles');}}});
  await settle();assert.deepEqual(page.navigations,['auth.html?mode=login']);
  assert.equal(page.element('profile-section').hidden,true);
});

test('error de perfil oculta datos y ofrece reintento', async () => {
  const page=pageHarness('workspace.js',{client:profileAdapter({failLoad:true})});await settle();
  assert.equal(page.element('profile-section').hidden,true);
  assert.equal(page.element('retry-profile').hidden,false);
  assert.match(page.element('workspace-message').textContent,/recuperar tu perfil/);
});

test('cierre de sesión borra la vista privada', async () => {
  const page=pageHarness('workspace.js',{client:profileAdapter()});await settle();
  await page.click('logout');
  assert.equal(page.element('profile-name').value,'');
  assert.equal(page.element('profile-section').hidden,true);
  assert.deepEqual(page.navigations,['auth.html?mode=login']);
});

test('cierre en otra pestaña no permite renderizar una carga atrasada', async () => {
  let resolveProfile;
  const client=profileAdapter();
  client.from=()=>({select(){return this;},eq(){return this;},single:()=>new Promise(resolve=>{resolveProfile=resolve;})});
  const page=pageHarness('workspace.js',{client});await settle();
  page.authEvent('SIGNED_OUT');resolveProfile({data:{name:'Privado',account_type:'user'},error:null});await settle();
  assert.equal(page.element('profile-section').hidden,true);
  assert.equal(page.element('profile-name').value,'');
});

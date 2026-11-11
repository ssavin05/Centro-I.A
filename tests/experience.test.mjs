import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync('auth.html','utf8');
const js=readFileSync('auth.js','utf8');
test('el registro permite elegir Usuario o Empresa',()=>{
  assert.match(html,/name="accountType" value="user"/);
  assert.match(html,/name="accountType" value="company"/);
  assert.match(html,/¿Qué tipo de cuenta quieres crear\?/);
  assert.match(js,/preselect=query\.get\('type'\)/);
});
test('el formulario incluye requisitos de contraseña y recuperación',()=>{
  assert.match(html,/autocomplete="new-password"/);
  assert.match(html,/password-confirm/);
  assert.match(js,/api\/bootstrap/);
  assert.match(js,/auth\/'\+endpoint/);
  assert.match(js,/contraseñas no coinciden/i);
  assert.match(js,/setError\(e\.message/);
});
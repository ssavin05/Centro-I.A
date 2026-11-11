import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync('workspace.html','utf8');
const js=readFileSync('workspace.js','utf8');
test('los espacios internos inician sin contenido ficticio',()=>{
  assert.match(html,/workspace-blank/);
  assert.match(html,/Tu espacio está listo/);
  assert.doesNotMatch(html,/850 pts|Hola, Alex|panel negocio|simular visita/i);
});
test('el workspace exige sesión y cierra sesión con CSRF',()=>{
  assert.match(js,/api\/bootstrap/);
  assert.match(js,/session\.user/);
  assert.match(js,/accountType==='company'/);
  assert.match(js,/api\/auth\/logout/);
  assert.match(js,/X-CSRF-Token/);
});
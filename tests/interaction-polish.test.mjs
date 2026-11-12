import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync('workspace.html','utf8');
const js=readFileSync('workspace.js','utf8');
test('los espacios interiores empiezan sin datos ficticios',()=>{
 assert.match(html,/workspace-blank/);
 assert.match(html,/Tu espacio está listo/);
 assert.doesNotMatch(html,/850 pts|Hola, Alex|panel negocio|simular visita/i);
});
test('el espacio verifica usuario y lee solo perfil mediante RLS',()=>{
 assert.match(html,/type="module" src="workspace.js"/);
 assert.match(js,/supabase\.auth\.getUser/);
 assert.match(js,/from\('cia_profiles'\)/);
 assert.match(js,/account_type==='company'/);
 assert.match(js,/supabase\.auth\.signOut/);
 assert.doesNotMatch(js,/user_metadata/);
});

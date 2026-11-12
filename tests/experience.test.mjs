import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync('auth.html','utf8');
const js=readFileSync('auth.js','utf8');
const client=readFileSync('supabase-client.js','utf8');
test('registro oficial usa Supabase Auth y elige Usuario o Empresa',()=>{
 assert.match(html,/name="accountType" value="user"/);
 assert.match(html,/name="accountType" value="company"/);
 assert.match(html,/type="module" src="auth.js"/);
 assert.match(js,/supabase\.auth\.signUp/);
 assert.match(js,/supabase\.auth\.signInWithPassword/);
 assert.match(js,/account_type:accountType/);
 assert.match(js,/confirmar tu cuenta/);
 assert.match(js,/contraseñas no coinciden/i);
});
test('cliente usa clave publica de Supabase y sesiones persistentes',()=>{
 assert.match(client,/sb_publishable_/);
 assert.match(client,/persistSession:true/);
 assert.doesNotMatch(client,/sb_secret_|service_role/);
});

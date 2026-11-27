import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {pagesFiles} from '../scripts/pages-files.mjs';
const builder=readFileSync('scripts/build-pages.mjs','utf8');
const server=readFileSync('server/index.mjs','utf8');
test('GitHub Pages publica solo la nueva web oficial',()=>{
  for(const file of ['index.html','auth.html','workspace.html','site.css','start.js','auth.js','workspace.js','supabase-client.js','mobile-welcome.css','account-rules.js'])assert.ok(pagesFiles.includes(file),'Falta '+file);
  assert.ok(!pagesFiles.includes('dashboard.html'));
  assert.ok(!pagesFiles.includes('app.js'));
  assert.match(builder,/pagesFiles/);
});
test('el servidor no expone la demo ni código interno',()=>{
  assert.match(server,/officialAssets=new Set/);
  assert.match(server,/guard\(officialAssets\.has\(fileName\)/);
  assert.doesNotMatch(server,/const preview=path\.startsWith/);
});

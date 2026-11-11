import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const builder=readFileSync('scripts/build-pages.mjs','utf8');
const server=readFileSync('server/index.mjs','utf8');
test('GitHub Pages publica solo la nueva web oficial',()=>{
  for(const file of ['index.html','auth.html','workspace.html','site.css','start.js','auth.js','workspace.js'])assert.ok(builder.includes(file),'Falta '+file);
  assert.doesNotMatch(builder,/dashboard\.html/);
  assert.doesNotMatch(builder,/app\.js/);
});
test('el servidor no expone la demo ni código interno',()=>{
  assert.match(server,/officialAssets=new Set/);
  assert.match(server,/guard\(officialAssets\.has\(fileName\)/);
  assert.doesNotMatch(server,/const preview=path\.startsWith/);
});
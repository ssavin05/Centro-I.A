import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {readdirSync,readFileSync} from 'node:fs';
import {join,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {pagesFiles} from '../scripts/pages-files.mjs';

test('el artefacto publicado contiene solo el sitio oficial y todos sus recursos',()=>{
  const root=fileURLToPath(new URL('../',import.meta.url));
  const built=spawnSync(process.execPath,['scripts/build-pages.mjs'],{cwd:root,encoding:'utf8'});
  assert.equal(built.status,0,built.stderr);
  const dist=join(root,'dist'),files=[];
  function scan(folder){for(const item of readdirSync(folder,{withFileTypes:true})){const full=join(folder,item.name);if(item.isDirectory())scan(full);else files.push(relative(dist,full).replaceAll('\\','/'));}}
  scan(dist);
  assert.deepEqual(files.sort(),[...pagesFiles,'.nojekyll'].sort());
  assert.ok(!files.some(file=>/^(server|demo|sql|supabase|docs)\//.test(file)));
  assert.match(readFileSync(join(dist,'index.html'),'utf8'),/<main class="mobile-welcome"/);
  assert.match(readFileSync(join(dist,'mobile-welcome.css'),'utf8'),/max-width: 1024px/);
});

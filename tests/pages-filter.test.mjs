import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {filterConfig} from '../scripts/pages-filter.mjs';
test('el filtro excluye nuevos archivos privados y extras dentro de directorios públicos',async t=>{
 const folder=await mkdtemp(join(tmpdir(),'cia-pages-'));t.after(()=>rm(folder,{recursive:true,force:true}));
 await mkdir(join(folder,'assets'));await mkdir(join(folder,'scripts'));await mkdir(join(folder,'supabase'));
 for(const file of ['index.html','supabase-client.js','AGENTS.md','otro-secreto.txt','_config.yml','assets/icon.svg','assets/prueba.txt','scripts/local.mjs','supabase/migration.sql'])await writeFile(join(folder,file),'fixture');
 const config=await filterConfig(folder,['index.html','assets/icon.svg','supabase-client.js']);const excluded=JSON.parse(config.split('exclude: ')[1]);
 for(const file of ['AGENTS.md','otro-secreto.txt','_config.yml','assets/prueba.txt','scripts/','supabase/','.nojekyll','render.yaml'])assert.ok(excluded.includes(file),file);
 for(const file of ['index.html','assets/icon.svg','assets'])assert.ok(!excluded.includes(file),file);
 for(const file of ['index.html','assets/icon.svg','supabase-client.js'])assert.ok(!excluded.some(pattern=>file.startsWith(pattern)),file);
});

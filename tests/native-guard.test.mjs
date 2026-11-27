import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
const run=env=>spawnSync(process.execPath,['scripts/verify-postgres.mjs'],{encoding:'utf8',env:{...process.env,...env},timeout:5000});
test('el verificador nativo rechaza destinos remotos antes de crear procesos SQL',()=>{
 const result=run({CIA_NATIVE_TEST:'1',PGHOST:'db.example.supabase.co',PGPORT:'55432'});
 assert.equal(result.status,1);assert.match(result.stderr,/No admite proyectos remotos/);assert.doesNotMatch(result.stderr,/ENOENT|connect|password/i);
});
test('el verificador nativo requiere marca explícita y puerto reservado para pruebas',()=>{
 for(const env of [{CIA_NATIVE_TEST:'',PGHOST:'127.0.0.1',PGPORT:'55432'},{CIA_NATIVE_TEST:'1',PGHOST:'127.0.0.1',PGPORT:'5432'}]){
  const result=run(env);assert.equal(result.status,1);assert.match(result.stderr,/Solo para PostgreSQL de pruebas/);
 }
});

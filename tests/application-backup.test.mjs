import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,mkdtemp,writeFile,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {operationsDatabase,actors,key} from './helpers/operations.mjs';
test('un respaldo sintético restaura filas y ledger sin volver a generar puntos',async t=>{
 const close=[];const h=await operationsDatabase({after:fn=>close.push(fn)});
 const folder=await mkdtemp(join(tmpdir(),'cia-restore-'));t.after(()=>rm(folder,{recursive:true,force:true}));
 let snapshot;
 try{
  await h.db.exec(await readFile(new URL('../supabase/migrations/20261127030040_growth_34.sql',import.meta.url),'utf8'));
  await h.rpc('company','cia_studio_adjust_points',[h.club,actors.user,100,'Fixture de restauración',key(8001)]);
  const reward=await h.rpc('company','cia_save_reward',[h.club,'Premio sintético','',30,2,key(8002)]);await h.rpc('user','cia_redeem_reward',[reward,key(8003)]);
  const names=(await h.db.query("select tablename from pg_tables where schemaname='public' and tablename like 'cia_%' order by tablename")).rows.map(row=>row.tablename);
  const edges=(await h.db.query("select child.relname as child,parent.relname as parent from pg_constraint f join pg_class child on child.oid=f.conrelid join pg_namespace cn on cn.oid=child.relnamespace join pg_class parent on parent.oid=f.confrelid join pg_namespace pn on pn.oid=parent.relnamespace where f.contype='f' and cn.nspname='public' and child.relname like 'cia_%' and pn.nspname='public' and parent.relname like 'cia_%'")).rows;
  snapshot={format:'cia-application-backup/v1',project:'huqspupbhhqilxeizklr',foreign_keys:edges,tables:{}};
  for(const name of names)snapshot.tables[name]=(await h.db.query('select coalesce(jsonb_agg(to_jsonb(t)),\'[]\') as records from public."'+name+'" t')).rows[0].records;
 }finally{for(const fn of close)await fn();}
 const file=join(folder,'synthetic.json');await writeFile(file,JSON.stringify(snapshot));
 const result=await promisify(execFile)(process.execPath,['scripts/verify-backup.mjs',file],{timeout:30000});
 const report=JSON.parse(result.stdout);assert.equal(report.passed,true);assert.equal(report.tables,22);assert.ok(report.records>8);assert.equal(report.target,'PGlite17 en memoria; sin red');
});

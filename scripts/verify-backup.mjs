// Restore application rows only into a fresh in-memory database. Never connects to Supabase.
import {readFile,readdir} from 'node:fs/promises';
import {PGlite} from 'pglite17';
import assert from 'node:assert/strict';
const filename=process.argv[2];if(!filename)throw Error('Indica un respaldo JSON privado de la aplicación.');
const backup=JSON.parse(await readFile(filename,'utf8'));
assert.equal(backup.format,'cia-application-backup/v1');assert.equal(backup.project,'huqspupbhhqilxeizklr');
const names=Object.keys(backup.tables),valid=name=>/^cia_[a-z_]+$/.test(name);
assert.ok(names.length>0&&names.every(name=>valid(name)&&Array.isArray(backup.tables[name])));
const edges=backup.foreign_keys;assert.ok(Array.isArray(edges)&&edges.every(edge=>names.includes(edge.child)&&names.includes(edge.parent)));
const canonical=value=>value&&typeof value==='object'?Array.isArray(value)?value.map(canonical):Object.fromEntries(Object.keys(value).sort().map(key=>[key,canonical(value[key])])):value;
const orderedRows=rows=>rows.map(row=>JSON.stringify(canonical(row))).sort();
const ordered=[],pending=new Set(names);
while(pending.size){const ready=[...pending].filter(name=>edges.filter(edge=>edge.child===name&&edge.parent!==name).every(edge=>!pending.has(edge.parent)));if(!ready.length)throw Error('Dependencia circular: requiere una estrategia de restauración adicional.');for(const name of ready){ordered.push(name);pending.delete(name);}}
const db=await PGlite.create();
try{
 await db.exec("create role anon nologin;create role authenticated nologin;create schema auth;create table auth.users(id uuid primary key,raw_user_meta_data jsonb not null default '{}');create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;grant usage on schema auth to anon,authenticated;grant execute on function auth.uid() to anon,authenticated;");
 // Auth account IDs are prerequisites only; credentials, sessions and Auth recovery are not backed up here.
 for(const row of backup.tables.cia_profiles||[])await db.query('insert into auth.users(id) values($1)',[row.id]);
 for(const name of (await readdir(new URL('../supabase/migrations/',import.meta.url))).filter(name=>name.endsWith('.sql')).sort())await db.exec(await readFile(new URL('../supabase/migrations/'+name,import.meta.url),'utf8'));
 const actual=(await db.query("select tablename from pg_tables where schemaname='public' and tablename like 'cia_%'")).rows.map(row=>row.tablename).sort();assert.deepEqual(actual,[...names].sort());
 await db.transaction(async tx=>{
  // In this fresh in-memory target only, suppress application side effects while restoring the ledger.
  // Foreign-key constraint triggers remain enabled, so invalid references still fail.
  for(const name of ordered)await tx.exec('alter table public."'+name+'" disable trigger user');
  for(const name of ordered)if(backup.tables[name].length)await tx.query('insert into public."'+name+'" select * from jsonb_populate_recordset(null::public."'+name+'",$1::jsonb)',[JSON.stringify(backup.tables[name])]);
  for(const name of ordered)await tx.exec('alter table public."'+name+'" enable trigger user');
 });
 let records=0;for(const name of names){const rows=(await db.query('select coalesce(jsonb_agg(to_jsonb(t)),\'[]\'::jsonb) as records from public."'+name+'" t')).rows[0].records;assert.deepEqual(orderedRows(rows),orderedRows(backup.tables[name]),'Diferencia de datos en '+name);records+=rows.length;}
 console.log(JSON.stringify({passed:true,tables:names.length,records,scope:'Solo datos de aplicación; no credenciales ni sesiones Auth',target:'PGlite17 en memoria; sin red'},null,2));
}finally{await db.close();}

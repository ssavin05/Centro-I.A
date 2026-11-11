import {DatabaseSync} from 'node:sqlite';
import {readFileSync, mkdirSync, readdirSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

export function openDatabase(path = process.env.DB_PATH || './data/centro-ia.sqlite') {
  const dbPath = path === ':memory:' ? path : resolve(path);
  if (dbPath !== ':memory:') mkdirSync(dirname(dbPath), {recursive:true});
  const db = new DatabaseSync(dbPath);
  db.exec('PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;');
  if(dbPath !== ':memory:') db.exec('PRAGMA journal_mode=WAL;');
  db.exec('CREATE TABLE IF NOT EXISTS schema_migrations (version TEXT PRIMARY KEY, applied_at TEXT NOT NULL DEFAULT (datetime(\'now\')));');
  const folder=fileURLToPath(new URL('../sql/',import.meta.url));
  for(const name of readdirSync(folder).filter(f=>/^\d+_[\w-]+\.sql$/.test(f)).sort()){
    const version=name.split('_')[0];
    if(db.prepare('SELECT version FROM schema_migrations WHERE version=?').get(version))continue;
    db.exec('BEGIN IMMEDIATE');
    try {
      db.exec(readFileSync(resolve(folder,name),'utf8'));
      db.prepare('INSERT INTO schema_migrations(version) VALUES(?)').run(version);
      db.exec('COMMIT');
    } catch(e){try{db.exec('ROLLBACK');}catch{}db.close();throw e;}
  }
  db.prepare('DELETE FROM sessions WHERE expires_at < ?').run(new Date().toISOString());
  return db;
}
export function transaction(db, fn) {
  db.exec('BEGIN IMMEDIATE');
  try { const result=fn(); db.exec('COMMIT'); return result; }
  catch(e){try{db.exec('ROLLBACK');}catch{}throw e;}
}
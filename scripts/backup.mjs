/* Exporta una instantánea coherente de SQLite usando VACUUM INTO. No sobrescribe respaldos. */
import {mkdirSync,existsSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {openDatabase} from '../server/db.mjs';
const destination=resolve(process.argv[2]||`./backups/centro-ia-${new Date().toISOString().replace(/[:.]/g,'-')}.sqlite`);
if(existsSync(destination))throw Error('El respaldo ya existe. Se requiere un nombre distinto.');
mkdirSync(dirname(destination),{recursive:true});
const db=openDatabase();
try{
  db.exec(`VACUUM INTO '${destination.replaceAll("'","''")}'`);
  console.log('Respaldo realizado: '+destination);
}finally{db.close();}
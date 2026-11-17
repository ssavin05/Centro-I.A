import {readFileSync,existsSync} from 'node:fs';
import {join,dirname,resolve,posix} from 'node:path';
import {fileURLToPath} from 'node:url';
import {pagesFiles} from './pages-files.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const errors=[];
for(const file of pagesFiles) {
  if(!existsSync(join(root,file))) {errors.push('Falta archivo: '+file);continue;}
  if(!/\.(html|css|js|webmanifest)$/.test(file)) continue;
  const source=readFileSync(join(root,file),'utf8');
  if(/sb_secret_|service_role\s*[:=]/i.test(source)) errors.push(file+': posible clave privilegiada');
  const refs=file.endsWith('.html') ? [...source.matchAll(/(?:src|href)="([^"#]+)"/g)].map(m=>m[1])
    : file.endsWith('.css') ? [...source.matchAll(/url\(['"]?([^)'"]+)['"]?\)/g)].map(m=>m[1])
    : file.endsWith('.js') ? [...source.matchAll(/(?:from\s+|import\()['"]([^'"]+)['"]/g)].map(m=>m[1]) : [];
  for(const ref of refs) {
    if(/^(https?:|data:|mailto:)/i.test(ref)) continue;
    if(ref.startsWith('/')) {errors.push(file+': ruta absoluta '+ref);continue;}
    const target=posix.normalize(posix.join(posix.dirname(file),ref.split(/[?#]/)[0]));
    if(target==='.'||target.endsWith('/'))continue;
    if(!pagesFiles.includes(target))errors.push(file+': recurso fuera del paquete '+ref);
  }
}
const home=readFileSync(join(root,'index.html'),'utf8');
if(!home.includes('auth.html?mode=login')||!home.includes('auth.html?mode=register'))errors.push('Faltan enlaces oficiales.');
if(/dashboard\.html|ver demo|explorar demo/i.test(home))errors.push('La portada aún enlaza a demo.');
const auth=readFileSync(join(root,'auth.html'),'utf8');
if(!auth.includes('name="accountType" value="user"')||!auth.includes('name="accountType" value="company"'))errors.push('Falta selector Usuario/Empresa.');
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}
else console.log('Web oficial: enlaces, imports y recursos empaquetados correctos.');

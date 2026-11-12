import {readFileSync,existsSync} from 'node:fs';
import {join,resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const errors=[];
const files=['index.html','auth.html','workspace.html','site.css','start.js','auth.js','workspace.js','supabase-client.js','manifest.webmanifest','assets/icons/nexo-club.svg'];
for(const f of files)if(!existsSync(join(root,f)))errors.push('Falta archivo: '+f);
for(const page of ['index.html','auth.html','workspace.html']){
 const html=readFileSync(join(root,page),'utf8');
 for(const m of html.matchAll(/(?:src|href)="([^"#]+)"/g)){
   const u=m[1];if(/^(?:https?:|data:|mailto:)/i.test(u))continue;
   if(u.startsWith('/'))errors.push(page+': ruta absoluta '+u);
   else if(!existsSync(join(root,u.split(/[?#]/)[0])))errors.push(page+': falta recurso '+u);
 }
}
const home=readFileSync(join(root,'index.html'),'utf8');
if(!home.includes('auth.html?mode=login')||!home.includes('auth.html?mode=register'))errors.push('Faltan enlaces oficiales.');
if(/dashboard\.html|ver demo|explorar demo/i.test(home))errors.push('La portada aún enlaza a demo.');
const auth=readFileSync(join(root,'auth.html'),'utf8');
if(!auth.includes('name="accountType" value="user"')||!auth.includes('name="accountType" value="company"'))errors.push('Falta selector Usuario/Empresa.');
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}else console.log('Web oficial: recursos y enlaces correctos.');
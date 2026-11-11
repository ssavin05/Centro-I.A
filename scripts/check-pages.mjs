// Verifica que tanto la portada como la app en GitHub Pages cargan recursos relativos.
import {readFileSync,existsSync} from 'node:fs';
import {join,resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
let errors=[];
const files=['index.html','dashboard.html','home.css','home.js','styles.css','waves.css','app.js','manifest.webmanifest','.nojekyll','assets/escena-comercio.svg','assets/icons/nexo-club.svg'];
for(const f of files)if(!existsSync(join(root,f)))errors.push('Falta archivo '+f);
for(const page of ['index.html','dashboard.html']){
 const html=readFileSync(join(root,page),'utf8');
 for(const m of html.matchAll(/(?:src|href)="([^"#]+)"/g)){
   const u=m[1];if(/^(?:https?:|data:|mailto:)/i.test(u))continue;
   if(u.startsWith('/'))errors.push(page+': ruta absoluta '+u);
   else if(!existsSync(join(root,u.split(/[?#]/)[0])))errors.push(page+': recurso faltante '+u);
 }
}
const landing=readFileSync(join(root,'index.html'),'utf8');
if(!landing.includes('href="home.css"')||!landing.includes('src="home.js"')||!landing.includes('href="dashboard.html"'))errors.push('Portada no enlaza diseño o aplicación');
const dashboard=readFileSync(join(root,'dashboard.html'),'utf8');
if(!dashboard.includes('src="app.js"')||!dashboard.includes('href="styles.css"')||!dashboard.includes('href="waves.css"'))errors.push('La app no conserva CSS, JS y ondas originales');
const css=readFileSync(join(root,'home.css'),'utf8');
if(!css.includes('assets/escena-comercio.svg'))errors.push('La portada no tiene ilustración original');
const js=readFileSync(join(root,'app.js'),'utf8');
if(js.length<30000||!js.includes('render()'))errors.push('Demo interactiva incompleta');
const waves=readFileSync(join(root,'waves.css'),'utf8');
if(!waves.includes('nexoMover1'))errors.push('Ondas animadas incompletas');
const manifest=JSON.parse(readFileSync(join(root,'manifest.webmanifest'),'utf8'));
if(manifest.start_url!=='./'||manifest.scope!=='./')errors.push('PWA no compatible con rutas Pages');
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}
else console.log('Verificación Pages: OK (portada + app + assets + rutas relativas).');
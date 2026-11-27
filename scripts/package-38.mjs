import {readdir,readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,dirname,relative,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {zipSync,unzipSync,strToU8} from 'fflate';
import {pagesFiles} from './pages-files.mjs';
const root=resolve(fileURLToPath(new URL('../',import.meta.url)));
const output=resolve(process.argv[2]||join(root,'../Cia.IA.3.8.zip'));
if(!output.endsWith('.zip')||!relative(root,output).startsWith('..'))throw Error('La entrega ZIP debe quedar fuera del código fuente.');
const files={},hash=data=>createHash('sha256').update(data).digest('hex');
const excluded=new Set(['node_modules','.temp','.git','dist','build','.idea','.vscode','.codex','.secrets','__pycache__']);
function privateFile(rel){
 const file=rel.split('/').at(-1).toLowerCase();
 return file==='render.yaml'||file==='.env'||file.startsWith('.env.')&&file!=='.env.example'||/\.(db\d*|sqlite\d*|pem|key|pfx|p12|log|zip|tmp|temp)$/.test(file)||/\.(db\d*|sqlite\d*)-(wal|shm|journal)$/.test(file)||/^(data|backups)\//.test(rel)&&file!=='.gitkeep';
}
async function walk(folder,rel=''){
 for(const item of await readdir(folder,{withFileTypes:true})){
  const name=rel?rel+'/'+item.name:item.name;
  if(item.isDirectory()){if(!excluded.has(item.name)&&name!=='.impeccable/review')await walk(join(folder,item.name),name);}
  else if(item.isSymbolicLink())throw Error('No se empaquetan enlaces simbólicos: '+name);
  else if(item.isFile()&&!privateFile(name))files['fuente/'+name]=new Uint8Array(await readFile(join(folder,item.name)));
 }
}
await walk(root);
for(const name of [...pagesFiles,'.nojekyll']){
 const data=new Uint8Array(await readFile(join(root,'dist',name)));
 if(name!=='.nojekyll'&&hash(data)!==hash(await readFile(join(root,name))))throw Error('La construcción está desactualizada: '+name);
 files['sitio-publicable/'+name]=data;
}
for(const name of ['desktop-home.jpg','mobile-goal.jpg','mobile-goals.jpg','mobile-rewards.jpg','tablet-calendar.jpg'])
 files['capturas/'+name]=new Uint8Array(await readFile(join(root,'.impeccable/review/v38',name)));
files['RESULTADOS-3.8.txt']=new Uint8Array(await readFile(join(root,'docs/RESULTADOS-3.8.txt')));
files['RESULTADOS-POSTGRES-3.5.1.txt']=new Uint8Array(await readFile(join(root,'docs/RESULTADOS-POSTGRES-3.5.1.txt')));
const publicReport=JSON.parse(await readFile(join(root,'docs/PUBLICACION-3.8.json'),'utf8'));if(!publicReport.passed||publicReport.matching_files!==pagesFiles.length)throw Error('Falta control público aprobado para esta entrega.');
files['PUBLICACION-3.8.json']=strToU8(JSON.stringify(publicReport,null,2)+'\n');
files['VERIFICACION.md']=new Uint8Array(await readFile(join(root,'docs/VERIFICACION-3.8.md')));
const start='@echo off\r\nchcp 65001 >nul\r\nsetlocal\r\ncd /d "%~dp0fuente"\r\nwhere node >nul 2>nul\r\nif errorlevel 1 (\r\n echo Instala Node.js 22.13 o posterior antes de abrir Centro I.A.\r\n pause\r\n exit /b 1\r\n)\r\nnode -e "import(\'pglite17\').catch(()=\u003eprocess.exit(1))" >nul 2>nul\r\nif errorlevel 1 (\r\n echo Ejecuta primero INSTALAR-DEPENDENCIAS.bat en la carpeta principal.\r\n pause\r\n exit /b 1\r\n)\r\nnode scripts/review-38.mjs\r\npause\r\n';
const install='@echo off\r\nchcp 65001 >nul\r\nsetlocal\r\ncd /d "%~dp0fuente"\r\nwhere node >nul 2>nul\r\nif errorlevel 1 (\r\n echo Instala Node.js 22.13 o posterior.\r\n pause\r\n exit /b 1\r\n)\r\ncall npx --yes pnpm@11.25.0 install --frozen-lockfile --ignore-scripts\r\nif errorlevel 1 (\r\n echo No se completó la instalación. Revisa la conexión y el mensaje anterior.\r\n) else (\r\n echo Dependencias listas. Ejecuta INICIAR-Cia.IA.3.8.bat.\r\n)\r\npause\r\n';
files['INICIAR-Cia.IA.3.8.bat']=strToU8(start);files['INSTALAR-DEPENDENCIAS.bat']=strToU8(install);
const leeme="<!doctype html><html lang=\"es\"><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>Centro I.A. 3.8</title><style>body{margin:0;background:#eaf3fc;color:#092344;font:17px/1.65 system-ui,sans-serif}header{background:#071b34;color:#fff;padding:40px 24px}main,header>div{max-width:1000px;margin:auto}main{padding:24px 24px 60px}h1{font-size:2.7rem;line-height:1.15}h2{margin-top:40px;font-size:1.4rem}a{color:#134c83;text-underline-offset:4px}header a{display:inline-block;background:#f2c76e;color:#071b34;padding:12px 20px;border-radius:8px;margin:10px 10px 0 0}li{margin:12px 0}img{max-width:100%;height:auto}:focus-visible{outline:3px solid #347da0;outline-offset:4px}</style><header><div><h1>Centro I.A. 3.8</h1><p>Más color y movimiento para Usuario: azul tinta, océano, cielo y premios dorados.</p><a href=\"fuente/docs/GUIA-CENTRO-IA-3.8.html\">Guía de los cambios</a><a href=\"https://ssavin05.github.io/Centro-I.A/\">Abrir aplicación</a></div></header><main><h2>Probar los ejemplos locales</h2><ol><li>Extrae todo el ZIP. Necesitas Node.js 22.13 o posterior.</li><li>Ejecuta INSTALAR-DEPENDENCIAS.bat; necesita Internet si faltan dependencias.</li><li>Ejecuta INICIAR-Cia.IA.3.8.bat y conserva su ventana abierta.</li><li>Abre <a href=\"http://127.0.0.1:4180/workspace.html?as=user\">Usuario en prueba local</a>.</li></ol><p>La franja PRUEBA LOCAL identifica datos sintéticos de dos negocios, separados de Supabase y de las cuentas reales.</p><h2>Qué cambia</h2><p>Elige una meta real desde Inicio. El premio y su avance responden al cambiar; un incremento confirmado de puntos tiene feedback propio. Navegación y filtros con entradas breves, premios dorados, citas en cielo y promociones con más contraste. Las animaciones se cancelan con movimiento reducido o pestaña oculta.</p><img src=\"capturas/desktop-home.jpg\" alt=\"Inicio de Usuario con premio y siguiente visita de ejemplo\"><h2>Comprobado</h2><p>115/115 pruebas locales, construcción correcta y revisión visual independiente aprobada. Cinco capturas: escritorio, tablet y tres estados de móvil. Publicación autorizada por el titular; PUBLICACION-3.8.json registra el control de los recursos publicados.</p><p><a href=\"VERIFICACION.md\">Verificación y límites</a> · <a href=\"fuente/docs/REVISION-VISUAL-3.8.md\">Revisión visual</a></p><h2>Contenido</h2><p>fuente: código, pruebas, guías y migraciones. sitio-publicable: frontend construido. capturas: evidencia visual. RESULTADOS-3.8.txt: registro completo. SHA256SUMS.txt: huellas verificadas de archivos. Sin bases, secretos ni dependencias instaladas.</p><h2>Lo que necesita tu participación</h2><p>Contenido real, condiciones de premios, validación de correo y piloto con dispositivos físicos. El respaldo real requiere autorización específica. Los límites técnicos están descritos en la guía y no se presentan como completados.</p></main></html>";
files['LEEME.html']=strToU8(leeme);
const names=Object.keys(files).sort();
for(const name of names){
 if(/(^|\/)(node_modules|\.git)(\/|$)|(^|\/)\.env$|render\.yaml$/i.test(name))throw Error('Archivo no permitido en entrega.');
 if(/\.(mjs|js|json|html|md|yml|yaml|toml|txt)$/.test(name)&&!name.includes('/vendor/')){
  const text=new TextDecoder().decode(files[name]);
  if(/sb_secret_[a-zA-Z0-9_]{15}|github_pat_[a-zA-Z0-9_]{20}|ghp_[a-zA-Z0-9]{30}/.test(text))throw Error('Revisar posible secreto en '+name);
 }
}
files['SHA256SUMS.txt']=strToU8(names.map(name=>hash(files[name])+'  '+name).join('\n')+'\n');
const archive={};for(const name of Object.keys(files).sort())archive['Cia.IA.3.8/'+name]=[files[name],{mtime:new Date('2026-11-27T20:00:00Z')}];
const zip=zipSync(archive,{level:6}),checked=unzipSync(zip);
for(const [name,data] of Object.entries(files)){const actual=checked['Cia.IA.3.8/'+name];if(!actual||hash(actual)!==hash(data))throw Error('Verificación ZIP fallida: '+name);}
await mkdir(dirname(output),{recursive:true});await writeFile(output,zip);
await writeFile(output+'.sha256',hash(zip)+'  '+output.split(/[\\/]/).at(-1)+'\n');
await writeFile(join(dirname(output),'Cia.IA.3.8-Guia.html'),await readFile(join(root,'docs/GUIA-CENTRO-IA-3.8.html')));
await writeFile(join(dirname(output),'Cia.IA.3.8-Verificacion.md'),await readFile(join(root,'docs/VERIFICACION-3.8.md')));
await writeFile(join(dirname(output),'Cia.IA.3.8-vista.jpg'),files['capturas/desktop-home.jpg']);
console.log(JSON.stringify({output,files:Object.keys(files).length,source:names.filter(n=>n.startsWith('fuente/')).length,public:names.filter(n=>n.startsWith('sitio-publicable/')).length,bytes:zip.length,sha256:hash(zip)},null,2));

import {readdir,readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,dirname,relative,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {zipSync,unzipSync,strToU8} from 'fflate';
import {pagesFiles} from './pages-files.mjs';
const root=resolve(fileURLToPath(new URL('../',import.meta.url)));
const output=resolve(process.argv[2]||join(root,'../Cia.IA.3.4.zip'));
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
for(const name of ['desktop-history.jpg','tablet-insights.jpg','mobile-memberships.jpg'])
 files['capturas/'+name]=new Uint8Array(await readFile(join(root,'.impeccable/review/v34',name)));
files['RESULTADOS-3.4.txt']=new Uint8Array(await readFile(join(root,'docs/RESULTADOS-3.4.txt')));
files['VERIFICACION.md']=new Uint8Array(await readFile(join(root,'docs/VERIFICACION-3.4.md')));
const start='@echo off\r\nchcp 65001 >nul\r\nsetlocal\r\ncd /d "%~dp0fuente"\r\nwhere node >nul 2>nul\r\nif errorlevel 1 (\r\n echo Instala Node.js 22.13 o posterior antes de abrir Centro I.A.\r\n pause\r\n exit /b 1\r\n)\r\nnode -e "import(\'pglite17\').catch(()=\u003eprocess.exit(1))" >nul 2>nul\r\nif errorlevel 1 (\r\n echo Ejecuta primero INSTALAR-DEPENDENCIAS.bat en la carpeta principal.\r\n pause\r\n exit /b 1\r\n)\r\nnode scripts/start-34.mjs\r\npause\r\n';
const install='@echo off\r\nchcp 65001 >nul\r\nsetlocal\r\ncd /d "%~dp0fuente"\r\nwhere node >nul 2>nul\r\nif errorlevel 1 (\r\n echo Instala Node.js 22.13 o posterior.\r\n pause\r\n exit /b 1\r\n)\r\ncall npx --yes pnpm@11.25.0 install --frozen-lockfile --ignore-scripts\r\nif errorlevel 1 (\r\n echo No se completó la instalación. Revisa la conexión y el mensaje anterior.\r\n) else (\r\n echo Dependencias listas. Ejecuta INICIAR-Cia.IA.3.4.bat.\r\n)\r\npause\r\n';
files['INICIAR-Cia.IA.3.4.bat']=strToU8(start);files['INSTALAR-DEPENDENCIAS.bat']=strToU8(install);
const leeme="<!doctype html><html lang=\"es\"><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>Centro I.A. 3.4</title><style>body{margin:0;background:#eef4f9;color:#173c50;font:17px/1.65 system-ui,sans-serif}header{background:#102a43;color:white;padding:40px 24px}main,header>div{max-width:1000px;margin:auto}main{padding:24px 24px 60px}h1{font-size:2.8rem;line-height:1.15}h2{margin-top:40px;font-size:1.4rem}a{color:#164c70;text-underline-offset:4px}header a{display:inline-block;background:#edc77d;color:#102a43;padding:12px 20px;border-radius:8px;margin:10px 10px 0 0}li{margin:12px 0}img{max-width:100%;height:auto}:focus-visible{outline:3px solid #347da0;outline-offset:4px}</style><header><div><h1>Centro I.A. 3.4</h1><p>Fidelidad, sedes y equipo; actividad, recuperación y uso diario.</p><a href=\"fuente/docs/GUIA-CENTRO-IA-3.4.html\">Guía y cuadro de funciones</a><a href=\"VERIFICACION.md\">Verificación</a></div></header><main><p><strong>Estado comprobado:</strong> núcleo, Studio y Operations están activados en Supabase. Growth 3.4 está implementado y probado localmente; su migración remota y la publicación se registran por separado. No se declara lanzamiento comercial.</p><h2>Abrir la aplicación</h2><ol><li>Extrae todo el ZIP. Necesitas Node.js 22.13 o posterior.</li><li>Ejecuta INSTALAR-DEPENDENCIAS.bat si faltan dependencias. La primera vez necesita Internet.</li><li>Ejecuta INICIAR-Cia.IA.3.4.bat y conserva abierta la ventana.</li><li>Abre <a href=\"http://127.0.0.1:4177/workspace.html?as=company\">Empresa</a> o <a href=\"http://127.0.0.1:4177/workspace.html?as=user\">Usuario</a>.</li></ol><p>PRUEBA LOCAL identifica datos aislados; el selector no inicia sesión en cuentas reales. scripts/review-34.mjs prepara ejemplos sintéticos en una base separada.</p><h2>Qué incorpora</h2><p>Historial con búsqueda y páginas, CSV autorizado, devolución de premios pendientes con motivo, participación reversible, preferencias internas, indicadores de retorno, archivo ICS y lectura periódica. Instalación web preparada con pantalla sin conexión; sin caché de cuentas ni cola de escrituras. Se conservan catálogo, logo, temas, premios, visitas, puntos, retos, promociones, sedes y equipo.</p><img src=\"capturas/desktop-history.jpg\" alt=\"Historial de canjes de la prueba local\"><h2>Comprobaciones</h2><p>98/98 pruebas aprobadas y construcción correcta. Revisión visual independiente limitada a tres vistas. Hay pendientes de producción, integración real, escala y seguridad adicional.</p><h2>Archivos y pendientes</h2><p>fuente: código, pruebas, migraciones y guías. sitio-publicable: frontend construido. capturas: evidencia. RESULTADOS-3.4.txt: pruebas. SHA256SUMS.txt: huellas verificadas. No incluye bases, sesiones, secretos ni dependencias instaladas.</p><p><a href=\"fuente/docs/PENDIENTES-TECNICOS-3.4.md\">Pendientes de desarrollo</a> · <a href=\"fuente/docs/ESTADO-DESARROLLO.md\">Estado comprobado</a></p><h2>Al final: lo que necesita al titular</h2><p><a href=\"fuente/docs/TAREAS-DEL-TITULAR-3.4.md\">Lista completa de tus decisiones y validaciones</a></p><p>Contenido real de negocios, condiciones comerciales, validación desde cuentas que controles, textos de privacidad/operación y pilotos en dispositivos físicos. No necesitas programar. El resto del trabajo técnico sigue identificado como responsabilidad de desarrollo.</p></main></html>";
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
const archive={};for(const name of Object.keys(files).sort())archive['Cia.IA.3.4/'+name]=[files[name],{mtime:new Date('2026-11-25T17:00:00Z')}];
const zip=zipSync(archive,{level:6}),checked=unzipSync(zip);
for(const [name,data] of Object.entries(files)){const actual=checked['Cia.IA.3.4/'+name];if(!actual||hash(actual)!==hash(data))throw Error('Verificación ZIP fallida: '+name);}
await mkdir(dirname(output),{recursive:true});await writeFile(output,zip);
await writeFile(output+'.sha256',hash(zip)+'  '+output.split(/[\\/]/).at(-1)+'\n');
await writeFile(join(dirname(output),'Cia.IA.3.4-Guia.html'),await readFile(join(root,'docs/GUIA-CENTRO-IA-3.4.html')));
await writeFile(join(dirname(output),'Cia.IA.3.4-Verificacion.md'),await readFile(join(root,'docs/VERIFICACION-3.4.md')));
await writeFile(join(dirname(output),'Cia.IA.3.4-vista.jpg'),files['capturas/desktop-history.jpg']);
console.log(JSON.stringify({output,files:Object.keys(files).length,source:names.filter(n=>n.startsWith('fuente/')).length,public:names.filter(n=>n.startsWith('sitio-publicable/')).length,bytes:zip.length,sha256:hash(zip)},null,2));

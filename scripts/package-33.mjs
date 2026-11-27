import {readdir,readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,dirname,relative,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {zipSync,unzipSync,strToU8} from 'fflate';
import {pagesFiles} from './pages-files.mjs';
const root=resolve(fileURLToPath(new URL('../',import.meta.url)));
const output=resolve(process.argv[2]||join(root,'../Cia.IA.3.3.zip'));
if(!output.endsWith('.zip')||!relative(root,output).startsWith('..'))throw Error('La entrega ZIP debe quedar fuera del código fuente.');
const files={},hash=data=>createHash('sha256').update(data).digest('hex');
const excluded=new Set(['node_modules','.git','dist','build','.idea','.vscode','.codex','.secrets','__pycache__']);
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
for(const name of ['desktop-resources.jpg','tablet-professional.jpg','mobile-agenda.jpg'])
 files['capturas/'+name]=new Uint8Array(await readFile(join(root,'.impeccable/review/v33',name)));
files['RESULTADOS-3.3.txt']=new Uint8Array(await readFile(join(root,'docs/RESULTADOS-3.3.txt')));
files['VERIFICACION.md']=new Uint8Array(await readFile(join(root,'docs/VERIFICACION-3.3.md')));
const start='@echo off\r\nchcp 65001 >nul\r\nsetlocal\r\ncd /d "%~dp0fuente"\r\nwhere node >nul 2>nul\r\nif errorlevel 1 (\r\n echo Instala Node.js 22.13 o posterior antes de abrir Centro I.A.\r\n pause\r\n exit /b 1\r\n)\r\nnode -e "import(\'pglite17\').catch(()=\u003eprocess.exit(1))" >nul 2>nul\r\nif errorlevel 1 (\r\n echo Ejecuta primero INSTALAR-DEPENDENCIAS.bat en la carpeta principal.\r\n pause\r\n exit /b 1\r\n)\r\nnode scripts/start-33.mjs\r\npause\r\n';
const install='@echo off\r\nchcp 65001 >nul\r\nsetlocal\r\ncd /d "%~dp0fuente"\r\nwhere node >nul 2>nul\r\nif errorlevel 1 (\r\n echo Instala Node.js 22.13 o posterior.\r\n pause\r\n exit /b 1\r\n)\r\ncall npx --yes pnpm@11.25.0 install --frozen-lockfile --ignore-scripts\r\nif errorlevel 1 (\r\n echo No se completó la instalación. Revisa la conexión y el mensaje anterior.\r\n) else (\r\n echo Dependencias listas. Ejecuta INICIAR-Cia.IA.3.3.bat.\r\n)\r\npause\r\n';
files['INICIAR-Cia.IA.3.3.bat']=strToU8(start);files['INSTALAR-DEPENDENCIAS.bat']=strToU8(install);
const leeme="<!doctype html><html lang=\"es\"><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>Centro I.A. 3.3 · Empieza aquí</title><style>body{margin:0;background:#eef4f9;color:#173c50;font:17px/1.65 system-ui,sans-serif}header{background:#102a43;color:white;padding:42px 24px}header>div,main{max-width:1000px;margin:auto}h1{font-size:clamp(2rem,5vw,3.4rem);line-height:1.15;margin:0 0 20px}main{padding:24px 24px 60px}h2{margin-top:40px;font-size:1.4rem}a{color:#164c70;text-underline-offset:4px}header a{display:inline-block;background:#edc77d;color:#102a43;border-radius:8px;padding:12px 20px;margin:10px 12px 0 0;font-weight:650}li{margin:12px 0}img{max-width:100%;height:auto;border-radius:12px}:focus-visible{outline:3px solid #98712c;outline-offset:4px}</style><header><div><h1>Centro I.A. 3.3</h1><p>Fidelidad, creación personalizada, catálogo, sedes, equipo y agenda.</p><a href=\"fuente/docs/GUIA-CENTRO-IA-3.3.html\">Guía y cuadro de funciones</a><a href=\"VERIFICACION.md\">Verificación y límites</a></div></header><main><p><strong>Estado comprobado:</strong> Studio 3.2 está activado en Supabase. Sedes, equipo y agenda avanzada 3.3 funcionan localmente; su activación remota quedó pendiente por confirmación vencida del conector. La nueva interfaz todavía no está publicada en Pages.</p><h2>Abrir la prueba local</h2><ol><li>Extrae todo el ZIP y comprueba Node.js 22.13 o posterior.</li><li>Ejecuta INSTALAR-DEPENDENCIAS.bat si faltan dependencias; la primera vez necesita Internet.</li><li>Ejecuta INICIAR-Cia.IA.3.3.bat y conserva abierta la ventana.</li><li>Abre <a href=\"http://127.0.0.1:4176/workspace.html?as=company\">Empresa</a> o <a href=\"http://127.0.0.1:4176/workspace.html?as=user\">Usuario</a>.</li></ol><p>La franja PRUEBA LOCAL identifica datos aislados de este equipo. El selector de cinco identidades no inicia sesión en cuentas reales. No compartas el servidor como servicio público.</p><h2>Qué incluye</h2><p>Ocho giros, cuatro temas, logo propio, catálogo editable e importaciones revisadas, promociones, premios, puntos, retos y avisos. Operación local con sedes, Gerente/Recepción/Profesional, invitaciones, recursos, jornadas, descansos, ausencias, disponibilidad, reprogramación e historial, series de hasta ocho semanas.</p><img src=\"capturas/desktop-resources.jpg\" alt=\"Recursos y responsable de una sede en la prueba local\"><h2>Comprobaciones</h2><p>89 de 89 pruebas aprobadas, sintaxis, imports y build. Revisión visual independiente de escritorio, tablet y celular limitada a las vistas capturadas. La guía distingue implementación, activación de base y publicación. No acredita auditoría completa, escala ni recorrido con JWT reales de todos los roles.</p><h2>Contenido</h2><p>fuente: código, pruebas, migraciones y guía. sitio-publicable: frontend construido sin adaptador local. capturas: evidencia nueva. SHA256SUMS.txt: huellas verificadas. RESULTADOS-3.3.txt: ejecución completa.</p><p>No incluye bases de datos, sesiones, secretos ni dependencias instaladas. No aplica migraciones, publica cambios ni activa servicios de pago al extraerlo. La entrega anterior Cia.IA.3.2.zip se conserva.</p></main></html>";
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
const archive={};for(const name of Object.keys(files).sort())archive['Cia.IA.3.3/'+name]=[files[name],{mtime:new Date('2026-11-25T17:00:00Z')}];
const zip=zipSync(archive,{level:6}),checked=unzipSync(zip);
for(const [name,data] of Object.entries(files)){const actual=checked['Cia.IA.3.3/'+name];if(!actual||hash(actual)!==hash(data))throw Error('Verificación ZIP fallida: '+name);}
await mkdir(dirname(output),{recursive:true});await writeFile(output,zip);
await writeFile(output+'.sha256',hash(zip)+'  '+output.split(/[\\/]/).at(-1)+'\n');
await writeFile(join(dirname(output),'Cia.IA.3.3-Guia.html'),await readFile(join(root,'docs/GUIA-CENTRO-IA-3.3.html')));
await writeFile(join(dirname(output),'Cia.IA.3.3-Verificacion.md'),await readFile(join(root,'docs/VERIFICACION-3.3.md')));
await writeFile(join(dirname(output),'Cia.IA.3.3-vista.jpg'),files['capturas/desktop-resources.jpg']);
console.log(JSON.stringify({output,files:Object.keys(files).length,source:names.filter(n=>n.startsWith('fuente/')).length,public:names.filter(n=>n.startsWith('sitio-publicable/')).length,bytes:zip.length,sha256:hash(zip)},null,2));

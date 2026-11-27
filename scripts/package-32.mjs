import {readdir,readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,dirname,relative,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {zipSync,unzipSync,strToU8} from 'fflate';
import {pagesFiles} from './pages-files.mjs';
const root=resolve(fileURLToPath(new URL('../',import.meta.url)));
const output=resolve(process.argv[2]||join(root,'../Cia.IA.3.2.zip'));
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
for(const name of ['desktop-user.jpg','desktop-catalog.jpg','mobile-user.jpg','tablet-business.jpg','narrow-calendar.jpg','mobile-rewards-progress.jpg','user-1280.jpg','guide-table.jpg'])
 files['capturas/'+name]=new Uint8Array(await readFile(join(root,'.impeccable/review/v32',name)));
files['VERIFICACION.md']=new Uint8Array(await readFile(join(root,'docs/VERIFICACION-3.2.md')));
const start='@echo off\r\nchcp 65001 >nul\r\nsetlocal\r\ncd /d "%~dp0fuente"\r\nwhere node >nul 2>nul\r\nif errorlevel 1 (\r\n echo Instala Node.js 22.13 o posterior antes de abrir Centro I.A.\r\n pause\r\n exit /b 1\r\n)\r\nnode -e "import(\'pglite17\').catch(()=\u003eprocess.exit(1))" >nul 2>nul\r\nif errorlevel 1 (\r\n echo Ejecuta primero INSTALAR-DEPENDENCIAS.bat en la carpeta principal.\r\n pause\r\n exit /b 1\r\n)\r\nnode scripts/start-32.mjs\r\npause\r\n';
const install='@echo off\r\nchcp 65001 >nul\r\nsetlocal\r\ncd /d "%~dp0fuente"\r\nwhere node >nul 2>nul\r\nif errorlevel 1 (\r\n echo Instala Node.js 22.13 o posterior.\r\n pause\r\n exit /b 1\r\n)\r\ncall npx --yes pnpm@11.25.0 install --frozen-lockfile --ignore-scripts\r\nif errorlevel 1 (\r\n echo No se completó la instalación. Revisa la conexión y el mensaje anterior.\r\n) else (\r\n echo Dependencias listas. Ejecuta INICIAR-Cia.IA.3.2.bat.\r\n)\r\npause\r\n';
files['INICIAR-Cia.IA.3.2.bat']=strToU8(start);files['INSTALAR-DEPENDENCIAS.bat']=strToU8(install);
const leeme='<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Cia.IA.3.2 · Empieza aquí</title><style>body{margin:0;background:#eef4f9;color:#173c50;font:17px/1.65 system-ui,sans-serif}header{background:#102a43;color:white;padding:45px 24px}header>div,main{max-width:1000px;margin:auto}h1{font-size:clamp(2rem,5vw,3.5rem);line-height:1.1;margin:0 0 20px}main{padding:30px 24px 60px}h2{margin-top:42px;font-size:1.4rem}a{color:#164c70;text-underline-offset:4px}header a{display:inline-block;background:#edc77d;color:#102a43;border-radius:8px;padding:12px 20px;margin:12px 12px 0 0;font-weight:650}li{margin:12px 0}img{max-width:100%;height:auto;border-radius:12px}code{background:#e1eef7;padding:3px 5px;border-radius:4px}:focus-visible{outline:3px solid #98712c;outline-offset:4px}</style><header><div><h1>Centro I.A. 3.2</h1><p>Tu aplicación de fidelidad: código editable, prueba local y guía de funciones.</p><a href="fuente/docs/GUIA-CENTRO-IA-3.2.html">Leer guía y cuadro de funciones</a><a href="VERIFICACION.md">Ver comprobaciones</a></div></header><main><p><strong>Entrega local funcional.</strong> Los módulos nuevos están implementados y probados en este equipo. Su migración 3.2 y su publicación para clientes siguen pendientes. La guía identifica todos los límites.</p><h2>Cómo abrir la aplicación</h2><ol><li>Extrae el ZIP completo. Necesitas Node.js 22.13 o posterior.</li><li>Ejecuta <strong>INSTALAR-DEPENDENCIAS.bat</strong> si todavía no instalaste las dependencias. La primera instalación necesita Internet.</li><li>Ejecuta <strong>INICIAR-Cia.IA.3.2.bat</strong>. Conserva esa ventana abierta.</li><li>Abre <a href="http://127.0.0.1:4175/workspace.html?as=company">Empresa</a> o <a href="http://127.0.0.1:4175/workspace.html?as=user">Usuario</a>. Crea un programa como Empresa y únete con su código como Usuario.</li></ol><p>Comprueba la franja PRUEBA LOCAL. Los cambios se guardan en tu equipo. El selector local no inicia sesión en cuentas reales ni se conecta a Supabase.</p><h2>Qué puedes probar</h2><p>Creación por ocho tipos de negocio, cuatro temas de marca, logo propio, catálogo editable con importaciones revisadas, promociones, premios de distintos tipos, retos y niveles, movimientos de puntos, avisos internos y solicitudes/citas por recurso. La interfaz se adapta a escritorio, tablet y celular.</p><img src="capturas/desktop-catalog.jpg" alt="Catálogo de servicios en la prueba local de Centro I.A., con acciones de importación y edición"><h2>Qué queda pendiente</h2><p>Activación y pruebas en producción, empleados con permisos y sucursales reales, agenda laboral avanzada, push/recordatorios, OCR y formatos adicionales, métricas y paginación para mayor volumen. La revisión adicional de correo, datos y seguridad queda en la fase final solicitada. Consulta el cuadro de pendientes en la guía.</p><h2>Contenido del paquete</h2><p><strong>fuente:</strong> código, pruebas, migraciones, guías y ejemplos. <strong>sitio-publicable:</strong> frontend construido, sin adaptador local. <strong>capturas:</strong> evidencia de prueba. <strong>SHA256SUMS.txt:</strong> huellas de los archivos.</p><p>El ZIP no incluye dependencias instaladas, bases de datos, sesiones ni secretos. No aplica migraciones remotas ni activa servicios de pago al extraerlo. No publiques la carpeta fuente completa como si fuera el sitio.</p></main></html>';
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
const archive={};for(const name of Object.keys(files).sort())archive['Cia.IA.3.2/'+name]=[files[name],{mtime:new Date('2026-11-17T04:30:00Z')}];
const zip=zipSync(archive,{level:6}),checked=unzipSync(zip);
for(const [name,data] of Object.entries(files)){const actual=checked['Cia.IA.3.2/'+name];if(!actual||hash(actual)!==hash(data))throw Error('Verificación ZIP fallida: '+name);}
await mkdir(dirname(output),{recursive:true});await writeFile(output,zip);
await writeFile(output+'.sha256',hash(zip)+'  '+output.split(/[\\/]/).at(-1)+'\n');
await writeFile(join(dirname(output),'Cia.IA.3.2-Guia.html'),await readFile(join(root,'docs/GUIA-CENTRO-IA-3.2.html')));
await writeFile(join(dirname(output),'Cia.IA.3.2-Verificacion.md'),await readFile(join(root,'docs/VERIFICACION-3.2.md')));
await writeFile(join(dirname(output),'Cia.IA.3.2-vista.jpg'),files['capturas/desktop-catalog.jpg']);
console.log(JSON.stringify({output,files:Object.keys(files).length,source:names.filter(n=>n.startsWith('fuente/')).length,public:names.filter(n=>n.startsWith('sitio-publicable/')).length,bytes:zip.length,sha256:hash(zip)},null,2));

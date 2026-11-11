// Detecta archivos privados presentes en el repositorio o paquete de distribución.
import {readdirSync} from 'node:fs';
import {join,relative,resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const bad=[];
const ignoreDirs=new Set(['.git','node_modules','.idea','.vscode','__pycache__']);
function unsafe(rel){
  const filename=rel.split('/').at(-1).toLowerCase();
  return filename==='.env'||
    (filename.startsWith('.env.')&&filename!=='.env.example')||
    /\.(sqlite\d*|db\d*|pem|p12|pfx|key|log|zip)$/.test(filename)||
    /\.(sqlite\d*|db\d*)-(?:wal|shm|journal)$/.test(filename)||
    (rel.startsWith('data/')&&filename!=='.gitkeep')||
    (rel.startsWith('backups/')&&filename!=='.gitkeep');
}
function scanFolder(folder){
  for(const item of readdirSync(folder,{withFileTypes:true})){
    const abs=join(folder,item.name),rel=relative(root,abs).replaceAll('\\','/');
    if(item.isDirectory()) {if(!ignoreDirs.has(item.name))scanFolder(abs);}
    else if(item.isFile()&&unsafe(rel))bad.push(rel);
  }
}
let gitFiles=null;
try{
  const inside=execFileSync('git',['rev-parse','--show-toplevel'],{cwd:root,encoding:'utf8',stdio:['ignore','pipe','ignore']}).trim();
  if(resolve(inside)===root){
    gitFiles=execFileSync('git',['ls-files','--cached','-z'],{cwd:root,encoding:'utf8'}).split('\0').filter(Boolean);
  }
}catch{}
if(gitFiles){for(const f of gitFiles)if(unsafe(f))bad.push(f);}
else scanFolder(root);
if(bad.length){
  console.error('ERROR: archivos privados o generados incluidos en la entrega/Git:');
  for(const f of bad)console.error(` - ${f}`);
  process.exitCode=1;
}else{
  console.log('Correcto: no se incluyen credenciales, bases de datos ni respaldos en el proyecto rastreado.');
}
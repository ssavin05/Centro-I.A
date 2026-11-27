// Read-only deployment checks. Uses public files; never reads a session or sends a mutation.
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {pagesFiles} from './pages-files.mjs';
const base=new URL(process.argv[2]||'https://ssavin05.github.io/Centro-I.A/');
if(base.protocol!=='https:'||base.username||base.password||base.search||base.hash||!base.pathname.endsWith('/'))throw Error('Usa una URL HTTPS pública que termine en /, sin credenciales ni parámetros.');
const root=new URL('../',import.meta.url),hash=data=>createHash('sha256').update(data).digest('hex');
const results=[],queue=[...pagesFiles];
async function worker(){while(queue.length){const name=queue.shift();try{
 const response=await fetch(new URL(name,base),{redirect:'error',headers:{'Cache-Control':'no-cache'},signal:AbortSignal.timeout(15000)});
 const body=new Uint8Array(await response.arrayBuffer()),expected=await readFile(new URL(name,root));
 const same=response.ok&&hash(body)===hash(expected);results.push({path:name,status:response.status,sha256:hash(body),matches:same});
 }catch(error){results.push({path:name,matches:false,error:error.name});}
}}
await Promise.all(Array.from({length:5},worker));
const privatePaths=['.env','AGENTS.md','scripts/local-preview-client.mjs','tests/auth-flow.test.mjs','supabase/migrations/20261127030040_growth_34.sql'];
const privateResults=[];
for(const name of privatePaths){try{const response=await fetch(new URL(name,base),{redirect:'manual',signal:AbortSignal.timeout(10000)});await response.body?.cancel();privateResults.push({path:name,status:response.status,blocked:response.status===404});}catch(error){privateResults.push({path:name,blocked:false,error:error.name});}}
const failures=results.filter(r=>!r.matches),exposed=privateResults.filter(r=>!r.blocked);
const report={base:base.href,checked_at:new Date().toISOString(),public_files:results.length,matching_files:results.length-failures.length,private_paths:privateResults,files:results.sort((a,b)=>a.path.localeCompare(b.path)),passed:!failures.length&&!exposed.length};
if(process.argv[3])await writeFile(process.argv[3],JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({base:report.base,matching:report.matching_files,total:report.public_files,private_paths_blocked:privateResults.filter(r=>r.blocked).length,passed:report.passed,failures,exposed},null,2));
if(!report.passed)process.exitCode=1;

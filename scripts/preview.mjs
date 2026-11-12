import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {extname, resolve} from 'node:path';
import {pagesFiles} from './pages-files.mjs';
const root = fileURLToPath(new URL('../',import.meta.url));
const publicFiles = new Set(pagesFiles);
const mime = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.png':'image/png','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'};
const port = Number(process.env.PORT || 4173);
createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url,'http://localhost').pathname);
    const file = pathname === '/' ? 'index.html' : pathname.slice(1);
    if (!['GET','HEAD'].includes(request.method) || !publicFiles.has(file)) {
      response.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});response.end('Página no encontrada.');return;
    }
    const data = await readFile(resolve(root,file));
    response.writeHead(200,{'Content-Type':(mime[extname(file)] || 'application/octet-stream')+'; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'});
    response.end(request.method === 'HEAD' ? undefined : data);
  } catch {response.writeHead(404);response.end('Página no encontrada.');}
}).listen(port,'127.0.0.1', () => console.log('Centro I.A.: http://127.0.0.1:'+port));

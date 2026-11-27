import {mkdirSync,copyFileSync,rmSync,writeFileSync} from 'node:fs';
import {dirname} from 'node:path';
import {join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {pagesFiles} from './pages-files.mjs';
const root=resolve(fileURLToPath(new URL('../',import.meta.url))),dist=join(root,'dist');
rmSync(dist,{recursive:true,force:true});mkdirSync(dist,{recursive:true});
for(const file of pagesFiles){mkdirSync(dirname(join(dist,file)),{recursive:true});copyFileSync(join(root,file),join(dist,file));}
writeFileSync(join(dist,'.nojekyll'),'');
console.log('Centro I.A. oficial preparado para GitHub Pages. La autenticación funciona con Supabase Auth.');

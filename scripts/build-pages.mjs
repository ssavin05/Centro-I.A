// Compila únicamente la web pública: portada y demostración visual.
// GitHub Pages no publica el backend ni datos privados.
import {mkdirSync,copyFileSync,cpSync,rmSync,writeFileSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(fileURLToPath(new URL('../',import.meta.url))),dist=join(root,'dist');
rmSync(dist,{recursive:true,force:true});mkdirSync(dist,{recursive:true});
for(const file of ['index.html','dashboard.html','home.css','experience.css','home.js','app.js','styles.css','dashboard-effects.css','waves.css','manifest.webmanifest'])copyFileSync(join(root,file),join(dist,file));
mkdirSync(join(dist,'assets'),{recursive:true});
cpSync(join(root,'assets/icons'),join(dist,'assets/icons'),{recursive:true});
copyFileSync(join(root,'assets/escena-comercio.svg'),join(dist,'assets/escena-comercio.svg'));
writeFileSync(join(dist,'.nojekyll'),'');
console.log('GitHub Pages listo: portada index.html + aplicación dashboard.html + CSS, JS y recursos.');
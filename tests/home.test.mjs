import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const html=readFileSync('index.html','utf8');
const css=readFileSync('home.css','utf8');
const dashboard=readFileSync('dashboard.html','utf8');
test('la portada es una landing propia y enlaza a la aplicación',()=>{
 const hero=html.match(/<section class="hero-marketing">([\s\S]*?)<\/section>/);
 assert.ok(hero,'La portada debe contener la sección principal');
 const heading=hero[1].match(/<h1>([\s\S]*?)<\/h1>/);
 assert.ok(heading,'La portada debe tener un título principal');
 assert.ok(heading[1].replace(/<[^>]*>/g,'').trim().length>=30,'El título principal debe describir la propuesta de valor');
 assert.match(html,/href="dashboard\.html"/);
 assert.match(html,/href="home.css"/);
 assert.match(html,/src="home.js"/);
 assert.match(html,/Centro I\.A\./);
 assert.doesNotMatch(html,/© Leal/);
});
test('la app anterior conserva su JavaScript y fondo animado',()=>{
 assert.match(dashboard,/src="app\.js"/);
 assert.match(dashboard,/href="styles\.css"/);
 assert.match(dashboard,/href="waves\.css"/);
 assert.match(css,/assets\/escena-comercio\.svg/);
});
test('el menú móvil abre, cierra y actualiza atributos accesibles',()=>{
 const listeners={};const menu={props:{},contains:()=>false,addEventListener:(name,fn)=>listeners['menu-'+name]=fn,setAttribute(k,v){this.props[k]=v}};
 const nav={opened:false,contains:()=>false,addEventListener:(name,fn)=>listeners['nav-'+name]=fn,classList:{contains:x=>nav.opened,toggle:(name,state)=>{nav.opened=state},remove:()=>{nav.opened=false;}}};
 const year={textContent:''};const doc={getElementById:id=>({'menu-button':menu,'site-nav':nav,'year':year}[id]||null),addEventListener:(name,fn)=>listeners['doc-'+name]=fn};
 vm.runInNewContext(readFileSync('home.js','utf8'),{document:doc,Date:class extends Date{getFullYear(){return 2026}}},{timeout:500});
 listeners['menu-click']();assert.equal(nav.opened,true);assert.equal(menu.props['aria-expanded'],'true');
 listeners['doc-keydown']({key:'Escape'});assert.equal(nav.opened,false);assert.equal(menu.props['aria-expanded'],'false');
 assert.equal(year.textContent,'2026');
});
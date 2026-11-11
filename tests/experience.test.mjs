import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const html=readFileSync('index.html','utf8');
const experienceCSS=readFileSync('experience.css','utf8');
const appCSS=readFileSync('dashboard-effects.css','utf8');

test('la portada incluye recorrido e ideas con datos identificados como demostración',()=>{
 assert.match(html,/class="journey-section"/);
 assert.match(html,/data-journey-step="2"/);
 assert.match(html,/data-idea="wellness"/);
 assert.match(html,/SIMULACIÓN INTERACTIVA/);
 assert.match(html,/Propuestas ilustrativas/);
 assert.match(html,/href="experience\.css"/);
 assert.match(readFileSync('dashboard.html','utf8'),/href="dashboard-effects\.css"/);
 assert.match(experienceCSS,/prefers-reduced-motion/);
 assert.match(appCSS,/prefers-reduced-motion/);
});

test('las ideas y el recorrido cambian sin recargar y con botones accesibles',()=>{
 const byId={};
 const makeNode=()=>({textContent:'',href:'',attrs:{},dataset:{},listeners:{},classList:{add(){},remove(){},toggle(){}},setAttribute(k,v){this.attrs[k]=v},addEventListener(k,fn){this.listeners[k]=fn}});
 const journeyCanvas=makeNode(),studio=makeNode();
 journeyCanvas.querySelector=selector=>(byId[selector]??=makeNode());
 studio.querySelector=selector=>(byId['idea-'+selector]??=makeNode());
 const journeyBtns=[0,1,2].map(i=>{const node=makeNode();node.dataset.journeyStep=String(i);return node;});
 const ideaBtns=['cafe','beauty','wellness'].map(k=>{const node=makeNode();node.dataset.idea=k;return node;});
 const document={
  getElementById:id=>id==='year'?byId.year??=makeNode():null,
  querySelector:selector=>selector==='.journey-canvas'?journeyCanvas:selector==='.idea-stage'?studio:null,
  querySelectorAll:selector=>selector==='[data-journey-step]'?journeyBtns:selector==='[data-idea]'?ideaBtns:[],
  addEventListener:()=>{},documentElement:{scrollHeight:1800},hidden:false
 };
 const window={innerHeight:800,scrollY:100,requestAnimationFrame:fn=>fn(),addEventListener:()=>{}};
 vm.runInNewContext(readFileSync('home.js','utf8'),{document,window,Date,console}, {timeout:1000});
 journeyBtns[1].listeners.click();
 assert.equal(journeyCanvas.dataset.step,'1');
 assert.equal(byId['[data-journey-title]'].textContent,'Cada visita tiene valor.');
 assert.equal(journeyBtns[1].attrs['aria-pressed'],'true');
 ideaBtns[2].listeners.click();
 assert.equal(studio.dataset.ideaType,'wellness');
 assert.equal(byId['idea-[data-idea-title]'].textContent,'Cada sesión puede sumar bienestar.');
 assert.equal(ideaBtns[2].attrs['aria-pressed'],'true');
});
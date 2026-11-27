import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
function harness({reduce=false,hidden=false,gain=true}={}){
 const frames=new Map(),animations=[],events={},media={matches:reduce,addEventListener(name,fn){this.change=fn;}};let next=0;
 const animated=()=>({animate(keyframes,options){const animation={cancelled:false,cancel(){this.cancelled=true;this.oncancel?.();}};animations.push({animation,keyframes,options});return animation;}});
 const feature={...animated(),querySelector:()=>animated(),querySelectorAll:()=>[animated()]};
 const panel={hidden:false,...animated(),querySelector:selector=>selector==='.customer-gain'&&!gain?null:animated(),querySelectorAll:()=>Array.from({length:6},animated)};
 const document={hidden,querySelector:selector=>selector.includes('customer-hero')?feature:panel,addEventListener:(name,fn)=>events[name]=fn};
 let create;runInNewContext(readFileSync('customer-motion.js','utf8').replace('export function createCustomerMotion','function createCustomerMotion')+'\nexpose(createCustomerMotion);',{document,matchMedia:()=>media,requestAnimationFrame:fn=>(frames.set(++next,fn),next),cancelAnimationFrame:id=>frames.delete(id),Set,Array,expose:fn=>create=fn});
 const flush=()=>{const pending=[...frames.values()];frames.clear();pending.forEach(fn=>fn());};
 return {motion:create(),frames,animations,events,media,document,panel,flush};
}
test('movimiento reducido, pestaña oculta y panel oculto evitan animación sin ocultar contenido',()=>{
 for(const options of [{reduce:true},{hidden:true},{}]){const h=harness(options);if(!options.reduce&&!options.hidden)h.panel.hidden=true;h.motion.hero();h.flush();assert.equal(h.animations.length,0);}
});
test('una entrada nueva sustituye la anterior y limpiar identidad invalida el frame pendiente',()=>{
 const h=harness();h.motion.hero();const old=[...h.frames.values()][0];h.motion.hero();assert.equal(h.frames.size,1);h.motion.stop();old();h.flush();assert.equal(h.animations.length,0);
 h.motion.hero();h.flush();assert.equal(h.animations.length,3);h.motion.stop();assert.ok(h.animations.every(a=>a.animation.cancelled));
});
test('los resultados se animan de forma acotada y se cancelan al ocultar la pestaña o reducir movimiento',()=>{
 const h=harness();h.motion.rewards();h.flush();assert.equal(h.animations.length,3);assert.ok(h.animations.every(a=>a.options.duration+a.options.delay<=350));
 h.document.hidden=true;h.events.visibilitychange();assert.ok(h.animations.every(a=>a.animation.cancelled));
 h.document.hidden=false;h.motion.hero();h.flush();h.media.matches=true;h.media.change();assert.ok(h.animations.every(a=>a.animation.cancelled));
});

test('la ganancia necesita un aviso real y sus cuatro efectos son finitos y cancelables',()=>{
 const noGain=harness({gain:false});noGain.motion.gain();noGain.flush();assert.equal(noGain.animations.length,0);
 const h=harness();h.motion.gain();h.flush();assert.equal(h.animations.length,4);assert.ok(h.animations.every(a=>a.options.duration<=620));h.motion.stop();assert.ok(h.animations.every(a=>a.animation.cancelled));
 for(const options of [{reduce:true},{hidden:true}]){const blocked=harness(options);blocked.motion.gain();blocked.motion.view('calendar');blocked.flush();assert.equal(blocked.animations.length,0);}
});
test('la navegación sustituye entradas previas y solo anima el panel visible',()=>{
 const h=harness();h.motion.view('calendar');h.motion.view('inbox');assert.equal(h.frames.size,1);h.flush();assert.equal(h.animations.length,1);assert.equal(h.animations[0].options.duration,230);h.panel.hidden=true;h.motion.view('catalog');h.flush();assert.equal(h.animations.length,1);h.motion.view('calendar"]');h.flush();assert.equal(h.animations.length,1);
});

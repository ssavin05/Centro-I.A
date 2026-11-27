import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
test('movimiento decorativo pausa en pestaña oculta y fuera de vista',()=>{
  const targets=[{dataset:{}},{dataset:{}}];let visibility,intersections;
  const document={hidden:false,documentElement:{dataset:{}},addEventListener:(event,handler)=>{if(event==='visibilitychange')visibility=handler;},querySelectorAll:()=>targets};
  const observed=[];
  class IntersectionObserver {constructor(callback){intersections=callback;}observe(target){observed.push(target);}}
  runInNewContext(readFileSync('ui-feedback.js','utf8'),{document,window:{IntersectionObserver},IntersectionObserver});
  assert.equal(document.documentElement.dataset.motion,'active');
  document.hidden=true;visibility();assert.equal(document.documentElement.dataset.motion,'paused');
  assert.equal(observed.length,2);
  intersections([{target:targets[0],isIntersecting:false},{target:targets[1],isIntersecting:true}]);
  assert.equal(targets[0].dataset.outOfView,'true');assert.equal(targets[1].dataset.outOfView,'false');
});
test('sin IntersectionObserver el contenido y los controles siguen disponibles',()=>{
  const document={hidden:false,documentElement:{dataset:{}},addEventListener(){}};
  assert.doesNotThrow(()=>runInNewContext(readFileSync('ui-feedback.js','utf8'),{document,window:{}}));
});
test('contraste mínimo de las combinaciones principales de marca',()=>{
  const luminance=hex=>{const rgb=hex.match(/[a-f0-9]{2}/gi).map(n=>parseInt(n,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2];};
  const contrast=(a,b)=>{const v=[luminance(a),luminance(b)].sort((a,b)=>b-a);return (v[0]+.05)/(v[1]+.05);};
  for(const [fg,bg] of [['fffdfa','173c50'],['dcebf4','173c50'],['0d151b','edc77d'],['446477','fffdfa'],['a02e38','fff0ec']])assert.ok(contrast(fg,bg)>=4.5,fg+' / '+bg);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const code=readFileSync(new URL('../home.js',import.meta.url),'utf8');

// The marketing page must remain usable even if an animation API is missing.
test('journey steps update copy, pressed state and keyboard navigation',()=>{
  const handlers=new Map();
  const elements=Object.fromEntries(['label','title','copy','coin','value','amount','unit'].map(k=>[k,{textContent:''}]));
  const canvas={dataset:{},querySelector(selector){return elements[selector.replace(/^\[data-journey-|\]$/g,'')]??null;}};
  const buttons=[0,1,2].map(i=>({dataset:{journeyStep:String(i)},attributes:{},classList:{toggle(){}},setAttribute(k,v){this.attributes[k]=v},addEventListener(k,fn){handlers.set(`${i}-${k}`,fn)},focus(){this.focused=true}}));
  const doc={
    querySelector(selector){return selector==='.journey-canvas'?canvas:null},
    querySelectorAll(selector){return selector==='[data-journey-step]'?buttons:[]},
    getElementById(){return null},
    addEventListener(){}
  };
  vm.runInNewContext(code,{document:doc,Date,window:{requestAnimationFrame:fn=>fn()}});
  handlers.get('0-click')();
  assert.equal(canvas.dataset.step,'0');
  const event={key:'ArrowRight',preventDefault(){this.prevented=true}};
  handlers.get('0-keydown')(event);
  assert.equal(event.prevented,true);
  assert.equal(canvas.dataset.step,'1');
  assert.match(elements.title.textContent,/valor/);
  assert.equal(buttons[1].attributes['aria-pressed'],'true');
  assert.equal(buttons[1].focused,true);
  handlers.get('1-keydown')({key:'End',preventDefault(){}});
  assert.equal(canvas.dataset.step,'2');
});

test('search updates guard missing results elements',()=>{
  const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');
  assert.match(app,/if\(grid\)grid\.innerHTML=/);
  assert.match(app,/if\(note\)note\.textContent=/);
});
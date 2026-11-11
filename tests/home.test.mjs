import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync('index.html','utf8');
const css=readFileSync('site.css','utf8');
test('la portada oficial presenta registro y acceso, sin demo',()=>{
  assert.match(html,/auth\.html\?mode=login/);
  assert.match(html,/auth\.html\?mode=register/);
  assert.match(html,/Centro I\.A\./);
  assert.doesNotMatch(html,/dashboard\.html|ver demo|demo local/i);
  assert.match(html,/href="site\.css"/);
  assert.match(html,/src="start\.js"/);
});
test('el diseño conserva identidad, movimiento y accesibilidad',()=>{
  assert.match(css,/#f8f5ed|#f8f6f0/);
  assert.match(css,/@keyframes waveDrift/);
  assert.match(css,/prefers-reduced-motion:reduce/);
  assert.match(css,/:focus-visible/);
  assert.match(css,/@media\(max-width:680px\)/);
});
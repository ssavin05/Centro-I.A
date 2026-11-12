import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test('el despliegue oficial usa Node y base persistente en una sola URL',()=>{
  const blueprint=readFileSync('render.yaml','utf8');
  const server=readFileSync('server/index.mjs','utf8');
  const auth=readFileSync('auth.js','utf8');
  assert.match(blueprint,/runtime: node/);
  assert.match(blueprint,/healthCheckPath: \/api\/health/);
  assert.match(blueprint,/mountPath: \/var\/data/);
  assert.match(blueprint,/DB_PATH[\s\S]*\/var\/data\/centro-ia\.sqlite/);
  assert.match(server,/RENDER_EXTERNAL_URL/);
  assert.match(server,/0\.0\.0\.0/);
  assert.match(auth,/\.\/api\/auth\/.*endpoint/);
  assert.doesNotMatch(auth,/localStorage\.setItem\([^)]*password/i);
});

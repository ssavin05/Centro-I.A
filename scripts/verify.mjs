import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {pagesFiles} from './pages-files.mjs';
const root = fileURLToPath(new URL('../',import.meta.url));
const commands = [
  ['scripts/check-repo.mjs'], ['scripts/check-pages.mjs'],
  ...pagesFiles.filter(file=>file.endsWith('.js')).map(file=>['--check',file]),
  ['--check','server/index.mjs'], ['--check','server/db.mjs'], ['--check','app/app.js'],
  ['--test','tests/*.test.mjs'], ['scripts/build-pages.mjs'],
];
for (const args of commands) {
  const result = spawnSync(process.execPath,args,{cwd:root,stdio:'inherit'});
  if (result.error) {console.error(result.error.message);process.exit(1);}
  if (result.status !== 0) process.exit(result.status || 1);
}

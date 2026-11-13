import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

await copyFile('public/404.html', 'out/404.html');
await writeFile('out/.nojekyll', '');

// The hourly refresh workflow reads this file from the deployed site and
// compares the commit with core's branch before rebuilding.
await mkdir(path.join('out', 'data'), { recursive: true });
await copyFile(path.join('content', 'data', 'source.json'), path.join('out', 'data', 'source.json'));

console.log('postbuild: custom 404.html, .nojekyll and source.json copied to out/');

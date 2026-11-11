import { copyFile, writeFile } from 'node:fs/promises';

await copyFile('public/404.html', 'out/404.html');
await writeFile('out/.nojekyll', '');

console.log('postbuild: custom 404.html and .nojekyll copied to out/');

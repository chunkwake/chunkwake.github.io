#!/usr/bin/env node
/**
 * Collect the last git date for every docs file so pages can show an honest
 * "updated" label without querying GitHub at runtime.
 */
import { execFileSync } from 'node:child_process';
import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const docsDir = path.join(root, 'content', 'docs');
const outputPath = path.join(root, 'content', 'data', 'docs-meta.json');

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (entry.name.endsWith('.mdx')) files.push(full);
  }

  return files;
}

function gitDate(relativePath) {
  try {
    const value = execFileSync('git', ['log', '-1', '--format=%cI', '--', relativePath], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return value || null;
  } catch {
    return null;
  }
}

const files = (await walk(docsDir)).sort();
const updated = {};

for (const file of files) {
  const relative = path.relative(root, file).split(path.sep).join('/');
  updated[relative] = gitDate(relative) ?? (await stat(file)).mtime.toISOString();
}

await mkdir(path.dirname(outputPath), { recursive: true });

let previous = '';
try {
  previous = await readFile(outputPath, 'utf8');
} catch {
  // first run
}

const next = `${JSON.stringify({ updated }, null, 2)}\n`;
if (next === previous) {
  console.log(`docs-meta: ${files.length} pages unchanged`);
} else {
  await writeFile(outputPath, next, 'utf8');
  console.log(`docs-meta: ${files.length} pages updated`);
}

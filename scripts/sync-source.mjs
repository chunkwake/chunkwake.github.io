#!/usr/bin/env node
/**
 * Record which core commit the site was built from. The hourly workflow reads
 * the deployed copy of this file and skips a rebuild when the branch has not
 * moved.
 *
 * `git ls-remote` is used instead of the GitHub API so the check does not spend
 * the 60 requests/hour unauthenticated quota.
 */
import { execFileSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repo = 'chunkwake/core';
const branch = 'ver/26.3';
const remote = `https://github.com/${repo}.git`;
const outputPath = path.join(root, 'content', 'data', 'source.json');
const releasePath = path.join(root, 'content', 'data', 'release.json');

async function readJson(file) {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch {
    return null;
  }
}

function remoteSha() {
  const output = execFileSync('git', ['ls-remote', remote, `refs/heads/${branch}`], {
    encoding: 'utf8',
    timeout: 20_000,
    stdio: ['ignore', 'pipe', 'ignore'],
  }).trim();

  const sha = output.split(/\s+/)[0];
  if (!/^[a-f0-9]{40}$/i.test(sha)) throw new Error(`unexpected ls-remote output: ${output}`);
  return sha;
}

const existing = await readJson(outputPath);
const release = await readJson(releasePath);
const releaseTag = release?.release?.tag ?? null;

let coreSha = existing?.coreSha ?? null;
try {
  coreSha = remoteSha();
} catch (error) {
  console.warn(`source: cannot read ${branch} (${error.message}); keeping the cached commit`);
}

if (!coreSha) {
  console.warn('source: no core commit available; the hourly gate will rebuild every run');
}

const unchanged = existing?.coreSha === coreSha && existing?.releaseTag === releaseTag;

if (unchanged) {
  console.log(`source: ${coreSha?.slice(0, 8) ?? 'unknown'} unchanged`);
} else {
  const data = {
    repo,
    branch,
    coreSha,
    releaseTag,
    fetchedAt: new Date().toISOString(),
  };

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  console.log(`source: ${coreSha ? coreSha.slice(0, 8) : 'unknown'} (${branch})`);
}

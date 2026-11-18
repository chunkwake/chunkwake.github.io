#!/usr/bin/env node
/**
 * Development log for the site: the latest commits of chunkwake/core, grouped
 * by date. The GitHub API is used only here, at build time, and the result is
 * cached in `content/data/changelog.json` so a failed request never breaks a
 * build.
 *
 * Set GITHUB_TOKEN (the workflow passes it) to avoid the 60 requests/hour
 * unauthenticated limit.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repo = 'chunkwake/core';
const branch = 'ver/26.3';
const limit = 80;
const outputPath = path.join(root, 'content', 'data', 'changelog.json');

const categoryByPrefix = new Map([
  ['api', 'api'],
  ['perf', 'perf'],
  ['ci', 'ci'],
  ['docs', 'docs'],
  ['документация', 'docs'],
  ['жители', 'villagers'],
  ['плагины', 'plugins'],
  ['редстоун', 'redstone'],
  ['генерация', 'worldgen'],
  ['сеть', 'network'],
  ['мир', 'world'],
  ['хранилище', 'storage'],
  ['anvil', 'storage'],
  ['команды', 'commands'],
  ['мост', 'bridge'],
  ['безопасность', 'security'],
  ['наблюдаемость', 'observability'],
  ['сборка', 'build'],
]);

function splitMessage(message) {
  const firstLine = (message ?? '').split('\n')[0].trim();
  const match = firstLine.match(/^([^:]{2,24}):\s+(.+)$/);
  if (!match) return { category: 'core', title: firstLine };

  const prefix = match[1].trim().toLowerCase();
  return {
    category: categoryByPrefix.get(prefix) ?? 'core',
    title: match[2].trim(),
  };
}

async function readCache() {
  try {
    return JSON.parse(await readFile(outputPath, 'utf8'));
  } catch {
    return null;
  }
}

async function fetchCommits() {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'chunkwake-site',
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const url = `https://api.github.com/repos/${repo}/commits?sha=${encodeURIComponent(branch)}&per_page=${limit}`;
  const response = await fetch(url, { headers, signal: AbortSignal.timeout(20_000) });
  if (!response.ok) {
    throw new Error(`GitHub API ${response.status} ${response.statusText}`);
  }

  const rows = await response.json();
  return rows
    .filter((row) => row?.sha && row?.commit?.author?.date)
    .filter((row) => !/^Merge\b/i.test((row.commit.message ?? '').trim()))
    .map((row) => {
      const { category, title } = splitMessage(row.commit.message);
      return {
        sha: row.sha,
        shortSha: row.sha.slice(0, 8),
        date: row.commit.author.date,
        category,
        title,
        url: `https://github.com/${repo}/commit/${row.sha}`,
      };
    });
}

const cached = await readCache();
let items = cached?.items ?? [];

const cacheOnly = process.argv.includes('--cache');
const cacheAge = cached?.fetchedAt ? Date.now() - Date.parse(cached.fetchedAt) : Infinity;
const cacheFresh = cacheOnly && cached?.items?.length > 0 && cacheAge < 30 * 60 * 1000;

if (cacheFresh) {
  console.log(`changelog: ${cached.items.length} cached commits (${Math.round(cacheAge / 60000)} min old)`);
} else {
  try {
    items = await fetchCommits();
    console.log(`changelog: ${items.length} commits from ${branch}`);
  } catch (error) {
    if (cached?.items?.length) {
      console.warn(`changelog: ${error.message}; keeping ${cached.items.length} cached commits`);
    } else {
      console.warn(`changelog: ${error.message}; no cached commits yet`);
    }
  }
}

if (items.length > 0) {
  const data = {
    source: repo,
    branch,
    fetchedAt: new Date().toISOString(),
    items,
  };
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

#!/usr/bin/env node
/**
 * Pull docs/feature-matrix.md from chunkwake/core and turn it into a small
 * JSON file the site can render without hitting GitHub at runtime.
 *
 * Usage:
 *   node scripts/sync-feature-matrix.mjs           # always fetch
 *   node scripts/sync-feature-matrix.mjs --cache   # reuse a fresh local copy
 *
 * The committed JSON is also the fallback: if the network or GitHub is down,
 * the build keeps the last known matrix instead of failing.
 */
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const branch = 'ver/26.3';
const source = `https://raw.githubusercontent.com/chunkwake/core/${branch}/docs/feature-matrix.md`;
const outputPath = path.join(root, 'content', 'data', 'feature-matrix.json');
const cacheMaxAgeMs = 6 * 60 * 60 * 1000;

const args = new Set(process.argv.slice(2));
const useCache = args.has('--cache');

const statusMap = new Map([
  ['готово', 'ready'],
  ['частично', 'partial'],
  ['нет', 'missing'],
]);

function stripInline(value) {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Split a markdown table row on pipes, ignoring code spans and inline math pipes. */
function splitRow(line) {
  const cells = [];
  let current = '';
  let inCode = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '\\' && line[i + 1] === '|') {
      current += '|';
      i += 1;
      continue;
    }

    if (char === '`') {
      inCode = !inCode;
      current += char;
      continue;
    }

    if (char === '|' && !inCode) {
      // Table delimiters in this source are written as " | ". Pipes without
      // surrounding whitespace (e.g. `|cos|` in prose) belong to the note.
      const before = i === 0 ? ' ' : line[i - 1];
      const after = i === line.length - 1 ? ' ' : line[i + 1];
      if (/\s/.test(before) && /\s/.test(after)) {
        cells.push(current);
        current = '';
        continue;
      }
    }

    current += char;
  }

  cells.push(current);

  if (cells.length > 0 && cells[0].trim() === '') cells.shift();
  if (cells.length > 0 && cells[cells.length - 1].trim() === '') cells.pop();

  return cells.map((cell) => cell.trim());
}

function parse(markdown) {
  const lines = markdown.replace(/^\uFEFF/, '').split(/\r?\n/);
  const sections = [];
  const totals = { ready: 0, partial: 0, missing: 0, unknown: 0, total: 0 };
  let current = null;

  for (const line of lines) {
    const heading = /^##\s+(.+)$/.exec(line);
    if (heading) {
      current = {
        id: `section-${sections.length + 1}`,
        title: stripInline(heading[1]),
        counts: { ready: 0, partial: 0, missing: 0, unknown: 0, total: 0 },
        rows: [],
      };
      sections.push(current);
      continue;
    }

    if (!current || !line.startsWith('|')) continue;

    const cells = splitRow(line);
    if (cells.length < 3) continue;
    if (cells[0].toLowerCase() === 'фича') continue;
    if (cells.every((cell) => /^:?-{3,}:?$/.test(cell))) continue;

    const [name, rawStatus, third, ...rest] = cells;
    if (!name || !rawStatus) continue;

    const status = statusMap.get(rawStatus.toLowerCase()) ?? 'unknown';
    // Some rows omit the stage column and go straight from status to the note.
    const stage = cells.length > 3 ? stripInline(third ?? '') : '';
    const note =
      cells.length > 3 ? rest.join(' | ').trim() : (third ?? '').trim();

    current.rows.push({
      id: `${current.id}-row-${current.rows.length + 1}`,
      name: stripInline(name),
      status,
      stage: stripInline(stage ?? ''),
      note,
    });

    current.counts[status] += 1;
    current.counts.total += 1;
    totals[status] += 1;
    totals.total += 1;
  }

  const kept = sections.filter((section) => section.rows.length > 0);
  kept.forEach((section, index) => {
    section.id = `section-${index + 1}`;
    section.rows.forEach((row, rowIndex) => {
      row.id = `${section.id}-row-${rowIndex + 1}`;
    });
  });

  return { sections: kept, totals };
}

async function readExisting() {
  try {
    return JSON.parse(await readFile(outputPath, 'utf8'));
  } catch {
    return null;
  }
}

function isFresh(data) {
  if (!data?.fetchedAt) return false;
  const fetchedAt = Date.parse(data.fetchedAt);
  return Number.isFinite(fetchedAt) && Date.now() - fetchedAt < cacheMaxAgeMs;
}

async function main() {
  const existing = await readExisting();

  if (useCache && isFresh(existing)) {
    console.log(
      `feature-matrix: using cached copy from ${existing.fetchedAt} (${existing.totals?.total ?? 0} rows)`,
    );
    return;
  }

  let markdown;
  try {
    const response = await fetch(source, {
      headers: { 'user-agent': 'chunkwake-site-matrix-sync' },
      signal: AbortSignal.timeout(20_000),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status} ${response.statusText}`);
    markdown = await response.text();
  } catch (error) {
    if (existing) {
      console.warn(
        `feature-matrix: fetch failed (${error.message}); keeping the committed copy from ${existing.fetchedAt ?? 'unknown'}`,
      );
      return;
    }

    console.error(`feature-matrix: fetch failed and no local copy exists: ${error.message}`);
    process.exitCode = 1;
    return;
  }

  const { sections, totals } = parse(markdown);
  if (totals.total === 0) {
    console.error('feature-matrix: parsed zero rows; keeping the existing file');
    if (!existing) process.exitCode = 1;
    return;
  }

  const data = {
    source,
    branch,
    fetchedAt: new Date().toISOString(),
    sha256: createHash('sha256').update(markdown).digest('hex'),
    totals,
    sections,
  };

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');

  console.log(
    `feature-matrix: ${totals.total} rows (${totals.ready} ready, ${totals.partial} partial, ${totals.missing} missing) from ${branch}`,
  );
}

await main();

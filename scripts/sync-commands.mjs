#!/usr/bin/env node
/**
 * Pull docs/commands.md from chunkwake/core into the compact JSON the command
 * reference renders. The core table is the source of truth for usage, level,
 * Russian summaries and differences; existing English translations are kept.
 *
 * Usage:
 *   node scripts/sync-commands.mjs           # always fetch
 *   node scripts/sync-commands.mjs --cache   # reuse a fresh local copy
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const branch = 'ver/26.3';
const source = `https://raw.githubusercontent.com/chunkwake/core/${branch}/docs/commands.md`;
const outputPath = path.join(root, 'content', 'data', 'commands.json');
const cacheMaxAgeMs = 6 * 60 * 60 * 1000;

const args = new Set(process.argv.slice(2));
const useCache = args.has('--cache');

const groupOrder = ['player', 'world', 'data', 'admin', 'extra'];

const worldKeys = new Set([
  'setblock',
  'fill',
  'clone',
  'summon',
  'weather',
  'gamerule',
  'time',
  'difficulty',
  'seed',
  'setworldspawn',
  'worldborder',
  'forceload',
  'locate',
  'fillbiome',
  'place',
]);

const dataKeys = new Set(['scoreboard', 'data', 'execute']);

const adminKeys = new Set([
  'op',
  'deop',
  'kick',
  'whitelist',
  'ban',
  'ban-ip',
  'banlist',
  'pardon',
  'pardon-ip',
  'reload',
  'tick',
  'debug',
  'perf',
  'stop',
  'save-all',
  'save-off',
  'save-on',
  'publish',
  'unpublish',
  'transfer',
  'setidletimeout',
  'return',
  'advancement',
  'recipe',
  'loot',
]);

function stripInline(value) {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\\([|*_`])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Split a markdown table row on pipes, ignoring code spans and escaped pipes. */
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

function keyFor(usage) {
  const clean = stripInline(usage);
  const parts = clean.split(/[\s/]+/).filter(Boolean);
  if (parts[0] === 'scoreboard' && parts[1]) return `${parts[0]} ${parts[1]}`;
  return parts[0] ?? '';
}

function displayName(usage) {
  const clean = stripInline(usage);
  const first = clean.split(/\s+/)[0] ?? '';
  return first.replace(/\//g, ' / ');
}

function groupFor(key) {
  if (key === 'tps' || key === 'top') return 'extra';
  if (worldKeys.has(key)) return 'world';
  if (dataKeys.has(key) || key.startsWith('scoreboard ')) return 'data';
  if (adminKeys.has(key)) return 'admin';
  return 'player';
}

function isExtension(entry) {
  return (
    entry.name === 'tps' ||
    entry.name === 'top' ||
    /расширение chunkwake/i.test(entry.difference?.ru ?? '') ||
    /chunkwake extension/i.test(entry.difference?.en ?? '')
  );
}

function parse(markdown) {
  const start = markdown.indexOf('## Реализовано');
  if (start === -1) throw new Error('section "## Реализовано" not found');

  const next = markdown.indexOf('\n## ', start + 1);
  const block = markdown
    .slice(start, next === -1 ? undefined : next)
    .replace(/ \|\| /g, ' |\n| ');

  const rows = [];

  for (const line of block.split(/\r?\n/)) {
    if (!line.startsWith('|')) continue;

    const cells = splitRow(line);
    if (cells.length < 3) continue;
    if (cells[0].toLowerCase() === 'команда') continue;
    if (cells.every((cell) => /^:?-{3,}:?$/.test(cell))) continue;

    const usage = stripInline(cells[0]);
    const level = Number.parseInt(stripInline(cells[1]), 10);
    if (!usage || !Number.isFinite(level)) continue;

    rows.push({
      usage,
      level,
      summaryRu: stripInline(cells[2] ?? '').replace(/^—$/, ''),
      differenceRu: stripInline(cells[3] ?? '').replace(/^—$/, ''),
    });
  }

  return rows;
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
    console.log(`commands: using cached copy from ${existing.fetchedAt}`);
    return;
  }

  let markdown;
  try {
    const response = await fetch(source, {
      headers: { 'user-agent': 'chunkwake-site-commands-sync' },
      signal: AbortSignal.timeout(20_000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status} ${response.statusText}`);
    markdown = await response.text();
  } catch (error) {
    if (existing) {
      console.warn(
        `commands: fetch failed (${error.message}); keeping the committed copy from ${existing.fetchedAt ?? 'unknown'}`,
      );
      return;
    }
    console.error(`commands: fetch failed and no local copy exists: ${error.message}`);
    process.exitCode = 1;
    return;
  }

  const rows = parse(markdown);
  if (rows.length < 50) {
    console.error(`commands: parsed only ${rows.length} rows; keeping the existing file`);
    if (!existing) process.exitCode = 1;
    return;
  }

  const groups = new Map(
    (existing?.groups ?? groupOrder.map((id) => ({ id, title: { ru: id, en: id }, note: { ru: '', en: '' }, commands: [] }))).map(
      (group) => [group.id, { ...group, commands: [] }],
    ),
  );

  const rowByKey = new Map(rows.map((row) => [keyFor(row.usage), row]));
  const seen = new Set();
  let added = 0;
  let updated = 0;

  // Existing entries keep their curated wording and order. Core owns the list
  // of commands, permission levels and usage shapes; translations stay with the
  // site until someone updates them deliberately.
  for (const group of existing?.groups ?? []) {
    const target = groups.get(group.id);
    if (!target) continue;

    for (const command of group.commands) {
      const key = keyFor(command.usage);
      const row = rowByKey.get(key);

      if (!row) {
        target.commands.push(command);
        continue;
      }

      seen.add(key);
      // The table is authoritative for which commands exist and their levels,
      // but its usage cells are often just the command name. Keep the richer
      // curated usage from the site; new commands below get the core shape.
      const next = { ...command, level: row.level };

      if (JSON.stringify(next) !== JSON.stringify(command)) updated += 1;
      target.commands.push(next);
    }
  }

  for (const row of rows) {
    const key = keyFor(row.usage);
    if (seen.has(key)) continue;

    const groupId = groupFor(key);
    const target = groups.get(groupId) ?? groups.get('player');
    if (!target) continue;

    const entry = {
      name: displayName(row.usage),
      usage: row.usage,
      level: row.level,
      summary: { ru: row.summaryRu, en: row.summaryRu },
      difference: { ru: row.differenceRu, en: row.differenceRu },
      ...(row.summaryRu || row.differenceRu ? { untranslated: true } : {}),
    };
    entry.extension = isExtension(entry);
    if (!entry.extension) delete entry.extension;

    target.commands.push(entry);
    added += 1;
  }

  if (existing && added === 0 && updated === 0) {
    console.log(`commands: ${rows.length} rows unchanged`);
    return;
  }

  const orderedGroups = groupOrder
    .map((id) => groups.get(id))
    .filter(Boolean)
    .map((group) => ({
      ...group,
      commands: group.commands.map((command) => {
        const next = { ...command };
        if (!next.extension) delete next.extension;
        if (!next.untranslated) delete next.untranslated;
        return next;
      }),
    }));

  const data = {
    source,
    fetchedAt: new Date().toISOString(),
    groups: orderedGroups,
  };

  const next = `${JSON.stringify(data, null, 2)}\n`;
  const previous = existing ? `${JSON.stringify(existing, null, 2)}\n` : '';

  await mkdir(path.dirname(outputPath), { recursive: true });

  if (next === previous) {
    console.log(`commands: ${rows.length} rows unchanged`);
    return;
  }

  await writeFile(outputPath, next, 'utf8');
  console.log(
    `commands: ${rows.length} rows (${added} added, ${updated} updated) from ${branch}`,
  );
}

await main();

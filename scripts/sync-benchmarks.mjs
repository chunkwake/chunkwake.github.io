#!/usr/bin/env node
/**
 * Build the benchmarks page data from chunkwake/core.
 *
 * Sources (all machine-written, no hand-edited numbers):
 *   - benchmarks/ab-p99/results.md  — pooled p50/p95/p99, TPS, paired deltas
 *   - docs/ab-p99.md                — date of the A/B run
 *   - docs/perf.md                  — lab table, startup, CPU, memory, storage
 *
 * Every section is parsed independently: if core changes a table and parsing
 * fails, that section keeps its cached value instead of breaking the build.
 */
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repo = 'chunkwake/core';
const branch = 'ver/26.3';
const raw = `https://raw.githubusercontent.com/${repo}/${branch}`;
const outputPath = path.join(root, 'content', 'data', 'benchmarks.json');
const sourcePath = path.join(root, 'content', 'data', 'source.json');

const urls = {
  abResults: `${raw}/benchmarks/ab-p99/results.md`,
  abDoc: `${raw}/docs/ab-p99.md`,
  perf: `${raw}/docs/perf.md`,
};

async function readJson(file) {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch {
    return null;
  }
}

async function fetchText(url) {
  const response = await fetch(`${url}?t=${Date.now()}`, {
    headers: { 'User-Agent': 'chunkwake-site' },
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new Error(`${url} -> ${response.status}`);
  return response.text();
}

/* ─── Markdown tables ─────────────────────────────────────────────────────── */

function splitCells(line) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.replace(/\*\*/g, '').trim());
}

function isSeparator(line) {
  return /^\|[\s:|-]+\|$/.test(line.trim());
}

function parseTables(text) {
  const tables = [];
  let block = [];

  const flush = () => {
    if (block.length >= 2) {
      const header = splitCells(block[0]).map((cell) => cell.toLowerCase());
      const rows = block
        .slice(1)
        .filter((line) => !isSeparator(line))
        .map(splitCells)
        .filter((cells) => cells.length > 1);
      tables.push({ header, rows });
    }
    block = [];
  };

  for (const line of text.split('\n')) {
    if (line.trim().startsWith('|')) block.push(line);
    else flush();
  }
  flush();
  return tables;
}

function findTable(tables, required) {
  return tables.find((table) => required.every((needle) => table.header.some((h) => h === needle)));
}

function col(table, name) {
  const index = table.header.indexOf(name);
  if (index < 0) throw new Error(`column "${name}" is missing`);
  return index;
}

function value(table, row, name) {
  return row[col(table, name)] ?? '';
}

/* ─── A/B p99 ─────────────────────────────────────────────────────────────── */

const abLabels = {
  cows200: { ru: '200 коров', en: '200 cows' },
  cows1000: { ru: '1000 коров', en: '1000 cows' },
  redstone: { ru: '1000 коров + redstone', en: '1000 cows + redstone' },
};

function parseAb(resultsText, docText) {
  const tables = parseTables(resultsText);
  const pooled = findTable(tables, ['scenario', 'side', 'p99 round median']);
  if (!pooled) throw new Error('pooled A/B table not found');

  const paired = findTable(tables, ['scenario', 'pairs', 'p99 ratio']);
  const roundsTable = findTable(tables, ['round', 'side', 'scenario']);

  const rounds = roundsTable
    ? new Set(roundsTable.rows.map((row) => value(roundsTable, row, 'round'))).size
    : Number(value(pooled, pooled.rows[0], 'rounds')) || null;

  const scenarios = [...new Set(pooled.rows.map((row) => value(pooled, row, 'scenario')))]
    .map((id) => {
      const cw = pooled.rows.find(
        (row) => value(pooled, row, 'scenario') === id && value(pooled, row, 'side') === 'Chunkwake',
      );
      const paper = pooled.rows.find(
        (row) => value(pooled, row, 'scenario') === id && value(pooled, row, 'side') === 'Paper',
      );
      if (!cw || !paper) return null;

      const pair = paired?.rows.find((row) => value(paired, row, 'scenario') === id);
      const deltaCell = pair ? value(paired, pair, 'p99 delta ms (mean / median)').split('/') : [];

      return {
        id,
        label: abLabels[id] ?? { ru: id, en: id },
        chunkwake: {
          ticks: value(pooled, cw, 'ticks'),
          avg: value(pooled, cw, 'avg ms'),
          p50: value(pooled, cw, 'p50 ms'),
          p95: value(pooled, cw, 'p95 ms'),
          p99: value(pooled, cw, 'p99 ms'),
          p99Median: value(pooled, cw, 'p99 round median'),
          max: value(pooled, cw, 'max ms'),
          tps: value(pooled, cw, 'tps (pooled window)'),
        },
        paper: {
          ticks: value(pooled, paper, 'ticks'),
          avg: value(pooled, paper, 'avg ms'),
          p50: value(pooled, paper, 'p50 ms'),
          p95: value(pooled, paper, 'p95 ms'),
          p99: value(pooled, paper, 'p99 ms'),
          p99Median: value(pooled, paper, 'p99 round median'),
          max: value(pooled, paper, 'max ms'),
          tps: value(pooled, paper, 'tps (pooled window)'),
        },
        delta: pair
          ? {
              p99Mean: deltaCell[0]?.trim() ?? '',
              p99Median: deltaCell[1]?.trim() ?? '',
              wins: value(paired, pair, 'p99 cw wins'),
              pBetter: value(paired, pair, 'p99 p(cw better)'),
              pPaperBetter: value(paired, pair, 'p99 p(paper better)'),
              ratio: value(paired, pair, 'p99 ratio'),
              tpsDelta: value(paired, pair, 'tps delta (mean)'),
              tpsWins: value(paired, pair, 'tps cw wins'),
              tpsPBetter: value(paired, pair, 'tps p(paper better)'),
            }
          : null,
      };
    })
    .filter(Boolean);

  if (scenarios.length === 0) throw new Error('A/B scenarios not found');

  const dateMatch = docText.match(/(\d{2})\.(\d{2})\.(\d{4})/);
  const date = dateMatch ? `${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}` : null;

  return { date, rounds, scenarios, sourceUrl: urls.abResults };
}

/* ─── Lab table + prose numbers ───────────────────────────────────────────── */

const labLabels = {
  join: { ru: 'Одновременный вход', en: 'Simultaneous join' },
  movement: { ru: 'Движение', en: 'Movement' },
  exploration: { ru: 'Исследование мира', en: 'World exploration' },
  redstone: { ru: 'Редстоун, 128 ламп и проводов', en: 'Redstone, 128 lamps and wires' },
  cows: { ru: '2500 коров', en: '2500 cows' },
};

function labId(label) {
  const text = label.toLowerCase();
  if (text.startsWith('одновременный')) return 'join';
  if (text.startsWith('движение')) return 'movement';
  if (text.startsWith('исследование')) return 'exploration';
  if (text.startsWith('редстоун')) return 'redstone';
  if (text.includes('коров')) return 'cows';
  return null;
}

function stripUnit(value, unit) {
  return value
    .replace(new RegExp(`\\s*${unit}\\s*$`), '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseLabSide(cell) {
  const parts = cell.split('/').map((part) => part.trim());
  if (parts.length < 3) throw new Error(`unexpected lab cell: ${cell}`);

  const p95 = stripUnit(parts[0], 'мс');
  const tpsMatch = parts[1].match(/\(TPS ([^)]+)\)/);
  const mspt = stripUnit(parts[1].replace(/\s*\(TPS[^)]*\)/, ''), 'мс');
  const memory = stripUnit(parts[2], 'МиБ');

  return { p95, mspt, memory, ...(tpsMatch ? { tps: tpsMatch[1] } : {}) };
}

function parsePerf(perfText) {
  const tables = parseTables(perfText);
  const out = {};

  const lab = findTable(tables, ['сценарий', 'chunkwake: вход p95 / mspt / память']);
  if (lab) {
    const scenarios = lab.rows
      .map((row, index) => {
        const id = labId(row[0]) ?? `lab-${index + 1}`;
        return {
          id,
          label: labLabels[id] ?? { ru: row[0], en: row[0] },
          chunkwake: parseLabSide(row[1]),
          vanilla: parseLabSide(row[2]),
        };
      })
      .filter(Boolean);

    const dateMatch = perfText.match(/##\s*Стенд против ванили \((\d{4}-\d{2}-\d{2}),\s*HEAD ([0-9a-f]+)\)/);
    const startupMatch = perfText.match(/Запуск:\s*Chunkwake\s*([\d.,–-]+)\s*с,\s*ваниль\s*([\d.,–-]+)\s*с/);

    if (scenarios.length > 0) {
      out.lab = {
        date: dateMatch?.[1] ?? null,
        head: dateMatch?.[2] ?? null,
        startup: startupMatch
          ? { chunkwake: startupMatch[1], vanilla: startupMatch[2] }
          : null,
        scenarios,
        sourceUrl: urls.perf,
      };
    }
  }

  const compression = findTable(tables, ['уровень deflate', 'данные', 'в секторах']);
  if (compression) {
    out.compression = compression.rows.map((row) => ({
      level: row[0],
      data: stripUnit(row[1], 'МБ'),
      sectors: stripUnit(row[2], 'МБ'),
      compress: row[3],
      decompress: row[4],
    }));
  }

  const storageMatch = perfText.match(/Полный чанк на уровне 6:\s*у нас\s*([\d.]+)\s*КБ,\s*у ванили\s*([\d.]+)\s*КБ/);
  if (storageMatch) {
    out.storage = { chunkKb: { chunkwake: storageMatch[1], vanilla: storageMatch[2] } };
  }

  const cpu = findTable(tables, ['что', 'до', 'после', 'правка']);
  if (cpu) {
    out.cpu = cpu.rows.map((row) => ({
      label: { ru: row[0], en: cpuEn[row[0]]?.label ?? row[0] },
      before: { ru: row[1], en: cpuEn[row[0]]?.before ?? row[1] },
      after: { ru: row[2], en: cpuEn[row[0]]?.after ?? row[2] },
      change: { ru: row[3], en: cpuEn[row[0]]?.change ?? row[3] },
    }));
  }

  const memory = findTable(tables, ['профиль', 'private в простое, мб', 'пик, мб', 'после 30 с, мб']);
  if (memory) {
    const dateMatch = perfText.match(/##\s*Второй проход по памяти \((\d{4}-\d{2}-\d{2})\)/);
    out.memory = {
      date: dateMatch?.[1] ?? null,
      rows: memory.rows.map((row) => ({
        label: { ru: row[0].replace(/`/g, ''), en: memoryEn(row[0].replace(/`/g, '')) },
        idle: row[1],
        peak: row[2],
        after: row[3],
        view: row[4],
      })),
    };
  }

  return out;
}

const cpuEn = {
  'Случайные тики, 400 тиков при 4096': {
    label: 'Random ticks, 400 ticks at 4096',
    before: '56.7 s',
    after: '32.5–33.5 s (vanilla 43 s)',
    change:
      'state kinds in a table; leaves tick only when decaying; deferred `distance` recompute',
  },
  '`/fill` 32×16×32 (`fill_16k`)': {
    label: '`/fill` 32×16×32 (`fill_16k`)',
    before: '288 ms',
    after: '35 ms',
    change: 'one world lock, one light pass, one broadcast queue per batch',
  },
  'Запись блока со светом': {
    label: 'Block write with light',
    before: '33.5 µs',
    after: '~28 µs',
    change: 'neighbours are read once for observers, fire and leaves',
  },
};

function memoryEn(label) {
  return label
    .replace(/^([AB]): обзор (\d+), /, '$1: view $2, ')
    .replace('исходная', 'baseline')
    .replace('общая Palette до', 'shared Palette before')
    .replace('итоговая normal', 'final normal')
    .replace('итоговая low', 'final low');
}

/* ─── Run ─────────────────────────────────────────────────────────────────── */

const existing = await readJson(outputPath);
const source = await readJson(sourcePath);

const cacheOnly = process.argv.includes('--cache');
const cacheAge = existing?.syncedAt ? Date.now() - Date.parse(existing.syncedAt) : Infinity;
if (cacheOnly && existing && cacheAge < 30 * 60 * 1000) {
  console.log(
    `benchmarks: cached (${Math.round(cacheAge / 60000)} min old, core ${existing.coreSha?.slice(0, 8) ?? 'unknown'})`,
  );
  process.exit(0);
}

const next = {
  source: repo,
  branch,
  coreSha: source?.coreSha ?? existing?.coreSha ?? null,
  syncedAt: new Date().toISOString(),
  ...(existing?.ab ? { ab: existing.ab } : {}),
  ...(existing?.lab ? { lab: existing.lab } : {}),
  ...(existing?.compression ? { compression: existing.compression } : {}),
  ...(existing?.storage ? { storage: existing.storage } : {}),
  ...(existing?.cpu ? { cpu: existing.cpu } : {}),
  ...(existing?.memory ? { memory: existing.memory } : {}),
};

const results = {};

try {
  const [abResults, abDoc] = await Promise.all([fetchText(urls.abResults), fetchText(urls.abDoc)]);
  next.ab = parseAb(abResults, abDoc);
  results.ab = `ok (${next.ab.scenarios.length} scenarios, ${next.ab.rounds ?? '?'} rounds)`;
} catch (error) {
  results.ab = `cached (${error.message})`;
}

try {
  const perf = await fetchText(urls.perf);
  const parsed = parsePerf(perf);
  for (const key of ['lab', 'compression', 'storage', 'cpu', 'memory']) {
    if (parsed[key]) {
      next[key] = parsed[key];
      results[key] = 'ok';
    } else {
      results[key] = 'cached (section not found)';
    }
  }
} catch (error) {
  for (const key of ['lab', 'compression', 'storage', 'cpu', 'memory']) {
    results[key] = `cached (${error.message})`;
  }
}

if (!next.ab && !next.lab) {
  console.warn('benchmarks: nothing parsed and no cache; keeping the file untouched');
  process.exit(0);
}

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(next, null, 2)}\n`, 'utf8');

for (const [key, status] of Object.entries(results)) {
  console.log(`benchmarks: ${key} ${status}`);
}
console.log(`benchmarks: core ${next.coreSha?.slice(0, 8) ?? 'unknown'}`);

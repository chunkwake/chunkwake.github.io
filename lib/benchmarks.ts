import data from '@/content/data/benchmarks.json';
import type { Lang } from './i18n';

type Localized = Record<Lang, string>;

export type AbSide = {
  ticks: string;
  avg: string;
  p50: string;
  p95: string;
  p99: string;
  p99Median: string;
  max: string;
  tps: string;
};

export type AbScenario = {
  id: string;
  label: Localized;
  chunkwake: AbSide;
  paper: AbSide;
  delta: {
    p99Mean: string;
    p99Median: string;
    wins: string;
    pBetter: string;
    pPaperBetter: string;
    ratio: string;
    tpsDelta: string;
    tpsWins: string;
    tpsPBetter: string;
  } | null;
};

export type LabScenario = {
  id: string;
  label: Localized;
  chunkwake: { p95: string; mspt: string; memory: string; tps?: string };
  vanilla: { p95: string; mspt: string; memory: string; tps?: string };
};

export type BenchmarksData = {
  source: string;
  branch: string;
  coreSha: string | null;
  syncedAt: string;
  ab?: {
    date: string | null;
    rounds: number | null;
    scenarios: AbScenario[];
    sourceUrl: string;
  };
  lab?: {
    date: string | null;
    head: string | null;
    startup: { chunkwake: string; vanilla: string } | null;
    scenarios: LabScenario[];
    sourceUrl: string;
  };
  compression?: {
    level: string;
    data: string;
    sectors: string;
    compress: string;
    decompress: string;
  }[];
  storage?: { chunkKb: { chunkwake: string; vanilla: string } };
  cpu?: { label: Localized; before: Localized; after: Localized; change: Localized }[];
  memory?: {
    date: string | null;
    rows: { label: Localized; idle: string; peak: string; after: string; view: string }[];
  };
};

export const benchmarksData = data as BenchmarksData;

export const abScenarioLabels: Record<string, Localized> = {
  cows200: { ru: '200 коров', en: '200 cows' },
  cows1000: { ru: '1000 коров', en: '1000 cows' },
  redstone: { ru: '1000 коров + redstone', en: '1000 cows + redstone' },
};

export const abScenarios = benchmarksData.ab?.scenarios ?? [];
export const labScenarios = benchmarksData.lab?.scenarios ?? [];
export const compressionRows = benchmarksData.compression ?? [];
export const cpuRows = benchmarksData.cpu ?? [];
export const memoryRows = (benchmarksData.memory?.rows ?? []).map((row) => ({
  profile: row.label,
  idle: row.idle,
  peak: row.peak,
  after: row.after,
  view: row.view,
}));

/* ─── Home page bars ──────────────────────────────────────────────────────── */

export type BenchmarkMetric = {
  id: string;
  label: Localized;
  chunkwake: number;
  vanilla: number;
  chunkwakeLabel: Localized;
  vanillaLabel: Localized;
  detail: Localized;
  delta: Localized;
};

function numbers(range?: string): number[] {
  if (!range) return [];
  return (range.match(/\d+(?:\.\d+)?/g) ?? []).map(Number);
}

function midpoint(range?: string): number {
  const values = numbers(range);
  if (values.length === 0) return 1;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function bounds(ranges: string[]): { min: number; max: number } {
  const values = ranges.flatMap(numbers);
  if (values.length === 0) return { min: 0, max: 0 };
  return { min: Math.min(...values), max: Math.max(...values) };
}

function lab(id: string) {
  return labScenarios.find((scenario) => scenario.id === id);
}

const startup = benchmarksData.lab?.startup;
const join = lab('join');
const exploration = lab('exploration');
const labCows = lab('cows');
const abCows = abScenarios.find((scenario) => scenario.id === 'cows1000');

const memoryBounds = bounds(labScenarios.map((scenario) => scenario.chunkwake.memory));
const vanillaMemoryBounds = bounds(labScenarios.map((scenario) => scenario.vanilla.memory));

const chunkKb = benchmarksData.storage?.chunkKb ?? { chunkwake: '6.9', vanilla: '8.7' };

const cows = abCows
  ? {
      chunkwake: Number(abCows.chunkwake.p99) || midpoint(labCows?.chunkwake.mspt),
      vanilla: Number(abCows.paper.p99) || midpoint(labCows?.vanilla.mspt),
      chunkwakeLabel: {
        ru: `${abCows.chunkwake.p99} мс p99 · ${abCows.chunkwake.tps} TPS`,
        en: `${abCows.chunkwake.p99} ms p99 · ${abCows.chunkwake.tps} TPS`,
      },
      vanillaLabel: {
        ru: `${abCows.paper.p99} мс p99 · ${abCows.paper.tps} TPS`,
        en: `${abCows.paper.p99} ms p99 · ${abCows.paper.tps} TPS`,
      },
    }
  : {
      chunkwake: midpoint(labCows?.chunkwake.mspt),
      vanilla: midpoint(labCows?.vanilla.mspt),
      chunkwakeLabel: {
        ru: `${labCows?.chunkwake.mspt ?? '3.9–5.6'} мс · ${labCows?.chunkwake.tps ?? '20'} TPS`,
        en: `${labCows?.chunkwake.mspt ?? '3.9–5.6'} ms · ${labCows?.chunkwake.tps ?? '20'} TPS`,
      },
      vanillaLabel: {
        ru: `${labCows?.vanilla.mspt ?? '120–221'} мс · ${labCows?.vanilla.tps ?? '4.4–8.6'} TPS`,
        en: `${labCows?.vanilla.mspt ?? '120–221'} ms · ${labCows?.vanilla.tps ?? '4.4–8.6'} TPS`,
      },
    };

export const benchmarks: BenchmarkMetric[] = [
  {
    id: 'startup',
    label: { ru: 'Запуск сервера', en: 'Server startup' },
    chunkwake: midpoint(startup?.chunkwake ?? '0.6–0.9'),
    vanilla: midpoint(startup?.vanilla ?? '6.6–11.4'),
    chunkwakeLabel: {
      ru: `${startup?.chunkwake ?? '0.6–0.9'} с`,
      en: `${startup?.chunkwake ?? '0.6–0.9'} s`,
    },
    vanillaLabel: {
      ru: `${startup?.vanilla ?? '6.6–11.4'} с`,
      en: `${startup?.vanilla ?? '6.6–11.4'} s`,
    },
    detail: {
      ru: 'От процесса до готовности принимать игроков. Данные игры уже в бинарнике.',
      en: 'From process start to accepting players. Game data is already in the binary.',
    },
    delta: { ru: 'быстрее', en: 'faster' },
  },
  {
    id: 'join',
    label: { ru: 'Вход 20 ботов', en: '20 bots joining' },
    chunkwake: midpoint(join?.chunkwake.p95),
    vanilla: midpoint(join?.vanilla.p95),
    chunkwakeLabel: {
      ru: `${join?.chunkwake.p95 ?? '11–26'} мс p95`,
      en: `${join?.chunkwake.p95 ?? '11–26'} ms p95`,
    },
    vanillaLabel: {
      ru: `${join?.vanilla.p95 ?? '845–860'} мс p95`,
      en: `${join?.vanilla.p95 ?? '845–860'} ms p95`,
    },
    detail: {
      ru: 'Одновременный вход 20 клиентов, p95. Замер после разминки 20 с.',
      en: '20 clients joining at once, p95. Measured after a 20 s warmup.',
    },
    delta: { ru: 'быстрее', en: 'faster' },
  },
  {
    id: 'chunks',
    label: { ru: 'Прогрузка чанков', en: 'Chunk loading' },
    chunkwake: midpoint(exploration?.chunkwake.mspt),
    vanilla: midpoint(exploration?.vanilla.mspt),
    chunkwakeLabel: {
      ru: `${exploration?.chunkwake.mspt ?? '0.8'} мс MSPT`,
      en: `${exploration?.chunkwake.mspt ?? '0.8'} ms MSPT`,
    },
    vanillaLabel: {
      ru: `${exploration?.vanilla.mspt ?? '3.4–4.3'} мс MSPT`,
      en: `${exploration?.vanilla.mspt ?? '3.4–4.3'} ms MSPT`,
    },
    detail: {
      ru: '20 ботов исследуют мир: генерация, свет и отправка чанков. Ниже — лучше.',
      en: '20 bots exploring: generation, light and chunk sending. Lower is better.',
    },
    delta: { ru: 'быстрее', en: 'faster' },
  },
  {
    id: 'cows',
    label: { ru: '1000 коров', en: '1000 cows' },
    chunkwake: cows.chunkwake,
    vanilla: cows.vanilla,
    chunkwakeLabel: cows.chunkwakeLabel,
    vanillaLabel: cows.vanillaLabel,
    detail: {
      ru: 'A/B на одинаковой нагрузке: 5 раундов, p99 по сырым тикам. Единственный плагин — PerfProbe.',
      en: 'A/B on identical load: 5 rounds, p99 from raw ticks. The only plugin is PerfProbe.',
    },
    delta: { ru: 'меньше p99', en: 'lower p99' },
  },
  {
    id: 'memory',
    label: { ru: 'Пик памяти', en: 'Peak memory' },
    chunkwake: memoryBounds.max || 236,
    vanilla: vanillaMemoryBounds.max || 929,
    chunkwakeLabel: {
      ru: `${memoryBounds.min}–${memoryBounds.max} МиБ`,
      en: `${memoryBounds.min}–${memoryBounds.max} MiB`,
    },
    vanillaLabel: {
      ru: `${vanillaMemoryBounds.min}–${vanillaMemoryBounds.max} МиБ`,
      en: `${vanillaMemoryBounds.min}–${vanillaMemoryBounds.max} MiB`,
    },
    detail: {
      ru: 'Пик памяти процесса под нагрузкой 20 ботов. JVM ванили с настройками по умолчанию.',
      en: 'Process peak under 20 bots. Vanilla JVM with default settings.',
    },
    delta: { ru: 'меньше памяти', en: 'less memory' },
  },
  {
    id: 'disk',
    label: { ru: 'Чанк на диске', en: 'Chunk on disk' },
    chunkwake: Number(chunkKb.chunkwake),
    vanilla: Number(chunkKb.vanilla),
    chunkwakeLabel: {
      ru: `${chunkKb.chunkwake} КБ`,
      en: `${chunkKb.chunkwake} KB`,
    },
    vanillaLabel: {
      ru: `${chunkKb.vanilla} КБ`,
      en: `${chunkKb.vanilla} KB`,
    },
    detail: {
      ru: 'Полный чанк после deflate 6. Миры Anvil читаются и пишутся в обе стороны.',
      en: 'A full chunk after deflate 6. Anvil worlds are read and written both ways.',
    },
    delta: { ru: 'меньше на диске', en: 'less disk' },
  },
];

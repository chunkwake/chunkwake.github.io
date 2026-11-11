import type { Lang } from './i18n';

export type BenchmarkMetric = {
  id: string;
  label: Record<Lang, string>;
  chunkwake: number;
  vanilla: number;
  chunkwakeLabel: Record<Lang, string>;
  vanillaLabel: Record<Lang, string>;
  detail: Record<Lang, string>;
  delta: Record<Lang, string>;
};

/**
 * Values come from chunkwake/core docs/perf.md (lab bench, 2026-11-10).
 * Bars compare normalized values; labels keep the original ranges.
 */
export const benchmarks: BenchmarkMetric[] = [
  {
    id: 'startup',
    label: { ru: 'Запуск сервера', en: 'Server startup' },
    chunkwake: 0.75,
    vanilla: 9,
    chunkwakeLabel: { ru: '0.6–0.9 с', en: '0.6–0.9 s' },
    vanillaLabel: { ru: '6.6–11.4 с', en: '6.6–11.4 s' },
    detail: {
      ru: 'От процесса до готовности принимать игроков. Данные игры уже в бинарнике.',
      en: 'From process start to accepting players. Game data is already in the binary.',
    },
    delta: { ru: 'быстрее', en: 'faster' },
  },
  {
    id: 'join',
    label: { ru: 'Вход 20 ботов', en: '20 bots joining' },
    chunkwake: 18.3,
    vanilla: 852.5,
    chunkwakeLabel: { ru: '11–26 мс p95', en: '11–26 ms p95' },
    vanillaLabel: { ru: '845–860 мс p95', en: '845–860 ms p95' },
    detail: {
      ru: 'Одновременный вход 20 клиентов, p95. Замер после разминки 20 с.',
      en: '20 clients joining at once, p95. Measured after a 20 s warmup.',
    },
    delta: { ru: 'быстрее', en: 'faster' },
  },
  {
    id: 'chunks',
    label: { ru: 'Прогрузка чанков', en: 'Chunk loading' },
    chunkwake: 0.8,
    vanilla: 3.85,
    chunkwakeLabel: { ru: '0.8 мс MSPT', en: '0.8 ms MSPT' },
    vanillaLabel: { ru: '3.4–4.3 мс MSPT', en: '3.4–4.3 ms MSPT' },
    detail: {
      ru: '20 ботов исследуют мир: генерация, свет и отправка чанков. Ниже — лучше.',
      en: '20 bots exploring: generation, light and chunk sending. Lower is better.',
    },
    delta: { ru: 'быстрее', en: 'faster' },
  },
  {
    id: 'cows',
    label: { ru: '2500 коров', en: '2500 cows' },
    chunkwake: 4.75,
    vanilla: 170.5,
    chunkwakeLabel: { ru: '3.9–5.6 мс · 20 TPS', en: '3.9–5.6 ms · 20 TPS' },
    vanillaLabel: { ru: '120–221 мс · 4.4–8.6 TPS', en: '120–221 ms · 4.4–8.6 TPS' },
    detail: {
      ru: 'MSPT при одинаковом числе сущностей. AI коров у Chunkwake ещё сверяется, поэтому сравниваем нагрузку, а не одинаковую работу.',
      en: 'MSPT with the same entity count. Cow AI is still being verified, so this compares load, not identical work.',
    },
    delta: { ru: 'меньше MSPT', en: 'less MSPT' },
  },
  {
    id: 'memory',
    label: { ru: 'Пик памяти', en: 'Peak memory' },
    chunkwake: 209,
    vanilla: 879,
    chunkwakeLabel: { ru: '182–236 МиБ', en: '182–236 MiB' },
    vanillaLabel: { ru: '845–929 МиБ', en: '845–929 MiB' },
    detail: {
      ru: 'Пик памяти процесса под нагрузкой 20 ботов. JVM ванили с настройками по умолчанию.',
      en: 'Process peak under 20 bots. Vanilla JVM with default settings.',
    },
    delta: { ru: 'меньше памяти', en: 'less memory' },
  },
  {
    id: 'disk',
    label: { ru: 'Чанк на диске', en: 'Chunk on disk' },
    chunkwake: 6.9,
    vanilla: 8.7,
    chunkwakeLabel: { ru: '6.9 КБ', en: '6.9 KB' },
    vanillaLabel: { ru: '8.7 КБ', en: '8.7 KB' },
    detail: {
      ru: 'Полный чанк после deflate 6. Миры Anvil читаются и пишутся в обе стороны.',
      en: 'A full chunk after deflate 6. Anvil worlds are read and written both ways.',
    },
    delta: { ru: 'меньше на диске', en: 'less disk' },
  },
];

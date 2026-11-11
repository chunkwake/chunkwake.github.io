import { AlertTriangle, Cpu, Gauge, HardDrive, MemoryStick, Terminal } from 'lucide-react';
import { CodeBlock } from '@/components/code-block';
import { links } from '@/lib/shared';

type Lang = 'ru' | 'en';

type Range = {
  p95: string;
  mspt: string;
  memory: string;
  tps?: string;
};

type Scenario = {
  id: string;
  label: { ru: string; en: string };
  chunkwake: Range;
  vanilla: Range;
};

const scenarios: Scenario[] = [
  {
    id: 'join',
    label: { ru: 'Одновременный вход', en: 'Simultaneous join' },
    chunkwake: { p95: '11.1–25.5', mspt: '0.4–0.5', memory: '187–188' },
    vanilla: { p95: '845–860', mspt: '2.1–2.6', memory: '907–929' },
  },
  {
    id: 'movement',
    label: { ru: 'Движение', en: 'Movement' },
    chunkwake: { p95: '16.4–47.1', mspt: '0.4–0.5', memory: '182–190' },
    vanilla: { p95: '703–746', mspt: '2.7–3.1', memory: '860–864' },
  },
  {
    id: 'exploration',
    label: { ru: 'Исследование мира', en: 'World exploration' },
    chunkwake: { p95: '25.2–30.4', mspt: '0.8', memory: '207–209' },
    vanilla: { p95: '698–891', mspt: '3.4–4.3', memory: '868–877' },
  },
  {
    id: 'redstone',
    label: { ru: 'Редстоун, 128 ламп и проводов', en: 'Redstone, 128 lamps and wires' },
    chunkwake: { p95: '16.1–16.2', mspt: '0.4–0.5', memory: '189–190' },
    vanilla: { p95: '897–960', mspt: '3.4–3.5', memory: '845–859' },
  },
  {
    id: 'cows',
    label: { ru: '2500 коров', en: '2500 cows' },
    chunkwake: { p95: '16.2', mspt: '3.9–5.6', memory: '230–236', tps: '20' },
    vanilla: { p95: '682–925', mspt: '120–221', memory: '909–913', tps: '4.4–8.6' },
  },
];

const cpuRows = [
  {
    label: { ru: 'Случайные тики, 400 тиков при 4096', en: 'Random ticks, 400 ticks at 4096' },
    before: { ru: '56.7 с', en: '56.7 s' },
    after: { ru: '32.5–33.5 с (ваниль 43 с)', en: '32.5–33.5 s (vanilla 43 s)' },
    change: {
      ru: 'виды состояний таблицей; листва тикает только при распаде; отложенный пересчёт `distance`',
      en: 'state kinds in a table; leaves tick only when decaying; deferred `distance` recompute',
    },
  },
  {
    label: { ru: '`/fill` 32×16×32 (`fill_16k`)', en: '`/fill` 32×16×32 (`fill_16k`)' },
    before: { ru: '288 мс', en: '288 ms' },
    after: { ru: '35 мс', en: '35 ms' },
    change: {
      ru: 'один замок мира, один проход света, одна очередь рассылки на пачку',
      en: 'one world lock, one light pass, one broadcast queue per batch',
    },
  },
  {
    label: { ru: 'Запись блока со светом', en: 'Block write with light' },
    before: { ru: '33.5 мкс', en: '33.5 µs' },
    after: { ru: '~28 мкс', en: '~28 µs' },
    change: {
      ru: 'соседи читаются один раз на наблюдателей, огонь и листву',
      en: 'neighbours are read once for observers, fire and leaves',
    },
  },
];

const memoryRows = [
  {
    profile: { ru: 'A: обзор 10, исходная', en: 'A: view 10, baseline' },
    idle: '391.5',
    peak: '1317.3',
    after: '1003.9',
    view: '100.0 %',
  },
  {
    profile: { ru: 'A: обзор 10, итоговая normal', en: 'A: view 10, final normal' },
    idle: '348.7',
    peak: '1222.6',
    after: '965.2',
    view: '100.0 %',
  },
  {
    profile: { ru: 'B: обзор 32, исходная', en: 'B: view 32, baseline' },
    idle: '391.4',
    peak: '1991.3',
    after: '1330.5',
    view: '94.2 %',
  },
  {
    profile: { ru: 'B: обзор 32, итоговая normal', en: 'B: view 32, final normal' },
    idle: '351.1',
    peak: '1818.4',
    after: '1164.6',
    view: '92.5 %',
  },
  {
    profile: { ru: 'A: обзор 10, итоговая low', en: 'A: view 10, final low' },
    idle: '339.2',
    peak: '776.6',
    after: '445.2',
    view: '99.6 %',
  },
];

const compressionRows = [
  { level: '1', data: '124', sectors: '149', compress: '69–106', decompress: '40–59' },
  { level: '3', data: '90', sectors: '116', compress: '156–204', decompress: '38–67' },
  { level: '6', data: '85', sectors: '113', compress: '257–340', decompress: '41–66' },
  { level: '9', data: '83', sectors: '110', compress: '2020', decompress: '38–67' },
];

const copy = {
  ru: {
    eyebrow: 'Замеры',
    title: 'Что показывает стенд',
    lead: 'Полная методика, железо, сырые числа и оговорки. Цифры ниже — не обещание для любого сервера, а сравнение одинаковых сценариев на одной машине.',
    stats: [
      { label: 'Запуск', value: '0.6–0.9', unit: 'с', note: 'у ванили 6.6–11.4 с' },
      { label: 'Вход 20 ботов, p95', value: '11–26', unit: 'мс', note: 'у ванили 845–860 мс' },
      { label: 'Пик памяти', value: '182–236', unit: 'МиБ', note: 'у ванили 845–929 МиБ' },
      { label: 'Чанк на диске', value: '6.9', unit: 'КБ', note: 'deflate 6 · у ванили 8.7 КБ' },
    ],
    benchTitle: 'Стенд и методика',
    benchNote:
      'Релизная сборка, плоский мир, обзор 2, Java 25 (Temurin) с настройками JVM по умолчанию. По два прогона на сценарий: разминка 20 с, замер 45 с. MSPT — из `tick query`, TPS — по приращению `time query gametime`.',
    hardware: [
      ['CPU', 'Ryzen 9 7945HX'],
      ['ОС', 'Windows 11'],
      ['Сборка', '`release`, HEAD d3b74fd'],
      ['Мир', 'плоский, обзор 2'],
      ['Боты', '20'],
      ['Разминка / замер', '20 с / 45 с'],
      ['Повторы', '2 на сценарий'],
      ['Java', 'Temurin 25, настройки по умолчанию'],
    ],
    scenarioTitle: 'Сквозные сценарии',
    scenarioLead:
      'Вход — p95 задержки подключения. MSPT и память — за тот же прогон. Ниже — лучше; для TPS ниже — хуже.',
    columns: {
      scenario: 'Сценарий',
      p95: 'Вход p95',
      mspt: 'MSPT',
      memory: 'Память',
      tps: 'TPS',
    },
    chunkwake: 'Chunkwake',
    vanilla: 'Ваниль 26.3',
    startup: 'Запуск сервера: Chunkwake 0.6–0.9 с, ваниль 6.6–11.4 с.',
    findingsTitle: 'Что нашли по ходу',
    findings: [
      'В плоском мире днём появлялись зомби, скелеты, криперы и пауки и убивали ботов: 172 смерти против 30 у ванили. Свет незагруженного столбца читался как 0, а не из шаблона; затемнение неба считалось не по `day.json`. После исправления обе проверки проходят, смертей нет.',
      'Цифры с коровами сняты ещё с лишними монстрами вокруг. Профиль «Простой» без ботов стенд отмечает ошибкой у обоих серверов — это недочёт стенда, а не сервера.',
    ],
    cpuTitle: 'CPU-оптимизации',
    cpuColumns: { what: 'Что', before: 'До', after: 'После', change: 'Правка' },
    memoryTitle: 'Память',
    memoryLead:
      'Замер `scripts/measure-memory.ps1`: новые миры с сидом 12345, 60 с полёта со скоростью 20 блоков/с, симуляция 6. Private — `PrivateMemorySize64` процесса Windows; пик — максимум проб с шагом 2 с; «после» — через 30 с после ухода бота.',
    memoryColumns: {
      profile: 'Профиль',
      idle: 'Private в простое',
      peak: 'Пик',
      after: 'После 30 с',
      view: 'Средний обзор',
    },
    memoryNote:
      'Живая куча после полёта при нуле столбцов: 480 → 417 МБ. Приватная память процесса всё равно втрое больше живой кучи: mimalloc удерживает страницы после пика. `arena_eager_commit=0` отклонён: в профиле A low он дал 504.1 МБ вместо 445.2 МБ.',
    storageTitle: 'Хранилище',
    storageLead:
      'Тот же полёт: 13 052 полных чанка. Полный чанк на уровне deflate 6 — 6.9 КБ против 8.7 КБ у ванили. Свободные сектора переиспользуются, повторный бэкап без изменений идёт по жёстким ссылкам.',
    compressionColumns: {
      level: 'deflate',
      data: 'Данные, МБ',
      sectors: 'В секторах, МБ',
      compress: 'Сжатие, мкс/чанк',
      decompress: 'Распаковка, мкс/чанк',
    },
    caveatsTitle: 'Оговорки',
    caveats: [
      'Это одна машина и по два прогона на сценарий. Разброс между прогонами виден в диапазонах; не переносите разницу на любое железо.',
      'Профиль с коровами сравнивает нагрузку, а не одинаковую работу: AI коров в Chunkwake ещё сверяется с ванилью.',
      'Настройки мира, которые Chunkwake пока не применяет, нельзя считать эквивалентными ванили. Скорость не заменяет проверку поведения.',
      'Память — пик процесса под конкретным сценарием, а не рекомендация по `-Xmx` для JVM. Для плагинов всё ещё нужна Java 25+.',
      'Это не результат с плагинами: стенд запускает ядро без пользовательских плагинов.',
    ],
    reproduceTitle: 'Воспроизведение',
    reproduceLead:
      'Соберите лабораторию и релизный сервер, затем повторите прогон. Лаборатория скачает `server.jar` по манифесту Mojang, если он не указан, и проверит Java 25+.',
    code: `cargo build -p chunkwake-lab
cargo build --release -p chunkwake-server

chunkwake-lab bench --chunkwake target/release/chunkwake \\
  --jar server.jar --accept-vanilla-eula \\
  --profile all --bots 20 --warmup 20 --duration 45 --repetitions 2`,
    links: [
      { label: 'docs/perf.md — сырые замеры', href: links.perf },
      {
        label: 'docs/lab.md — лаборатория',
        href: 'https://github.com/chunkwake/core/blob/ver/26.3/docs/lab.md',
      },
    ],
    sourceNote:
      'Цифры взяты из `docs/perf.md` и `docs/lab.md` ветки `ver/26.3`. Если числа на этой странице расходятся с исходниками, верьте исходникам.',
  },
  en: {
    eyebrow: 'Benchmarks',
    title: 'What the bench shows',
    lead: 'Full method, hardware, raw numbers and caveats. These figures are not a promise for every server: they compare identical scenarios on one machine.',
    stats: [
      { label: 'Startup', value: '0.6–0.9', unit: 's', note: 'vanilla 6.6–11.4 s' },
      { label: '20 bots joining, p95', value: '11–26', unit: 'ms', note: 'vanilla 845–860 ms' },
      { label: 'Peak memory', value: '182–236', unit: 'MiB', note: 'vanilla 845–929 MiB' },
      { label: 'Chunk on disk', value: '6.9', unit: 'KB', note: 'deflate 6 · vanilla 8.7 KB' },
    ],
    benchTitle: 'Bench and method',
    benchNote:
      'Release build, flat world, view distance 2, Java 25 (Temurin) with default JVM settings. Two runs per scenario: 20 s warmup, 45 s measurement. MSPT comes from `tick query`; TPS from the `time query gametime` increment.',
    hardware: [
      ['CPU', 'Ryzen 9 7945HX'],
      ['OS', 'Windows 11'],
      ['Build', '`release`, HEAD d3b74fd'],
      ['World', 'flat, view distance 2'],
      ['Bots', '20'],
      ['Warmup / measurement', '20 s / 45 s'],
      ['Repetitions', '2 per scenario'],
      ['Java', 'Temurin 25, default settings'],
    ],
    scenarioTitle: 'End-to-end scenarios',
    scenarioLead:
      'Join is p95 connection latency. MSPT and memory are from the same run. Lower is better; for TPS, higher is better.',
    columns: {
      scenario: 'Scenario',
      p95: 'Join p95',
      mspt: 'MSPT',
      memory: 'Memory',
      tps: 'TPS',
    },
    chunkwake: 'Chunkwake',
    vanilla: 'Vanilla 26.3',
    startup: 'Server startup: Chunkwake 0.6–0.9 s, vanilla 6.6–11.4 s.',
    findingsTitle: 'What the runs found',
    findings: [
      'During the day, zombies, skeletons, creepers and spiders spawned in the flat world and killed bots: 172 deaths versus 30 for vanilla. Light in an unloaded flat-world column read as 0 instead of the template value, and sky darkening used the wrong timeline. After the fix both checks pass and Chunkwake has no deaths.',
      'The cow numbers were taken while extra monsters were still around. The botless "Simple" profile is reported as an error on both servers: that is a bench bug, not a server bug.',
    ],
    cpuTitle: 'CPU optimizations',
    cpuColumns: { what: 'What', before: 'Before', after: 'After', change: 'Change' },
    memoryTitle: 'Memory',
    memoryLead:
      'Measured with `scripts/measure-memory.ps1`: fresh worlds with seed 12345, 60 s of flight at 20 blocks/s, simulation 6. Private is Windows `PrivateMemorySize64`; peak is the maximum of samples every 2 s; after is 30 s after the bot leaves.',
    memoryColumns: {
      profile: 'Profile',
      idle: 'Private idle',
      peak: 'Peak',
      after: 'After 30 s',
      view: 'Average view',
    },
    memoryNote:
      'Live heap after flight with zero loaded columns: 480 → 417 MB. Process private memory is still three times the live heap: mimalloc keeps pages after the peak. `arena_eager_commit=0` was rejected: in profile A low it gave 504.1 MB instead of 445.2 MB.',
    storageTitle: 'Storage',
    storageLead:
      'Same flight: 13,052 full chunks. A full chunk at deflate 6 is 6.9 KB versus 8.7 KB for vanilla. Free sectors are reused, and a repeated backup with no changes uses hard links.',
    compressionColumns: {
      level: 'deflate',
      data: 'Data, MB',
      sectors: 'In sectors, MB',
      compress: 'Compress, µs/chunk',
      decompress: 'Decompress, µs/chunk',
    },
    caveatsTitle: 'Caveats',
    caveats: [
      'This is one machine and two runs per scenario. The spread is visible in the ranges; do not project the difference onto any hardware.',
      'The cow profile compares load, not identical work: cow AI in Chunkwake is still being verified against vanilla.',
      'World settings that Chunkwake does not apply yet cannot be considered equivalent to vanilla. Speed does not replace behaviour checks.',
      'Memory is the process peak under a specific scenario, not an `-Xmx` recommendation. Plugins still need Java 25+.',
      'This is a core-only result: the bench runs without user plugins.',
    ],
    reproduceTitle: 'Reproduction',
    reproduceLead:
      'Build the lab and the release server, then repeat the run. The lab downloads `server.jar` from the Mojang manifest if it is not provided and checks for Java 25+.',
    code: `cargo build -p chunkwake-lab
cargo build --release -p chunkwake-server

chunkwake-lab bench --chunkwake target/release/chunkwake \\
  --jar server.jar --accept-vanilla-eula \\
  --profile all --bots 20 --warmup 20 --duration 45 --repetitions 2`,
    links: [
      { label: 'docs/perf.md — raw measurements', href: links.perf },
      {
        label: 'docs/lab.md — the lab',
        href: 'https://github.com/chunkwake/core/blob/ver/26.3/docs/lab.md',
      },
    ],
    sourceNote:
      'Figures come from `docs/perf.md` and `docs/lab.md` on `ver/26.3`. If this page disagrees with the sources, trust the sources.',
  },
} as const;

function renderInline(value: string) {
  return value.split(/(`[^`]+`)/g).map((part, index) =>
    part.startsWith('`') && part.endsWith('`') && part.length > 2 ? (
      <code key={index}>{part.slice(1, -1)}</code>
    ) : (
      <span key={index}>{part}</span>
    ),
  );
}

export function BenchmarkReport({ lang }: { lang: string }) {
  const locale: Lang = lang === 'en' ? 'en' : 'ru';
  const t = copy[locale];
  const units = locale === 'ru' ? { ms: 'мс', mib: 'МиБ', mb: 'МБ', kb: 'КБ' } : { ms: 'ms', mib: 'MiB', mb: 'MB', kb: 'KB' };

  return (
    <div className="cw-bench-page">
      <header className="cw-bench-hero">
        <div className="cw-eyebrow">{t.eyebrow}</div>
        <h1>{t.title}</h1>
        <p>{t.lead}</p>
      </header>

      <div className="cw-bench-stats">
        {t.stats.map((stat) => (
          <div className="cw-bench-stat" key={stat.label}>
            <span className="cw-bench-stat-label">{stat.label}</span>
            <strong>
              {stat.value} <span>{stat.unit}</span>
            </strong>
            <span className="cw-bench-stat-note">{stat.note}</span>
          </div>
        ))}
      </div>

      <section className="cw-bench-section">
        <div className="cw-bench-section-head">
          <div>
            <h2>{t.benchTitle}</h2>
            <p>{renderInline(t.benchNote)}</p>
          </div>
          <Cpu size={18} aria-hidden="true" />
        </div>
        <dl className="cw-bench-specs">
          {t.hardware.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{renderInline(value)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="cw-bench-section">
        <div className="cw-bench-section-head">
          <div>
            <h2>{t.scenarioTitle}</h2>
            <p>{t.scenarioLead}</p>
          </div>
          <Gauge size={18} aria-hidden="true" />
        </div>

        <div className="cw-table-wrap cw-bench-table-wrap">
          <table className="cw-table cw-bench-table">
            <thead>
              <tr>
                <th rowSpan={2}>{t.columns.scenario}</th>
                <th colSpan={3}>{t.chunkwake}</th>
                <th colSpan={3}>{t.vanilla}</th>
              </tr>
              <tr>
                <th>{t.columns.p95}</th>
                <th>{t.columns.mspt}</th>
                <th>{t.columns.memory}</th>
                <th>{t.columns.p95}</th>
                <th>{t.columns.mspt}</th>
                <th>{t.columns.memory}</th>
              </tr>
            </thead>
            <tbody>
              {scenarios.map((scenario) => (
                <tr key={scenario.id}>
                  <td>
                    <span className="cw-table-name">{scenario.label[locale]}</span>
                    {scenario.chunkwake.tps ? (
                      <span className="cw-bench-tps">
                        TPS {scenario.chunkwake.tps} / {scenario.vanilla.tps}
                      </span>
                    ) : null}
                  </td>
                  <td>{scenario.chunkwake.p95} {units.ms}</td>
                  <td>{scenario.chunkwake.mspt} {units.ms}</td>
                  <td>{scenario.chunkwake.memory} {units.mib}</td>
                  <td>{scenario.vanilla.p95} {units.ms}</td>
                  <td>{scenario.vanilla.mspt} {units.ms}</td>
                  <td>{scenario.vanilla.memory} {units.mib}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="cw-bench-startup">{t.startup}</p>
      </section>

      <section className="cw-bench-section">
        <div className="cw-bench-section-head">
          <div>
            <h2>{t.findingsTitle}</h2>
          </div>
          <AlertTriangle size={18} aria-hidden="true" />
        </div>
        <ul className="cw-bench-findings">
          {t.findings.map((item) => (
            <li key={item}>{renderInline(item)}</li>
          ))}
        </ul>
      </section>

      <section className="cw-bench-section">
        <div className="cw-bench-section-head">
          <div>
            <h2>{t.cpuTitle}</h2>
          </div>
          <Terminal size={18} aria-hidden="true" />
        </div>
        <div className="cw-table-wrap cw-bench-table-wrap">
          <table className="cw-table cw-bench-table">
            <thead>
              <tr>
                <th>{t.cpuColumns.what}</th>
                <th>{t.cpuColumns.before}</th>
                <th>{t.cpuColumns.after}</th>
                <th>{t.cpuColumns.change}</th>
              </tr>
            </thead>
            <tbody>
              {cpuRows.map((row) => (
                <tr key={row.label.ru}>
                  <td>{renderInline(row.label[locale])}</td>
                  <td>{row.before[locale]}</td>
                  <td>{row.after[locale]}</td>
                  <td className="cw-bench-change">{renderInline(row.change[locale])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="cw-bench-section">
        <div className="cw-bench-section-head">
          <div>
            <h2>{t.memoryTitle}</h2>
            <p>{renderInline(t.memoryLead)}</p>
          </div>
          <MemoryStick size={18} aria-hidden="true" />
        </div>
        <div className="cw-table-wrap cw-bench-table-wrap">
          <table className="cw-table cw-bench-table">
            <thead>
              <tr>
                <th>{t.memoryColumns.profile}</th>
                <th>{t.memoryColumns.idle}</th>
                <th>{t.memoryColumns.peak}</th>
                <th>{t.memoryColumns.after}</th>
                <th>{t.memoryColumns.view}</th>
              </tr>
            </thead>
            <tbody>
              {memoryRows.map((row) => (
                <tr key={row.profile.ru}>
                  <td>{row.profile[locale]}</td>
                  <td>{row.idle} {units.mb}</td>
                  <td>{row.peak} {units.mb}</td>
                  <td>{row.after} {units.mb}</td>
                  <td>{row.view}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="cw-bench-note">{renderInline(t.memoryNote)}</p>
      </section>

      <section className="cw-bench-section">
        <div className="cw-bench-section-head">
          <div>
            <h2>{t.storageTitle}</h2>
            <p>{t.storageLead}</p>
          </div>
          <HardDrive size={18} aria-hidden="true" />
        </div>
        <div className="cw-table-wrap cw-bench-table-wrap">
          <table className="cw-table cw-bench-table">
            <thead>
              <tr>
                <th>{t.compressionColumns.level}</th>
                <th>{t.compressionColumns.data}</th>
                <th>{t.compressionColumns.sectors}</th>
                <th>{t.compressionColumns.compress}</th>
                <th>{t.compressionColumns.decompress}</th>
              </tr>
            </thead>
            <tbody>
              {compressionRows.map((row) => (
                <tr key={row.level}>
                  <td>{row.level}</td>
                  <td>{row.data}</td>
                  <td>{row.sectors}</td>
                  <td>{row.compress}</td>
                  <td>{row.decompress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="cw-bench-section">
        <div className="cw-bench-section-head">
          <div>
            <h2>{t.caveatsTitle}</h2>
          </div>
          <AlertTriangle size={18} aria-hidden="true" />
        </div>
        <ul className="cw-bench-caveats">
          {t.caveats.map((item) => (
            <li key={item}>{renderInline(item)}</li>
          ))}
        </ul>
      </section>

      <section className="cw-bench-section">
        <div className="cw-bench-section-head">
          <div>
            <h2>{t.reproduceTitle}</h2>
            <p>{renderInline(t.reproduceLead)}</p>
          </div>
          <Terminal size={18} aria-hidden="true" />
        </div>
        <CodeBlock code={t.code} lang="bash" title="chunkwake-lab bench" badge="shell" />
        <div className="cw-bench-links">
          {t.links.map((link) => (
            <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
              {link.label} ↗
            </a>
          ))}
        </div>
      </section>

      <p className="cw-bench-source">{renderInline(t.sourceNote)}</p>
    </div>
  );
}

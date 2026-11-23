import { AlertTriangle, Cpu, Gauge, HardDrive, MemoryStick, Terminal } from 'lucide-react';
import { CodeBlock } from '@/components/code-block';
import {
  abScenarioLabels,
  abScenarios,
  benchmarksData,
  compressionRows,
  cpuRows,
  labScenarios,
  memoryRows,
} from '@/lib/benchmarks';
import { links } from '@/lib/shared';

type Lang = 'ru' | 'en';

const ui = {
  ru: {
    eyebrow: 'Замеры',
    title: 'Что показывает стенд',
    lead: 'Полная методика, железо, сырые числа и оговорки. Цифры ниже — не обещание для любого сервера, а сравнение одинаковых сценариев на одной машине.',
    statStartup: 'Запуск',
    statJoin: 'Вход 20 ботов, p95',
    statCows: '1000 коров, p99',
    statTps: 'TPS, 1000 коров',
    vanillaNote: (value: string) => `у ванили ${value}`,
    paperNote: (value: string) => `у Paper ${value}`,
    methodTitle: 'Стенд и методика',
    methodLead:
      'Два независимых стенда. Лабораторный: 20 ботов, разминка 20 с, замер 45 с, по два прогона на сценарий. A/B: один бот, пять раундов по три 15-секундных окна, p99 по сырым тикам.',
    dates: 'Даты и повторы',
    datesValue: (lab: string, ab: string) => `лаборатория ${lab} · A/B ${ab}`,
    labTitle: 'Лабораторный стенд',
    labLead:
      'Плоский мир, обзор 2, Java 25 (Temurin) с настройками по умолчанию. Вход — p95 задержки подключения; MSPT и память — из того же прогона. Ниже — лучше.',
    labColumns: { scenario: 'Сценарий', p95: 'Вход p95', mspt: 'MSPT', memory: 'Память', tps: 'TPS' },
    chunkwake: 'Chunkwake',
    vanilla: 'Ваниль 26.3',
    startup: (cw: string, vanilla: string) =>
      `Запуск сервера: Chunkwake ${cw} с, ваниль ${vanilla} с.`,
    abTitle: 'A/B: p99 и TPS',
    abLead:
      '5 независимых раундов на одном железе: свежие миры, release-сборка, один бот, `view-distance=8`, плоский мир, единственный плагин `PerfProbe` 1.2.',
    abColumns: {
      scenario: 'Сценарий',
      cw: 'p99 Chunkwake',
      paper: 'p99 Paper',
      ratio: 'Отношение',
      wins: 'Раунды',
      p: 'p',
      tps: 'TPS',
    },
    abAvg: (cw: string, paper: string) => `avg ${cw} / ${paper} мс`,
    abNote:
      'p99 посчитан pooled по всем сырым тикам; TPS — по `Server.getCurrentTick()`, а не по числу Java-событий. p — односторонний точный sign-test: 5/5 даёт минимально возможное 0.031. TPS у обеих сторон 20.00, разница в пределах ±0.01 тика/с.',
    abCaveat:
      'Это узкая заявка: один игрок, ванильные коровы с AI, плоский мир и один плагин. Она не доказывает преимущество на произвольных плагинах, мирах и схемах редстоуна.',
    abSource: 'Сырые samples и все 30 окон',
    findingsTitle: 'Что нашли по ходу',
    findings: [
      'В плоском мире днём появлялись зомби, скелеты, криперы и пауки и убивали ботов: 172 смерти против 30 у ванили. Свет незагруженного столбца читался как 0, а не из шаблона; затемнение неба считалось не по `day.json`. После исправления обе проверки проходят, смертей нет.',
      'Цифры с коровами сняты ещё с лишними монстрами вокруг. Профиль «Простой» без ботов стенд отмечает ошибкой у обоих серверов — это недочёт стенда, а не сервера.',
    ],
    archiveNote:
      'Ниже — исторические раунды оптимизаций. Они объясняют, откуда взялись текущие цифры, но не заменяют замеры выше.',
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
    storageLead: (cw: string, vanilla: string) =>
      `Тот же полёт: полный чанк на уровне deflate 6 — ${cw} КБ против ${vanilla} КБ у ванили. Свободные сектора переиспользуются, повторный бэкап без изменений идёт по жёстким ссылкам.`,
    compressionColumns: {
      level: 'deflate',
      data: 'Данные, МБ',
      sectors: 'В секторах, МБ',
      compress: 'Сжатие, мкс/чанк',
      decompress: 'Распаковка, мкс/чанк',
    },
    caveatsTitle: 'Оговорки',
    caveats: [
      'Это одна машина и ограниченное число прогонов. Разброс между прогонами виден в диапазонах; не переносите разницу на любое железо.',
      'Профиль с коровами сравнивает нагрузку, а не одинаковую работу: AI коров в Chunkwake ещё сверяется с ванилью.',
      'Настройки мира, которые Chunkwake пока не применяет, нельзя считать эквивалентными ванили. Скорость не заменяет проверку поведения.',
      'Память — пик процесса под конкретным сценарием, а не рекомендация по `-Xmx` для JVM. Для плагинов всё ещё нужна Java 25+.',
      'A/B-стенд запускает ядро с одним служебным плагином `PerfProbe`; это не результат с пользовательскими плагинами.',
    ],
    reproduceTitle: 'Воспроизведение',
    reproduceLead:
      'Соберите лабораторию и релизный сервер, затем повторите прогон. Лаборатория скачает `server.jar` по манифесту Mojang, если он не указан, и проверит Java 25+.',
    labCodeTitle: 'chunkwake-lab bench',
    code: `cargo build -p chunkwake-lab
cargo build --release -p chunkwake-server

chunkwake-lab bench --chunkwake target/release/chunkwake \\
  --jar server.jar --accept-vanilla-eula \\
  --profile all --bots 20 --warmup 20 --duration 45 --repetitions 2`,
    abCodeTitle: 'A/B p99',
    abCode: `powershell -ExecutionPolicy Bypass -File scripts/ab_p99.ps1 -Rounds 5 -SampleMs 15000
py -3 scripts/analyze_ab_p99.py`,
    sourceNote: 'Данные обновляются автоматически при сборке сайта.',
  },
  en: {
    eyebrow: 'Benchmarks',
    title: 'What the bench shows',
    lead: 'Full method, hardware, raw numbers and caveats. These figures are not a promise for every server: they compare identical scenarios on one machine.',
    statStartup: 'Startup',
    statJoin: '20 bots joining, p95',
    statCows: '1000 cows, p99',
    statTps: 'TPS, 1000 cows',
    vanillaNote: (value: string) => `vanilla ${value}`,
    paperNote: (value: string) => `Paper ${value}`,
    methodTitle: 'Bench and method',
    methodLead:
      'Two independent benches. Lab: 20 bots, 20 s warmup, 45 s measurement, two runs per scenario. A/B: one bot, five rounds of three 15-second windows, p99 from raw ticks.',
    dates: 'Dates and repeats',
    datesValue: (lab: string, ab: string) => `lab ${lab} · A/B ${ab}`,
    labTitle: 'Lab bench',
    labLead:
      'Flat world, view distance 2, Java 25 (Temurin) with default JVM settings. Join is p95 connection latency; MSPT and memory come from the same run. Lower is better.',
    labColumns: { scenario: 'Scenario', p95: 'Join p95', mspt: 'MSPT', memory: 'Memory', tps: 'TPS' },
    chunkwake: 'Chunkwake',
    vanilla: 'Vanilla 26.3',
    startup: (cw: string, vanilla: string) => `Server startup: Chunkwake ${cw} s, vanilla ${vanilla} s.`,
    abTitle: 'A/B: p99 and TPS',
    abLead:
      '5 independent rounds on one machine: fresh worlds, release build, one bot, `view-distance=8`, flat world, the only plugin is `PerfProbe` 1.2.',
    abColumns: {
      scenario: 'Scenario',
      cw: 'p99 Chunkwake',
      paper: 'p99 Paper',
      ratio: 'Ratio',
      wins: 'Rounds',
      p: 'p',
      tps: 'TPS',
    },
    abAvg: (cw: string, paper: string) => `avg ${cw} / ${paper} ms`,
    abNote:
      'p99 is pooled over every raw tick; TPS comes from `Server.getCurrentTick()`, not the number of Java tick events. p is a one-sided exact sign test: 5/5 gives the smallest possible 0.031. TPS is 20.00 on both sides, within ±0.01 tick/s.',
    abCaveat:
      'This is a narrow claim: one player, vanilla cows with AI, a flat world and one plugin. It does not prove an advantage on arbitrary plugins, worlds or redstone builds.',
    abSource: 'Raw samples and all 30 windows',
    findingsTitle: 'What the runs found',
    findings: [
      'During the day, zombies, skeletons, creepers and spiders spawned in the flat world and killed bots: 172 deaths versus 30 for vanilla. Light in an unloaded flat-world column read as 0 instead of the template value, and sky darkening used the wrong timeline. After the fix both checks pass and Chunkwake has no deaths.',
      'The cow numbers were taken while extra monsters were still around. The botless "Simple" profile is reported as an error on both servers: that is a bench bug, not a server bug.',
    ],
    archiveNote:
      'Below are historical optimisation rounds. They explain where the current numbers come from, but do not replace the measurements above.',
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
    storageLead: (cw: string, vanilla: string) =>
      `Same flight: a full chunk at deflate 6 is ${cw} KB versus ${vanilla} KB for vanilla. Free sectors are reused, and a repeated backup with no changes uses hard links.`,
    compressionColumns: {
      level: 'deflate',
      data: 'Data, MB',
      sectors: 'In sectors, MB',
      compress: 'Compress, µs/chunk',
      decompress: 'Decompress, µs/chunk',
    },
    caveatsTitle: 'Caveats',
    caveats: [
      'This is one machine and a limited number of runs. The spread is visible in the ranges; do not project the difference onto any hardware.',
      'The cow profile compares load, not identical work: cow AI in Chunkwake is still being verified against vanilla.',
      'World settings that Chunkwake does not apply yet cannot be considered equivalent to vanilla. Speed does not replace behaviour checks.',
      'Memory is the process peak under a specific scenario, not an `-Xmx` recommendation. Plugins still need Java 25+.',
      'The A/B bench runs the core with one service plugin, `PerfProbe`; it is not a result with user plugins.',
    ],
    reproduceTitle: 'Reproduction',
    reproduceLead:
      'Build the lab and the release server, then repeat the run. The lab downloads `server.jar` from the Mojang manifest if it is not provided and checks for Java 25+.',
    labCodeTitle: 'chunkwake-lab bench',
    code: `cargo build -p chunkwake-lab
cargo build --release -p chunkwake-server

chunkwake-lab bench --chunkwake target/release/chunkwake \\
  --jar server.jar --accept-vanilla-eula \\
  --profile all --bots 20 --warmup 20 --duration 45 --repetitions 2`,
    abCodeTitle: 'A/B p99',
    abCode: `powershell -ExecutionPolicy Bypass -File scripts/ab_p99.ps1 -Rounds 5 -SampleMs 15000
py -3 scripts/analyze_ab_p99.py`,
    sourceNote: 'Data refreshes automatically when the site is built.',
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

function shortDate(value: string | null | undefined) {
  if (!value) return '—';
  const [year, month, day] = value.split('-');
  return day ? `${day}.${month}.${year}` : value;
}

export function BenchmarkReport({ lang }: { lang: string }) {
  const locale: Lang = lang === 'en' ? 'en' : 'ru';
  const t = ui[locale];
  const units =
    locale === 'ru'
      ? { ms: 'мс', mib: 'МиБ', mb: 'МБ', kb: 'КБ' }
      : { ms: 'ms', mib: 'MiB', mb: 'MB', kb: 'KB' };

  const labDate = shortDate(benchmarksData.lab?.date);
  const abDate = shortDate(benchmarksData.ab?.date);
  const rounds = benchmarksData.ab?.rounds ?? 5;
  const startup = benchmarksData.lab?.startup ?? { chunkwake: '0.6–0.9', vanilla: '6.6–11.4' };
  const join = labScenarios.find((scenario) => scenario.id === 'join');
  const cows = abScenarios.find((scenario) => scenario.id === 'cows1000');
  const storage = benchmarksData.storage?.chunkKb ?? { chunkwake: '6.9', vanilla: '8.7' };

  const stats = [
    {
      label: t.statStartup,
      value: startup.chunkwake,
      unit: locale === 'ru' ? 'с' : 's',
      note: t.vanillaNote(`${startup.vanilla} ${locale === 'ru' ? 'с' : 's'}`),
    },
    {
      label: t.statJoin,
      value: join?.chunkwake.p95 ?? '—',
      unit: units.ms,
      note: t.vanillaNote(`${join?.vanilla.p95 ?? '—'} ${units.ms}`),
    },
    {
      label: t.statCows,
      value: cows?.chunkwake.p99 ?? '—',
      unit: units.ms,
      note: t.paperNote(`${cows?.paper.p99 ?? '—'} ${units.ms}`),
    },
    {
      label: t.statTps,
      value: cows?.chunkwake.tps ?? '—',
      unit: 'TPS',
      note: t.paperNote(cows?.paper.tps ?? '—'),
    },
  ];

  return (
    <div className="cw-bench-page">
      <header className="cw-bench-hero">
        <div className="cw-eyebrow">{t.eyebrow}</div>
        <h1>{t.title}</h1>
        <p>{t.lead}</p>
      </header>

      <div className="cw-bench-stats">
        {stats.map((stat) => (
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
            <h2>{t.methodTitle}</h2>
            <p>{renderInline(t.methodLead)}</p>
          </div>
          <Cpu size={18} aria-hidden="true" />
        </div>
        <dl className="cw-bench-specs">
          <div>
            <dt>CPU</dt>
            <dd>Ryzen 9 7945HX</dd>
          </div>
          <div>
            <dt>{locale === 'ru' ? 'ОС' : 'OS'}</dt>
            <dd>Windows 11</dd>
          </div>
          <div>
            <dt>{locale === 'ru' ? 'Сборка' : 'Build'}</dt>
            <dd>
              <code>release</code>
            </dd>
          </div>
          <div>
            <dt>{locale === 'ru' ? 'Мир' : 'World'}</dt>
            <dd>{locale === 'ru' ? 'плоский, обзор 2 / 8' : 'flat, view 2 / 8'}</dd>
          </div>
          <div>
            <dt>{locale === 'ru' ? 'Java' : 'Java'}</dt>
            <dd>Temurin 25</dd>
          </div>
          <div>
            <dt>{t.dates}</dt>
            <dd>{t.datesValue(labDate, abDate)}</dd>
          </div>
        </dl>
      </section>

      <section className="cw-bench-section">
        <div className="cw-bench-section-head">
          <div>
            <h2>{t.abTitle}</h2>
            <p>{renderInline(t.abLead)}</p>
          </div>
          <Gauge size={18} aria-hidden="true" />
        </div>

        <div className="cw-table-wrap cw-bench-table-wrap">
          <table className="cw-table cw-bench-table">
            <thead>
              <tr>
                <th>{t.abColumns.scenario}</th>
                <th>{t.abColumns.cw}</th>
                <th>{t.abColumns.paper}</th>
                <th>{t.abColumns.ratio}</th>
                <th>{t.abColumns.wins}</th>
                <th>{t.abColumns.p}</th>
                <th>{t.abColumns.tps}</th>
              </tr>
            </thead>
            <tbody>
              {abScenarios.map((scenario) => (
                <tr key={scenario.id}>
                  <td>
                    <span className="cw-table-name">
                      {scenario.label?.[locale] ?? abScenarioLabels[scenario.id]?.[locale] ?? scenario.id}
                    </span>
                    <span className="cw-bench-tps">{t.abAvg(scenario.chunkwake.avg, scenario.paper.avg)}</span>
                  </td>
                  <td>
                    {scenario.chunkwake.p99} {units.ms}
                  </td>
                  <td>
                    {scenario.paper.p99} {units.ms}
                  </td>
                  <td>{scenario.delta?.ratio ?? '—'}</td>
                  <td>{scenario.delta?.wins ?? '—'}</td>
                  <td>{scenario.delta?.pBetter ?? '—'}</td>
                  <td>
                    {scenario.chunkwake.tps} / {scenario.paper.tps}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="cw-bench-note">{renderInline(t.abNote)}</p>
        <p className="cw-bench-note">{renderInline(t.abCaveat)}</p>
        <div className="cw-bench-links">
          {benchmarksData.ab?.sourceUrl ? (
            <a href={benchmarksData.ab.sourceUrl} target="_blank" rel="noreferrer">
              {t.abSource} ↗
            </a>
          ) : null}
        </div>
        <p className="cw-bench-startup">
          {locale === 'ru'
            ? `Раундов: ${rounds} · все 30 окон в results.md`
            : `Rounds: ${rounds} · all 30 windows in results.md`}
        </p>
      </section>

      <section className="cw-bench-section">
        <div className="cw-bench-section-head">
          <div>
            <h2>{t.labTitle}</h2>
            <p>{t.labLead}</p>
          </div>
          <Terminal size={18} aria-hidden="true" />
        </div>

        <div className="cw-table-wrap cw-bench-table-wrap">
          <table className="cw-table cw-bench-table">
            <thead>
              <tr>
                <th rowSpan={2}>{t.labColumns.scenario}</th>
                <th colSpan={3}>{t.chunkwake}</th>
                <th colSpan={3}>{t.vanilla}</th>
              </tr>
              <tr>
                <th>{t.labColumns.p95}</th>
                <th>{t.labColumns.mspt}</th>
                <th>{t.labColumns.memory}</th>
                <th>{t.labColumns.p95}</th>
                <th>{t.labColumns.mspt}</th>
                <th>{t.labColumns.memory}</th>
              </tr>
            </thead>
            <tbody>
              {labScenarios.map((scenario) => (
                <tr key={scenario.id}>
                  <td>
                    <span className="cw-table-name">{scenario.label[locale]}</span>
                    {scenario.chunkwake.tps ? (
                      <span className="cw-bench-tps">
                        TPS {scenario.chunkwake.tps} / {scenario.vanilla.tps}
                      </span>
                    ) : null}
                  </td>
                  <td>
                    {scenario.chunkwake.p95} {units.ms}
                  </td>
                  <td>
                    {scenario.chunkwake.mspt} {units.ms}
                  </td>
                  <td>
                    {scenario.chunkwake.memory} {units.mib}
                  </td>
                  <td>
                    {scenario.vanilla.p95} {units.ms}
                  </td>
                  <td>
                    {scenario.vanilla.mspt} {units.ms}
                  </td>
                  <td>
                    {scenario.vanilla.memory} {units.mib}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="cw-bench-startup">{t.startup(startup.chunkwake, startup.vanilla)}</p>
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

      <p className="cw-bench-note">{t.archiveNote}</p>

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
                  <td>
                    {row.idle} {units.mb}
                  </td>
                  <td>
                    {row.peak} {units.mb}
                  </td>
                  <td>
                    {row.after} {units.mb}
                  </td>
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
            <p>{t.storageLead(storage.chunkwake, storage.vanilla)}</p>
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
        <CodeBlock code={t.code} lang="bash" title={t.labCodeTitle} badge="shell" />
        <div className="cw-bench-links">
          <a href={`/${locale}/docs/lab`}>{locale === 'ru' ? 'Лаборатория' : 'Laboratory'} →</a>
          <a href={links.perf} target="_blank" rel="noreferrer">
            docs/perf.md ↗
          </a>
        </div>
        <CodeBlock code={t.abCode} lang="powershell" title={t.abCodeTitle} badge="shell" />
        <div className="cw-bench-links">
          <a href={`${links.github}/tree/ver/26.3/benchmarks/ab-p99`} target="_blank" rel="noreferrer">
            benchmarks/ab-p99 ↗
          </a>
        </div>
      </section>

      <p className="cw-bench-source">
        {renderInline(t.sourceNote)}{' '}
        {locale === 'ru' ? 'Источники' : 'Sources'}: {labDate} (docs/perf.md), {abDate} (results.md)
        {benchmarksData.coreSha ? ` · core ${benchmarksData.coreSha.slice(0, 8)}` : ''}.
      </p>
    </div>
  );
}

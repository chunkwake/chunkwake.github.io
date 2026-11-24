import { copy } from '@/lib/dictionary';
import { benchmarkPageMeta } from '@/lib/benchmark-meta';
import { benchmarksData, labScenarios } from '@/lib/benchmarks';
import changelog from '@/content/data/changelog.json';
import { featureMatrix } from '@/lib/feature-matrix';
import type { Lang } from '@/lib/i18n';
import { milestones, statusPageMeta } from '@/lib/milestones';
import { pluginData, pluginGate, pluginStatusLabels } from '@/lib/plugins';
import { releaseData } from '@/lib/release';

type StaticSearchPage = {
  path: string;
  url: string;
  locale: Lang;
  data: {
    title: string;
    description: string;
    structuredData: {
      headings: { id: string; content: string }[];
      contents: { heading?: string; content: string }[];
    };
    searchBreadcrumbs: string[];
  };
};

function page(
  locale: Lang,
  path: string,
  title: string,
  description: string,
  contents: string[],
): StaticSearchPage {
  return {
    path: `site/${path}.${locale}.mdx`,
    url: `/${locale}${path}`,
    locale,
    data: {
      title,
      description,
      structuredData: {
        headings: [],
        contents: contents.filter(Boolean).map((content) => ({ content })),
      },
      searchBreadcrumbs: [locale === 'ru' ? 'Сайт' : 'Site'],
    },
  };
}

function homePages(locale: Lang): StaticSearchPage[] {
  const text = copy[locale];
  const featureLabels = text.features.columns
    .flatMap((column) => [column.title, ...column.items.map((item) => item.label)])
    .join('. ');

  return [
    page(
      locale,
      '',
      text.meta.title,
      text.meta.description,
      [
        text.hero.lead,
        `${text.features.title}. ${text.features.lead}`,
        featureLabels,
        `${text.compat.title}. ${text.compat.lead} ${text.compat.note}`,
        `${text.plugins.title}. ${text.plugins.lead} ${text.plugins.bullets.join(' ')}`,
        `${text.architecture.title}. ${text.architecture.lead}`,
        text.roadmap.items.map((item) => `${item.title}: ${item.text}`).join(' '),
      ],
    ),
  ];
}

function benchmarkPages(locale: Lang): StaticSearchPage[] {
  const meta = benchmarkPageMeta[locale];
  const ab = benchmarksData.ab;
  const abDate = ab?.date ?? '';
  const rounds = ab?.rounds ?? 5;
  const abText = (ab?.scenarios ?? [])
    .map(
      (scenario) =>
        `${scenario.label?.[locale] ?? scenario.id}: p99 ${scenario.chunkwake.p99} / ${scenario.paper.p99} ${locale === 'ru' ? 'мс' : 'ms'}, ${scenario.delta?.ratio ?? ''}`,
    )
    .join('; ');

  return [
    page(
      locale,
      '/benchmarks',
      meta.title,
      meta.description,
      locale === 'ru'
        ? [
            'A/B p99: Ryzen 9 7945HX, release, один бот, обзор 8, плоский мир, 5 раундов по 15 секунд, плагин PerfProbe. ' + abText + '.',
            'Лабораторный стенд: 20 ботов, разминка 20 секунд, замер 45 секунд, два прогона. Сценарии: вход, движение, исследование мира, редстоун и 2500 коров.',
            `Память: пик и состояние через 30 секунд. Хранилище: deflate 1/3/6/9, чанк ${benchmarksData.storage?.chunkKb.chunkwake ?? '6.9'} КБ против ${benchmarksData.storage?.chunkKb.vanilla ?? '8.7'} КБ у ванили.`,
            'Оговорки: одна машина, ограниченное число прогонов, служебный плагин PerfProbe, AI коров ещё сверяется с ванилью, скорость не заменяет проверку поведения.',
            'Данные обновляются автоматически: A/B из benchmarks/ab-p99/results.md, лабораторный стенд из docs/perf.md.',
            'Воспроизведение: chunkwake-lab bench --profile all --bots 20 --warmup 20 --duration 45 --repetitions 2.',
          ]
        : [
            `A/B p99: Ryzen 9 7945HX, release, one bot, view 8, flat world, 5 rounds of 15 seconds, PerfProbe plugin. ${abText}.`,
            `Lab bench: 20 bots, 20 second warmup, 45 second measurement, two runs. Scenarios: join, movement, world exploration, redstone and 2500 cows. ${labScenarios.length} scenarios.`,
            `Memory: peak and state after 30 seconds. Storage: deflate 1/3/6/9, a chunk is ${benchmarksData.storage?.chunkKb.chunkwake ?? '6.9'} KB versus ${benchmarksData.storage?.chunkKb.vanilla ?? '8.7'} KB for vanilla.`,
            'Caveats: one machine, limited runs, the PerfProbe service plugin, cow AI is still being verified against vanilla, speed does not replace behaviour checks.',
            `Data refreshes automatically: A/B from benchmarks/ab-p99/results.md (${abDate}, ${rounds} rounds), lab from docs/perf.md.`,
            'Reproduction: chunkwake-lab bench --profile all --bots 20 --warmup 20 --duration 45 --repetitions 2.',
          ],
    ),
  ];
}

function downloadPages(locale: Lang): StaticSearchPage[] {
  const text = copy[locale];
  const release = releaseData.release;
  const releaseText = release
    ? locale === 'ru'
      ? `Последний релиз ${release.tag}, опубликован ${release.publishedAt?.slice(0, 10) ?? ''}.`
      : `Latest release ${release.tag}, published ${release.publishedAt?.slice(0, 10) ?? ''}.`
    : text.download.emptyText;

  return [
    page(
      locale,
      '/download',
      text.download.title,
      text.download.lead,
      [
        releaseText,
        text.download.platforms.map((platform) => `${platform.os}: ${platform.file}. ${platform.note}`).join(' '),
        `${text.download.source}: ${text.download.sourceNote}`,
        `cargo build --release -p chunkwake-server`,
        `${text.download.requirements}: ${text.download.reqRust}, ${text.download.reqJdk}, ${text.download.reqJava}.`,
      ],
    ),
  ];
}

function supportPages(locale: Lang): StaticSearchPage[] {
  const text = copy[locale];
  return [
    page(
      locale,
      '/support',
      text.support.title,
      text.support.lead,
      [
        locale === 'ru'
          ? 'Поддержать проект криптовалютой: BTC, USDT в сети TON, TRX в сети TRON. Переводите только указанную монету в указанной сети.'
          : 'Support the project with crypto: BTC, USDT on TON, TRX on TRON. Send only the listed coin on the listed network.',
        text.support.scan,
        text.support.warning,
      ],
    ),
  ];
}

function statusPages(locale: Lang): StaticSearchPage[] {
  const meta = statusPageMeta[locale];
  const totals = featureMatrix.totals;
  const stageText = milestones
    .map((milestone) => `${milestone.id} ${milestone.title[locale]}: ${milestone.summary[locale]}`)
    .join(' ');

  return [
    page(
      locale,
      '/status',
      meta.title,
      meta.description,
      [
        locale === 'ru'
          ? `Текущий фокус — M7. В фич-матрице ${totals.ready} готово, ${totals.partial} частично, ${totals.missing} не начато.`
          : `Current focus is M7. The feature matrix has ${totals.ready} ready, ${totals.partial} partial and ${totals.missing} not started.`,
        stageText,
        locale === 'ru'
          ? 'Исследовательские направления: журнал изменений и WAL, off-heap секции, STM-тик, компилятор совместимости.'
          : 'Research tracks: event log and WAL, off-heap sections, STM tick, compatibility compiler.',
      ],
    ),
  ];
}

function compatibilityPages(locale: Lang): StaticSearchPage[] {
  const ru = locale === 'ru';
  return [
    page(
      locale,
      '/compatibility',
      ru ? 'Совместимость плагинов' : 'Plugin compatibility',
      ru
        ? 'Плагины Paper, проверенные на живом сервере Chunkwake, с версиями и ограничениями.'
        : 'Paper plugins verified on a live Chunkwake server, with versions and limits.',
      [
        ...pluginData.plugins.map(
          (plugin) =>
            `${plugin.name} ${plugin.version}: ${pluginStatusLabels[plugin.status][locale]}. ${plugin.summary[locale]}`,
        ),
        ...(pluginGate
          ? [
              locale === 'ru'
                ? `Гейт плагинов: ${pluginGate.enabled} из ${pluginGate.total}. Вне стенда: ${(pluginGate.excluded ?? []).map((item) => item.name).join(', ')}.`
                : `Plugin gate: ${pluginGate.enabled} of ${pluginGate.total}. Outside the gate: ${(pluginGate.excluded ?? []).map((item) => item.name).join(', ')}.`,
            ]
          : []),
        ru
          ? 'Как проверяем: релизная сборка, реальный сервер с plugins/*.jar, лог включения, команды плагина и результат в мире.'
          : 'How we test: a release build, a real server with plugins/*.jar, the enable log, plugin commands and the result in the world.',
        ru
          ? 'Граница совместимости: плагины, которые заходят во внутренности CraftBukkit, Netty или ServerLevel, могут работать не полностью.'
          : 'Compatibility boundary: plugins that reach into CraftBukkit, Netty or ServerLevel internals may not work fully.',
      ],
    ),
  ];
}

function changelogPages(locale: Lang): StaticSearchPage[] {
  const items = (changelog as { items: { date: string; title: string }[] }).items;
  return [
    page(
      locale,
      '/changelog',
      locale === 'ru' ? 'Журнал разработки' : 'Development log',
      locale === 'ru'
        ? 'Коммиты ядра Chunkwake: плагины, редстоун, жители, производительность и API.'
        : 'Chunkwake core commits: plugins, redstone, villagers, performance and API.',
      items.slice(0, 40).map((item) => `${item.date.slice(0, 10)} ${item.title}`),
    ),
  ];
}

export function getStaticSearchPages(): StaticSearchPage[] {
  return (['ru', 'en'] as const).flatMap((locale) => [
    ...homePages(locale),
    ...benchmarkPages(locale),
    ...downloadPages(locale),
    ...supportPages(locale),
    ...statusPages(locale),
    ...compatibilityPages(locale),
    ...changelogPages(locale),
  ]);
}

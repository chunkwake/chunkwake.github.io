import { copy } from '@/lib/dictionary';
import { benchmarkPageMeta } from '@/lib/benchmark-meta';
import { featureMatrix } from '@/lib/feature-matrix';
import type { Lang } from '@/lib/i18n';
import { milestones, statusPageMeta } from '@/lib/milestones';
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
  const ru = locale === 'ru';
  const meta = benchmarkPageMeta[locale];
  return [
    page(
      locale,
      '/benchmarks',
      meta.title,
      meta.description,
      ru
        ? [
            'Стенд: Ryzen 9 7945HX, Windows 11, release, плоский мир, обзор 2, Java 25 Temurin, 20 ботов, разминка 20 секунд, замер 45 секунд, два прогона.',
            'Сценарии: одновременный вход, движение, исследование мира, редстоун на 128 лампах и проводах, 2500 коров. Сравниваются p95 входа, MSPT, TPS и память.',
            'Память: private в простое, пик и состояние через 30 секунд. Хранилище: deflate 1/3/6/9, полный чанк 6.9 КБ против 8.7 КБ у ванили.',
            'Оговорки: одна машина, два прогона, без пользовательских плагинов, AI коров ещё сверяется с ванилью, скорость не заменяет проверку поведения.',
            'Воспроизведение: chunkwake-lab bench --profile all --bots 20 --warmup 20 --duration 45 --repetitions 2.',
          ]
        : [
            'Bench: Ryzen 9 7945HX, Windows 11, release, flat world, view distance 2, Java 25 Temurin, 20 bots, 20 second warmup, 45 second measurement, two runs.',
            'Scenarios: simultaneous join, movement, world exploration, redstone with 128 lamps and wires, 2500 cows. Join p95, MSPT, TPS and memory are compared.',
            'Memory: private idle, peak and state after 30 seconds. Storage: deflate 1/3/6/9, a full chunk is 6.9 KB versus 8.7 KB for vanilla.',
            'Caveats: one machine, two runs, no user plugins, cow AI is still being verified against vanilla, speed does not replace behaviour checks.',
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

export function getStaticSearchPages(): StaticSearchPage[] {
  return (['ru', 'en'] as const).flatMap((locale) => [
    ...homePages(locale),
    ...benchmarkPages(locale),
    ...downloadPages(locale),
    ...supportPages(locale),
    ...statusPages(locale),
  ]);
}

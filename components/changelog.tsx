import { ArrowUpRight, GitCommitHorizontal } from 'lucide-react';
import changelog from '@/content/data/changelog.json';
import { links } from '@/lib/shared';
import type { Lang } from '@/lib/i18n';

type Commit = {
  sha: string;
  shortSha: string;
  date: string;
  category: string;
  title: string;
  url: string;
};

type ChangelogData = {
  source: string;
  branch: string;
  fetchedAt: string;
  items: Commit[];
};

const data = changelog as ChangelogData;

const months = {
  ru: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
} as const;

const categoryLabels: Record<string, Record<Lang, string>> = {
  api: { ru: 'API', en: 'API' },
  perf: { ru: 'производительность', en: 'performance' },
  ci: { ru: 'CI', en: 'CI' },
  docs: { ru: 'документация', en: 'docs' },
  villagers: { ru: 'жители', en: 'villagers' },
  plugins: { ru: 'плагины', en: 'plugins' },
  redstone: { ru: 'редстоун', en: 'redstone' },
  worldgen: { ru: 'генерация', en: 'worldgen' },
  network: { ru: 'сеть', en: 'network' },
  world: { ru: 'мир', en: 'world' },
  storage: { ru: 'хранение', en: 'storage' },
  commands: { ru: 'команды', en: 'commands' },
  bridge: { ru: 'мост', en: 'bridge' },
  security: { ru: 'безопасность', en: 'security' },
  observability: { ru: 'наблюдаемость', en: 'observability' },
  build: { ru: 'сборка', en: 'build' },
  core: { ru: 'ядро', en: 'core' },
};

const ui = {
  ru: {
    eyebrow: 'Журнал',
    title: 'Что меняется в core',
    lead: 'Лента коммитов ветки `ver/26.3`: без пересказов и релизных пауз. Свежие правки — сверху; ссылка ведёт на коммит в GitHub.',
    count: 'коммитов',
    last: 'последний',
    note: 'Показываются последние 80 коммитов. Заголовки — авторские, поэтому на английской странице они остаются на языке оригинала.',
    empty: 'Коммитов пока нет.',
    all: 'Все коммиты',
  },
  en: {
    eyebrow: 'Log',
    title: 'What changes in core',
    lead: 'The commit feed of `ver/26.3`, without rewrites or release pauses. Newest first; each link opens the commit on GitHub.',
    count: 'commits',
    last: 'latest',
    note: 'The last 80 commits are shown. Titles are author-written, so they stay in their original language on this page.',
    empty: 'No commits yet.',
    all: 'All commits',
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

function formatDay(iso: string, locale: Lang) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const day = date.getUTCDate();
  const month = months[locale][date.getUTCMonth()];
  const year = date.getUTCFullYear();
  return locale === 'ru' ? `${day} ${month} ${year}` : `${month} ${day}, ${year}`;
}

function formatTime(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return `${iso.slice(11, 16)} UTC`;
}

function groupByDay(items: Commit[]) {
  const groups = new Map<string, Commit[]>();
  for (const item of items) {
    const day = item.date.slice(0, 10);
    const list = groups.get(day);
    if (list) list.push(item);
    else groups.set(day, [item]);
  }
  return [...groups.entries()];
}

export function Changelog({ lang }: { lang: Lang }) {
  const t = ui[lang];
  const groups = groupByDay(data.items);
  const latest = data.items[0];

  return (
    <div className="cw-log">
      <div className="cw-log-stats">
        <div className="cw-log-stat">
          <strong>{data.items.length}</strong>
          <span>{t.count}</span>
        </div>
        <div className="cw-log-stat">
          <strong>{data.items.length > 0 ? formatDay(latest.date, lang) : '—'}</strong>
          <span>{t.last}</span>
        </div>
        <div className="cw-log-stat is-wide">
          <strong>{data.branch}</strong>
          <span>{data.source}</span>
        </div>
      </div>

      {groups.length === 0 ? <p className="cw-log-empty">{t.empty}</p> : null}

      <div className="cw-log-groups">
        {groups.map(([day, items]) => (
          <section className="cw-log-day" key={day}>
            <h2>
              <time dateTime={day}>{formatDay(day, lang)}</time>
              <span>{items.length}</span>
            </h2>
            <ol>
              {items.map((item) => (
                <li key={item.sha}>
                  <a href={item.url} target="_blank" rel="noreferrer" className="cw-log-row">
                    <span className="cw-log-time">{formatTime(item.date)}</span>
                    <span className={`cw-log-tag is-${item.category}`}>
                      {categoryLabels[item.category]?.[lang] ?? item.category}
                    </span>
                    <span className="cw-log-title">{renderInline(item.title)}</span>
                    <span className="cw-log-sha">{item.shortSha}</span>
                  </a>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>

      <p className="cw-log-note">
        <GitCommitHorizontal size={12} aria-hidden="true" />
        {t.note}
      </p>

      <div className="cw-log-links">
        <a href={`${links.github}/commits/${data.branch}`} target="_blank" rel="noreferrer" className="cw-btn">
          {t.all}
          <ArrowUpRight size={12} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

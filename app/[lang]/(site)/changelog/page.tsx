import type { Metadata } from 'next';
import { Changelog } from '@/components/changelog';
import { DataFreshness } from '@/components/data-freshness';
import { LangNotFound } from '@/components/lang-not-found';
import { isLang } from '@/lib/i18n';
import { pageMetadata } from '@/lib/seo';

const meta = {
  ru: {
    eyebrow: 'changelog',
    title: 'Журнал разработки',
    description:
      'Коммиты ядра Chunkwake: плагины, редстоун, жители, производительность и API. Лента без пересказов, ссылки на коммиты в GitHub.',
    lead: 'Что меняется в ядре прямо сейчас. Лента собирается из коммитов `ver/26.3` при сборке сайта.',
  },
  en: {
    eyebrow: 'changelog',
    title: 'Development log',
    description:
      'Chunkwake core commits: plugins, redstone, villagers, performance and API. A raw feed with links to the commits on GitHub.',
    lead: 'What changes in the core right now. The feed is built from `ver/26.3` commits when the site is built.',
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const text = meta[lang === 'en' ? 'en' : 'ru'];
  return pageMetadata({
    lang,
    path: '/changelog',
    title: text.title,
    description: text.description,
    type: 'article',
  });
}

export default async function ChangelogPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) return <LangNotFound lang={lang} />;
  const text = meta[lang];

  return (
    <div className="cw-page cw-log-page">
      <header className="cw-page-head">
        <div className="cw-eyebrow">{text.eyebrow}</div>
        <h1>{text.title}</h1>
        <p>{text.lead}</p>
        <DataFreshness lang={lang} />
      </header>
      <Changelog lang={lang} />
    </div>
  );
}

import type { Metadata } from 'next';
import { DataFreshness } from '@/components/data-freshness';
import { LangNotFound } from '@/components/lang-not-found';
import { PluginCompatibility } from '@/components/plugin-compat';
import { isLang } from '@/lib/i18n';
import { pageMetadata } from '@/lib/seo';

const meta = {
  ru: {
    title: 'Совместимость плагинов',
    description:
      'Плагины Paper, проверенные на Chunkwake: BlueMap, LuckPerms, WorldEdit, EssentialsX, Vault, PlaceholderAPI, ViaVersion и Velocity. Версии, результаты и ограничения.',
    eyebrow: 'compatibility',
    heading: 'Совместимость плагинов',
    lead: 'Список плагинов, которые включаются и работают на живом сервере Chunkwake. Версии, дата проверки и известные ограничения — без обещаний «всё поддерживается».',
  },
  en: {
    title: 'Plugin compatibility',
    description:
      'Paper plugins verified on Chunkwake: BlueMap, LuckPerms, WorldEdit, EssentialsX, Vault, PlaceholderAPI, ViaVersion and Velocity. Versions, results and limits.',
    eyebrow: 'compatibility',
    heading: 'Plugin compatibility',
    lead: 'Plugins that enable and work on a live Chunkwake server. Versions, test dates and known limits, without a blanket "everything is supported".',
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const text = meta[lang === 'en' ? 'en' : 'ru'];
  return pageMetadata({
    lang,
    path: '/compatibility',
    title: text.title,
    description: text.description,
  });
}

export default async function CompatibilityPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) return <LangNotFound lang={lang} />;
  const text = meta[lang];

  return (
    <div className="cw-page cw-compat-page">
      <header className="cw-page-head">
        <div className="cw-eyebrow">{text.eyebrow}</div>
        <h1>{text.heading}</h1>
        <p>{text.lead}</p>
        <DataFreshness lang={lang} note />
      </header>
      <PluginCompatibility lang={lang} />
    </div>
  );
}

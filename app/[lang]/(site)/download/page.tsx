import type { Metadata } from 'next';
import { DownloadPanel } from '@/components/download-panel';
import { LangNotFound } from '@/components/lang-not-found';
import { getCopy } from '@/lib/dictionary';
import { isLang } from '@/lib/i18n';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const copy = getCopy(lang);
  return pageMetadata({
    lang,
    path: '/download',
    title: copy.download.title,
    description: copy.download.lead,
  });
}

export default async function DownloadPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) return <LangNotFound lang={lang} />;
  const copy = getCopy(lang);

  return (
    <div className="cw-page">
      <header className="cw-page-head">
        <div className="cw-eyebrow">download</div>
        <h1>{copy.download.title}</h1>
        <p>{copy.download.lead}</p>
      </header>
      <DownloadPanel copy={copy} />
    </div>
  );
}

import type { Metadata } from 'next';
import { LangNotFound } from '@/components/lang-not-found';
import { StatusReport } from '@/components/status-report';
import { isLang } from '@/lib/i18n';
import { statusPageMeta } from '@/lib/milestones';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const text = statusPageMeta[lang === 'en' ? 'en' : 'ru'];
  return pageMetadata({
    lang,
    path: '/status',
    title: text.title,
    description: text.description,
  });
}

export default async function StatusPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) return <LangNotFound lang={lang} />;

  return (
    <div className="cw-page cw-status-page-wrap">
      <StatusReport lang={lang} />
    </div>
  );
}

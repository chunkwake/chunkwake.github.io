import type { Metadata } from 'next';
import { BenchmarkReport } from '@/components/benchmark-report';
import { LangNotFound } from '@/components/lang-not-found';
import { benchmarkPageMeta } from '@/lib/benchmark-meta';
import { isLang } from '@/lib/i18n';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const text = benchmarkPageMeta[lang === 'en' ? 'en' : 'ru'];
  return pageMetadata({
    lang,
    path: '/benchmarks',
    title: text.title,
    description: text.description,
  });
}

export default async function BenchmarksPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) return <LangNotFound lang={lang} />;

  return (
    <div className="cw-page cw-bench-page-wrap">
      <BenchmarkReport lang={lang} />
    </div>
  );
}

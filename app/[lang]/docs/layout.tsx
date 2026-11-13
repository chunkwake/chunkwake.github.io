import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { i18nProvider } from 'fumadocs-ui/i18n';
import { docsOptions, translations } from '@/lib/layout.shared';
import { i18n, isLang } from '@/lib/i18n';
import { LangNotFound } from '@/components/lang-not-found';
import { DocsSearchProvider } from '@/components/docs-search';

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: React.ReactNode;
}) {
  const { lang } = await params;
  if (!isLang(lang)) return <LangNotFound lang={lang} />;

  const locale = lang === 'en' ? 'en' : 'ru';

  return (
    <RootProvider
      i18n={i18nProvider(translations, lang)}
      theme={{ enabled: false }}
      search={{ enabled: false }}
    >
      <DocsSearchProvider lang={locale}>
        <DocsLayout {...docsOptions(lang)} tree={source.getPageTree(lang)}>
          {children}
        </DocsLayout>
      </DocsSearchProvider>
    </RootProvider>
  );
}

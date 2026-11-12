import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { i18nProvider } from 'fumadocs-ui/i18n';
import { docsOptions, translations } from '@/lib/layout.shared';
import { i18n, isLang } from '@/lib/i18n';
import { LangNotFound } from '@/components/lang-not-found';
import LazySearchDialog from '@/components/lazy-search-dialog';

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: React.ReactNode;
}) {
  const { lang } = await params;
  if (!isLang(lang)) return <LangNotFound lang={lang} />;

  return (
    <RootProvider
      i18n={i18nProvider(translations, lang)}
      theme={{ enabled: false }}
      search={{ enabled: true, SearchDialog: LazySearchDialog }}
    >
      <DocsLayout {...docsOptions(lang)} tree={source.getPageTree(lang)}>
        {children}
      </DocsLayout>
    </RootProvider>
  );
}

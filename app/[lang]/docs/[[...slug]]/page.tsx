import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { source } from '@/lib/source';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import { DocsActions } from '@/components/docs-actions';
import { getMDXComponents } from '@/components/mdx';
import { LangNotFound } from '@/components/lang-not-found';
import { isLang } from '@/lib/i18n';
import { pageMetadata } from '@/lib/seo';
import { docsRoute } from '@/lib/shared';
import docsMeta from '@/content/data/docs-meta.json';

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; slug?: string[] }>;
}) {
  const { lang, slug } = await params;
  if (!isLang(lang)) return <LangNotFound lang={lang} />;
  const page = source.getPage(slug, lang);
  if (!page) notFound();

  const MDX = page.data.body;
  const file = `content/docs/${page.slugs.length > 0 ? page.slugs.join('/') : 'index'}${
    lang === 'en' ? '.en' : ''
  }.mdx`;
  const updated = (docsMeta as { updated: Record<string, string> }).updated[file];

  return (
    <DocsPage toc={page.data.toc}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsActions lang={lang} file={file} updated={updated} />
      <DocsBody>
        <MDX components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug?: string[] }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLang(lang)) return { title: '404' };
  const page = source.getPage(slug, lang);
  if (!page) notFound();

  const path = page.slugs.length > 0 ? `${docsRoute}/${page.slugs.join('/')}` : docsRoute;

  return pageMetadata({
    lang,
    path,
    title: page.data.title,
    description: page.data.description,
    image: lang === 'en' ? '/og-docs-en.png' : '/og-docs-ru.png',
    type: 'article',
  });
}

import { source } from '@/lib/source';
import { getStaticSearchPages } from '@/lib/search-pages';
import { createFromSource } from 'fumadocs-core/search/server';

export const dynamic = 'force-static';

const searchSource: any = Object.create(source);
searchSource.getPages = () => [...source.getPages(), ...getStaticSearchPages()];

async function buildSearchIndex(page: any) {
  let structuredData = page.data.structuredData;

  if (typeof structuredData === 'function') {
    structuredData = await structuredData();
  } else if (!structuredData && typeof page.data.load === 'function') {
    structuredData = (await page.data.load()).structuredData;
  }

  return {
    title: page.data.title ?? page.url,
    description: page.data.description,
    url: page.url,
    id: page.url,
    structuredData: structuredData ?? { headings: [], contents: [] },
    ...(page.data.searchBreadcrumbs ? { breadcrumbs: page.data.searchBreadcrumbs } : {}),
  };
}

export const { staticGET: GET } = createFromSource(searchSource, {
  buildIndex: buildSearchIndex,
});

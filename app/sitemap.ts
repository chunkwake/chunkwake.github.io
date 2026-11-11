import type { MetadataRoute } from 'next';

const base = 'https://chunkwake.github.io';
const paths = [
  '',
  '/docs',
  '/docs/getting-started',
  '/docs/faq',
  '/docs/migrating',
  '/docs/feature-matrix',
  '/docs/plugins',
  '/docs/architecture',
  '/download',
  '/support',
];

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return ['ru', 'en'].flatMap((lang) =>
    paths.map((path) => ({
      url: `${base}/${lang}${path}`,
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1 : 0.7,
    })),
  );
}

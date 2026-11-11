import { createGetUrl } from 'fumadocs-core/source';

export const appName = 'Chunkwake';
export const appVersion = '0.1.0';
export const mcVersion = '26.3';
export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';
export const docsContentRoute = '/llms.mdx/docs';

export const gitConfig = {
  user: 'chunkwake',
  repo: 'core',
  siteRepo: 'chunkwake.github.io',
  branch: 'ver/26.3',
};

export const links = {
  github: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  issues: `https://github.com/${gitConfig.user}/${gitConfig.repo}/issues`,
  actions: `https://github.com/${gitConfig.user}/${gitConfig.repo}/actions`,
  releases: `https://github.com/${gitConfig.user}/${gitConfig.repo}/releases`,
  siteRepo: `https://github.com/${gitConfig.user}/${gitConfig.siteRepo}`,
  license: `https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/LICENSE`,
  featureMatrix: `https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/docs/feature-matrix.md`,
  perf: `https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/docs/perf.md`,
  architecture: `https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/ARCHITECTURE.md`,
  contributing: `https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/CONTRIBUTING.md`,
  java: 'https://adoptium.net/',
  paperApi: 'https://jd.papermc.io/paper/26.3/',
};

const getContentUrl = createGetUrl(docsContentRoute);

export function getPageMarkdownUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'content.md'];
  return { segments, url: getContentUrl(segments, page.locale) };
}

const getImageUrl = createGetUrl(docsImageRoute);

export function getPageImageUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'image.png'];
  return { segments, url: getImageUrl(segments, page.locale) };
}

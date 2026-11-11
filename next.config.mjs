import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

const isDev = process.env.NODE_ENV === 'development';

/** @type {import('next').NextConfig} */
const config = {
  // Static export is required for GitHub Pages. In dev we let Next render
  // dynamic params normally, so unknown locales produce our 404 instead of
  // a static-export error.
  ...(isDev ? {} : { output: 'export' }),
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  turbopack: {
    root: import.meta.dirname,
  },
};

export default withMDX(config);

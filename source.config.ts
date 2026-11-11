import { defineConfig } from 'fumadocs-mdx/config';
import { chunkwakeTheme } from './lib/code-theme';

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      themes: {
        light: chunkwakeTheme,
        dark: chunkwakeTheme,
      },
    },
  },
});

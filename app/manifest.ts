import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'Chunkwake — сервер Minecraft на Rust',
    short_name: 'Chunkwake',
    description:
      'Серверное ядро Minecraft 26.3 на Rust: ванильное поведение и плагины Paper/Folia в одном бинарнике.',
    start_url: '/ru/',
    scope: '/',
    display: 'standalone',
    background_color: '#181818',
    theme_color: '#181818',
    lang: 'ru',
    categories: ['games', 'developer'],
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}

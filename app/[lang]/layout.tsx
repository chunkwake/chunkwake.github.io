import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { i18nProvider } from 'fumadocs-ui/i18n';
import { translations } from '@/lib/layout.shared';
import { i18n } from '@/lib/i18n';
import { getCopy } from '@/lib/dictionary';
import '@xyflow/react/dist/style.css';
import '../global.css';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-mono',
  display: 'swap',
});

export const dynamicParams = false;

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const copy = getCopy(lang);

  return {
    metadataBase: new URL('https://chunkwake.github.io'),
    title: {
      default: copy.meta.title,
      template: '%s — Chunkwake',
    },
    description: copy.meta.description,
    alternates: {
      canonical: `/${lang}`,
      languages: {
        ru: '/ru',
        en: '/en',
      },
    },
    icons: {
      icon: '/favicon.svg',
    },
    openGraph: {
      type: 'website',
      siteName: 'Chunkwake',
      title: copy.meta.title,
      description: copy.meta.description,
      locale: lang === 'en' ? 'en_US' : 'ru_RU',
      url: `/${lang}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: copy.meta.title,
      description: copy.meta.description,
    },
  };
}

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: React.ReactNode;
}) {
  const { lang } = await params;

  return (
    <html
      lang={lang}
      className={`${inter.variable} ${mono.variable} dark`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="cw-body">
        <RootProvider
          i18n={i18nProvider(translations, lang)}
          theme={{ enabled: false }}
          search={{ enabled: true }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}

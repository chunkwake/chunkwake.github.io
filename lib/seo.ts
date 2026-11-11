import type { Metadata } from 'next';
import type { Lang } from './i18n';

export const siteUrl = 'https://chunkwake.github.io';

export function pageMetadata({
  lang,
  path,
  title,
  description,
  image,
  type = 'website',
}: {
  lang: string;
  path: string;
  title: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
}): Metadata {
  const isEn = lang === 'en';
  const url = `${siteUrl}/${lang}${path}`;
  const ruUrl = `${siteUrl}/ru${path}`;
  const enUrl = `${siteUrl}/en${path}`;
  const ogImage = image ?? (isEn ? '/og-en.png' : '/og-ru.png');

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ru: ruUrl,
        en: enUrl,
        'x-default': ruUrl,
      },
    },
    openGraph: {
      type,
      url,
      siteName: 'Chunkwake',
      title,
      description,
      locale: isEn ? 'en_US' : 'ru_RU',
      alternateLocale: isEn ? 'ru_RU' : 'en_US',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function LocaleSwitch({ lang }: { lang: string }) {
  const pathname = usePathname() || `/${lang}`;
  const other = lang === 'en' ? 'ru' : 'en';
  const target = pathname.replace(/^\/(ru|en)(?=\/|$)/, `/${other}`) || `/${other}`;

  return (
    <div className="cw-locale" role="group" aria-label="Language">
      <Link
        href={lang === 'ru' ? pathname : target}
        className={lang === 'ru' ? 'is-active' : ''}
        aria-current={lang === 'ru' ? 'true' : undefined}
      >
        RU
      </Link>
      <span aria-hidden="true">/</span>
      <Link
        href={lang === 'en' ? pathname : target}
        className={lang === 'en' ? 'is-active' : ''}
        aria-current={lang === 'en' ? 'true' : undefined}
      >
        EN
      </Link>
    </div>
  );
}

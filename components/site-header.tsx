import Link from 'next/link';
import { Logo } from './logo';
import { LocaleSwitch } from './locale-switch';
import type { SiteCopy } from '@/lib/dictionary';
import { links } from '@/lib/shared';

export function SiteHeader({ lang, copy }: { lang: string; copy: SiteCopy }) {
  return (
    <header className="cw-header">
      <div className="cw-header-inner">
        <Link href={`/${lang}`} className="cw-brand" aria-label="Chunkwake home">
          <Logo />
        </Link>

        <nav className="cw-nav" aria-label={copy.nav.menu}>
          <Link href={`/${lang}/docs`}>{copy.nav.docs}</Link>
          <Link href={`/${lang}/docs/migrating`}>{copy.nav.migration}</Link>
          <Link href={`/${lang}/docs/plugins`}>{copy.nav.plugins}</Link>
          <Link href={`/${lang}/download`}>{copy.nav.download}</Link>
          <a href={links.github} target="_blank" rel="noreferrer">
            {copy.nav.github}
            <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">
              <path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="1.7" />
            </svg>
          </a>
        </nav>

        <div className="cw-header-side">
          <span className="cw-stage" title="Early stage">
            <span className="cw-stage-dot" />
            early
          </span>
          <LocaleSwitch lang={lang} />
          <a className="cw-icon-link" href={links.github} target="_blank" rel="noreferrer" aria-label="GitHub">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 2C6.48 2 2 6.58 2 12.26c0 4.53 2.87 8.37 6.84 9.73.5.09.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.36 9.36 0 0 1 12 6.84c.85 0 1.71.12 2.51.35 1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.49A10.27 10.27 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z"
              />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}

'use client';

import dynamic from 'next/dynamic';
import { useCallback, useState } from 'react';
import { useSearchHotkeys } from '@/lib/use-search-hotkeys';

const SiteSearchRuntime = dynamic(() => import('./site-search-runtime'), {
  ssr: false,
});

export function SiteSearch({ lang, label }: { lang: string; label: string }) {
  const [open, setOpen] = useState(false);
  const openSearch = useCallback(() => setOpen(true), []);
  const closeSearch = useCallback(() => setOpen(false), []);

  useSearchHotkeys(openSearch, !open);

  return (
    <>
      <button
        type="button"
        className="cw-search-trigger"
        onClick={openSearch}
        aria-label={label}
        aria-keyshortcuts="/ Control+K Meta+K"
        title={`${label} (/)`}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
          <path d="m20 20-4.2-4.2" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
        <kbd className="cw-search-kbd">/</kbd>
      </button>
      {open ? <SiteSearchRuntime lang={lang} onClose={closeSearch} /> : null}
    </>
  );
}

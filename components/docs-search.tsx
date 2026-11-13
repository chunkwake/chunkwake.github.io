'use client';

import dynamic from 'next/dynamic';
import { createContext, useCallback, useContext, useState } from 'react';
import { useSearchHotkeys } from '@/lib/use-search-hotkeys';

const SearchDialog = dynamic(() => import('./search-dialog'), {
  ssr: false,
});

type SearchContextValue = {
  open: () => void;
  lang: 'ru' | 'en';
};

const SearchContext = createContext<SearchContextValue | null>(null);

export function DocsSearchProvider({
  lang,
  children,
}: {
  lang: 'ru' | 'en';
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const openSearch = useCallback(() => setOpen(true), []);

  useSearchHotkeys(openSearch, !open);

  return (
    <SearchContext.Provider value={{ open: openSearch, lang }}>
      {children}
      {open ? <SearchDialog open onOpenChange={setOpen} lang={lang} /> : null}
    </SearchContext.Provider>
  );
}

export function DocsSearchTrigger({ full = false }: { full?: boolean }) {
  const context = useContext(SearchContext);
  const label = context?.lang === 'en' ? 'Search' : 'Поиск';

  return (
    <button
      type="button"
      className={`cw-search-trigger${full ? ' cw-search-trigger-full' : ''}`}
      onClick={() => context?.open()}
      aria-label={label}
      aria-keyshortcuts="/ Control+K Meta+K"
      title={`${label} (/)`}
    >
      <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
        <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <path d="m20 20-4.2-4.2" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
      {full ? <span className="cw-search-trigger-label">{label}</span> : null}
      <kbd className="cw-search-kbd">/</kbd>
    </button>
  );
}

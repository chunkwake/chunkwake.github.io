'use client';

import { useCallback } from 'react';
import { useSearchContext } from 'fumadocs-ui/contexts/search';
import { useSearchHotkeys } from '@/lib/use-search-hotkeys';

export function DocsSearchHotkeys() {
  const { open, setOpenSearch } = useSearchContext();
  const openSearch = useCallback(() => setOpenSearch(true), [setOpenSearch]);

  useSearchHotkeys(openSearch, !open);

  return null;
}

'use client';

import { useEffect, useRef } from 'react';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { i18nProvider } from 'fumadocs-ui/i18n';
import { useSearchContext } from 'fumadocs-ui/contexts/search';
import { translations } from '@/lib/layout.shared';
import LazySearchDialog from './lazy-search-dialog';

function OpenSearch({ onClose }: { onClose: () => void }) {
  const { open, setOpenSearch } = useSearchContext();
  const hasOpened = useRef(false);

  useEffect(() => {
    setOpenSearch(true);
  }, [setOpenSearch]);

  useEffect(() => {
    if (open) {
      hasOpened.current = true;
      return;
    }
    if (hasOpened.current) onClose();
  }, [open, onClose]);

  return null;
}

/**
 * The provider is mounted only while the dialog is open. Search on marketing
 * pages therefore costs nothing until someone actually presses the trigger.
 */
export default function SiteSearchRuntime({ lang, onClose }: { lang: string; onClose: () => void }) {
  return (
    <RootProvider
      i18n={i18nProvider(translations, lang)}
      theme={{ enabled: false }}
      search={{
        enabled: true,
        SearchDialog: LazySearchDialog,
        hotKey: [{ key: () => false, display: '/' }],
      }}
    >
      <OpenSearch onClose={onClose} />
    </RootProvider>
  );
}

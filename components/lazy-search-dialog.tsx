'use client';

import dynamic from 'next/dynamic';
import type { SharedProps } from 'fumadocs-ui/components/dialog/search';

const SearchDialog = dynamic(() => import('./search'), {
  ssr: false,
});

export default function LazySearchDialog(props: SharedProps) {
  return <SearchDialog {...props} />;
}

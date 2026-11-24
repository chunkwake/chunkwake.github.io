'use client';

import { LazyArchitectureFlow } from './lazy-architecture-flow';
import { copy } from '@/lib/dictionary';

export function DocsArchitecture({ lang }: { lang: 'ru' | 'en' }) {
  const c = copy[lang].architecture;

  return (
    <div className="cw-arch-docs">
      <div className="cw-window cw-diagram-window">
        <div className="cw-window-bar">
          <span className="cw-window-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="cw-window-title">runtime graph</span>
          <span className="cw-window-lang">{c.hoverHint}</span>
        </div>
        <LazyArchitectureFlow nodes={c.nodes} />
        <div className="cw-flow-note">{c.footnote}</div>
      </div>
    </div>
  );
}

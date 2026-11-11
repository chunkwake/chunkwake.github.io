'use client';

import { useState } from 'react';
import { LangIcon } from './lang-icon';

export type CodeTab = {
  id: string;
  label: string;
  html: string;
  icon?: 'java' | 'kotlin';
};

export function CodeTabs({ tabs, badge }: { tabs: CodeTab[]; badge?: string }) {
  const [active, setActive] = useState(tabs[0]?.id);

  return (
    <div className="cw-window cw-code-tabs">
      <div className="cw-window-bar">
        <span className="cw-window-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>

        <div className="cw-code-tabs-list" role="tablist" aria-label="Language">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active === tab.id}
              className={`cw-code-tab${active === tab.id ? ' is-active' : ''}`}
              onClick={() => setActive(tab.id)}
            >
              {tab.icon ? <LangIcon lang={tab.icon} /> : null}
              {tab.label}
            </button>
          ))}
        </div>

        {badge ? <span className="cw-window-lang">{badge}</span> : null}
      </div>

      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          hidden={active !== tab.id}
          className="cw-shiki cw-code-panel"
          dangerouslySetInnerHTML={{ __html: tab.html }}
        />
      ))}
    </div>
  );
}

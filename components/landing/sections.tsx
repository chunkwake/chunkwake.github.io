import Link from 'next/link';
import { CommandLine } from '@/components/command-line';
import { CodeBlock } from '@/components/code-block';
import { CodeTabsServer } from '@/components/code-tabs-server';
import { LazyArchitectureFlow } from '@/components/lazy-architecture-flow';
import type { SiteCopy } from '@/lib/dictionary';
import { featureMatrix } from '@/lib/feature-matrix';
import { links } from '@/lib/shared';

type Status = 'ready' | 'partial' | 'none';

function Dot({ status }: { status: Status }) {
  return <span className={`cw-dot cw-dot-${status}`} aria-hidden="true" />;
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="cw-eyebrow">{children}</div>;
}

export function CompatibilitySection({ copy }: { copy: SiteCopy }) {
  return (
    <section className="cw-section" data-reveal>
      <div className="cw-split-head">
        <div>
          <Eyebrow>{copy.compat.eyebrow}</Eyebrow>
          <h2>{copy.compat.title}</h2>
        </div>
        <p>{copy.compat.lead}</p>
      </div>

      <div className="cw-table-wrap">
        <table className="cw-table">
          <thead>
            <tr>
              <th>{copy.compat.head[0]}</th>
              <th>{copy.compat.head[1]}</th>
              <th>{copy.compat.head[2]}</th>
            </tr>
          </thead>
          <tbody>
            {copy.compat.rows.map((row) => (
              <tr key={row.name} className={row.name === 'Chunkwake' ? 'is-current' : undefined}>
                <td>
                  <span className="cw-table-name">{row.name}</span>
                  {row.name === 'Chunkwake' ? <span className="cw-table-tag">this</span> : null}
                </td>
                <td>
                  <span className="cw-cell-status">
                    <Dot status={row.plugins.status} />
                    {row.plugins.label}
                  </span>
                </td>
                <td>
                  <span className="cw-cell-status">
                    <Dot status={row.threads.status} />
                    {row.threads.label}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="cw-fine">{copy.compat.note}</p>
    </section>
  );
}

export function FeaturesSection({ lang, copy }: { lang: string; copy: SiteCopy }) {
  const totals = featureMatrix.totals;
  const summary =
    lang === 'en'
      ? `Full feature matrix: ${totals.ready} ready · ${totals.partial} partial · ${totals.missing} not started.`
      : `Полная фич-матрица: ${totals.ready} готово · ${totals.partial} частично · ${totals.missing} не начато.`;

  return (
    <section className="cw-section" data-reveal>
      <div className="cw-split-head">
        <div>
          <Eyebrow>{copy.features.eyebrow}</Eyebrow>
          <h2>{copy.features.title}</h2>
        </div>
        <p>{copy.features.lead}</p>
      </div>

      <div className="cw-feature-grid">
        {copy.features.columns.map((column) => (
          <div className="cw-feature" key={column.title}>
            <div className="cw-feature-head">
              <span className="cw-feature-kicker">{column.kicker}</span>
              <h3>{column.title}</h3>
            </div>
            <ul>
              {column.items.map((item) => (
                <li key={item.label}>
                  <Dot status={item.status} />
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="cw-feature-foot">
        <span>{summary}</span>
        <Link href={`/${lang}/docs/feature-matrix`}>
          {lang === 'en' ? 'Open matrix' : 'Открыть матрицу'}
          <span aria-hidden="true"> →</span>
        </Link>
      </div>
    </section>
  );
}

export async function PluginsSection({ lang, copy }: { lang: string; copy: SiteCopy }) {
  return (
    <section className="cw-section cw-plugins" data-reveal>
      <div className="cw-split-head">
        <div>
          <Eyebrow>{copy.plugins.eyebrow}</Eyebrow>
          <h2>{copy.plugins.title}</h2>
        </div>
        <p>{copy.plugins.lead}</p>
      </div>

      <div className="cw-plugins-grid">
        <div className="cw-plugin-copy">
          <ul className="cw-bullets">
            {copy.plugins.bullets.map((item) => (
              <li key={item}>
                <span className="cw-bullet-mark" aria-hidden="true">
                  +
                </span>
                {item}
              </li>
            ))}
          </ul>
          <p className="cw-fine">{copy.plugins.note}</p>
          <div className="cw-plugin-actions">
            <Link className="cw-btn cw-btn-primary" href={`/${lang}/docs/plugins`}>
              {copy.nav.plugins}
              <span aria-hidden="true">→</span>
            </Link>
            <a className="cw-btn" href={links.paperApi} target="_blank" rel="noreferrer">
              paper-api
            </a>
          </div>
        </div>

        <div className="cw-code-stack">
          <CodeTabsServer
            badge=".java / .kt"
            tabs={[
              { id: 'java', label: 'Java', code: copy.plugins.code, lang: 'java', icon: 'java' },
              { id: 'kotlin', label: 'Kotlin', code: copy.plugins.codeKotlin, lang: 'kotlin', icon: 'kotlin' },
            ]}
          />
          <CodeBlock
            code={copy.plugins.file}
            lang="yaml"
            title="plugin.yml"
            badge="yaml"
            className="cw-window-small"
          />
        </div>
      </div>
    </section>
  );
}

export async function ArchitectureSection({ copy }: { copy: SiteCopy }) {
  return (
    <section className="cw-section cw-architecture" data-reveal>
      <div className="cw-split-head">
        <div>
          <Eyebrow>{copy.architecture.eyebrow}</Eyebrow>
          <h2>{copy.architecture.title}</h2>
        </div>
        <p>{copy.architecture.lead}</p>
      </div>

      <div className="cw-arch-grid">
        <CodeBlock code={copy.architecture.tree} lang="text" title="workspace" badge="tree" />

        <div className="cw-window cw-diagram-window">
          <div className="cw-window-bar">
            <span className="cw-window-dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className="cw-window-title">runtime graph</span>
            <span className="cw-window-lang">{copy.architecture.hoverHint}</span>
          </div>
          <LazyArchitectureFlow nodes={copy.architecture.nodes} />
          <div className="cw-flow-note">{copy.architecture.footnote}</div>
        </div>
      </div>
    </section>
  );
}

export function RoadmapSection({ lang, copy }: { lang: string; copy: SiteCopy }) {
  return (
    <section className="cw-section" data-reveal>
      <div className="cw-split-head">
        <div>
          <Eyebrow>{copy.roadmap.eyebrow}</Eyebrow>
          <h2>{copy.roadmap.title}</h2>
        </div>
        <p>{copy.roadmap.lead}</p>
      </div>

      <div className="cw-roadmap-grid">
        {copy.roadmap.items.map((item, index) => (
          <div className="cw-roadmap-item" key={item.title}>
            <div className="cw-roadmap-top">
              <span className="cw-roadmap-index">{String(index + 1).padStart(2, '0')}</span>
              <span className="cw-roadmap-tag">{item.tag}</span>
            </div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        ))}
      </div>

      <Link className="cw-roadmap-more" href={`/${lang}/status`}>
        {copy.roadmap.more} <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}

export function CtaSection({ lang, copy }: { lang: string; copy: SiteCopy }) {
  return (
    <section className="cw-section cw-cta" data-reveal>
      <div className="cw-cta-inner">
        <div>
          <h2>{copy.cta.title}</h2>
          <p>{copy.cta.lead}</p>
          <div className="cw-hero-actions">
            <Link className="cw-btn cw-btn-primary" href={`/${lang}/docs`}>
              {copy.cta.docs}
              <span aria-hidden="true">→</span>
            </Link>
            <Link className="cw-btn" href={`/${lang}/download`}>
              {copy.cta.download}
            </Link>
          </div>
        </div>
        <CommandLine command={copy.cta.command}  />
      </div>
    </section>
  );
}

import Link from 'next/link';
import { CommandLine } from '@/components/command-line';
import { featureMatrix } from '@/lib/feature-matrix';
import type { SiteCopy } from '@/lib/dictionary';

export function Hero({ lang, copy }: { lang: string; copy: SiteCopy }) {
  const totals = featureMatrix.totals;
  const badge =
    lang === 'en'
      ? `Early stage · ${totals.ready} mechanics ready · ${totals.partial} partial`
      : `Ранняя стадия · ${totals.ready} механик готово · ${totals.partial} частично`;

  return (
    <section className="cw-hero">
      <div className="cw-hero-grid" aria-hidden="true" />
      <div className="cw-hero-inner">
        <div className="cw-hero-copy">
          <div className="cw-badge">
            <span className="cw-badge-dot" />
            {badge}
          </div>

          <h1 className="cw-hero-title">
            {copy.hero.title}
            <br />
            <span className="cw-accent">{copy.hero.titleAccent}</span>{' '}
            {copy.hero.titleTail}
          </h1>

          <p className="cw-hero-lead">{copy.hero.lead}</p>

          <CommandLine command={copy.hero.command}  />

          <div className="cw-hero-actions">
            <Link className="cw-btn cw-btn-primary" href={`/${lang}/docs/getting-started`}>
              {copy.hero.primary}
              <span aria-hidden="true">→</span>
            </Link>
            <Link className="cw-btn" href={`/${lang}/download`}>
              {copy.hero.secondary}
            </Link>
          </div>

          <p className="cw-hero-platforms">{copy.hero.platforms}</p>
        </div>

        <div className="cw-hero-visual">
          <div className="cw-window">
            <div className="cw-window-bar">
              <span className="cw-window-dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span className="cw-window-title">{copy.terminal.title}</span>
              <span className="cw-window-path">~/server</span>
            </div>

            <div className="cw-window-body">
              {copy.terminal.lines.map((line, index) => (
                <div
                  key={index}
                  className={`cw-term-line cw-term-${line.kind}`}
                  style={{ animationDelay: `${0.35 + index * 0.1}s` }}
                >
                  {line.kind === 'prompt' ? <span className="cw-term-prompt">$</span> : null}
                  <span>{line.text}</span>
                </div>
              ))}
              <div className="cw-term-cursor" aria-hidden="true">
                <span />
              </div>
            </div>

            <div className="cw-window-foot">
              <span className="cw-term-ok">●</span>
              {copy.terminal.footer}
            </div>
          </div>

          <div className="cw-hero-side" aria-hidden="true">
            <div className="cw-side-row">
              <span className="cw-side-key">engine</span>
              <span className="cw-side-val">rust · tokio</span>
            </div>
            <div className="cw-side-row">
              <span className="cw-side-key">plugins</span>
              <span className="cw-side-val">paper-api 26.3</span>
            </div>
            <div className="cw-side-row">
              <span className="cw-side-key">tick</span>
              <span className="cw-side-val">0.4–0.5 ms</span>
            </div>
            <div className="cw-side-row">
              <span className="cw-side-key">binary</span>
              <span className="cw-side-val">~40 MB</span>
            </div>
            <div className="cw-side-meter">
              <span style={{ width: '72%' }} />
            </div>
            <div className="cw-side-caption">vanilla data embedded</div>
          </div>
        </div>
      </div>
    </section>
  );
}

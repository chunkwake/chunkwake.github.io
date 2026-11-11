import Link from 'next/link';
import { ArrowUpRight, CircleDot, Compass, Flag } from 'lucide-react';
import { featureMatrix } from '@/lib/feature-matrix';
import type { Lang } from '@/lib/i18n';
import {
  researchTracks,
  stageCountsM5,
  stageCountsM7,
  stateLabels,
  statusPageMeta,
  milestones,
} from '@/lib/milestones';
import { links } from '@/lib/shared';

type LangKey = 'ru' | 'en';

const ui = {
  ru: {
    eyebrow: 'Статус',
    title: 'Этапы и текущий фокус',
    lead: 'Публичный план Chunkwake. Прогресс берётся из фич-матрицы, а формулировки этапов — из `docs/milestones.md` в core.',
    focus: 'Сейчас в фокусе',
    focusText: (partial: number, missing: number) =>
      `Генерация, редстоун и оставшаяся ваниль закрываются итеративно. ${missing} механик ещё не начаты, ${partial} — частично.`,
    totals: 'По всей матрице',
    ready: 'готово',
    partial: 'частично',
    missing: 'не начато',
    timeline: 'Этапы',
    research: 'Исследовательские направления',
    researchNote: 'Эти направления не входят в текущий релизный путь, но заложены в архитектуру.',
    read: 'Как читать страницу',
    readText:
      '«Пройдено» означает, что фундамент этапа есть в коде. «Развивается» и «текущий фокус» — механики ещё добавляются. «Дальше» и «план» — работа не начата. Даты не обещаются: готовность важнее календаря.',
    source: 'Источник',
    sourceText: 'Этапы и приоритеты: `docs/milestones.md`. Цифры: фич-матрица, обновлена',
    matrix: 'Открыть фич-матрицу',
    commands: 'Справочник команд',
    observability: 'Наблюдаемость',
    rows: 'строк',
  },
  en: {
    eyebrow: 'Status',
    title: 'Milestones and current focus',
    lead: 'The public Chunkwake plan. Progress comes from the feature matrix; milestone wording comes from `docs/milestones.md` in core.',
    focus: 'Current focus',
    focusText: (partial: number, missing: number) =>
      `Generation, redstone and the rest of vanilla are being closed iteratively. ${missing} mechanics are not started, ${partial} are partial.`,
    totals: 'Across the matrix',
    ready: 'ready',
    partial: 'partial',
    missing: 'not started',
    timeline: 'Milestones',
    research: 'Research tracks',
    researchNote: 'These are not on the current release path, but the architecture leaves room for them.',
    read: 'How to read this page',
    readText:
      '"Complete" means the foundation of the stage exists in code. "Active" and "current focus" mean mechanics are still being added. "Next" and "planned" mean work has not started. No dates are promised: readiness beats the calendar.',
    source: 'Source',
    sourceText: 'Stages and priorities: `docs/milestones.md`. Numbers: feature matrix, updated',
    matrix: 'Open the feature matrix',
    commands: 'Command reference',
    observability: 'Observability',
    rows: 'rows',
  },
} as const;

function renderInline(value: string) {
  return value.split(/(`[^`]+`)/g).map((part, index) =>
    part.startsWith('`') && part.endsWith('`') && part.length > 2 ? (
      <code key={index}>{part.slice(1, -1)}</code>
    ) : (
      <span key={index}>{part}</span>
    ),
  );
}

function StageCounts({
  counts,
  lang,
}: {
  counts: { total: number; ready: number; partial: number; missing: number };
  lang: LangKey;
}) {
  const t = ui[lang];
  return (
    <div className="cw-status-counts">
      <span>
        <strong>{counts.total}</strong> {t.rows}
      </span>
      <span className="is-ready">
        <strong>{counts.ready}</strong> {t.ready}
      </span>
      <span className="is-partial">
        <strong>{counts.partial}</strong> {t.partial}
      </span>
      <span className="is-missing">
        <strong>{counts.missing}</strong> {t.missing}
      </span>
    </div>
  );
}

export function StatusReport({ lang }: { lang: string }) {
  const locale: LangKey = lang === 'en' ? 'en' : 'ru';
  const t = ui[locale];
  const meta = statusPageMeta[locale];
  const totals = featureMatrix.totals;

  return (
    <div className="cw-status-page">
      <header className="cw-status-hero">
        <div className="cw-eyebrow">{t.eyebrow}</div>
        <h1>{meta.title}</h1>
        <p>{meta.description}</p>
      </header>

      <div className="cw-status-summary">
        <div className="cw-status-summary-main">
          <span className="cw-status-summary-label">{t.focus}</span>
          <strong>M7</strong>
          <p>{t.focusText(stageCountsM7.partial, stageCountsM7.missing)}</p>
        </div>
        <div className="cw-status-summary-grid">
          <div className="cw-status-summary-stat">
            <span>{t.totals}</span>
            <strong>{totals.total}</strong>
          </div>
          <div className="cw-status-summary-stat is-ready">
            <span>{t.ready}</span>
            <strong>{totals.ready}</strong>
          </div>
          <div className="cw-status-summary-stat is-partial">
            <span>{t.partial}</span>
            <strong>{totals.partial}</strong>
          </div>
          <div className="cw-status-summary-stat is-missing">
            <span>{t.missing}</span>
            <strong>{totals.missing}</strong>
          </div>
        </div>
      </div>

      <section className="cw-status-section">
        <div className="cw-status-section-head">
          <div>
            <h2>{t.timeline}</h2>
          </div>
          <Compass size={18} aria-hidden="true" />
        </div>

        <ol className="cw-status-timeline">
          {milestones.map((milestone) => (
            <li className={`cw-status-item state-${milestone.state}`} key={milestone.id}>
              <div className="cw-status-marker">
                <span>{milestone.id}</span>
              </div>
              <div className="cw-status-body">
                <div className="cw-status-head">
                  <h3>{milestone.title[locale]}</h3>
                  <span className={`cw-status-badge state-${milestone.state}`}>
                    {stateLabels[milestone.state][locale]}
                  </span>
                </div>
                <p>{renderInline(milestone.summary[locale])}</p>
                {milestone.id === 'M5' ? <StageCounts counts={stageCountsM5} lang={locale} /> : null}
                {milestone.id === 'M7' ? (
                  <>
                    <StageCounts counts={stageCountsM7} lang={locale} />
                    <Link className="cw-status-inline-link" href={`/${locale}/docs/feature-matrix`}>
                      {t.matrix} <ArrowUpRight size={12} aria-hidden="true" />
                    </Link>
                  </>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="cw-status-section">
        <div className="cw-status-section-head">
          <div>
            <h2>{t.research}</h2>
            <p>{t.researchNote}</p>
          </div>
          <CircleDot size={18} aria-hidden="true" />
        </div>
        <div className="cw-status-research">
          {researchTracks.map((track) => (
            <div className="cw-status-research-card" key={track.id}>
              <div className="cw-status-research-top">
                <span>{track.id}</span>
                <span className={`cw-status-badge state-${track.state}`}>
                  {stateLabels[track.state][locale]}
                </span>
              </div>
              <h3>{track.title[locale]}</h3>
              <p>{renderInline(track.summary[locale])}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cw-status-note">
        <div>
          <h2>{t.read}</h2>
          <p>{t.readText}</p>
        </div>
        <Flag size={18} aria-hidden="true" />
      </section>

      <div className="cw-status-links">
        <a href={links.featureMatrix} target="_blank" rel="noreferrer">
          {t.sourceText} {featureMatrix.fetchedAt.slice(0, 10)} <ArrowUpRight size={12} aria-hidden="true" />
        </a>
        <a
          href="https://github.com/chunkwake/core/blob/ver/26.3/docs/milestones.md"
          target="_blank"
          rel="noreferrer"
        >
          docs/milestones.md <ArrowUpRight size={12} aria-hidden="true" />
        </a>
        <Link href={`/${locale}/docs/commands`}>{t.commands}</Link>
        <Link href={`/${locale}/docs/observability`}>{t.observability}</Link>
      </div>
    </div>
  );
}

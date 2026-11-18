import { coreCommitUrl, coreSource, formatCoreDate } from '@/lib/core-source';
import type { Lang } from '@/lib/i18n';

const ui = {
  ru: {
    label: 'Данные из core',
    branch: coreSource.branch,
    note: 'Матрица, команды и релизы обновляются автоматически.',
    title: 'Снимок ветки core, из которого собран сайт',
  },
  en: {
    label: 'Core data',
    branch: coreSource.branch,
    note: 'Matrix, commands and releases refresh automatically.',
    title: 'Snapshot of the core branch this site was built from',
  },
} as const;

export function DataFreshness({
  lang,
  note = false,
  className = '',
}: {
  lang: Lang;
  note?: boolean;
  className?: string;
}) {
  const t = ui[lang];
  const short = coreSource.coreSha.slice(0, 8);

  return (
    <p className={`cw-freshness${className ? ` ${className}` : ''}`} title={t.title}>
      <span className="cw-freshness-dot" aria-hidden="true" />
      <span className="cw-freshness-label">{t.label}</span>
      <a href={coreCommitUrl()} target="_blank" rel="noreferrer" className="cw-freshness-sha">
        {short}
      </a>
      <span className="cw-freshness-branch">{t.branch}</span>
      <span className="cw-freshness-sep" aria-hidden="true">
        ·
      </span>
      <time dateTime={coreSource.fetchedAt}>{formatCoreDate(lang)}</time>
      {note ? <span className="cw-freshness-note">{t.note}</span> : null}
    </p>
  );
}

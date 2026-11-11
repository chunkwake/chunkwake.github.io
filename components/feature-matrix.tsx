'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  Check,
  ChevronRight,
  CircleDashed,
  Columns3,
  ExternalLink,
  List,
  Minus,
  Search,
  X,
} from 'lucide-react';
import {
  featureMatrix,
  getSectionTitle,
  type MatrixRow,
  type MatrixSection,
  type MatrixStatus,
} from '@/lib/feature-matrix';
import type { Lang } from '@/lib/i18n';

type Filter = 'all' | MatrixStatus;
type View = 'list' | 'board';

const ui = {
  ru: {
    total: 'всего',
    ready: 'готово',
    partial: 'частично',
    missing: 'нет',
    allSections: 'Все разделы',
    search: 'Поиск по фичам и заметкам',
    clear: 'Очистить',
    all: 'Все',
    empty: 'Ничего не найдено. Попробуйте другой запрос или сбросьте фильтры.',
    reset: 'Сбросить фильтры',
    source: 'Источник',
    updated: 'Обновлено',
    commit: 'коммит',
    rows: 'строк',
    note: 'Названия механик и заметки остаются на русском, как в исходной матрице.',
    statusNote: 'Статусы: готово — поведение есть, частично — работает не всё, нет — заготовка данных.',
    status: 'Статус',
    list: 'Список',
    board: 'Доска',
    view: 'Вид',
    close: 'Закрыть',
    openNote: 'Открыть заметку',
    noteTitle: 'Заметка',
    emptyColumn: 'Здесь пусто',
    boardHint: 'Нажмите на карточку, чтобы прочитать заметку целиком.',
  },
  en: {
    total: 'total',
    ready: 'ready',
    partial: 'partial',
    missing: 'not started',
    allSections: 'All sections',
    search: 'Search features and notes',
    clear: 'Clear',
    all: 'All',
    empty: 'Nothing matched. Try another query or reset the filters.',
    reset: 'Reset filters',
    source: 'Source',
    updated: 'Updated',
    commit: 'commit',
    rows: 'rows',
    note: 'Mechanic names and notes are kept in Russian, as in the source matrix.',
    statusNote: 'Statuses: ready — the behaviour exists, partial — not everything works, not started — data scaffolding only.',
    status: 'Status',
    list: 'List',
    board: 'Board',
    view: 'View',
    close: 'Close',
    openNote: 'Open note',
    noteTitle: 'Note',
    emptyColumn: 'Nothing here',
    boardHint: 'Select a card to read the full note.',
  },
} as const;

const statusMeta: Record<MatrixStatus, { icon: typeof Check }> = {
  ready: { icon: Check },
  partial: { icon: CircleDashed },
  missing: { icon: Minus },
  unknown: { icon: CircleDashed },
};

function resolveHref(href: string) {
  if (/^(https?:|mailto:|#)/.test(href)) return href;
  try {
    return new URL(href, `https://github.com/chunkwake/core/blob/${featureMatrix.branch}/docs/`).toString();
  } catch {
    return href;
  }
}

const inlineToken = /(`[^`]+`)|(\*\*[^*]+\*\*)|\[([^\]]+)\]\(([^)]+)\)/g;

function InlineMarkdown({ text }: { text: string }) {
  const nodes: React.ReactNode[] = [];
  let last = 0;

  for (const match of text.matchAll(inlineToken)) {
    const index = match.index ?? 0;
    if (index > last) nodes.push(text.slice(last, index));

    if (match[1]) {
      nodes.push(<code key={index}>{match[1].slice(1, -1)}</code>);
    } else if (match[2]) {
      nodes.push(<strong key={index}>{match[2].slice(2, -2)}</strong>);
    } else if (match[3]) {
      nodes.push(
        <a key={index} href={resolveHref(match[4])} target="_blank" rel="noreferrer">
          {match[3]}
        </a>,
      );
    }

    last = index + match[0].length;
  }

  if (last < text.length) nodes.push(text.slice(last));
  return <>{nodes}</>;
}

function plainText(markdown: string) {
  return markdown
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1');
}

function preview(note: string, limit = 300) {
  const text = plainText(note);
  if (text.length <= limit) return text;
  return `${text.slice(0, limit).replace(/\s+\S*$/, '')}…`;
}

/**
 * Long source notes are one wall of text. Split them into paragraphs on
 * sentence boundaries outside code spans so the detail panel stays readable.
 */
function toParagraphs(note: string) {
  const sentences: string[] = [];
  let start = 0;
  let inCode = false;

  for (let index = 0; index < note.length; index += 1) {
    const char = note[index];
    if (char === '`') inCode = !inCode;

    if (!inCode && /[.!?]/.test(char) && (note[index + 1] === ' ' || note[index + 1] === '\n')) {
      const sentence = note.slice(start, index + 1).trim();
      if (sentence) sentences.push(sentence);
      start = index + 1;
    }
  }

  const tail = note.slice(start).trim();
  if (tail) sentences.push(tail);

  const paragraphs: string[] = [];
  let buffer: string[] = [];
  let length = 0;

  for (const sentence of sentences) {
    buffer.push(sentence);
    length += sentence.length;
    if (length >= 340) {
      paragraphs.push(buffer.join(' '));
      buffer = [];
      length = 0;
    }
  }

  if (buffer.length > 0) paragraphs.push(buffer.join(' '));
  return paragraphs.length > 0 ? paragraphs : [note];
}

type Detail = { row: MatrixRow; section: MatrixSection };

export function FeatureMatrix() {
  const pathname = usePathname();
  const lang: Lang = pathname?.startsWith('/en') ? 'en' : 'ru';
  const t = ui[lang];

  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<Filter>('all');
  const [section, setSection] = useState('all');
  const [view, setView] = useState<View>('list');
  const [detail, setDetail] = useState<Detail | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!detail) return;

    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDetail(null);
    };
    const previousOverflow = document.body.style.overflow;

    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [detail]);

  const normalizedQuery = query.trim().toLowerCase();

  const matches = useMemo(() => {
    return (row: MatrixRow) => {
      if (view === 'list' && status !== 'all' && row.status !== status) return false;
      if (!normalizedQuery) return true;
      return `${row.name} ${row.stage} ${row.note}`.toLowerCase().includes(normalizedQuery);
    };
  }, [normalizedQuery, status, view]);

  const matchingBySection = useMemo(() => {
    const result = new Map<string, number>();
    for (const item of featureMatrix.sections) {
      result.set(item.id, item.rows.filter(matches).length);
    }
    return result;
  }, [matches]);

  const matchingTotal = useMemo(
    () => [...matchingBySection.values()].reduce((sum, value) => sum + value, 0),
    [matchingBySection],
  );

  const sections = useMemo(
    () =>
      featureMatrix.sections
        .filter((item) => section === 'all' || item.id === section)
        .map((item) => ({ ...item, rows: item.rows.filter(matches) }))
        .filter((item) => item.rows.length > 0),
    [matches, section],
  );

  const board = useMemo(() => {
    const order: MatrixStatus[] = ['ready', 'partial', 'missing'];
    return order.map((itemStatus) => ({
      status: itemStatus,
      rows: sections.flatMap((item) =>
        item.rows
          .filter((row) => row.status === itemStatus)
          .map((row) => ({ row, section: item })),
      ),
    }));
  }, [sections]);

  const totals = featureMatrix.totals;
  const fetchedAt = featureMatrix.fetchedAt.slice(0, 10);
  const shortSha = featureMatrix.sha256.slice(0, 7);

  function reset() {
    setQuery('');
    setStatus('all');
    setSection('all');
  }

  function statusLabel(value: MatrixStatus) {
    if (value === 'ready') return t.ready;
    if (value === 'missing') return t.missing;
    if (value === 'unknown') return t.partial;
    return t.partial;
  }

  const statusFilters: { id: Filter; label: string; count: number; icon?: typeof Check }[] = [
    { id: 'all', label: t.all, count: totals.total },
    { id: 'ready', label: t.ready, count: totals.ready, icon: Check },
    { id: 'partial', label: t.partial, count: totals.partial, icon: CircleDashed },
    { id: 'missing', label: t.missing, count: totals.missing, icon: Minus },
  ];

  const empty = sections.length === 0;

  return (
    <div className="cw-matrix">
      <div className="cw-matrix-top">
        <div className="cw-matrix-summary">
          <div className="cw-matrix-score">
            <strong>{totals.total}</strong>
            <span>{t.total}</span>
          </div>
          <div className="cw-matrix-score cw-matrix-score-ready">
            <strong>{totals.ready}</strong>
            <span>{t.ready}</span>
          </div>
          <div className="cw-matrix-score cw-matrix-score-partial">
            <strong>{totals.partial}</strong>
            <span>{t.partial}</span>
          </div>
          <div className="cw-matrix-score cw-matrix-score-missing">
            <strong>{totals.missing}</strong>
            <span>{t.missing}</span>
          </div>
        </div>

        <div className="cw-matrix-bar" aria-hidden="true">
          <span className="is-ready" style={{ width: `${(totals.ready / totals.total) * 100}%` }} />
          <span className="is-partial" style={{ width: `${(totals.partial / totals.total) * 100}%` }} />
          <span className="is-missing" style={{ width: `${(totals.missing / totals.total) * 100}%` }} />
        </div>
      </div>

      <div className="cw-matrix-toolbar">
        <label className="cw-matrix-search">
          <Search size={13} aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.search}
            aria-label={t.search}
          />
          {query ? (
            <button type="button" onClick={() => setQuery('')} aria-label={t.clear}>
              <X size={12} aria-hidden="true" />
            </button>
          ) : null}
        </label>

        {view === 'list' ? (
          <div className="cw-matrix-filters" role="group" aria-label={t.status}>
            {statusFilters.map((filter) => {
              const Icon = filter.icon;
              return (
                <button
                  key={filter.id}
                  type="button"
                  className={`cw-matrix-filter${status === filter.id ? ' is-active' : ''} cw-matrix-filter-${filter.id}`}
                  aria-pressed={status === filter.id}
                  onClick={() => setStatus(filter.id)}
                >
                  {Icon ? <Icon size={11} aria-hidden="true" /> : null}
                  {filter.label}
                  <span>{filter.count}</span>
                </button>
              );
            })}
          </div>
        ) : null}

        <div className="cw-matrix-views" role="group" aria-label={t.view}>
          <button
            type="button"
            className={`cw-matrix-view${view === 'list' ? ' is-active' : ''}`}
            aria-pressed={view === 'list'}
            onClick={() => setView('list')}
          >
            <List size={12} aria-hidden="true" />
            {t.list}
          </button>
          <button
            type="button"
            className={`cw-matrix-view${view === 'board' ? ' is-active' : ''}`}
            aria-pressed={view === 'board'}
            onClick={() => setView('board')}
          >
            <Columns3 size={12} aria-hidden="true" />
            {t.board}
          </button>
        </div>
      </div>

      <div className="cw-matrix-sections" role="group" aria-label={t.allSections}>
        <button
          type="button"
          className={`cw-matrix-chip${section === 'all' ? ' is-active' : ''}`}
          aria-pressed={section === 'all'}
          onClick={() => setSection('all')}
        >
          {t.allSections}
          <span>{matchingTotal}</span>
        </button>
        {featureMatrix.sections.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`cw-matrix-chip${section === item.id ? ' is-active' : ''}`}
            aria-pressed={section === item.id}
            onClick={() => setSection(item.id)}
          >
            {getSectionTitle(item.title, lang)}
            <span>{matchingBySection.get(item.id) ?? 0}</span>
          </button>
        ))}
      </div>

      {view === 'list' ? (
        <div className="cw-matrix-list">
          {sections.map((item) => (
            <section className="cw-matrix-section" key={item.id}>
              <div className="cw-matrix-section-head">
                <h3>{getSectionTitle(item.title, lang)}</h3>
                <span>
                  {item.rows.length} / {item.counts.total} {t.rows}
                </span>
              </div>

              <div className="cw-matrix-rows">
                {item.rows.map((row) => {
                  const Icon = statusMeta[row.status].icon;
                  return (
                    <button
                      type="button"
                      className={`cw-matrix-row is-${row.status}`}
                      key={row.id}
                      onClick={() => setDetail({ row, section: item })}
                      aria-label={`${row.name} — ${t.openNote}`}
                    >
                      <span className="cw-matrix-row-head">
                        <Icon size={12} strokeWidth={2} className="cw-matrix-icon" aria-hidden="true" />
                        <span className="cw-matrix-row-name">
                          <span>{row.name}</span>
                          {row.stage ? <code>{row.stage}</code> : null}
                        </span>
                        <span className={`cw-matrix-status is-${row.status}`}>{statusLabel(row.status)}</span>
                        <ChevronRight size={13} className="cw-matrix-open" aria-hidden="true" />
                      </span>
                      {row.note ? <span className="cw-matrix-note">{preview(row.note)}</span> : null}
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="cw-matrix-board">
          {board.map((column) => {
            const Icon = statusMeta[column.status].icon;
            return (
              <section className={`cw-matrix-column is-${column.status}`} key={column.status}>
                <header className="cw-matrix-column-head">
                  <Icon size={12} strokeWidth={2} aria-hidden="true" />
                  <h3>{statusLabel(column.status)}</h3>
                  <span>{column.rows.length}</span>
                </header>

                <div className="cw-matrix-column-body">
                  {column.rows.map(({ row, section: item }) => (
                    <button
                      type="button"
                      className={`cw-matrix-card is-${row.status}`}
                      key={row.id}
                      onClick={() => setDetail({ row, section: item })}
                      aria-label={`${row.name} — ${t.openNote}`}
                    >
                      <span className="cw-matrix-card-title">{row.name}</span>
                      <span className="cw-matrix-card-meta">
                        <span>{getSectionTitle(item.title, lang)}</span>
                        {row.stage ? <code>{row.stage}</code> : null}
                      </span>
                      {row.note ? <span className="cw-matrix-card-note">{preview(row.note, 150)}</span> : null}
                    </button>
                  ))}

                  {column.rows.length === 0 ? <p className="cw-matrix-column-empty">{t.emptyColumn}</p> : null}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {empty ? (
        <div className="cw-matrix-empty">
          <p>{t.empty}</p>
          <button type="button" className="cw-matrix-reset" onClick={reset}>
            {t.reset}
          </button>
        </div>
      ) : null}

      {view === 'board' ? <p className="cw-matrix-board-hint">{t.boardHint}</p> : null}

      <div className="cw-matrix-foot">
        <span>
          {t.source}:{' '}
          <a href={featureMatrix.source} target="_blank" rel="noreferrer">
            feature-matrix.md <ExternalLink size={10} aria-hidden="true" />
          </a>
          {' · '}
          {featureMatrix.branch} · {t.commit} <code>{shortSha}</code>
        </span>
        <span>
          {t.updated}: <time dateTime={featureMatrix.fetchedAt}>{fetchedAt}</time>
        </span>
      </div>

      <p className="cw-matrix-hint">
        {t.statusNote}
        {lang === 'en' ? ` ${t.note}` : ''}
      </p>

      {detail ? (
        <div
          className="cw-matrix-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setDetail(null);
          }}
        >
          <aside
            className="cw-matrix-detail"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cw-matrix-detail-title"
          >
            <div className="cw-matrix-detail-head">
              <span className={`cw-matrix-status is-${detail.row.status}`}>
                {statusLabel(detail.row.status)}
              </span>
              {detail.row.stage ? <code>{detail.row.stage}</code> : null}
              <button
                ref={closeRef}
                type="button"
                className="cw-matrix-detail-close"
                onClick={() => setDetail(null)}
                aria-label={t.close}
              >
                <X size={15} aria-hidden="true" />
              </button>
            </div>

            <h3 id="cw-matrix-detail-title">{detail.row.name}</h3>
            <div className="cw-matrix-detail-meta">
              {getSectionTitle(detail.section.title, lang)}
              {detail.row.stage ? (
                <>
                  <span>·</span>
                  {detail.row.stage}
                </>
              ) : null}
            </div>

            <div className="cw-matrix-detail-note">
              {toParagraphs(detail.row.note).map((paragraph, index) => (
                <p key={index}>
                  <InlineMarkdown text={paragraph} />
                </p>
              ))}
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}

'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStaticSearch } from 'fumadocs-core/search/client';

type RawItem = {
  id: string;
  url: string;
  type: 'page' | 'heading' | 'text' | 'table';
  content?: string;
  breadcrumbs?: string[];
  rows?: RawItem[];
};

type Row = {
  id: string;
  url: string;
  kind: 'page' | 'heading' | 'text' | 'link';
  title: string;
  crumb?: string;
  snippet?: string;
};

const quickLinks = {
  ru: [
    ['Документация', '/ru/docs'],
    ['Быстрый старт', '/ru/docs/getting-started'],
    ['Справочник команд', '/ru/docs/commands'],
    ['Наблюдаемость', '/ru/docs/observability'],
    ['Замеры', '/ru/benchmarks'],
    ['Статус', '/ru/status'],
    ['Скачать', '/ru/download'],
  ],
  en: [
    ['Documentation', '/en/docs'],
    ['Getting started', '/en/docs/getting-started'],
    ['Command reference', '/en/docs/commands'],
    ['Observability', '/en/docs/observability'],
    ['Benchmarks', '/en/benchmarks'],
    ['Status', '/en/status'],
    ['Download', '/en/download'],
  ],
} as const;

const ui = {
  ru: {
    placeholder: 'Поиск по сайту',
    label: 'Поиск по сайту',
    close: 'Закрыть поиск',
    empty: 'Ничего не найдено',
    emptyHint: 'Попробуйте другое слово или откройте раздел ниже.',
    loading: 'Ищу…',
    navigation: 'навигация',
    open: 'открыть',
    closeKey: 'закрыть',
    results: 'результатов',
    linksLabel: 'быстрых ссылок',
    error: 'Поиск недоступен. Попробуйте ещё раз.',
  },
  en: {
    placeholder: 'Search the site',
    label: 'Search the site',
    close: 'Close search',
    empty: 'Nothing found',
    emptyHint: 'Try another word or open a section below.',
    loading: 'Searching…',
    navigation: 'navigate',
    open: 'open',
    closeKey: 'close',
    results: 'results',
    linksLabel: 'quick links',
    error: 'Search is unavailable. Try again.',
  },
} as const;

function flattenItems(items: RawItem[]): RawItem[] {
  const flat: RawItem[] = [];
  for (const item of items) {
    if (item.type === 'table') {
      flat.push(...(item.rows ?? []).map((row) => ({ ...row, type: 'text' as const })));
    } else {
      flat.push(item);
    }
  }
  return flat;
}

function toRows(items: RawItem[], lang: 'ru' | 'en'): Row[] {
  const flat = flattenItems(items);
  const structured = flat.filter((item) => item.type !== 'text');
  const source = structured.length > 0 ? structured : flat;

  const pages = new Map<string, { title: string; crumb: string }>();
  for (const item of source) {
    if (item.type !== 'page') continue;
    pages.set(item.url.split('#')[0], {
      title: item.content ?? item.url,
      crumb: (item.breadcrumbs ?? []).join(' / '),
    });
  }

  return source.slice(0, 40).map((item) => {
    const page = pages.get(item.url.split('#')[0]);
    const isPage = item.type === 'page';
    const isText = item.type === 'text';

    const title = isText
      ? (page?.title ?? (lang === 'ru' ? 'Фрагмент' : 'Snippet'))
      : (item.content ?? item.url);
    const crumb = isPage ? (item.breadcrumbs ?? []).join(' / ') : (page?.title ?? '');
    const snippet = isText ? item.content : undefined;

    return {
      id: item.id,
      url: item.url,
      kind: item.type === 'page' ? 'page' : item.type === 'heading' ? 'heading' : 'text',
      title,
      ...(crumb ? { crumb } : {}),
      ...(snippet ? { snippet } : {}),
    };
  });
}

export default function SearchDialog({
  open,
  onOpenChange,
  lang,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lang: 'ru' | 'en';
}) {
  const t = ui[lang];
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(0);

  const { search, onSearchChange, isLoading, data, error } = useStaticSearch({
    locale: lang,
  });

  const rows = useMemo(() => {
    const items = (data?.items ?? []) as RawItem[];
    return toRows(items, lang);
  }, [data, lang]);

  const links = useMemo<Row[]>(
    () =>
      quickLinks[lang].map(([title, url]) => ({
        id: url,
        url,
        kind: 'link',
        title,
      })),
    [lang],
  );

  const displayRows = search.trim() ? rows : links;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      previousFocus.current = document.activeElement as HTMLElement | null;
      dialog.showModal();
      requestAnimationFrame(() => inputRef.current?.focus());
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      previousFocus.current?.focus();
      return;
    }

    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = 'hidden';
    return () => {
      root.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [search]);

  useEffect(() => {
    setActive((current) => Math.min(current, Math.max(0, displayRows.length - 1)));
  }, [displayRows.length]);

  useEffect(() => {
    const activeItem = listRef.current?.querySelector('[data-active="true"]');
    activeItem?.scrollIntoView({ block: 'nearest' });
  }, [active, displayRows.length]);

  const close = useCallback(() => {
    previousFocus.current?.focus();
    onOpenChange(false);
  }, [onOpenChange]);

  const openRow = useCallback(
    (row: Row | undefined) => {
      if (!row) return;
      onOpenChange(false);
      router.push(row.url);
    },
    [onOpenChange, router],
  );

  const onKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((current) => Math.min(current + 1, Math.max(0, displayRows.length - 1)));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((current) => Math.max(0, current - 1));
    } else if (event.key === 'Home') {
      event.preventDefault();
      setActive(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      setActive(Math.max(0, displayRows.length - 1));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      openRow(displayRows[active]);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="cw-search-dialog"
      aria-label={t.label}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClose={close}
      onKeyDown={onKeyDown}
      onMouseDown={(event) => {
        if (event.target === dialogRef.current) close();
      }}
    >
      <div className="cw-search-head">
        <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" className="cw-search-icon">
          <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
          <path d="m20 20-4.2-4.2" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
        <input
          ref={inputRef}
          className="cw-search-input"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={t.placeholder}
          aria-label={t.label}
          role="combobox"
          aria-expanded="true"
          aria-autocomplete="list"
          aria-haspopup="listbox"
          aria-controls="cw-search-list"
          aria-activedescendant={
            displayRows.length > 0 ? `cw-search-option-${active}` : undefined
          }
          autoComplete="off"
          spellCheck={false}
        />
        {isLoading ? <span className="cw-search-loading">{t.loading}</span> : null}
        <button type="button" className="cw-search-esc" onClick={close} aria-label={t.close}>
          esc
        </button>
      </div>

      <div className="cw-search-body" id="cw-search-list" role="listbox" ref={listRef}>
        {error ? <p className="cw-search-empty">{t.error}</p> : null}

        {!error && displayRows.length === 0 && !isLoading ? (
          <>
            <p className="cw-search-empty">{t.empty}</p>
            <p className="cw-search-empty-hint">{t.emptyHint}</p>
          </>
        ) : null}

        {displayRows.map((row, index) => (
          <button
            type="button"
            key={`${row.kind}-${row.id}`}
            id={`cw-search-option-${index}`}
            role="option"
            aria-selected={index === active}
            data-active={index === active}
            className="cw-search-row"
            onMouseEnter={() => setActive(index)}
            onClick={() => openRow(row)}
          >
            <span className="cw-search-row-icon" aria-hidden="true">
              {row.kind === 'link' ? '→' : row.kind === 'heading' ? '#' : '¶'}
            </span>
            <span className="cw-search-row-main">
              <span className="cw-search-row-title">{row.title}</span>
              {row.crumb ? <span className="cw-search-row-crumb">{row.crumb}</span> : null}
              {row.snippet ? <span className="cw-search-row-snippet">{row.snippet}</span> : null}
            </span>
            <span className="cw-search-row-enter" aria-hidden="true">
              ↵
            </span>
          </button>
        ))}
      </div>

      <div className="cw-search-foot">
        <span className="cw-search-hints">
          <kbd>↑</kbd>
          <kbd>↓</kbd> {t.navigation}
          <kbd>↵</kbd> {t.open}
          <kbd>esc</kbd> {t.closeKey}
        </span>
        <span className="cw-search-count">
          {displayRows.length > 0
            ? `${displayRows.length} ${search.trim() ? t.results : t.linksLabel}`
            : ''}
        </span>
      </div>
    </dialog>
  );
}

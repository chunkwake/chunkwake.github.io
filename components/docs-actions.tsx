'use client';

import { useEffect, useRef, useState } from 'react';
import { CalendarDays, Check, Copy, ExternalLink } from 'lucide-react';

const repo = 'chunkwake/chunkwake.github.io';
const branch = 'main';

const ui = {
  ru: {
    copy: 'Скопировать Markdown',
    copied: 'Markdown скопирован',
    failed: 'Не удалось скопировать',
    github: 'Открыть на GitHub',
    updated: 'Обновлено',
  },
  en: {
    copy: 'Copy Markdown',
    copied: 'Markdown copied',
    failed: 'Copy failed',
    github: 'Open on GitHub',
    updated: 'Updated',
  },
} as const;

export function DocsActions({
  lang,
  file,
  updated,
}: {
  lang: string;
  file: string;
  updated?: string;
}) {
  const t = ui[lang === 'en' ? 'en' : 'ru'];
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const markdownRef = useRef<string | null>(null);

  const rawUrl = `https://raw.githubusercontent.com/${repo}/${branch}/${file}`;
  const githubUrl = `https://github.com/${repo}/blob/${branch}/${file}`;
  const date = updated ? updated.slice(0, 10) : null;

  useEffect(() => {
    let cancelled = false;
    fetch(rawUrl, { cache: 'force-cache' })
      .then((response) => (response.ok ? response.text() : Promise.reject(response.status)))
      .then((markdown) => {
        if (!cancelled) markdownRef.current = markdown;
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [rawUrl]);

  function resetLater() {
    window.setTimeout(() => setState('idle'), 1800);
  }

  function write(markdown: string) {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(markdown)
        .then(() => {
          setState('copied');
          resetLater();
        })
        .catch(() => {
          setState('failed');
          resetLater();
        });
      return;
    }

    const textarea = document.createElement('textarea');
    textarea.value = markdown;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand('copy');
    textarea.remove();
    setState(copied ? 'copied' : 'failed');
    resetLater();
  }

  function copyMarkdown() {
    if (markdownRef.current) {
      write(markdownRef.current);
      return;
    }

    // The prefetch may still be in flight; fetch once more as a fallback.
    fetch(rawUrl)
      .then((response) => (response.ok ? response.text() : Promise.reject(response.status)))
      .then((markdown) => {
        markdownRef.current = markdown;
        write(markdown);
      })
      .catch(() => {
        setState('failed');
        resetLater();
      });
  }

  return (
    <div className="cw-doc-actions">
      <button type="button" className="cw-doc-action" onClick={copyMarkdown}>
        {state === 'copied' ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
        {state === 'copied' ? t.copied : state === 'failed' ? t.failed : t.copy}
      </button>

      <a className="cw-doc-action" href={githubUrl} target="_blank" rel="noreferrer">
        <ExternalLink size={13} aria-hidden="true" />
        {t.github}
      </a>

      {date ? (
        <span className="cw-doc-updated">
          <CalendarDays size={12} aria-hidden="true" />
          {t.updated} {date}
        </span>
      ) : null}
    </div>
  );
}

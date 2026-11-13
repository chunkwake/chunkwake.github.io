'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { loadTerminalDemo, type TerminalDemoData } from '@/lib/terminal';

type Line = {
  type: 'input' | 'output';
  text: string;
  level?: 'info' | 'warn' | 'error';
};

type Status = 'idle' | 'loading' | 'playing' | 'paused' | 'done' | 'error';

const ui = {
  ru: {
    play: 'Запустить',
    pause: 'Пауза',
    resume: 'Продолжить',
    replay: 'Ещё раз',
    copy: 'Скопировать',
    copied: 'Скопировано',
    showAll: 'Весь вывод',
    loading: 'Загружаю запись…',
    error: 'Не удалось загрузить запись. Попробуйте ещё раз.',
    idle: 'Реальный вывод Chunkwake. Нажмите «Запустить».',
    recorded: 'Записано',
    transcript: 'Текст сессии',
    badge: 'реальная запись',
    source: 'бинарник',
  },
  en: {
    play: 'Play',
    pause: 'Pause',
    resume: 'Resume',
    replay: 'Replay',
    copy: 'Copy',
    copied: 'Copied',
    showAll: 'Full output',
    loading: 'Loading recording…',
    error: 'Could not load the recording. Try again.',
    idle: 'Real Chunkwake output. Press Play.',
    recorded: 'Recorded',
    transcript: 'Session text',
    badge: 'real recording',
    source: 'binary',
  },
} as const;

function formatDate(value: string, lang: 'ru' | 'en') {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function TerminalDemo({
  id,
  lang,
  title,
}: {
  id: string;
  lang: 'ru' | 'en';
  title?: string;
}) {
  const t = ui[lang];
  const [data, setData] = useState<TerminalDemoData | null>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const [typing, setTyping] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [copied, setCopied] = useState(false);
  const [speed, setSpeed] = useState(1);

  const runRef = useRef(0);
  const pausedRef = useRef(false);
  const speedRef = useRef(1);
  const timersRef = useRef(new Set<ReturnType<typeof setTimeout>>());
  const screenRef = useRef<HTMLDivElement>(null);

  const sleep = useCallback(
    (ms: number) =>
      new Promise<void>((resolve) => {
        const timer = setTimeout(() => {
          timersRef.current.delete(timer);
          resolve();
        }, ms);
        timersRef.current.add(timer);
      }),
    [],
  );

  useEffect(
    () => () => {
      runRef.current += 1;
      for (const timer of timersRef.current) clearTimeout(timer);
      timersRef.current.clear();
    },
    [],
  );

  useEffect(() => {
    const screen = screenRef.current;
    if (!screen) return;
    screen.scrollTop = screen.scrollHeight;
  }, [lines, typing]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const waitWhilePaused = useCallback(
    async (token: number) => {
      while (pausedRef.current && token === runRef.current) await sleep(120);
    },
    [sleep],
  );

  const run = useCallback(
    async (demo: TerminalDemoData) => {
      const token = ++runRef.current;
      const reduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      pausedRef.current = false;
      setLines([]);
      setTyping(null);
      setStatus('playing');

      let lastAt = 0;

      for (const event of demo.events) {
        if (token !== runRef.current) return;
        await waitWhilePaused(token);
        if (token !== runRef.current) return;

        const gap = Math.max(24, Math.min(event.at - lastAt, 360));
        if (!reduced) await sleep(gap / speedRef.current);
        if (token !== runRef.current) return;

        if (event.type === 'input') {
          if (reduced) {
            setLines((previous) => [...previous, { type: 'input', text: event.text }]);
          } else {
            for (let index = 1; index <= event.text.length; index += 1) {
              if (token !== runRef.current) return;
              await waitWhilePaused(token);
              setTyping(event.text.slice(0, index));
              await sleep(14 / speedRef.current);
            }
            setTyping(null);
            setLines((previous) => [...previous, { type: 'input', text: event.text }]);
          }
        } else {
          setLines((previous) => [
            ...previous,
            { type: 'output', text: event.text, level: event.level },
          ]);
          if (!reduced) await sleep(36 / speedRef.current);
        }

        lastAt = event.at;
      }

      if (token === runRef.current) setStatus('done');
    },
    [sleep, waitWhilePaused],
  );

  const start = useCallback(async () => {
    if (status === 'playing') {
      pausedRef.current = true;
      setStatus('paused');
      return;
    }

    if (status === 'paused') {
      pausedRef.current = false;
      setStatus('playing');
      return;
    }

    setStatus('loading');

    let demo = data;
    if (!demo) {
      try {
        demo = await loadTerminalDemo(id);
        setData(demo);
      } catch {
        setStatus('error');
        return;
      }
    }

    await run(demo);
  }, [data, id, run, status]);

  const showAll = useCallback(() => {
    if (!data) return;
    runRef.current += 1;
    pausedRef.current = false;
    setTyping(null);
    setLines(
      data.events.map((event) => ({
        type: event.type,
        text: event.text,
        level: event.level,
      })),
    );
    setStatus('done');
  }, [data]);

  const transcript = data
    ? data.events
        .map((event) =>
          event.type === 'input' ? `${data.prompt} ${event.text}` : event.text,
        )
        .join('\n')
    : '';

  const copy = useCallback(async () => {
    if (!transcript) return;
    try {
      await navigator.clipboard.writeText(transcript);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard can be unavailable without a secure context
    }
  }, [transcript]);

  const heading = data?.title?.[lang] ?? title ?? id;
  const sourceUrl = data?.core?.branch
    ? `https://github.com/${data.core.repo}/tree/${data.core.branch}`
    : null;

  return (
    <div className="cw-term-demo">
      <div className="cw-term-head">
        <span className="cw-window-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="cw-term-title">{heading}</span>
        <span className="cw-term-badge">{t.badge}</span>
        <div className="cw-term-actions">
          <button type="button" onClick={start} disabled={status === 'loading'}>
            {status === 'playing' ? t.pause : status === 'paused' ? t.resume : status === 'done' ? t.replay : t.play}
          </button>
          <button type="button" onClick={showAll} disabled={!data}>
            {t.showAll}
          </button>
          <button type="button" onClick={copy} disabled={!data}>
            {copied ? t.copied : t.copy}
          </button>
        </div>
      </div>

      <div className="cw-term-screen" ref={screenRef} role="log" aria-live="off">
        {status === 'idle' ? (
          <div className="cw-term-idle">
            <button type="button" className="cw-term-start" onClick={start}>
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path d="M8 5.5v13l11-6.5-11-6.5Z" fill="currentColor" />
              </svg>
              {t.play}
            </button>
            <p>{t.idle}</p>
          </div>
        ) : null}

        {status === 'loading' ? <p className="cw-term-muted">{t.loading}</p> : null}
        {status === 'error' ? <p className="cw-term-error-text">{t.error}</p> : null}

        {lines.map((line, index) =>
          line.type === 'input' ? (
            <div className="cw-term-line cw-term-line-input" key={`${index}-${line.text}`}>
              <span className="cw-term-prompt" aria-hidden="true">
                {data?.prompt ?? '>'}
              </span>
              <span>{line.text}</span>
            </div>
          ) : (
            <div
              className={`cw-term-line cw-term-output${
                line.level ? ` cw-term-${line.level}` : ''
              }`}
              key={`${index}-${line.text}`}
            >
              {line.text || '\u00a0'}
            </div>
          ),
        )}

        {typing !== null ? (
          <div className="cw-term-line cw-term-line-input">
            <span className="cw-term-prompt" aria-hidden="true">
              {data?.prompt ?? '>'}
            </span>
            <span>{typing}</span>
            <span className="cw-term-caret" aria-hidden="true" />
          </div>
        ) : null}

        {status === 'playing' || status === 'paused' ? (
          <div className="cw-term-line cw-term-line-input">
            <span className="cw-term-prompt" aria-hidden="true">
              {data?.prompt ?? '>'}
            </span>
            <span className="cw-term-caret" aria-hidden="true" />
          </div>
        ) : null}
      </div>

      <div className="cw-term-foot">
        {data ? (
          <>
            <span>
              {t.recorded} {formatDate(data.capturedAt, lang)}
            </span>
            {data.core.coreSha && sourceUrl ? (
              <a href={sourceUrl} target="_blank" rel="noreferrer">
                {data.core.repo} @ {data.core.coreSha.slice(0, 7)}
              </a>
            ) : null}
            <span>
              {t.source}: {data.binary.profile}
            </span>
            {status === 'playing' || status === 'paused' ? (
              <label className="cw-term-speed">
                <span className="sr-only">speed</span>
                <select
                  value={speed}
                  onChange={(event) => setSpeed(Number(event.target.value))}
                  aria-label={lang === 'ru' ? 'Скорость воспроизведения' : 'Playback speed'}
                >
                  <option value={1}>1×</option>
                  <option value={2}>2×</option>
                </select>
              </label>
            ) : null}
          </>
        ) : (
          <span>{lang === 'ru' ? 'Запись с реального сервера' : 'Recorded from a real server'}</span>
        )}
      </div>

      {data ? (
        <details className="cw-term-transcript">
          <summary>{t.transcript}</summary>
          <pre>{transcript}</pre>
        </details>
      ) : null}
    </div>
  );
}

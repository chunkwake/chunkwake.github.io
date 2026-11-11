'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ru" className="dark">
      <body className="cw-body">
        <div className="cw-404">
          <span className="cw-404-code">error · critical</span>
          <h1>Приложение упало</h1>
          <p>Обновите страницу. Если ошибка повторяется, откройте issue в репозитории.</p>
          <div className="cw-hero-actions">
            <button type="button" className="cw-btn cw-btn-primary" onClick={reset}>
              Обновить
            </button>
            <a className="cw-btn" href="https://github.com/chunkwake/core/issues">
              Issues
            </a>
          </div>
          {error.digest ? <p className="cw-footer-mono">digest: {error.digest}</p> : null}
        </div>
      </body>
    </html>
  );
}

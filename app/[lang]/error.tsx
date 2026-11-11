'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="cw-404">
      <span className="cw-404-code">error · runtime</span>
      <h1>Что-то сломалось</h1>
      <p>Страница не смогла отрисоваться. Попробуйте ещё раз или вернитесь в документацию.</p>
      <div className="cw-hero-actions">
        <button type="button" className="cw-btn cw-btn-primary" onClick={reset}>
          Попробовать снова
        </button>
        <Link className="cw-btn" href="/ru/docs">
          Документация
        </Link>
      </div>
    </div>
  );
}

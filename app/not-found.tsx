import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="cw-404">
      <span className="cw-404-code">404 · not found</span>
      <h1>Страница не найдена</h1>
      <p>Возможно, она переехала. Начни с документации или вернись на главную.</p>
      <div className="cw-hero-actions">
        <Link className="cw-btn cw-btn-primary" href="/ru/docs">
          Документация
        </Link>
        <Link className="cw-btn" href="/ru">
          На главную
        </Link>
        <Link className="cw-btn" href="/en">
          English
        </Link>
      </div>
    </div>
  );
}

import Link from 'next/link';
import { getCopy } from '@/lib/dictionary';

export default async function NotFound() {
  const copy = getCopy('ru');
  return (
    <div className="cw-404">
      <span className="cw-404-code">404</span>
      <h1>Страница не найдена</h1>
      <p>Возможно, она переехала. Начни с документации или вернись на главную.</p>
      <div className="cw-hero-actions">
        <Link className="cw-btn cw-btn-primary" href="/ru/docs">
          {copy.nav.docs}
        </Link>
        <Link className="cw-btn" href="/ru">
          На главную
        </Link>
      </div>
    </div>
  );
}

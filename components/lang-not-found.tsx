import Link from 'next/link';

export function LangNotFound({ lang }: { lang: string }) {
  return (
    <div className="cw-404">
      <span className="cw-404-code">404 · unknown locale</span>
      <h1>Страница не найдена</h1>
      <p>
        Локаль <code>{lang}</code> не поддерживается. Доступны русская и английская версии.
      </p>
      <div className="cw-hero-actions">
        <Link className="cw-btn cw-btn-primary" href="/ru/docs">
          Документация
        </Link>
        <Link className="cw-btn" href="/ru">
          Русский
        </Link>
        <Link className="cw-btn" href="/en">
          English
        </Link>
      </div>
    </div>
  );
}

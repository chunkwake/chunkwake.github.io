import { codeToHtml } from 'shiki';
import { chunkwakeTheme } from '@/lib/code-theme';

export async function CodeBlock({
  code,
  lang,
  title,
  badge,
  className,
}: {
  code: string;
  lang: string;
  title: string;
  badge?: string;
  className?: string;
}) {
  const html = await codeToHtml(code, {
    lang,
    theme: chunkwakeTheme,
  });

  return (
    <div className={`cw-window ${className ?? ''}`}>
      <div className="cw-window-bar">
        <span className="cw-window-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="cw-window-title">{title}</span>
        <span className="cw-window-lang">{badge ?? lang}</span>
      </div>
      <div className="cw-shiki" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

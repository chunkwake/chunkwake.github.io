import Link from 'next/link';
import { Logo } from './logo';
import type { SiteCopy } from '@/lib/dictionary';
import { links } from '@/lib/shared';

export function SiteFooter({ lang, copy }: { lang: string; copy: SiteCopy }) {
  const f = copy.footer;
  return (
    <footer className="cw-footer">
      <div className="cw-footer-inner">
        <div className="cw-footer-brand">
          <Link href={`/${lang}`} aria-label="Chunkwake home">
            <Logo />
          </Link>
          <p>{f.tagline}</p>
          <p className="cw-footer-note">{f.disclaimer}</p>
        </div>

        <div className="cw-footer-col">
          <h3>{f.project}</h3>
          <a href={links.github} target="_blank" rel="noreferrer">
            {f.links.github}
          </a>
          <a href={links.issues} target="_blank" rel="noreferrer">
            {f.links.issues}
          </a>
          <a href={links.releases} target="_blank" rel="noreferrer">
            {f.links.releases}
          </a>
        </div>

        <div className="cw-footer-col">
          <h3>{f.docs}</h3>
          <Link href={`/${lang}/docs/getting-started`}>{f.links.quickstart}</Link>
          <Link href={`/${lang}/docs/migrating`}>{f.links.migration}</Link>
          <Link href={`/${lang}/docs/plugins`}>{f.links.plugins}</Link>
          <Link href={`/${lang}/docs/feature-matrix`}>{f.links.matrix}</Link>
          <Link href={`/${lang}/docs/architecture`}>{f.links.architecture}</Link>
          <Link href={`/${lang}/benchmarks`}>{f.links.benchmarks}</Link>
          <Link href={`/${lang}/support`}>{f.links.support}</Link>
        </div>

        <div className="cw-footer-col">
          <h3>{f.legal}</h3>
          <a href={links.license} target="_blank" rel="noreferrer">
            {f.links.license}
          </a>
          <a href={links.contributing} target="_blank" rel="noreferrer">
            Contributing
          </a>
        </div>
      </div>

      <div className="cw-footer-bottom">
        <span>{f.trademark}</span>
        <span className="cw-footer-mono">Minecraft 26.3 · Rust stable · GPL-3.0</span>
      </div>
    </footer>
  );
}

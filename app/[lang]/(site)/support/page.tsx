import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import { CopyButton } from '@/components/copy-button';
import { LangNotFound } from '@/components/lang-not-found';
import { donations } from '@/lib/donations';
import { getCopy } from '@/lib/dictionary';
import { isLang } from '@/lib/i18n';
import { renderQr } from '@/lib/qr';
import { pageMetadata } from '@/lib/seo';

const marks = {
  btc: '₿',
  usdt: '₮',
  trx: 'T',
} as const;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const copy = getCopy(lang);
  return pageMetadata({
    lang,
    path: '/support',
    title: copy.support.title,
    description: copy.support.lead,
  });
}

export default async function SupportPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) return <LangNotFound lang={lang} />;
  const copy = getCopy(lang);
  const s = copy.support;

  const cards = donations.map((donation) => ({
    ...donation,
    qr: renderQr(donation.address, donation.palette),
  }));

  return (
    <div className="cw-page cw-support">
      <header className="cw-page-head">
        <div className="cw-eyebrow">{s.eyebrow}</div>
        <h1>{s.title}</h1>
        <p>{s.lead}</p>
      </header>

      <div className="cw-donate-grid">
        {cards.map((donation) => (
          <article
            className={`cw-donate-card is-${donation.id}`}
            key={donation.id}
            style={
              {
                '--donate-accent': donation.palette.accent,
                '--donate-ink': donation.palette.ink,
                '--donate-paper': donation.palette.paper,
                '--donate-glow': donation.palette.glow,
              } as CSSProperties
            }
          >
            <div className="cw-donate-head">
              <span className="cw-donate-mark" aria-hidden="true">
                {marks[donation.id]}
              </span>
              <div>
                <h2>{donation.coin}</h2>
                <span>{donation.ticker}</span>
              </div>
            </div>

            <div className="cw-donate-qr" role="img" aria-label={`${s.scan}: ${donation.address}`}>
              <div className="cw-donate-qr-svg" dangerouslySetInnerHTML={{ __html: donation.qr }} />
              <span className="cw-donate-qr-badge" aria-hidden="true">
                {marks[donation.id]}
              </span>
            </div>

            <div className="cw-donate-network">
              {s.network}: <strong>{donation.network}</strong>
            </div>

            <div className="cw-donate-field">
              <span>{s.address}</span>
              <code>{donation.address}</code>
              <CopyButton
                text={donation.address}
                label={s.copy}
                copiedLabel={s.copied}
                className="cw-donate-copy"
                showLabel
              />
            </div>
          </article>
        ))}
      </div>

      <p className="cw-support-warning">{s.warning}</p>
    </div>
  );
}

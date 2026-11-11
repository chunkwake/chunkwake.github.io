import type { Metadata } from 'next';
import QRCode from 'qrcode';
import { CopyButton } from '@/components/copy-button';
import { LangNotFound } from '@/components/lang-not-found';
import { donations } from '@/lib/donations';
import { getCopy } from '@/lib/dictionary';
import { isLang } from '@/lib/i18n';

const marks = {
  btc: '₿',
  usdt: '₮',
  trx: 'T',
} as const;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const copy = getCopy(lang);
  return {
    title: copy.support.title,
    description: copy.support.lead,
  };
}

export default async function SupportPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) return <LangNotFound lang={lang} />;
  const copy = getCopy(lang);
  const s = copy.support;

  const cards = await Promise.all(
    donations.map(async (donation) => ({
      ...donation,
      qr: await QRCode.toString(donation.address, {
        type: 'svg',
        margin: 1,
        width: 144,
        errorCorrectionLevel: 'M',
        color: { dark: '#181818', light: '#e7e7e7' },
      }),
    })),
  );

  return (
    <div className="cw-page cw-support">
      <header className="cw-page-head">
        <div className="cw-eyebrow">{s.eyebrow}</div>
        <h1>{s.title}</h1>
        <p>{s.lead}</p>
      </header>

      <div className="cw-support-note">
        <span className="cw-support-badge">{s.only}</span>
        <p>{s.note}</p>
      </div>

      <div className="cw-donate-grid">
        {cards.map((donation) => (
          <article className={`cw-donate-card is-${donation.id}`} key={donation.id}>
            <div className="cw-donate-head">
              <span className="cw-donate-mark" aria-hidden="true">
                {marks[donation.id]}
              </span>
              <div>
                <h2>{donation.coin}</h2>
                <span>{donation.ticker}</span>
              </div>
            </div>

            <div
              className="cw-donate-qr"
              role="img"
              aria-label={`${s.scan}: ${donation.address}`}
              dangerouslySetInnerHTML={{ __html: donation.qr }}
            />

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

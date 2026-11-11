'use client';

import { useEffect, useState } from 'react';
import type { SiteCopy } from '@/lib/dictionary';
import { links } from '@/lib/shared';
import { CopyButton } from '@/components/copy-button';

type OS = 'windows' | 'linux';

export function DownloadPanel({ copy }: { copy: SiteCopy }) {
  const [os, setOs] = useState<OS>('windows');
  const [detected, setDetected] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('linux')) setOs('linux');
    if (ua.includes('windows')) setOs('windows');
    setDetected(true);
  }, []);

  const command = 'cargo build --release -p chunkwake-server';

  return (
    <div className="cw-download">
      <div className="cw-notice" role="status">
        <div>
          <strong>{copy.download.emptyTitle}</strong>
          <p>{copy.download.emptyText}</p>
        </div>
        <a href={links.releases} target="_blank" rel="noreferrer" className="cw-btn">
          GitHub Releases
        </a>
      </div>

      <div className="cw-download-tabs" role="tablist" aria-label="Platform">
        <button
          type="button"
          role="tab"
          aria-selected={os === 'windows'}
          className={os === 'windows' ? 'is-active' : ''}
          onClick={() => setOs('windows')}
        >
          {copy.download.windows}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={os === 'linux'}
          className={os === 'linux' ? 'is-active' : ''}
          onClick={() => setOs('linux')}
        >
          {copy.download.linux}
        </button>
      </div>

      <div className="cw-download-grid">
        {copy.download.platforms.map((platform) => {
          const key = platform.os.toLowerCase() as OS;
          return (
            <div className={`cw-download-card ${os === key ? 'is-active' : ''}`} key={platform.os}>
              <div className="cw-download-card-head">
                <span className="cw-download-os">{platform.os}</span>
                <span className="cw-download-arch">{platform.arch}</span>
              </div>
              <code className="cw-download-file">{platform.file}</code>
              <p>{platform.note}</p>
              <span className="cw-download-state">{copy.download.emptyTitle}</span>
            </div>
          );
        })}
      </div>

      <div className="cw-download-source">
        <div>
          <h3>{copy.download.source}</h3>
          <p>{copy.download.sourceNote}</p>
        </div>
        <div className="cw-command cw-command-wide">
          <span className="cw-command-prompt" aria-hidden="true">
            $
          </span>
          <code>{command}</code>
          <CopyButton text={command} label="Copy command" copiedLabel="Copied" />
        </div>
      </div>

      <div className="cw-download-requirements">
        <h3>{copy.download.requirements}</h3>
        <ul>
          <li>{copy.download.reqRust}</li>
          <li>{copy.download.reqJdk}</li>
          <li>{copy.download.reqJava}</li>
          <li>{detected ? copy.download.osDetected : copy.download.osUnknown}</li>
        </ul>
      </div>
    </div>
  );
}

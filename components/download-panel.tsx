'use client';

import { useEffect, useMemo, useState } from 'react';
import type { SiteCopy } from '@/lib/dictionary';
import type { ReleaseAsset, ReleaseInfo } from '@/lib/release';
import { formatBytes } from '@/lib/release';
import { links } from '@/lib/shared';
import { CopyButton } from '@/components/copy-button';

type OS = 'windows' | 'linux';

const ui = {
  ru: {
    published: 'опубликован',
    platform: 'Платформа',
    prerelease: 'pre-release',
    download: 'Скачать',
    downloads: 'скачиваний',
    all: 'Все файлы релиза',
    noAssets: 'В этом релизе нет файла для этой платформы. Все файлы — на GitHub.',
    noChecksum: 'SHA-256 не опубликован в релизе. Сверьте файл на странице релиза.',
    checksums: 'Контрольные суммы',
    copyHash: 'Скопировать SHA-256',
    copied: 'Скопировано',
    build: 'Или собрать из исходников',
  },
  en: {
    published: 'published',
    platform: 'Platform',
    prerelease: 'pre-release',
    download: 'Download',
    downloads: 'downloads',
    all: 'All release files',
    noAssets: 'This release has no file for this platform. All files are on GitHub.',
    noChecksum: 'SHA-256 is not published in this release. Verify the file on the release page.',
    checksums: 'Checksums',
    copyHash: 'Copy SHA-256',
    copied: 'Copied',
    build: 'Or build from source',
  },
} as const;

const platforms: { key: OS }[] = [{ key: 'windows' }, { key: 'linux' }];

function platformAssets(release: ReleaseInfo | null, os: OS): ReleaseAsset[] {
  if (!release) return [];
  return release.assets.filter(
    (asset) => asset.platform === os && asset.kind !== 'checksum' && asset.kind !== 'other',
  );
}

function checksumFile(release: ReleaseInfo | null) {
  return release?.assets.find((asset) => asset.kind === 'checksum') ?? null;
}

export function DownloadPanel({
  copy,
  release,
  lang,
}: {
  copy: SiteCopy;
  release: ReleaseInfo | null;
  lang: string;
}) {
  const [os, setOs] = useState<OS>('windows');
  const [detected, setDetected] = useState(false);
  const text = ui[lang === 'en' ? 'en' : 'ru'];

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('linux')) setOs('linux');
    if (ua.includes('windows')) setOs('windows');
    setDetected(true);
  }, []);

  const command = 'cargo build --release -p chunkwake-server';
  const activeAssets = useMemo(() => platformAssets(release, os), [release, os]);
  const activeChecksums = useMemo(
    () =>
      release?.assets.filter(
        (asset) => asset.platform === os && asset.kind !== 'checksum' && asset.sha256,
      ) ?? [],
    [release, os],
  );
  const checksums = checksumFile(release);
  const platformLabel = os === 'windows' ? copy.download.windows : copy.download.linux;

  return (
    <div className="cw-download">
      {release ? (
        <div className="cw-release" role="status">
          <div className="cw-release-main">
            <span className="cw-release-tag">{release.tag}</span>
            {release.prerelease ? <span className="cw-release-pre">{text.prerelease}</span> : null}
            <p>
              {release.name}
              {release.publishedAt ? ` · ${text.published} ${release.publishedAt.slice(0, 10)}` : ''}
            </p>
          </div>
          <a href={release.htmlUrl} target="_blank" rel="noreferrer" className="cw-btn">
            {text.all}
          </a>
        </div>
      ) : (
        <div className="cw-notice" role="status">
          <div>
            <strong>{copy.download.emptyTitle}</strong>
            <p>{copy.download.emptyText}</p>
          </div>
          <a href={links.releases} target="_blank" rel="noreferrer" className="cw-btn">
            GitHub Releases
          </a>
        </div>
      )}

      <div className="cw-download-tabs" role="tablist" aria-label={text.platform}>
        {platforms.map((platform) => (
          <button
            key={platform.key}
            type="button"
            role="tab"
            aria-selected={os === platform.key}
            className={os === platform.key ? 'is-active' : ''}
            onClick={() => setOs(platform.key)}
          >
            {platform.key === 'windows' ? copy.download.windows : copy.download.linux}
          </button>
        ))}
      </div>

      {release ? (
        activeAssets.length > 0 ? (
          <div className="cw-download-grid cw-download-grid-release">
            {activeAssets.map((asset) => (
              <div className="cw-download-card is-active" key={asset.name}>
                <div className="cw-download-card-head">
                  <span className="cw-download-os">{platformLabel}</span>
                  <span className="cw-download-arch">{asset.arch || platformLabel}</span>
                </div>
                <code className="cw-download-file">{asset.name}</code>
                <p>
                  {formatBytes(asset.size)}
                  {asset.downloads ? ` · ${asset.downloads} ${text.downloads}` : ''}
                </p>
                <a
                  className="cw-btn cw-download-button"
                  href={asset.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {text.download}
                </a>
                {asset.sha256 ? (
                  <div className="cw-download-hash">
                    <span>{copy.download.checksum}</span>
                    <code>{asset.sha256}</code>
                    <CopyButton
                      text={asset.sha256}
                      label={text.copyHash}
                      copiedLabel={text.copied}
                    />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <div className="cw-download-empty">
            <p>{text.noAssets}</p>
            <a href={release.htmlUrl} target="_blank" rel="noreferrer" className="cw-btn">
              {text.all}
            </a>
          </div>
        )
      ) : (
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
      )}

      {release ? (
        <div className="cw-download-checksums">
          <div className="cw-download-checksums-head">
            <h3>{text.checksums}</h3>
            {checksums ? (
              <a href={checksums.url} target="_blank" rel="noreferrer">
                {checksums.name} ↗
              </a>
            ) : null}
          </div>
          {activeChecksums.length > 0 ? (
            <div className="cw-download-hash-list">
              {activeChecksums.map((asset) => (
                <div className="cw-download-hash-row" key={asset.name}>
                  <code className="cw-download-hash-name">{asset.name}</code>
                  <code className="cw-download-hash-value">{asset.sha256}</code>
                  <CopyButton
                    text={asset.sha256 ?? ''}
                    label={text.copyHash}
                    copiedLabel={text.copied}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="cw-download-checksum-note">
              {text.noChecksum}{' '}
              <a href={release.htmlUrl} target="_blank" rel="noreferrer">
                {text.all} ↗
              </a>
            </p>
          )}
        </div>
      ) : null}

      <div className="cw-download-source">
        <div>
          <h3>{release ? text.build : copy.download.source}</h3>
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

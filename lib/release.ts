import data from '@/content/data/release.json';

export type ReleasePlatform = 'windows' | 'linux' | 'other';
export type ReleaseKind = 'archive' | 'binary' | 'checksum' | 'other';

export type ReleaseAsset = {
  name: string;
  size: number;
  url: string;
  platform: ReleasePlatform;
  arch: string;
  kind: ReleaseKind;
  downloads: number;
  sha256: string | null;
};

export type ReleaseInfo = {
  tag: string;
  version: string;
  name: string;
  publishedAt: string | null;
  htmlUrl: string;
  prerelease: boolean;
  assets: ReleaseAsset[];
};

export type ReleaseData = {
  source: string;
  repo: string;
  fetchedAt: string | null;
  release: ReleaseInfo | null;
};

export const releaseData = data as ReleaseData;

export function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export function assetsFor(platform: ReleasePlatform) {
  return releaseData.release?.assets.filter((asset) => asset.platform === platform) ?? [];
}

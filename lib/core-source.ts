import data from '@/content/data/source.json';
import type { Lang } from './i18n';

export type CoreSource = {
  repo: string;
  branch: string;
  coreSha: string;
  releaseTag: string | null;
  fetchedAt: string;
};

export const coreSource = data as CoreSource;

export function coreCommitUrl(sha = coreSource.coreSha) {
  return `https://github.com/${coreSource.repo}/commit/${sha}`;
}

export function formatCoreDate(lang: Lang) {
  const date = new Date(coreSource.fetchedAt);
  if (Number.isNaN(date.getTime())) return coreSource.fetchedAt;
  const iso = date.toISOString();
  return lang === 'ru'
    ? `${iso.slice(8, 10)}.${iso.slice(5, 7)}.${iso.slice(0, 4)}, ${iso.slice(11, 16)} UTC`
    : `${iso.slice(0, 10)} ${iso.slice(11, 16)} UTC`;
}

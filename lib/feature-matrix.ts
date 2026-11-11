import rawMatrix from '@/content/data/feature-matrix.json';
import type { Lang } from './i18n';

export type MatrixStatus = 'ready' | 'partial' | 'missing' | 'unknown';

export type MatrixRow = {
  id: string;
  name: string;
  status: MatrixStatus;
  stage: string;
  note: string;
};

export type MatrixSection = {
  id: string;
  title: string;
  counts: {
    ready: number;
    partial: number;
    missing: number;
    unknown: number;
    total: number;
  };
  rows: MatrixRow[];
};

export type FeatureMatrixData = {
  source: string;
  branch: string;
  fetchedAt: string;
  sha256: string;
  totals: {
    ready: number;
    partial: number;
    missing: number;
    unknown: number;
    total: number;
  };
  sections: MatrixSection[];
};

export const featureMatrix = rawMatrix as FeatureMatrixData;

const sectionTitles: Record<string, Record<Lang, string>> = {
  'Генерация и измерения': { ru: 'Генерация и измерения', en: 'Generation and dimensions' },
  Редстоун: { ru: 'Редстоун', en: 'Redstone' },
  Сущности: { ru: 'Сущности', en: 'Entities' },
  'Мир, который тикает': { ru: 'Мир, который тикает', en: 'World ticking' },
  'Станции и рецепты': { ru: 'Станции и рецепты', en: 'Stations and recipes' },
  'Игрок и команды': { ru: 'Игрок и команды', en: 'Player and commands' },
  'Не начато': { ru: 'Не начато', en: 'Not started' },
  'Плагины (Paper API)': { ru: 'Плагины (Paper API)', en: 'Plugins (Paper API)' },
};

export function getSectionTitle(title: string, lang: Lang) {
  return sectionTitles[title]?.[lang] ?? title;
}

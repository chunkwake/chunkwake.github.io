import data from '@/content/data/plugins.json';
import type { Lang } from './i18n';

export type PluginStatus = 'works' | 'partial' | 'unsupported';
export type PluginKind =
  | 'map'
  | 'permissions'
  | 'world'
  | 'gameplay'
  | 'api'
  | 'protocol'
  | 'proxy'
  | 'content';

export type LocalizedList = Record<Lang, string[]>;
export type LocalizedText = Record<Lang, string>;

export type PluginEntry = {
  id: string;
  name: string;
  version: string;
  status: PluginStatus;
  kind: PluginKind;
  url: string;
  summary: LocalizedText;
  details: LocalizedList;
  limits: LocalizedList;
};

export type PluginGate = {
  date: string;
  total: number;
  enabled: number;
  jars?: number;
  note: LocalizedText;
  failures: { name: string; version: string; reason: LocalizedText }[];
  excluded?: { name: string; version: string; reason: LocalizedText }[];
  verified: { name: string; version: string }[];
};

export type PluginData = {
  source: string;
  testedAt: string;
  coreSha: string;
  gate?: PluginGate;
  plugins: PluginEntry[];
};

export const pluginData = data as PluginData;

export const pluginStatusLabels: Record<PluginStatus, Record<Lang, string>> = {
  works: { ru: 'работает', en: 'works' },
  partial: { ru: 'частично', en: 'partial' },
  unsupported: { ru: 'не работает', en: 'unsupported' },
};

export const pluginKindLabels: Record<PluginKind, Record<Lang, string>> = {
  map: { ru: 'карта', en: 'map' },
  permissions: { ru: 'права', en: 'permissions' },
  world: { ru: 'мир', en: 'world' },
  gameplay: { ru: 'геймплей', en: 'gameplay' },
  api: { ru: 'API', en: 'API' },
  protocol: { ru: 'протокол', en: 'protocol' },
  proxy: { ru: 'прокси', en: 'proxy' },
  content: { ru: 'контент', en: 'content' },
};

export function pluginTotals() {
  const plugins = pluginData.plugins;
  return {
    total: plugins.length,
    works: plugins.filter((plugin) => plugin.status === 'works').length,
    partial: plugins.filter((plugin) => plugin.status === 'partial').length,
    unsupported: plugins.filter((plugin) => plugin.status === 'unsupported').length,
    proxies: plugins.filter((plugin) => plugin.kind === 'proxy').length,
  };
}

export const pluginGate = pluginData.gate;

import { defineI18n } from 'fumadocs-core/i18n';

export const i18n = defineI18n({
  defaultLanguage: 'ru',
  languages: ['ru', 'en'],
});

export type Lang = (typeof i18n.languages)[number];

export function isLang(value: string): value is Lang {
  return (i18n.languages as readonly string[]).includes(value);
}

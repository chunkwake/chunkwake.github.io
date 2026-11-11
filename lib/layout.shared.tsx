import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { uiTranslations } from 'fumadocs-ui/i18n';
import { Download } from 'lucide-react';
import { Logo } from '@/components/logo';
import { i18n, type Lang } from './i18n';
import { gitConfig, links } from './shared';

export const translations = i18n
  .translations()
  .extend(uiTranslations())
  .add({
    ru: {
      displayName: 'Русский',
      'Search(search dialog)': 'Поиск',
      'Search(search trigger)': 'Поиск',
      'Open Search(search trigger)(aria-label)': 'Открыть поиск',
      'Close Search(search dialog)(aria-label)': 'Закрыть поиск',
      'No results found(search dialog)': 'Ничего не найдено',
      'Search failed(search dialog)': 'Поиск не удался',
      'On this page(table of contents)': 'На этой странице',
      'No Headings(table of contents)': 'Нет заголовков',
      'Table of Contents(inline table of contents)': 'Содержание',
      'Previous Page(pagination)': 'Назад',
      'Next Page(pagination)': 'Далее',
      'Edit on GitHub(edit page)': 'Редактировать на GitHub',
      'Last updated on(page footer)': 'Обновлено',
      'Copy Text(code block)(aria-label)': 'Скопировать',
      'Copied Text(code block)(aria-label)': 'Скопировано',
      'Copy Anchor Link(heading anchor)(aria-label)': 'Скопировать ссылку',
      'Copied Anchor Link(heading anchor)(aria-label)': 'Ссылка скопирована',
      'Collapse Sidebar(sidebar)(aria-label)': 'Свернуть боковую панель',
      'Open Sidebar(sidebar)(aria-label)': 'Открыть боковую панель',
      'Close Sidebar(sidebar)(aria-label)': 'Закрыть боковую панель',
      'Hide Sidebar(sidebar)': 'Скрыть панель',
      'Show Sidebar(sidebar)': 'Показать панель',
      'Choose a language(language switcher)': 'Выбрать язык',
      'Language(language switcher)': 'Язык',
      'Skip to Content(skip link)': 'К содержанию',
      'Toggle Theme(theme switcher)(aria-label)': 'Переключить тему',
      'Theme(site menu)': 'Тема',
      'Toggle Menu(home layout header)(aria-label)': 'Открыть меню',
      'Back to Home(404 not found page)': 'На главную',
      'Page Not Found(404 not found page)': 'Страница не найдена',
      'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.(404 not found page)':
        'Возможно, она переехала или была удалена.',
      'Copy Markdown(page actions)': 'Скопировать Markdown',
      'View as Markdown(page actions)': 'Открыть как Markdown',
      'Options(aria-label)': 'Опции',
    },
    en: { displayName: 'English' },
  });

const navText: Record<Lang, { docs: string; migration: string; plugins: string; download: string }> = {
  ru: { docs: 'Документация', migration: 'Миграция', plugins: 'Плагины', download: 'Скачать' },
  en: { docs: 'Documentation', migration: 'Migration', plugins: 'Plugins', download: 'Download' },
};

/**
 * The docs layout already has the page tree in its sidebar. Repeating the
 * site nav there duplicates entries (and highlights two of them at once),
 * so we keep only a download shortcut next to the GitHub icon.
 */
export function docsOptions(locale: string): BaseLayoutProps {
  const lang: Lang = locale === 'en' ? 'en' : 'ru';
  const text = navText[lang];

  return {
    nav: {
      title: <Logo />,
      url: `/${lang}`,
    },
    githubUrl: links.github,
    themeSwitch: { enabled: false },
    links: [
      {
        type: 'icon',
        label: text.download,
        text: text.download,
        url: `/${lang}/download`,
        icon: <Download />,
      },
    ],
  };
}


export const githubBranch = gitConfig.branch;

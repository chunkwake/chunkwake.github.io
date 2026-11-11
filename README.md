# chunkwake.github.io

Сайт проекта [Chunkwake](https://github.com/chunkwake/core): документация, страница загрузки и обзор архитектуры.

Стек: Next.js 16 + Fumadocs 16, статический экспорт, деплой на GitHub Pages через Actions.
Дизайн: тёмная тема, палитра `#181818 / #202020 / #303030 / #A6A092 / #E7E7E7`.

## Локально

```bash
pnpm install
pnpm dev          # http://localhost:8500
```

Проверка перед PR:

```bash
pnpm types:check
pnpm build        # статика в out/ + кастомный 404.html
pnpm preview      # http://localhost:8500
```

## Структура

```
app/(root)/            / → /ru/ (редирект) и глобальная 404
app/[lang]/(site)      лендинг, загрузка и поддержка
app/[lang]/docs        документация Fumadocs
app/api/search         статический поисковый индекс
app/manifest.ts        PWA-манифест
content/docs           MDX, русский — базовый, английский — суффикс .en
lib/i18n.ts            локали ru/en
lib/dictionary.ts      тексты лендинга
lib/source.ts          источник документации
components/            лендинг, логотип, шапка, футер, загрузка,
                       Shiki-код, Java/Kotlin-табы и React Flow-диаграмма
source.config.ts       общая тема Shiki для MDX-кода
public/                favicon, OG-картинки, PWA-иконки, 404.html
scripts/postbuild.mjs  копирует кастомный 404 и .nojekyll в out/
```

## Документация

`content/docs/index.mdx` — русская страница, `index.en.mdx` — английская. Аналогично для остальных файлов.
Для новой страницы добавьте её slug в `content/docs/meta.json`.

Фич-матрица синхронизируется автоматически: `scripts/sync-feature-matrix.mjs` забирает
`core/docs/feature-matrix.md` при сборке и кладёт разобранный JSON в `content/data`.
Если GitHub недоступен, сборка использует последнюю сохранённую копию. `scripts/sync-docs-meta.mjs`
собирает даты последних изменений страниц, а `pnpm images:generate` пересобирает OG-картинки
и PWA-иконки. Остальной контент `core/docs` пока не синхронизируется: страницы `getting-started`,
`plugins` и `architecture` — курированные версии исходной документации.

## Деплой

Workflow `.github/workflows/site.yml` собирает `out/` и публикует через GitHub Pages artifact.
Ветка `gh-pages` не используется.

Один раз в настройках репозитория:

1. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
2. Workflow сам вызовет `configure-pages` с `enablement: true`.

Сайт: <https://chunkwake.github.io/>. Репозиторий называется `chunkwake.github.io`, поэтому
`basePath` не нужен.

После появления релизов в `chunkwake/core` можно добавить `repository_dispatch` (`release`)
из workflow ядра, чтобы страница загрузки пересобиралась автоматически.

## Что дальше

- синхронизация остального `core/docs` → MDX на сборке;
- страница загрузки из GitHub Releases API;
- каталог совместимости плагинов.

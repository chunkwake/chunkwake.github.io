/**
 * Scripted terminal sessions. Each demo is recorded from a real binary by
 * `scripts/record-terminal.mjs`; keep commands deterministic and free of a
 * connected client so the output stays useful in the docs.
 */
export const sessions = [
  {
    id: 'cli-help',
    kind: 'cli',
    args: ['--help'],
    shell: 'cli',
    title: { ru: 'CLI целиком', en: 'The whole CLI' },
    description: {
      ru: 'Все команды установки, диагностики, бэкапов и наблюдения.',
      en: 'Setup, diagnostics, backups and observability in one place.',
    },
  },
  {
    id: 'doctor',
    kind: 'cli',
    args: ['doctor'],
    needsDir: true,
    shell: 'cli',
    title: { ru: 'Проверка перед запуском', en: 'Preflight check' },
    description: {
      ru: 'Doctor проверяет порт, встроенные данные и Java для плагинов.',
      en: 'Doctor checks the port, embedded data and Java for plugins.',
    },
  },
  {
    id: 'config',
    kind: 'cli',
    args: ['config', 'show'],
    needsDir: true,
    shell: 'cli',
    title: { ru: 'Текущие настройки', en: 'Current settings' },
    description: {
      ru: 'Что записано в server.properties и какие значения ждут своей очереди.',
      en: 'What is written to server.properties and which values are reserved.',
    },
  },
  {
    id: 'console',
    kind: 'server',
    commands: ['version', 'help'],
    title: { ru: 'Консоль сервера', en: 'Server console' },
    description: {
      ru: 'Консоль принимает те же команды, что и чат, без слэша.',
      en: 'The console accepts the same commands as chat, without the slash.',
    },
  },
  {
    id: 'tick',
    kind: 'server',
    commands: ['tps', 'top'],
    title: { ru: 'TPS и снимок нагрузки', en: 'TPS and load snapshot' },
    description: {
      ru: 'Две команды Chunkwake: короткая строка и полный снимок по подсистемам.',
      en: 'Two Chunkwake commands: a short line and a full breakdown by subsystem.',
    },
  },
  {
    id: 'world',
    kind: 'server',
    commands: [
      'time set day',
      'seed',
      'setblock 0 64 0 stone',
      'fill 0 64 0 2 64 2 glass',
      'save-all',
    ],
    title: { ru: 'Время, сид и блоки', en: 'Time, seed and blocks' },
    description: {
      ru: 'Ванильные команды на настоящем плоском мире, без подключённого клиента.',
      en: 'Vanilla commands against a real flat world, with no client attached.',
    },
  },
];

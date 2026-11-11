import { featureMatrix } from './feature-matrix';
import type { Lang } from './i18n';

export type MilestoneState = 'done' | 'active' | 'current' | 'next' | 'planned' | 'research';

export type Milestone = {
  id: string;
  title: Record<Lang, string>;
  summary: Record<Lang, string>;
  state: MilestoneState;
};

export type StageCounts = {
  total: number;
  ready: number;
  partial: number;
  missing: number;
};

const allRows = featureMatrix.sections.flatMap((section) => section.rows);

function stageCounts(stage: string): StageCounts {
  const rows = allRows.filter((row) => row.stage.includes(stage));
  return {
    total: rows.length,
    ready: rows.filter((row) => row.status === 'ready').length,
    partial: rows.filter((row) => row.status === 'partial').length,
    missing: rows.filter((row) => row.status === 'missing').length,
  };
}

export const stageCountsM5 = stageCounts('M5');
export const stageCountsM7 = stageCounts('M7');

export const stateLabels: Record<MilestoneState, Record<Lang, string>> = {
  done: { ru: 'пройдено', en: 'complete' },
  active: { ru: 'развивается', en: 'active' },
  current: { ru: 'текущий фокус', en: 'current focus' },
  next: { ru: 'дальше', en: 'next' },
  planned: { ru: 'план', en: 'planned' },
  research: { ru: 'исследование', en: 'research' },
};

export const statusPageMeta = {
  ru: {
    title: 'Статус и этапы',
    description:
      'Публичный план Chunkwake: что уже работает, где сейчас фокус и что дальше. Цифры берутся из фич-матрицы.',
  },
  en: {
    title: 'Status and milestones',
    description:
      'The public Chunkwake plan: what already works, where the focus is now and what comes next. Numbers come from the feature matrix.',
  },
} as const;

export const milestones: Milestone[] = [
  {
    id: 'M0',
    state: 'done',
    title: { ru: 'Фундамент', en: 'Foundations' },
    summary: {
      ru: 'Репозиторий, ветка `ver/26.3`, workspace, CI с fmt/clippy/test на Windows и Linux, лицензия, `ARCHITECTURE.md` и критерии.',
      en: 'Repository, `ver/26.3` branch, workspace, CI with fmt/clippy/test on Windows and Linux, licence, `ARCHITECTURE.md` and criteria.',
    },
  },
  {
    id: 'M1',
    state: 'done',
    title: { ru: 'Протокол', en: 'Protocol' },
    summary: {
      ru: 'Пакеты 26.3, status ping, вход offline и online через Mojang, configuration-фаза с реестрами.',
      en: '26.3 packets, status ping, offline and online login through Mojang, configuration phase with registries.',
    },
  },
  {
    id: 'M2',
    state: 'done',
    title: { ru: 'Пустой мир', en: 'Empty world' },
    summary: {
      ru: 'Вход в void/flat мир, движение, стриминг чанков, keep-alive, чат и таб-лист. Нагрузка проверялась тысячей ботов.',
      en: 'Void/flat world login, movement, chunk streaming, keep-alive, chat and tab list. Load was checked with a thousand bots.',
    },
  },
  {
    id: 'M3',
    state: 'done',
    title: { ru: 'Мир и хранение', en: 'World and storage' },
    summary: {
      ru: 'Anvil load/save, палитры, свет, установка и ломка блоков, async I/O, региональный тикинг.',
      en: 'Anvil load/save, palettes, light, block placement and breaking, async I/O, region ticking.',
    },
  },
  {
    id: 'M4',
    state: 'done',
    title: { ru: 'JVM-мост', en: 'JVM bridge' },
    summary: {
      ru: 'Загрузка `plugin.yml` и `paper-plugin.yml`, `onEnable`, команды, события, планировщики. Мост работает через FFM.',
      en: '`plugin.yml` and `paper-plugin.yml` loading, `onEnable`, commands, events, schedulers. The bridge uses FFM.',
    },
  },
  {
    id: 'M5',
    state: 'active',
    title: { ru: 'Геймплей', en: 'Gameplay' },
    summary: {
      ru: 'Игроки, инвентари, предметы, мобы, урон, смерть и респаун, печи, крафт, чары, жидкости, редстоун и звуки. Часть механик ещё доводится.',
      en: 'Players, inventories, items, mobs, damage, death and respawn, furnaces, crafting, enchanting, fluids, redstone and sounds. Some mechanics are still being completed.',
    },
  },
  {
    id: 'M6',
    state: 'active',
    title: { ru: 'Расширение API', en: 'API expansion' },
    summary: {
      ru: 'Покрытие Bukkit API под популярные плагины: LuckPerms, Vault, EssentialsX, WorldEdit/FAWE, WorldGuard, PlaceholderAPI, ProtocolLib/PacketEvents.',
      en: 'Bukkit API coverage for popular plugins: LuckPerms, Vault, EssentialsX, WorldEdit/FAWE, WorldGuard, PlaceholderAPI, ProtocolLib/PacketEvents.',
    },
  },
  {
    id: 'M7',
    state: 'current',
    title: { ru: 'Мир, редстоун и остальная ваниль', en: 'Worldgen, redstone and the rest of vanilla' },
    summary: {
      ru: 'Итеративно закрываются генерация, структуры, мобы, боссы, жители, рыбалка, достижения и game events. Это текущий фокус.',
      en: 'Generation, structures, mobs, bosses, villagers, fishing, advancements and game events are being closed iteratively. This is the current focus.',
    },
  },
  {
    id: 'M8',
    state: 'next',
    title: { ru: 'Производительность и стабильность', en: 'Performance and stability' },
    summary: {
      ru: 'Профилирование, нагрузочные тесты, fuzzing протокола и длительные soak-тесты.',
      en: 'Profiling, load tests, protocol fuzzing and long soak tests.',
    },
  },
  {
    id: 'M9',
    state: 'planned',
    title: { ru: 'Публичная альфа', en: 'Public alpha' },
    summary: {
      ru: 'Публичный релиз после стабилизации и закрытия критичных механик. Даты не обещаются: статус важнее календаря.',
      en: 'A public release after stabilisation and the remaining critical mechanics. No dates are promised: status beats the calendar.',
    },
  },
  {
    id: 'M10',
    state: 'planned',
    title: { ru: 'Плагины на других языках', en: 'Plugins in other languages' },
    summary: {
      ru: 'Стабильный C ABI поверх JVM-моста: Rust, Python, затем C/C++, C# и другие обёртки. После альфы.',
      en: 'A stable C ABI on top of the JVM bridge: Rust, Python, then C/C++, C# and other wrappers. After alpha.',
    },
  },
];

export const researchTracks: Milestone[] = [
  {
    id: 'M3a',
    state: 'research',
    title: { ru: 'Журнал изменений и WAL', en: 'Event log and WAL' },
    summary: {
      ru: 'Event-sourced лог изменений мира и write-ahead log для отката и replay.',
      en: 'An event-sourced world change log and write-ahead log for rollback and replay.',
    },
  },
  {
    id: 'M4a',
    state: 'research',
    title: { ru: 'Off-heap секции', en: 'Off-heap sections' },
    summary: {
      ru: 'Секции чанков как `MemorySegment`: чтение блоков без вызова через мост.',
      en: 'Chunk sections as `MemorySegment`: block reads without a bridge call.',
    },
  },
  {
    id: 'M4b',
    state: 'research',
    title: { ru: 'STM-тик', en: 'STM tick' },
    summary: {
      ru: 'Read/write-set, детерминированный коммит и откат; тесты гонок на синтетических плагинах.',
      en: 'Read/write sets, deterministic commit and rollback; race tests on synthetic plugins.',
    },
  },
  {
    id: 'M6a',
    state: 'research',
    title: { ru: 'Компилятор совместимости', en: 'Compatibility compiler' },
    summary: {
      ru: 'ASM-анализ байткода плагинов и shim’ы для несовместимых обращений к internals.',
      en: 'ASM analysis of plugin bytecode and shims for incompatible internals access.',
    },
  },
];

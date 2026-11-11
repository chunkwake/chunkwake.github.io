import type { Lang } from './i18n';

type Status = 'ready' | 'partial' | 'none';

export interface SiteCopy {
  meta: {
    title: string;
    description: string;
  };
  nav: {
    docs: string;
    migration: string;
    plugins: string;
    download: string;
    support: string;
    github: string;
    menu: string;
  };
  hero: {
    title: string;
    titleAccent: string;
    titleTail: string;
    lead: string;
    command: string;
    primary: string;
    secondary: string;
    platforms: string;
  };
  terminal: {
    title: string;
    lines: { kind: 'prompt' | 'ok' | 'muted' | 'accent'; text: string }[];
    footer: string;
  };
  stats: {
    eyebrow: string;
    title: string;
    note: string;
    items: { value: string; unit?: string; label: string; sub: string }[];
  };
  compat: {
    eyebrow: string;
    title: string;
    lead: string;
    head: [string, string, string];
    rows: { name: string; plugins: { status: Status; label: string }; threads: { status: Status; label: string } }[];
    note: string;
  };
  features: {
    eyebrow: string;
    title: string;
    lead: string;
    columns: {
      title: string;
      kicker: string;
      items: { label: string; status: Status }[];
    }[];
  };
  plugins: {
    eyebrow: string;
    title: string;
    lead: string;
    bullets: string[];
    codeTitle: string;
    code: string;
    codeKotlin: string;
    file: string;
    note: string;
  };
  architecture: {
    eyebrow: string;
    title: string;
    lead: string;
    tree: string;
    footnote: string;
    nodes: {
      client: { label: string; tip: string };
      net: { label: string; tip: string };
      world: { label: string; tip: string };
      mechanics: { label: string; tip: string };
      bridge: { label: string; tip: string };
      jvm: { label: string; tip: string };
      plugins: { label: string; tip: string };
    };
    hoverHint: string;
  };
  roadmap: {
    eyebrow: string;
    title: string;
    lead: string;
    items: { tag: string; title: string; text: string }[];
  };
  cta: {
    title: string;
    lead: string;
    command: string;
    docs: string;
    download: string;
  };
  footer: {
    tagline: string;
    project: string;
    docs: string;
    legal: string;
    links: {
      github: string;
      issues: string;
      releases: string;
      quickstart: string;
      migration: string;
      plugins: string;
      matrix: string;
      architecture: string;
      support: string;
      license: string;
    };
    disclaimer: string;
    trademark: string;
  };
  support: {
    eyebrow: string;
    title: string;
    lead: string;
    only: string;
    note: string;
    network: string;
    address: string;
    scan: string;
    copy: string;
    copied: string;
    warning: string;
  };
  download: {
    title: string;
    lead: string;
    emptyTitle: string;
    emptyText: string;
    windows: string;
    linux: string;
    source: string;
    sourceNote: string;
    requirements: string;
    platforms: { os: string; file: string; arch: string; note: string }[];
    latest: string;
    checksum: string;
    previous: string;
    reqRust: string;
    reqJdk: string;
    reqJava: string;
    osDetected: string;
    osUnknown: string;
  };
  docs: {
    label: string;
    intro: string;
  };
}

const ru: SiteCopy = {
  meta: {
    title: 'Chunkwake — сервер Minecraft на Rust',
    description:
      'Серверное ядро Minecraft 26.3 на Rust: ванильное поведение и плагины Paper/Folia через настоящий paper-api.jar в JVM внутри процесса.',
  },
  nav: {
    docs: 'Документация',
    migration: 'Миграция',
    plugins: 'Плагины',
    download: 'Скачать',
    support: 'Поддержать',
    github: 'GitHub',
    menu: 'Меню',
  },
  hero: {
    title: 'Сервер Minecraft на Rust.',
    titleAccent: 'Плагины Paper',
    titleTail: 'работают без переписывания.',
    lead: 'Движок, сеть, генерация и свет — на Rust, без GC-пауз. Настоящий paper-api.jar живёт в JVM внутри процесса сервера. Всё в одном бинарнике: данные игры и API плагинов уже внутри.',
    command: 'chunkwake setup --dir ./server',
    primary: 'Быстрый старт',
    secondary: 'Скачать сборку',
    platforms: 'Windows x86_64 · Linux x86_64 (musl) · Java 25+ только для плагинов',
  },
  terminal: {
    title: 'chunkwake doctor',
    lines: [
      { kind: 'prompt', text: 'chunkwake doctor --dir ./server' },
      { kind: 'ok', text: 'server.properties        ok' },
      { kind: 'ok', text: 'embedded vanilla data    26.3' },
      { kind: 'ok', text: 'port                     25565' },
      { kind: 'ok', text: 'java 25 (plugins)        found' },
      { kind: 'accent', text: 'ready in 34 ms' },
      { kind: 'muted', text: 'paper-api.jar embedded · 1 binary' },
    ],
    footer: 'engine: rust · plugins: jvm · ticking: 20 tps',
  },
  stats: {
    eyebrow: 'Замеры',
    title: 'Быстрее, потому что нет лишнего.',
    note: 'Ryzen 9 7945HX, release-сборка, сравнение с server.jar 26.3: 20 ботов, разминка 20 с, замер 45 с. Полная методика — в docs/perf.md.',
    items: [
      { value: '0.6–0.9', unit: 'с', label: 'Запуск сервера', sub: 'у ванили 6.6–11 с' },
      { value: '20', unit: 'TPS', label: '2500 коров', sub: '3.9–5.6 мс MSPT · у ванили 4.4–8.6 TPS' },
      { value: '182–236', unit: 'МиБ', label: 'Пик памяти', sub: 'у ванили 845–913 МиБ' },
      { value: '6.9', unit: 'КБ', label: 'Чанк на диске', sub: 'deflate 6 · у ванили 8.7 КБ' },
    ],
  },
  compat: {
    eyebrow: 'Совместимость',
    title: 'Обычные плагины Paper на многопоточном ядре.',
    lead: 'Chunkwake запускает плагины Paper и при этом строит движок вокруг Rust и tokio.',
    head: ['Ядро', 'Плагины Paper/Folia', 'Многопоточность'],
    rows: [
      {
        name: 'Paper',
        plugins: { status: 'ready', label: 'Обычные плагины' },
        threads: { status: 'none', label: 'Один главный поток' },
      },
      {
        name: 'Folia',
        plugins: { status: 'partial', label: 'Только folia-supported' },
        threads: { status: 'ready', label: 'Регионы' },
      },
      {
        name: 'Chunkwake',
        plugins: { status: 'ready', label: 'Paper и Folia API' },
        threads: { status: 'partial', label: 'По этапам' },
      },
    ],
    note: 'Граница совместимости — плагины, которые лезут во внутренности NMS и CraftBukkit. Ванильные классы лежат в classpath, часть таких плагинов работает; полностью это не обещается.',
  },
  features: {
    eyebrow: 'Что уже работает',
    title: 'Мир, механики и плагины уже работают.',
    lead: 'Генерация мира, редстоун, мобы, инвентарь и плагины уже реализованы. Построчная матрица со статусами — в документации.',
    columns: [
      {
        title: 'Мир',
        kicker: 'worldgen',
        items: [
          { label: 'Ванильная генерация оверворлда', status: 'ready' },
          { label: 'Нижний мир и Край', status: 'ready' },
          { label: 'Anvil в обе стороны', status: 'ready' },
          { label: 'Свет, спавн, граница мира', status: 'ready' },
          { label: 'Деревни и структуры', status: 'partial' },
        ],
      },
      {
        title: 'Механики',
        kicker: 'tick',
        items: [
          { label: 'Редстоун и поршни', status: 'ready' },
          { label: 'Жидкости, огонь, случайные тики', status: 'ready' },
          { label: 'Мобы, снаряды, опыт', status: 'ready' },
          { label: 'Печи, наковальня, станции', status: 'ready' },
          { label: 'Таблички и книги', status: 'ready' },
        ],
      },
      {
        title: 'Плагины',
        kicker: 'jvm',
        items: [
          { label: 'Настоящий paper-api.jar', status: 'ready' },
          { label: 'События в порядке Paper', status: 'ready' },
          { label: 'Планировщики Folia', status: 'ready' },
          { label: 'Maven libraries, loader/bootstrapper', status: 'ready' },
          { label: 'NMS-классы в classpath', status: 'partial' },
        ],
      },
      {
        title: 'Эксплуатация',
        kicker: 'ops',
        items: [
          { label: 'Один бинарник', status: 'ready' },
          { label: 'setup, doctor, config set', status: 'ready' },
          { label: 'Резервные копии и откат', status: 'ready' },
          { label: 'Встроенный дашборд метрик', status: 'ready' },
          { label: 'Ванильные команды', status: 'ready' },
        ],
      },
    ],
  },
  plugins: {
    eyebrow: 'Разработчикам плагинов',
    title: 'Плагины собираются и работают как на Paper.',
    lead: 'В classpath лежит официальный paper-api.jar. Реализовано поведение API, поэтому код собирается и работает как на Paper.',
    bullets: [
      'Bukkit и Paper события в порядке Paper, с отменой и подменой данных.',
      'GlobalRegionScheduler, RegionScheduler, AsyncScheduler и EntityScheduler для всех плагинов.',
      'plugin.yml и paper-plugin.yml, libraries из Maven, loader и bootstrapper.',
      'PDC, Metadatable, реестры, теги, атрибуты и каналы плагинов.',
    ],
    codeTitle: 'HelloPlugin',
    code: `public final class HelloPlugin extends JavaPlugin {
  @Override
  public void onEnable() {
    getServer().getPluginManager().registerEvents(new Listener() {
      @EventHandler(priority = EventPriority.NORMAL)
      public void onJoin(PlayerJoinEvent event) {
        event.getPlayer().sendMessage("chunkwake is awake");
      }
    }, this);
  }
}`,
    codeKotlin: `class HelloPlugin : JavaPlugin() {
  override fun onEnable() {
    server.pluginManager.registerEvents(object : Listener() {
      @EventHandler(priority = EventPriority.NORMAL)
      fun onJoin(event: PlayerJoinEvent) {
        event.player.sendMessage("chunkwake is awake")
      }
    }, this)
  }
}`,
    file: `name: HelloPlugin
version: 1.0.0
main: dev.chunkwake.hello.HelloPlugin
api-version: "26.3"`,
    note: 'Плагинам нужна Java 25+. Сервер найдёт её по java-path, CHUNKWAKE_JAVA или PATH.',
  },
  architecture: {
    eyebrow: 'Устройство',
    title: 'Ядро на Rust, плагины в JVM.',
    lead: 'Ядро и мир живут в Rust. Плагины — в настоящей JVM рядом, через JNI-мост. Если на событие нет слушателей, Rust его никуда не отправляет.',
    tree: `crates/
├── protocol    пакеты 26.3, NBT, текстовые компоненты
├── net         соединения, игра, команды, события
├── worldgen    шум, биомы, поверхности, структуры
├── world       чанки, палитры, Anvil, свет
├── bridge      JVM через JNI, встроенный API
├── server      бинарник: CLI, setup, консоль, бэкапы
├── metrics     метрики и дашборд
└── lab         сравнение с ванилью и бенчмарки

java/
├── api-impl    Bukkit / Paper / Folia поверх Rust
└── test-plugin живые проверки событий`,
    footnote: 'Около 170 тыс. строк Rust и 14 тыс. строк Java.',
    nodes: {
      client: {
        label: 'Клиент 26.3',
        tip: 'Подключается по протоколу 26.3. Status, login, configuration и play — на Rust.',
      },
      net: {
        label: 'net · tokio',
        tip: 'Соединения, пакеты, команды и механики. Отсюда события уходят в мост.',
      },
      world: {
        label: 'world · worldgen',
        tip: 'Чанки, Anvil, свет и ванильная генерация. Рельеф сверяется с server.jar.',
      },
      mechanics: {
        label: 'redstone · mobs',
        tip: 'Редстоун, мобы, жидкости, инвентарь и случайные тики.',
      },
      bridge: {
        label: 'JNI bridge',
        tip: 'В JVM уходят только события со слушателями и запросы плагинов.',
      },
      jvm: {
        label: 'JVM · paper-api',
        tip: 'Настоящая JVM: официальный paper-api.jar и api-impl рядом.',
      },
      plugins: {
        label: 'plugins/*.jar',
        tip: 'Обычные плагины Paper из plugins/. Переписывать ничего не нужно.',
      },
    },
    hoverHint: 'наведи на узел',
  },
  roadmap: {
    eyebrow: 'Дальше',
    title: 'Что запланировано.',
    lead: 'Этих возможностей пока нет в релизе. Описание — в ARCHITECTURE.md.',
    items: [
      { tag: 'STM-тик', title: 'Параллельный тик с Paper-семантикой', text: 'Плагины видят один главный поток, а исполняются параллельно.' },
      { tag: 'Islands', title: 'Динамические острова вместо регионов', text: 'Мир делится по нагрузке, а не по фиксированной сетке Folia.' },
      { tag: 'Event log', title: 'Мир как журнал событий', text: 'Откат и повтор изменений вместо резервных копий целиком.' },
      { tag: 'Panama', title: 'Мост на FFM с общей памятью', text: 'Следующее поколение границы между Rust и JVM.' },
    ],
  },
  cta: {
    title: 'Попробуй на своём сервере.',
    lead: 'Сборка релиза появится здесь, как только выйдет первый тег. Пока — из исходников за пару минут.',
    command: 'chunkwake setup --dir ./server',
    docs: 'Открыть документацию',
    download: 'Страница загрузки',
  },
  footer: {
    tagline: 'Сервер Minecraft Java Edition 26.3 на Rust. Совместим с плагинами Paper и Folia.',
    project: 'Проект',
    docs: 'Документация',
    legal: 'Лицензия',
    links: {
      github: 'GitHub',
      issues: 'Issues',
      releases: 'Релизы',
      quickstart: 'Быстрый старт',
      migration: 'Миграция с Paper',
      plugins: 'Разработка плагинов',
      matrix: 'Фич-матрица',
      architecture: 'Архитектура',
      support: 'Поддержать проект',
      license: 'GPL-3.0',
    },
    disclaimer: 'Независимый проект. Не связан с Mojang Studios, Microsoft, PaperMC или Folia и не одобрен ими.',
    trademark: 'Minecraft — товарный знак Mojang Synergies AB.',
  },
  support: {
    eyebrow: 'Поддержка',
    title: 'Поддержать проект.',
    lead: 'Если Chunkwake полезен, проект можно поддержать криптовалютой.',
    only: 'Только пожертвования',
    note: 'Только пожертвования: без подписок, аккаунтов и платёжных форм.',
    network: 'Сеть',
    address: 'Адрес',
    scan: 'QR-код для сканирования',
    copy: 'Скопировать адрес',
    copied: 'Адрес скопирован',
    warning:
      'Отправляйте только указанную монету в указанной сети. Перевод в другой сети может быть потерян без возможности возврата.',
  },
  download: {
    title: 'Скачать Chunkwake',
    lead: 'Один бинарник: данные игры и API плагинов встроены. Java нужна только для запуска плагинов.',
    emptyTitle: 'Релизов пока нет',
    emptyText: 'Первая сборка появится здесь после тега. Пока сервер собирается из исходников одной командой.',
    windows: 'Windows x86_64',
    linux: 'Linux x86_64',
    source: 'Собрать из исходников',
    sourceNote: 'Нужны Rust stable и JDK 21+ для экстракторов данных.',
    requirements: 'Требования',
    platforms: [
      { os: 'Windows', file: 'chunkwake-<version>-windows-x86_64.zip', arch: 'x86_64', note: 'Один .exe внутри архива' },
      { os: 'Linux', file: 'chunkwake-<version>-linux-x86_64.tar.gz', arch: 'x86_64 · musl', note: 'Статическая сборка, работает в контейнере' },
    ],
    latest: 'Последняя версия',
    checksum: 'SHA-256',
    previous: 'Прошлые версии',
    reqRust: 'Rust stable',
    reqJdk: 'JDK 21+ — только для сборки данных игры',
    reqJava: 'Java 25+ — только для запуска плагинов',
    osDetected: 'ОС определена автоматически',
    osUnknown: 'Windows x86_64 / Linux x86_64 (musl)',
  },
  docs: {
    label: 'Документация',
    intro: 'Установка, эксплуатация и разработка плагинов.',
  },
};

const en: SiteCopy = {
  meta: {
    title: 'Chunkwake — a Minecraft server in Rust',
    description:
      'A Minecraft 26.3 server core written in Rust: vanilla behaviour and Paper/Folia plugins through a real paper-api.jar in an in-process JVM.',
  },
  nav: {
    docs: 'Documentation',
    migration: 'Migration',
    plugins: 'Plugins',
    download: 'Download',
    support: 'Support',
    github: 'GitHub',
    menu: 'Menu',
  },
  hero: {
    title: 'A Minecraft server in Rust.',
    titleAccent: 'Paper plugins',
    titleTail: 'run without a rewrite.',
    lead: 'Engine, networking, worldgen and lighting are Rust, with no GC pauses. A real paper-api.jar lives in a JVM inside the server process. One binary: game data and the plugin API are embedded.',
    command: 'chunkwake setup --dir ./server',
    primary: 'Quick start',
    secondary: 'Download',
    platforms: 'Windows x86_64 · Linux x86_64 (musl) · Java 25+ only for plugins',
  },
  terminal: {
    title: 'chunkwake doctor',
    lines: [
      { kind: 'prompt', text: 'chunkwake doctor --dir ./server' },
      { kind: 'ok', text: 'server.properties        ok' },
      { kind: 'ok', text: 'embedded vanilla data    26.3' },
      { kind: 'ok', text: 'port                     25565' },
      { kind: 'ok', text: 'java 25 (plugins)        found' },
      { kind: 'accent', text: 'ready in 34 ms' },
      { kind: 'muted', text: 'paper-api.jar embedded · 1 binary' },
    ],
    footer: 'engine: rust · plugins: jvm · ticking: 20 tps',
  },
  stats: {
    eyebrow: 'Benchmarks',
    title: 'Faster because there is less in the way.',
    note: 'Ryzen 9 7945HX, release build, compared with server.jar 26.3: 20 bots, 20 s warmup, 45 s measurement. Full method in docs/perf.md.',
    items: [
      { value: '0.6–0.9', unit: 's', label: 'Server startup', sub: 'vanilla takes 6.6–11 s' },
      { value: '20', unit: 'TPS', label: '2500 cows', sub: '3.9–5.6 ms MSPT · vanilla 4.4–8.6 TPS' },
      { value: '182–236', unit: 'MiB', label: 'Peak memory', sub: 'vanilla 845–913 MiB' },
      { value: '6.9', unit: 'KB', label: 'Chunk on disk', sub: 'deflate 6 · vanilla 8.7 KB' },
    ],
  },
  compat: {
    eyebrow: 'Compatibility',
    title: 'Ordinary Paper plugins on a multithreaded core.',
    lead: 'Chunkwake runs Paper plugins while the engine is built around Rust and tokio.',
    head: ['Core', 'Paper/Folia plugins', 'Multithreading'],
    rows: [
      {
        name: 'Paper',
        plugins: { status: 'ready', label: 'Ordinary plugins' },
        threads: { status: 'none', label: 'Single main thread' },
      },
      {
        name: 'Folia',
        plugins: { status: 'partial', label: 'folia-supported only' },
        threads: { status: 'ready', label: 'Regions' },
      },
      {
        name: 'Chunkwake',
        plugins: { status: 'ready', label: 'Paper and Folia APIs' },
        threads: { status: 'partial', label: 'By stages' },
      },
    ],
    note: 'The compatibility boundary is plugins that reach into NMS and CraftBukkit internals. Vanilla classes are on the classpath and some of those plugins work; this is not promised in full.',
  },
  features: {
    eyebrow: 'What works',
    title: 'World, mechanics and plugins already work.',
    lead: 'World generation, redstone, mobs, inventory and plugins are implemented. The line-by-line status matrix is in the docs.',
    columns: [
      {
        title: 'World',
        kicker: 'worldgen',
        items: [
          { label: 'Vanilla overworld generation', status: 'ready' },
          { label: 'Nether and End', status: 'ready' },
          { label: 'Anvil read and write', status: 'ready' },
          { label: 'Light, spawn, world border', status: 'ready' },
          { label: 'Villages and structures', status: 'partial' },
        ],
      },
      {
        title: 'Mechanics',
        kicker: 'tick',
        items: [
          { label: 'Redstone and pistons', status: 'ready' },
          { label: 'Fluids, fire, random ticks', status: 'ready' },
          { label: 'Mobs, projectiles, XP', status: 'ready' },
          { label: 'Furnaces, anvil, stations', status: 'ready' },
          { label: 'Signs and books', status: 'ready' },
        ],
      },
      {
        title: 'Plugins',
        kicker: 'jvm',
        items: [
          { label: 'The real paper-api.jar', status: 'ready' },
          { label: 'Events in Paper order', status: 'ready' },
          { label: 'Folia schedulers', status: 'ready' },
          { label: 'Maven libraries, loader/bootstrapper', status: 'ready' },
          { label: 'NMS classes on the classpath', status: 'partial' },
        ],
      },
      {
        title: 'Operations',
        kicker: 'ops',
        items: [
          { label: 'One binary', status: 'ready' },
          { label: 'setup, doctor, config set', status: 'ready' },
          { label: 'Backups and rollback', status: 'ready' },
          { label: 'Built-in metrics dashboard', status: 'ready' },
          { label: 'Vanilla commands', status: 'ready' },
        ],
      },
    ],
  },
  plugins: {
    eyebrow: 'Plugin developers',
    title: 'Plugins compile and run as they do on Paper.',
    lead: 'The official paper-api.jar is on the classpath. The API behaviour is implemented, so code compiles and runs as it does on Paper.',
    bullets: [
      'Bukkit and Paper events in Paper order, with cancellation and data replacement.',
      'GlobalRegionScheduler, RegionScheduler, AsyncScheduler and EntityScheduler for every plugin.',
      'plugin.yml and paper-plugin.yml, Maven libraries, loader and bootstrapper.',
      'PDC, Metadatable, registries, tags, attributes and plugin channels.',
    ],
    codeTitle: 'HelloPlugin',
    code: `public final class HelloPlugin extends JavaPlugin {
  @Override
  public void onEnable() {
    getServer().getPluginManager().registerEvents(new Listener() {
      @EventHandler(priority = EventPriority.NORMAL)
      public void onJoin(PlayerJoinEvent event) {
        event.getPlayer().sendMessage("chunkwake is awake");
      }
    }, this);
  }
}`,
    codeKotlin: `class HelloPlugin : JavaPlugin() {
  override fun onEnable() {
    server.pluginManager.registerEvents(object : Listener() {
      @EventHandler(priority = EventPriority.NORMAL)
      fun onJoin(event: PlayerJoinEvent) {
        event.player.sendMessage("chunkwake is awake")
      }
    }, this)
  }
}`,
    file: `name: HelloPlugin
version: 1.0.0
main: dev.chunkwake.hello.HelloPlugin
api-version: "26.3"`,
    note: 'Plugins need Java 25+. The server finds it via java-path, CHUNKWAKE_JAVA or PATH.',
  },
  architecture: {
    eyebrow: 'Architecture',
    title: 'A Rust core with plugins in the JVM.',
    lead: 'The core and the world live in Rust. Plugins live in a real JVM next to it through a JNI bridge. If an event has no listeners, Rust never sends it anywhere.',
    tree: `crates/
├── protocol    packets 26.3, NBT, text components
├── net         connections, game, commands, events
├── worldgen    noise, biomes, surfaces, structures
├── world       chunks, palettes, Anvil, light
├── bridge      JVM over JNI, embedded API
├── server      binary: CLI, setup, console, backups
├── metrics     metrics and dashboard
└── lab         vanilla comparison and benchmarks

java/
├── api-impl    Bukkit / Paper / Folia on top of Rust
└── test-plugin live event checks`,
    footnote: 'About 170k lines of Rust and 14k lines of Java.',
    nodes: {
      client: {
        label: 'Client 26.3',
        tip: 'Connects over the 26.3 protocol. Status, login, configuration and play run in Rust.',
      },
      net: {
        label: 'net · tokio',
        tip: 'Connections, packets, commands and mechanics. Events leave for the bridge from here.',
      },
      world: {
        label: 'world · worldgen',
        tip: 'Chunks, Anvil, light and vanilla world generation. Terrain is checked against server.jar.',
      },
      mechanics: {
        label: 'redstone · mobs',
        tip: 'Redstone, mobs, fluids, inventory and random ticks.',
      },
      bridge: {
        label: 'JNI bridge',
        tip: 'Only events with listeners and plugin requests cross into the JVM.',
      },
      jvm: {
        label: 'JVM · paper-api',
        tip: 'A real JVM with the official paper-api.jar and api-impl next to it.',
      },
      plugins: {
        label: 'plugins/*.jar',
        tip: 'Ordinary Paper plugins from plugins/. Nothing needs a rewrite.',
      },
    },
    hoverHint: 'hover a node',
  },
  roadmap: {
    eyebrow: 'Next',
    title: 'What is planned.',
    lead: 'These features are not in a release yet. The design is described in ARCHITECTURE.md.',
    items: [
      { tag: 'STM tick', title: 'Parallel ticking with Paper semantics', text: 'Plugins see one main thread while executing in parallel.' },
      { tag: 'Islands', title: 'Dynamic islands instead of regions', text: 'The world is split by load, not by Folia’s fixed grid.' },
      { tag: 'Event log', title: 'The world as an event log', text: 'Rollback and replay instead of whole-world backups.' },
      { tag: 'Panama', title: 'An FFM bridge with shared memory', text: 'The next generation of the Rust/JVM boundary.' },
    ],
  },
  cta: {
    title: 'Try it on your server.',
    lead: 'Release builds will appear here as soon as the first tag ships. For now, build from source in a couple of minutes.',
    command: 'chunkwake setup --dir ./server',
    docs: 'Open documentation',
    download: 'Download page',
  },
  footer: {
    tagline: 'A Minecraft Java Edition 26.3 server in Rust. Compatible with Paper and Folia plugins.',
    project: 'Project',
    docs: 'Documentation',
    legal: 'License',
    links: {
      github: 'GitHub',
      issues: 'Issues',
      releases: 'Releases',
      quickstart: 'Quick start',
      migration: 'Migrating from Paper',
      plugins: 'Plugin development',
      matrix: 'Feature matrix',
      architecture: 'Architecture',
      support: 'Support the project',
      license: 'GPL-3.0',
    },
    disclaimer: 'An independent project. Not affiliated with or endorsed by Mojang Studios, Microsoft, PaperMC or Folia.',
    trademark: 'Minecraft is a trademark of Mojang Synergies AB.',
  },
  support: {
    eyebrow: 'Support',
    title: 'Support the project.',
    lead: 'If Chunkwake is useful to you, you can support the project with crypto.',
    only: 'Donations only',
    note: 'Donations only: no subscriptions, accounts or payment forms.',
    network: 'Network',
    address: 'Address',
    scan: 'QR code to scan',
    copy: 'Copy address',
    copied: 'Address copied',
    warning:
      'Send only the listed coin on the listed network. A transfer on another network may be lost with no way to recover it.',
  },
  download: {
    title: 'Download Chunkwake',
    lead: 'One binary: game data and the plugin API are embedded. Java is only needed to run plugins.',
    emptyTitle: 'No releases yet',
    emptyText: 'The first build will appear here after the first tag. Until then, build the server from source with one command.',
    windows: 'Windows x86_64',
    linux: 'Linux x86_64',
    source: 'Build from source',
    sourceNote: 'Requires Rust stable and JDK 21+ for the data extractors.',
    requirements: 'Requirements',
    platforms: [
      { os: 'Windows', file: 'chunkwake-<version>-windows-x86_64.zip', arch: 'x86_64', note: 'A single .exe inside the archive' },
      { os: 'Linux', file: 'chunkwake-<version>-linux-x86_64.tar.gz', arch: 'x86_64 · musl', note: 'Static build, runs in a container' },
    ],
    latest: 'Latest version',
    checksum: 'SHA-256',
    previous: 'Previous versions',
    reqRust: 'Rust stable',
    reqJdk: 'JDK 21+ — only for building game data',
    reqJava: 'Java 25+ — only for running plugins',
    osDetected: 'OS detected automatically',
    osUnknown: 'Windows x86_64 / Linux x86_64 (musl)',
  },
  docs: {
    label: 'Documentation',
    intro: 'Installation, operations and plugin development.',
  },
};

export const copy: Record<Lang, SiteCopy> = { ru, en };

export function getCopy(lang: string): SiteCopy {
  return lang === 'en' ? en : ru;
}

'use client';

import { useEffect, useMemo, useState } from 'react';
import { Check, RotateCcw } from 'lucide-react';

type Lang = 'ru' | 'en';

const storageKey = 'chunkwake:migration-checklist:v1';

const ui = {
  ru: {
    progress: 'готово',
    of: 'из',
    steps: 'шагов',
    reset: 'Сбросить',
    stored: 'Отметки хранятся только в этом браузере, в localStorage.',
    groups: [
      {
        title: 'Подготовка',
        items: [
          'Снята полная копия каталога Paper/Folia: миры, плагины, конфиги, `ops.json`.',
          'Проверены фич-матрица и критические плагины: NMS, CraftBukkit, конфиги Paper.',
          'Создан тестовый клон; рабочий сервер не мигрируется первым.',
          'Для плагинов доступна Java 25+, путь к ней известен.',
        ],
      },
      {
        title: 'Перенос',
        items: [
          'Chunkwake установлен в отдельный каталог, Paper-инсталляция сохранена.',
          'Миры скопированы, имена совпадают с `level-name`.',
          '`plugins/` перенесён вместе с папками данных и баз.',
          'Настройки сверены: порт, MOTD, `online-mode`, сид, сжатие, Java.',
          'Velocity переведён на modern forwarding, backend-порт закрыт от клиентов.',
        ],
      },
      {
        title: 'Проверка',
        items: [
          '`chunkwake doctor` проходит без ошибок, порт свободен.',
          'Сервер запускается, виден в списке и принимает вход.',
          'Мир, инвентари, координаты и данные игроков на месте.',
          'Чанки и свет грузятся без ошибок.',
          'Команды, права и `ops.json` работают.',
          'Плагины включились, события срабатывают, задачи планировщиков выполняются.',
          'PDC, реестры, теги и атрибуты читаются.',
          'TPS и MSPT не деградировали под вашей нагрузкой.',
        ],
      },
      {
        title: 'Откат',
        items: [
          'Создан и проверен бэкап Chunkwake: `backup create`, `backup verify`.',
          'План отката на Paper проверен на тестовом клоне.',
          'Paper-каталог и бэкапы не удаляются, пока Chunkwake не отработает несколько дней.',
        ],
      },
    ],
  },
  en: {
    progress: 'done',
    of: 'of',
    steps: 'steps',
    reset: 'Reset',
    stored: 'Progress is stored only in this browser, in localStorage.',
    groups: [
      {
        title: 'Preparation',
        items: [
          'A full copy of the Paper/Folia directory exists: worlds, plugins, configs, `ops.json`.',
          'The feature matrix and critical plugins were checked: NMS, CraftBukkit, Paper configs.',
          'A test clone exists; the production server is not migrated first.',
          'Java 25+ is available for plugins and its path is known.',
        ],
      },
      {
        title: 'Transfer',
        items: [
          'Chunkwake is installed in a separate directory; the Paper install is kept.',
          'Worlds are copied and their names match `level-name`.',
          '`plugins/` was moved together with data folders and databases.',
          'Settings were checked: port, MOTD, `online-mode`, seed, compression, Java.',
          'Velocity uses modern forwarding; the backend port is closed to clients.',
        ],
      },
      {
        title: 'Verification',
        items: [
          '`chunkwake doctor` passes and the port is free.',
          'The server starts, appears in the list and accepts logins.',
          'Worlds, inventories, positions and player data are intact.',
          'Chunks and light load without errors.',
          'Commands, permissions and `ops.json` work.',
          'Plugins enabled, events fire and scheduler tasks run.',
          'PDC, registries, tags and attributes read correctly.',
          'TPS and MSPT did not regress under your load.',
        ],
      },
      {
        title: 'Rollback',
        items: [
          'A Chunkwake backup was created and verified: `backup create`, `backup verify`.',
          'The Paper rollback plan was tested on the clone.',
          'The Paper directory and backups are kept until Chunkwake has run for several days.',
        ],
      },
    ],
  },
} as const;

function itemId(groupIndex: number, itemIndex: number) {
  return `g${groupIndex}-i${itemIndex}`;
}

function renderInline(value: string) {
  return value.split(/(`[^`]+`)/g).map((part, index) =>
    part.startsWith('`') && part.endsWith('`') && part.length > 2 ? (
      <code key={index}>{part.slice(1, -1)}</code>
    ) : (
      <span key={index}>{part}</span>
    ),
  );
}

export function MigrationChecklist({ lang }: { lang: string }) {
  const locale: Lang = lang === 'en' ? 'en' : 'ru';
  const t = ui[locale];
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);

  const total = useMemo(
    () => t.groups.reduce((sum, group) => sum + group.items.length, 0),
    [t.groups],
  );

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          setChecked(parsed as Record<string, boolean>);
        }
      }
    } catch {
      // A private window or blocked storage must not break the checklist.
    }
    setHydrated(true);
  }, []);

  const done = t.groups.reduce(
    (sum, group, groupIndex) =>
      sum +
      group.items.reduce(
        (groupSum, _item, itemIndex) => groupSum + (checked[itemId(groupIndex, itemIndex)] ? 1 : 0),
        0,
      ),
    0,
  );
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  function toggle(id: string) {
    setChecked((previous) => {
      const next = { ...previous, [id]: !previous[id] };
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // Keep the UI usable even when storage is unavailable.
      }
      return next;
    });
  }

  function reset() {
    setChecked({});
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      // Ignore unavailable storage.
    }
  }

  return (
    <div className="cw-checklist">
      <div className="cw-checklist-top">
        <div className="cw-checklist-progress">
          <div
            className="cw-checklist-bar"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={done}
            aria-label={t.progress}
          >
            <span style={{ width: `${hydrated ? percent : 0}%` }} />
          </div>
          <span className="cw-checklist-count">
            {done} {t.of} {total} {t.steps} · {percent}% {t.progress}
          </span>
        </div>
        <button type="button" className="cw-checklist-reset" onClick={reset}>
          <RotateCcw size={12} aria-hidden="true" />
          {t.reset}
        </button>
      </div>

      <div className="cw-checklist-groups">
        {t.groups.map((group, groupIndex) => (
          <section className="cw-checklist-group" key={group.title}>
            <h3>{group.title}</h3>
            <ul>
              {group.items.map((item, itemIndex) => {
                const id = itemId(groupIndex, itemIndex);
                const isChecked = Boolean(checked[id]);
                return (
                  <li key={id} className={isChecked ? 'is-done' : undefined}>
                    <label>
                      <input type="checkbox" checked={isChecked} onChange={() => toggle(id)} />
                      <span className="cw-checklist-box" aria-hidden="true">
                        {isChecked ? <Check size={12} /> : null}
                      </span>
                      <span className="cw-checklist-text">{renderInline(item)}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      <p className="cw-checklist-note">{t.stored}</p>
    </div>
  );
}

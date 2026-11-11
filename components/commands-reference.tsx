'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import { Search, Terminal, X } from 'lucide-react';
import {
  commandGroups,
  commandTotal,
  type CommandEntry,
  type CommandGroup,
  type CommandLevel,
} from '@/lib/commands';

type Lang = 'ru' | 'en';
type LevelFilter = 'all' | CommandLevel;

const ui = {
  ru: {
    search: 'Команда, аргумент или описание',
    group: 'Раздел',
    all: 'Все',
    level: 'Уровень прав',
    levels: {
      0: 'все',
      2: 'гейм-мастер',
      3: 'админ',
      4: 'владелец',
    },
    found: 'найдено',
    of: 'из',
    commands: 'команд',
    empty: 'Ничего не найдено. Попробуйте другой запрос или сбросьте фильтры.',
    reset: 'Сбросить фильтры',
    difference: 'Отличия',
    extension: 'расширение',
    hint: 'Поиск идёт по имени, аргументам, описанию и отличиям от ванили.',
  },
  en: {
    search: 'Command, argument or description',
    group: 'Section',
    all: 'All',
    level: 'Permission level',
    levels: {
      0: 'everyone',
      2: 'game master',
      3: 'admin',
      4: 'server owner',
    },
    found: 'found',
    of: 'of',
    commands: 'commands',
    empty: 'Nothing matched. Try another query or reset the filters.',
    reset: 'Reset filters',
    difference: 'Differences',
    extension: 'extension',
    hint: 'Search covers the name, arguments, description and differences from vanilla.',
  },
} as const;

function renderInline(value: string) {
  return value.split(/(`[^`]+`)/g).map((part, index) =>
    part.startsWith('`') && part.endsWith('`') && part.length > 2 ? (
      <code key={index}>{part.slice(1, -1)}</code>
    ) : (
      <span key={index}>{part}</span>
    ),
  );
}

function matches(command: CommandEntry, query: string, lang: Lang) {
  if (!query) return true;
  const haystack = [
    command.name,
    command.usage,
    command.summary[lang],
    command.difference[lang],
    String(command.level),
    command.extension ? 'extension chunkwake расширение' : '',
  ]
    .join(' ')
    .toLocaleLowerCase(lang);

  return query
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
}

export function CommandsReference({ lang }: { lang: string }) {
  const locale: Lang = lang === 'en' ? 'en' : 'ru';
  const t = ui[locale];
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState('all');
  const [level, setLevel] = useState<LevelFilter>('all');
  const deferredQuery = useDeferredValue(query.trim().toLocaleLowerCase(locale));

  const visible = useMemo<CommandGroup[]>(() => {
    return commandGroups
      .filter((item) => group === 'all' || item.id === group)
      .map((item) => ({
        ...item,
        commands: item.commands.filter(
          (command) =>
            (level === 'all' || command.level === level) && matches(command, deferredQuery, locale),
        ),
      }))
      .filter((item) => item.commands.length > 0);
  }, [deferredQuery, group, level, locale]);

  const count = visible.reduce((sum, item) => sum + item.commands.length, 0);
  const filtered = query !== '' || group !== 'all' || level !== 'all';

  function reset() {
    setQuery('');
    setGroup('all');
    setLevel('all');
  }

  return (
    <div className="cw-commands">
      <div className="cw-commands-toolbar">
        <label className="cw-commands-search">
          <Search size={15} aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.search}
            aria-label={t.search}
          />
          {query ? (
            <button type="button" onClick={() => setQuery('')} aria-label={t.reset}>
              <X size={14} aria-hidden="true" />
            </button>
          ) : null}
        </label>

        <div className="cw-commands-count" aria-live="polite">
          <Terminal size={13} aria-hidden="true" />
          <span>
            {t.found} <strong>{count}</strong> {t.of} {commandTotal} {t.commands}
          </span>
        </div>
      </div>

      <div className="cw-commands-filters">
        <div className="cw-commands-filter-row" role="group" aria-label={t.group}>
          <span className="cw-commands-filter-label">{t.group}</span>
          <div className="cw-commands-chips">
            <button
              type="button"
              className={`cw-command-chip${group === 'all' ? ' is-active' : ''}`}
              aria-pressed={group === 'all'}
              onClick={() => setGroup('all')}
            >
              {t.all}
            </button>
            {commandGroups.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`cw-command-chip${group === item.id ? ' is-active' : ''}`}
                aria-pressed={group === item.id}
                onClick={() => setGroup(item.id)}
              >
                {item.title[locale]}
                <span>{item.commands.length}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="cw-commands-filter-row" role="group" aria-label={t.level}>
          <span className="cw-commands-filter-label">{t.level}</span>
          <div className="cw-commands-chips">
            <button
              type="button"
              className={`cw-command-chip${level === 'all' ? ' is-active' : ''}`}
              aria-pressed={level === 'all'}
              onClick={() => setLevel('all')}
            >
              {t.all}
            </button>
            {([0, 2, 3, 4] as CommandLevel[]).map((value) => (
              <button
                key={value}
                type="button"
                className={`cw-command-chip${level === value ? ' is-active' : ''}`}
                aria-pressed={level === value}
                onClick={() => setLevel(value)}
              >
                <span className={`cw-command-level-dot level-${value}`}>{value}</span>
                {t.levels[value]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="cw-commands-hint">{t.hint}</p>

      {count === 0 ? (
        <div className="cw-commands-empty">
          <p>{t.empty}</p>
          {filtered ? (
            <button type="button" className="cw-btn" onClick={reset}>
              {t.reset}
            </button>
          ) : null}
        </div>
      ) : (
        <div className="cw-commands-groups">
          {visible.map((item) => (
            <section className="cw-commands-group" key={item.id}>
              <header className="cw-commands-group-head">
                <div>
                  <h2>{item.title[locale]}</h2>
                  <p>{item.note[locale]}</p>
                </div>
                <span className="cw-commands-group-count">{item.commands.length}</span>
              </header>

              <div className="cw-commands-list">
                {item.commands.map((command) => (
                  <article className="cw-command-item" key={`${item.id}-${command.name}`}>
                    <div className="cw-command-item-head">
                      <code>/{command.usage}</code>
                      <div className="cw-command-badges">
                        {command.extension ? (
                          <span className="cw-command-ext">{t.extension}</span>
                        ) : null}
                        <span className={`cw-command-level level-${command.level}`}>
                          L{command.level} · {t.levels[command.level]}
                        </span>
                      </div>
                    </div>
                    <p className="cw-command-summary">{renderInline(command.summary[locale])}</p>
                    {command.difference[locale] ? (
                      <p className="cw-command-diff">
                        <span>{t.difference}:</span> {renderInline(command.difference[locale])}
                      </p>
                    ) : null}
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

import { AlertTriangle, ArrowUpRight, Check, X } from 'lucide-react';
import type { Lang } from '@/lib/i18n';
import {
  pluginData,
  pluginGate,
  pluginKindLabels,
  pluginStatusLabels,
  pluginTotals,
  type PluginEntry,
  type PluginStatus,
} from '@/lib/plugins';

const ui = {
  ru: {
    tested: 'подробно',
    works: 'работает',
    partial: 'частично',
    unsupported: 'не работает',
    gateStat: 'гейт',
    verifiedOn: 'Проверено на core',
    details: 'Что работает',
    limits: 'Ограничения',
    site: 'Сайт плагина',
    gateTitle: 'Гейт плагинов',
    gateEnabled: 'включилось',
    gateFailures: 'Не включились',
    gateExcluded: 'Не входят в стенд',
    gateVerified: 'Ещё проверено',
    noteTitle: 'Граница совместимости',
    note: 'Плагины, которые заходят во внутренности CraftBukkit, Netty или `ServerLevel`, могут работать не полностью. Полностью повторить Java-сервер без Java-сервера нельзя, и это не обещается: для каждого плагина в таблице указано, что именно проверено.',
    howTitle: 'Как проверяем',
    how: [
      'Собираем релизную сборку и запускаем реальный сервер с `plugins/*.jar`.',
      'Смотрим лог включения: `N of N enabled`, ошибки загрузки и предупреждения `api: <метод>`.',
      'Выполняем команды плагина и проверяем результат в мире, а не только факт регистрации.',
      'Ограничения и открытые места записываем в `docs/feature-matrix.md` вместе с датой.',
    ],
    matrix: 'Фич-матрица',
    dev: 'Разработка плагинов',
    about: 'О запуске плагинов',
  },
  en: {
    tested: 'detailed',
    works: 'works',
    partial: 'partial',
    unsupported: 'unsupported',
    gateStat: 'gate',
    verifiedOn: 'Verified on core',
    details: 'What works',
    limits: 'Limits',
    site: 'Plugin site',
    gateTitle: 'Plugin gate',
    gateEnabled: 'enabled',
    gateFailures: 'Did not enable',
    gateExcluded: 'Not in the gate',
    gateVerified: 'Also verified',
    noteTitle: 'Compatibility boundary',
    note: 'Plugins that reach into CraftBukkit, Netty or `ServerLevel` internals may not work fully. Reimplementing a Java server without Java is not possible, and this is not promised: each row states what was actually verified.',
    howTitle: 'How we test',
    how: [
      'Build a release binary and start a real server with `plugins/*.jar`.',
      'Read the enable log: `N of N enabled`, load errors and `api: <method>` warnings.',
      'Run the plugin commands and check the result in the world, not just registration.',
      'Record limits and open gaps in `docs/feature-matrix.md` with the date.',
    ],
    matrix: 'Feature matrix',
    dev: 'Plugin development',
    about: 'Running plugins',
  },
} as const;

const statusIcon: Record<PluginStatus, typeof Check> = {
  works: Check,
  partial: AlertTriangle,
  unsupported: X,
};

function renderInline(value: string) {
  return value.split(/(`[^`]+`)/g).map((part, index) =>
    part.startsWith('`') && part.endsWith('`') && part.length > 2 ? (
      <code key={index}>{part.slice(1, -1)}</code>
    ) : (
      <span key={index}>{part}</span>
    ),
  );
}

function PluginCard({ plugin, locale }: { plugin: PluginEntry; locale: Lang }) {
  const t = ui[locale];
  const Icon = statusIcon[plugin.status];
  const details = plugin.details[locale];
  const limits = plugin.limits[locale];

  return (
    <article className={`cw-compat-card is-${plugin.status}`}>
      <header className="cw-compat-head">
        <div className="cw-compat-name">
          <h2>{plugin.name}</h2>
          <span className="cw-compat-version">{plugin.version}</span>
        </div>
        <span className={`cw-compat-status is-${plugin.status}`}>
          <Icon size={11} aria-hidden="true" />
          {pluginStatusLabels[plugin.status][locale]}
        </span>
      </header>

      <p className="cw-compat-kind">{pluginKindLabels[plugin.kind][locale]}</p>
      <p className="cw-compat-summary">{plugin.summary[locale]}</p>

      <div className="cw-compat-block">
        <h3>{t.details}</h3>
        <ul>
          {details.map((item) => (
            <li key={item}>
              <Check size={11} aria-hidden="true" />
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      </div>

      {limits.length > 0 ? (
        <div className="cw-compat-block is-limit">
          <h3>{t.limits}</h3>
          <ul>
            {limits.map((item) => (
              <li key={item}>
                <AlertTriangle size={11} aria-hidden="true" />
                <span>{renderInline(item)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <footer className="cw-compat-foot">
        <a href={plugin.url} target="_blank" rel="noreferrer">
          {t.site} <ArrowUpRight size={11} aria-hidden="true" />
        </a>
      </footer>
    </article>
  );
}

export function PluginCompatibility({ lang }: { lang: Lang }) {
  const t = ui[lang];
  const totals = pluginTotals();
  const gateIssues = pluginGate
    ? pluginGate.failures.length > 0
      ? pluginGate.failures
      : (pluginGate.excluded ?? [])
    : [];
  const gateIssuesLabel =
    pluginGate && pluginGate.failures.length > 0 ? t.gateFailures : t.gateExcluded;

  return (
    <div className="cw-compat">
      <div className="cw-compat-stats">
        <div className="cw-compat-stat">
          <strong>{totals.total}</strong>
          <span>{t.tested}</span>
        </div>
        <div className="cw-compat-stat is-works">
          <strong>{totals.works}</strong>
          <span>{t.works}</span>
        </div>
        <div className="cw-compat-stat">
          <strong>{pluginGate ? `${pluginGate.enabled}/${pluginGate.total}` : '—'}</strong>
          <span>{t.gateStat}</span>
        </div>
        <div className="cw-compat-stat">
          <strong>{pluginData.testedAt}</strong>
          <span>
            {t.verifiedOn} {pluginData.coreSha.slice(0, 8)}
          </span>
        </div>
      </div>

      {pluginGate ? (
        <section className="cw-gate">
          <div className="cw-gate-head">
            <div>
              <h2>{t.gateTitle}</h2>
              <p>{pluginGate.note[lang]}</p>
            </div>
            <div className="cw-gate-count">
              <strong>{pluginGate.enabled}</strong>
              <span>
                / {pluginGate.total} {t.gateEnabled}
              </span>
              <time dateTime={pluginGate.date}>{pluginGate.date}</time>
            </div>
          </div>

          <div
            className="cw-gate-bar"
            role="img"
            aria-label={`${pluginGate.enabled} / ${pluginGate.total}`}
          >
            <span
              style={{ width: `${Math.round((pluginGate.enabled / pluginGate.total) * 100)}%` }}
            />
          </div>

          <div className="cw-gate-cols">
            <div>
              <h3>{gateIssuesLabel}</h3>
              <ul className="cw-gate-failures">
                {gateIssues.map((failure) => (
                  <li key={failure.name}>
                    <div>
                      <strong>{failure.name}</strong>
                      {failure.version ? <span>{failure.version}</span> : null}
                    </div>
                    <p>{renderInline(failure.reason[lang])}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3>{t.gateVerified}</h3>
              <ul className="cw-gate-chips">
                {pluginGate.verified.map((plugin) => (
                  <li key={plugin.name}>
                    {plugin.name}
                    <span>{plugin.version}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ) : null}

      <div className="cw-compat-grid">
        {pluginData.plugins.map((plugin) => (
          <PluginCard key={plugin.id} plugin={plugin} locale={lang} />
        ))}
      </div>

      <section className="cw-compat-note">
        <h2>{t.noteTitle}</h2>
        <p>{renderInline(t.note)}</p>
      </section>

      <section className="cw-compat-how">
        <h2>{t.howTitle}</h2>
        <ol>
          {t.how.map((item) => (
            <li key={item}>{renderInline(item)}</li>
          ))}
        </ol>
        <div className="cw-compat-links">
          <a href={`/${lang}/docs/feature-matrix`} className="cw-btn">
            {t.matrix}
          </a>
          <a href={`/${lang}/docs/plugins`} className="cw-btn">
            {t.dev}
          </a>
          <a href={`/${lang}/docs/running`} className="cw-btn">
            {t.about}
          </a>
        </div>
      </section>
    </div>
  );
}

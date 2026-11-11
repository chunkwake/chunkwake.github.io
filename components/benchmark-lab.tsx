'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  Beef,
  HardDrive,
  Info,
  Map as MapIcon,
  MemoryStick,
  RotateCcw,
  Rocket,
  Users,
} from 'lucide-react';
import { benchmarks } from '@/lib/benchmarks';
import type { Lang } from '@/lib/i18n';

const icons = {
  startup: Rocket,
  join: Users,
  chunks: MapIcon,
  cows: Beef,
  memory: MemoryStick,
  disk: HardDrive,
} as const;

const ui = {
  ru: {
    eyebrow: 'Бенчмарк',
    title: 'Один стенд. Два сервера.',
    lead: 'Не синтетика: одинаковый мир, одинаковые боты и одинаковые сценарии. Переключайте замеры и смотрите, где именно появляется разница.',
    vanilla: 'Ваниль 26.3',
    chunkwake: 'Chunkwake',
    method:
      'Ryzen 9 7945HX, release, плоский мир, обзор 2, 20 ботов, разминка 20 с, замер 45 с, два прогона.',
    source: 'Полная методика и сырые данные',
    replay: 'Проиграть заново',
    lower: 'Ниже — лучше',
    speed: 'Анимация ускорена, пропорции между замерами сохранены.',
  },
  en: {
    eyebrow: 'Benchmark',
    title: 'One bench. Two servers.',
    lead: 'Not synthetic: the same world, the same bots and the same scenarios. Switch metrics and see where the difference actually shows up.',
    vanilla: 'Vanilla 26.3',
    chunkwake: 'Chunkwake',
    method:
      'Ryzen 9 7945HX, release, flat world, view distance 2, 20 bots, 20 s warmup, 45 s measurement, two runs.',
    source: 'Full method and raw data',
    replay: 'Replay',
    lower: 'Lower is better',
    speed: 'Animation is accelerated; proportions between measurements are preserved.',
  },
} as const;

export function BenchmarkLab({ lang }: { lang: string }) {
  const t = ui[lang === 'en' ? 'en' : 'ru'];
  const [active, setActive] = useState(benchmarks[0].id);
  const [round, setRound] = useState(0);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setInView(true);
        observer.disconnect();
      },
      { threshold: 0.18 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const metric = benchmarks.find((item) => item.id === active) ?? benchmarks[0];
  const max = Math.max(metric.chunkwake, metric.vanilla);
  const chunkwakeWidth = Math.max(4, (metric.chunkwake / max) * 100);
  const vanillaWidth = Math.max(4, (metric.vanilla / max) * 100);
  const ratio = metric.vanilla / metric.chunkwake;
  const ratioText = ratio >= 10 ? Math.round(ratio).toString() : ratio.toFixed(1);

  // A single "race" takes 1.4 s for the slower server. The faster bar gets
  // a duration proportional to the measured ratio, with a small floor so it
  // stays visible. This keeps the animation honest without an 11-second wait.
  const raceMs = 1400;
  const chunkwakeDuration = Math.max(90, Math.round((metric.chunkwake / metric.vanilla) * raceMs));

  return (
    <section ref={sectionRef} className="cw-section cw-bench" id="benchmark" data-reveal>
      <div className="cw-split-head">
        <div>
          <div className="cw-eyebrow">{t.eyebrow}</div>
          <h2>{t.title}</h2>
        </div>
        <p>{t.lead}</p>
      </div>

      <div className="cw-bench-panel">
        <div className="cw-bench-tabs" role="tablist" aria-label={t.eyebrow}>
          {benchmarks.map((item) => {
            const Icon = icons[item.id as keyof typeof icons] ?? Rocket;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={item.id === active}
                className={`cw-bench-tab${item.id === active ? ' is-active' : ''}`}
                onClick={() => {
                  setActive(item.id);
                  setRound((value) => value + 1);
                }}
              >
                <Icon size={13} strokeWidth={1.7} aria-hidden="true" />
                {item.label[lang === 'en' ? 'en' : 'ru']}
              </button>
            );
          })}
        </div>

        <div className="cw-bench-body">
          <div className="cw-bench-rows">
            <div className="cw-bench-row cw-bench-row-vanilla">
              <div className="cw-bench-row-head">
                <span>
                  <i className="cw-bench-key cw-bench-key-vanilla" />
                  {t.vanilla}
                </span>
                <strong>{metric.vanillaLabel[lang === 'en' ? 'en' : 'ru']}</strong>
              </div>
              <div className="cw-bench-track">
                <span
                  key={`${metric.id}-${round}-${inView ? 'in' : 'out'}-vanilla`}
                  className="cw-bench-fill cw-bench-fill-vanilla"
                  style={{ width: `${vanillaWidth}%`, animationDuration: `${raceMs}ms` }}
                />
              </div>
            </div>

            <div className="cw-bench-row cw-bench-row-chunkwake">
              <div className="cw-bench-row-head">
                <span>
                  <i className="cw-bench-key cw-bench-key-chunkwake" />
                  {t.chunkwake}
                </span>
                <strong>{metric.chunkwakeLabel[lang === 'en' ? 'en' : 'ru']}</strong>
              </div>
              <div className="cw-bench-track">
                <span
                  key={`${metric.id}-${round}-${inView ? 'in' : 'out'}-chunkwake`}
                  className="cw-bench-fill cw-bench-fill-chunkwake"
                  style={{ width: `${chunkwakeWidth}%`, animationDuration: `${chunkwakeDuration}ms` }}
                />
              </div>
            </div>
          </div>

          <div className="cw-bench-side">
            <div className="cw-bench-score" key={`${metric.id}-${round}-score`}>
              <span className="cw-bench-ratio">×{ratioText}</span>
              <span className="cw-bench-ratio-label">
                {metric.delta[lang === 'en' ? 'en' : 'ru']} · {t.lower}
              </span>
            </div>
            <button type="button" className="cw-bench-replay" onClick={() => setRound((value) => value + 1)}>
              <RotateCcw size={12} aria-hidden="true" />
              {t.replay}
            </button>
          </div>
        </div>

        <div className="cw-bench-foot">
          <Info size={12} aria-hidden="true" />
          <span>
            {metric.detail[lang === 'en' ? 'en' : 'ru']} {t.method} {t.speed}{' '}
            <Link href={`/${lang}/benchmarks`}>
              {t.source} ↗
            </Link>
          </span>
        </div>
      </div>
    </section>
  );
}

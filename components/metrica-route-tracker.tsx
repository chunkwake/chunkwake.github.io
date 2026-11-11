'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const COUNTER_ID = 114190994;

declare global {
  interface Window {
    ym?: (...args: unknown[]) => void;
  }
}

export function MetricaRouteTracker() {
  const pathname = usePathname();
  const initial = useRef(true);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;

    if (initial.current) {
      initial.current = false;
      return;
    }

    window.ym?.(COUNTER_ID, 'hit', window.location.href, {
      title: document.title,
      referrer: document.referrer,
    });
  }, [pathname]);

  return null;
}

'use client';

import { useEffect } from 'react';

export function ScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('cw-reveal-init');

    const items = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));

    if (!('IntersectionObserver' in window)) {
      for (const item of items) item.classList.add('is-visible');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.06,
      },
    );

    for (const item of items) {
      if (item.getBoundingClientRect().top < window.innerHeight * 0.92) {
        item.classList.add('is-visible');
      } else {
        observer.observe(item);
      }
    }

    return () => {
      observer.disconnect();
      root.classList.remove('cw-reveal-init');
    };
  }, []);

  return null;
}

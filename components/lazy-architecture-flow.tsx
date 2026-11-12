'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import type { SiteCopy } from '@/lib/dictionary';

const ArchitectureFlow = dynamic(
  () => import('./architecture-flow').then((module) => module.ArchitectureFlow),
  {
    ssr: false,
    loading: () => <div className="cw-flow cw-flow-placeholder" aria-hidden="true" />,
  },
);

export function LazyArchitectureFlow({
  nodes,
}: {
  nodes: SiteCopy['architecture']['nodes'];
}) {
  const host = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = host.current;
    if (!element) return;

    if (!('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { rootMargin: '500px 0px' },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={host} className="cw-arch-lazy">
      {visible ? (
        <ArchitectureFlow nodes={nodes} />
      ) : (
        <div className="cw-flow cw-flow-placeholder" aria-hidden="true" />
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';

export function CopyButton({
  text,
  label = 'Copy',
  copiedLabel = 'Copied',
  className,
  showLabel = false,
}: {
  text: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
  showLabel?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button type="button" className={className ?? 'cw-copy'} onClick={copy} aria-label={label}>
      {copied ? (
        <span className="cw-copy-done">✓</span>
      ) : (
        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
          <rect x="8" y="8" width="11" height="11" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      )}
      {showLabel ? (
        <span aria-hidden="true">{copied ? copiedLabel : label}</span>
      ) : (
        <span className="sr-only">{copied ? copiedLabel : label}</span>
      )}
    </button>
  );
}

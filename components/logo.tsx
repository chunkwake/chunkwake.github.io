import { cn } from '@/lib/cn';

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn('cw-logo', className)} aria-label="Chunkwake">
      <svg className="cw-logo-mark" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="2" y="2" width="5.5" height="5.5" rx="1" fill="currentColor" opacity="0.4" />
        <rect x="9.25" y="2" width="5.5" height="5.5" rx="1" fill="currentColor" opacity="0.4" />
        <rect x="16.5" y="2" width="5.5" height="5.5" rx="1" fill="currentColor" opacity="0.4" />
        <rect x="2" y="9.25" width="5.5" height="5.5" rx="1" fill="currentColor" opacity="0.4" />
        <rect x="9.25" y="9.25" width="5.5" height="5.5" rx="1" fill="var(--accent)" />
        <rect x="16.5" y="9.25" width="5.5" height="5.5" rx="1" fill="currentColor" opacity="0.4" />
        <rect x="2" y="16.5" width="5.5" height="5.5" rx="1" fill="currentColor" opacity="0.4" />
        <rect x="9.25" y="16.5" width="5.5" height="5.5" rx="1" fill="currentColor" opacity="0.4" />
        <rect x="16.5" y="16.5" width="5.5" height="5.5" rx="1" fill="currentColor" opacity="0.18" />
      </svg>
      {!compact && (
        <span className="cw-logo-text">
          chunk<span>wake</span>
        </span>
      )}
    </span>
  );
}

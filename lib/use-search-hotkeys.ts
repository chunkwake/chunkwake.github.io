'use client';

import { useCallback, useEffect } from 'react';

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return true;
  return target.closest('[role="dialog"]') !== null;
}

/**
 * Opens site search from `/`, `Ctrl/Cmd+K` or `Ctrl/Cmd+/`.
 *
 * `/` is the primary shortcut: browsers may reserve `Ctrl+K` for the address
 * bar, so it cannot be the only way to reach the dialog. The listener runs in
 * the capture phase and stops propagation, otherwise Fumadocs' own bubble
 * handler would toggle the same dialog a second time.
 */
export function useSearchHotkeys(open: () => void, enabled = true) {
  const onHotkey = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;
      if (event.defaultPrevented || event.isComposing || event.keyCode === 229 || event.repeat) return;

      const modifier = event.metaKey || event.ctrlKey;
      const key = event.key.toLowerCase();
      const isCtrlK = modifier && !event.altKey && key === 'k';
      const isSlash = !modifier && !event.altKey && event.key === '/';
      const isCtrlSlash = modifier && !event.altKey && event.key === '/';

      if (!isCtrlK && !isSlash && !isCtrlSlash) return;
      if (isTypingTarget(event.target)) return;
      if (document.querySelector('[role="dialog"]')) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      open();
    },
    [enabled, open],
  );

  useEffect(() => {
    if (!enabled) return;
    window.addEventListener('keydown', onHotkey, { capture: true });
    return () => window.removeEventListener('keydown', onHotkey, { capture: true });
  }, [enabled, onHotkey]);
}

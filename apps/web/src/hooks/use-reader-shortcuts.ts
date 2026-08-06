'use client';

import { useEffect } from 'react';

interface ReaderShortcutHandlers {
  onPreviousPage: () => void;
  onNextPage: () => void;
  onFirstPage: () => void;
  onLastPage: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onFitWidth: () => void;
  enabled: boolean;
}

const EDITABLE_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT']);

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return EDITABLE_TAGS.has(target.tagName) || target.isContentEditable;
}

export function useReaderShortcuts(handlers: ReaderShortcutHandlers): void {
  const {
    onPreviousPage,
    onNextPage,
    onFirstPage,
    onLastPage,
    onZoomIn,
    onZoomOut,
    onResetZoom,
    onFitWidth,
    enabled,
  } = handlers;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return;

      const withModifier = event.ctrlKey || event.metaKey;

      if (withModifier) {
        switch (event.key) {
          case '+':
          case '=':
            event.preventDefault();
            onZoomIn();
            return;
          case '-':
            event.preventDefault();
            onZoomOut();
            return;
          case '0':
            event.preventDefault();
            onResetZoom();
            return;
          default:
            return;
        }
      }

      switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
          event.preventDefault();
          onPreviousPage();
          return;
        case 'ArrowRight':
        case 'ArrowDown':
        case 'PageDown':
        case ' ':
          event.preventDefault();
          onNextPage();
          return;
        case 'Home':
          event.preventDefault();
          onFirstPage();
          return;
        case 'End':
          event.preventDefault();
          onLastPage();
          return;
        case 'f':
        case 'F':
          event.preventDefault();
          onFitWidth();
          return;
        default:
          return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    enabled,
    onPreviousPage,
    onNextPage,
    onFirstPage,
    onLastPage,
    onZoomIn,
    onZoomOut,
    onResetZoom,
    onFitWidth,
  ]);
}

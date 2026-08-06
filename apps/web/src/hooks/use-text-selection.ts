'use client';

import { type RefObject, useCallback, useEffect, useState } from 'react';

import { buildHighlightRects } from '@/modules/reader/domain/build-highlight-rects';
import type { HighlightRect } from '@/modules/reader/domain/highlight';

export interface PendingSelection {
  text: string;
  rects: HighlightRect[];
  anchor: { x: number; y: number };
}

const PICKER_OFFSET_PX = 12;

export function useTextSelection(containerRef: RefObject<HTMLElement | null>): {
  selection: PendingSelection | null;
  clear: () => void;
} {
  const [selection, setSelection] = useState<PendingSelection | null>(null);

  const clear = useCallback(() => {
    setSelection(null);
    window.getSelection()?.removeAllRanges();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container === null) return;

    const handleSelectionEnd = () => {
      const active = window.getSelection();
      if (active === null || active.isCollapsed || active.rangeCount === 0) {
        setSelection(null);
        return;
      }

      const range = active.getRangeAt(0);
      if (!container.contains(range.commonAncestorContainer)) {
        setSelection(null);
        return;
      }

      const pageElement = container.querySelector('[data-pdf-page]');
      if (pageElement === null) {
        setSelection(null);
        return;
      }

      const text = active.toString().trim();
      if (text === '') {
        setSelection(null);
        return;
      }

      const rects = buildHighlightRects(range, pageElement.getBoundingClientRect());
      if (rects.length === 0) {
        setSelection(null);
        return;
      }

      const bounds = range.getBoundingClientRect();
      setSelection({
        text,
        rects,
        anchor: { x: bounds.left + bounds.width / 2, y: bounds.top - PICKER_OFFSET_PX },
      });
    };

    document.addEventListener('mouseup', handleSelectionEnd);
    document.addEventListener('touchend', handleSelectionEnd);

    return () => {
      document.removeEventListener('mouseup', handleSelectionEnd);
      document.removeEventListener('touchend', handleSelectionEnd);
    };
  }, [containerRef]);

  return { selection, clear };
}

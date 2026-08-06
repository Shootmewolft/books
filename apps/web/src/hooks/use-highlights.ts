'use client';

import { useCallback, useEffect, useState } from 'react';

import type { Highlight, HighlightColor, HighlightRect } from '@/modules/reader/domain/highlight';
import { highlightStorageKey } from '@/modules/reader/domain/highlight-storage-key';
import { readStoredHighlights } from '@/modules/reader/domain/read-stored-highlights';
import { writeStoredHighlights } from '@/modules/reader/domain/write-stored-highlights';

interface AddHighlightInput {
  page: number;
  color: HighlightColor;
  text: string;
  rects: HighlightRect[];
}

interface UseHighlightsResult {
  highlights: Highlight[];
  addHighlight: (input: AddHighlightInput) => void;
  removeHighlight: (id: string) => void;
}

export function useHighlights(bookPath: string, filePath: string): UseHighlightsResult {
  const storageKey = highlightStorageKey(bookPath, filePath);
  const [highlights, setHighlights] = useState<Highlight[]>([]);

  useEffect(() => {
    setHighlights(readStoredHighlights(storageKey));
  }, [storageKey]);

  const addHighlight = useCallback(
    (input: AddHighlightInput) => {
      if (input.rects.length === 0) return;

      setHighlights((current) => {
        const next = [
          ...current,
          {
            id: crypto.randomUUID(),
            page: input.page,
            color: input.color,
            text: input.text,
            rects: input.rects,
            createdAt: Date.now(),
          },
        ];
        writeStoredHighlights(storageKey, next);
        return next;
      });
    },
    [storageKey],
  );

  const removeHighlight = useCallback(
    (id: string) => {
      setHighlights((current) => {
        const next = current.filter((entry) => entry.id !== id);
        writeStoredHighlights(storageKey, next);
        return next;
      });
    },
    [storageKey],
  );

  return { highlights, addHighlight, removeHighlight };
}

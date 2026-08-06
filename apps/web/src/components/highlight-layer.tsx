'use client';

import { HIGHLIGHT_SWATCHES } from '@/modules/reader/constants/highlight-swatches';
import type { Highlight } from '@/modules/reader/domain/highlight';

interface HighlightLayerProps {
  highlights: readonly Highlight[];
  onRemove: (id: string) => void;
  removeLabel: string;
}

export function HighlightLayer({ highlights, onRemove, removeLabel }: HighlightLayerProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-1">
      {highlights.map((highlight) =>
        highlight.rects.map((rect) => (
          <button
            key={`${highlight.id}:${rect.x},${rect.y}`}
            type="button"
            onClick={() => onRemove(highlight.id)}
            title={`${removeLabel}: ${highlight.text.slice(0, 60)}`}
            aria-label={`${removeLabel}: ${highlight.text.slice(0, 60)}`}
            className="pointer-events-auto absolute cursor-pointer rounded-xs mix-blend-multiply transition-opacity hover:opacity-90"
            style={{
              left: `${rect.x * 100}%`,
              top: `${rect.y * 100}%`,
              width: `${rect.width * 100}%`,
              height: `${rect.height * 100}%`,
              backgroundColor: HIGHLIGHT_SWATCHES[highlight.color],
              opacity: 0.42,
            }}
          />
        )),
      )}
    </div>
  );
}

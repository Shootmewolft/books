'use client';

import { HIGHLIGHT_SWATCHES } from '@/modules/reader/constants/highlight-swatches';
import { HIGHLIGHT_COLORS, type HighlightColor } from '@/modules/reader/domain/highlight';

interface HighlightPickerProps {
  position: { x: number; y: number };
  label: string;
  onPick: (color: HighlightColor) => void;
}

export function HighlightPicker({ position, label, onPick }: HighlightPickerProps) {
  return (
    <div
      role="toolbar"
      aria-label={label}
      className="-translate-x-1/2 fixed z-50 flex items-center gap-1.5 rounded-pill border border-edge-bright bg-raised px-2.5 py-1.5 shadow-[0_10px_30px_-10px_rgb(0_0_0/0.9)]"
      style={{ left: position.x, top: position.y }}
    >
      {HIGHLIGHT_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          onMouseDown={(event) => {
            event.preventDefault();
            onPick(color);
          }}
          aria-label={color}
          title={color}
          className="size-4 rounded-full border border-void/40 transition-transform hover:scale-125"
          style={{ backgroundColor: HIGHLIGHT_SWATCHES[color] }}
        />
      ))}
    </div>
  );
}

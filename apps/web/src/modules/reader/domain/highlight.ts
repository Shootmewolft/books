export const HIGHLIGHT_COLORS = ['brass', 'patina', 'rose', 'violet'] as const;

export type HighlightColor = (typeof HIGHLIGHT_COLORS)[number];

export interface HighlightRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Highlight {
  id: string;
  page: number;
  color: HighlightColor;
  text: string;
  rects: HighlightRect[];
  createdAt: number;
}

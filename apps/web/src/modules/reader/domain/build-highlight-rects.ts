import type { HighlightRect } from '@/modules/reader/domain/highlight';

const MIN_RECT_SIZE = 0.0005;

export function buildHighlightRects(range: Range, pageBounds: DOMRect): HighlightRect[] {
  if (pageBounds.width === 0 || pageBounds.height === 0) return [];

  return Array.from(range.getClientRects())
    .map((rect) => ({
      x: (rect.left - pageBounds.left) / pageBounds.width,
      y: (rect.top - pageBounds.top) / pageBounds.height,
      width: rect.width / pageBounds.width,
      height: rect.height / pageBounds.height,
    }))
    .filter((rect) => rect.width > MIN_RECT_SIZE && rect.height > MIN_RECT_SIZE);
}

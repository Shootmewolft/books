import type { Highlight } from '@/modules/reader/domain/highlight';

export function writeStoredHighlights(key: string, highlights: readonly Highlight[]): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(highlights));
  } catch {
    return;
  }
}

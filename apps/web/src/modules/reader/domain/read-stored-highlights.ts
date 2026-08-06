import type { Highlight } from '@/modules/reader/domain/highlight';

export function readStoredHighlights(key: string): Highlight[] {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (entry): entry is Highlight =>
        typeof entry === 'object' &&
        entry !== null &&
        typeof (entry as Highlight).id === 'string' &&
        Array.isArray((entry as Highlight).rects),
    );
  } catch {
    return [];
  }
}

import type { CatalogueFilters } from '@/lib/types';

type FilterKey = keyof CatalogueFilters;

export function buildFilterHref(
  basePath: string,
  current: CatalogueFilters,
  key: FilterKey,
  value: string | undefined,
): string {
  const next: Record<string, string> = {};

  for (const [existingKey, existingValue] of Object.entries(current)) {
    if (existingValue !== undefined && existingValue !== '') {
      next[existingKey] = String(existingValue);
    }
  }

  if (value === undefined) {
    delete next[key];
  } else {
    next[key] = value;
  }

  if (key === 'category') {
    delete next['subcategory'];
  }

  const query = new URLSearchParams(next).toString();
  return query === '' ? basePath : `${basePath}?${query}`;
}

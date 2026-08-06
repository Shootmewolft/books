import type { CatalogueFilters } from '@/modules/catalogue/types';

import { FILTER_PARAM_NAMES } from '../constants/filter-param-names';

type FilterKey = keyof CatalogueFilters;

export function buildFilterHref(
  basePath: string,
  current: CatalogueFilters,
  key: FilterKey,
  value: string | undefined,
): string {
  const next: CatalogueFilters = { ...current };

  if (value === undefined) {
    delete next[key];
  } else {
    Object.assign(next, { [key]: value });
  }

  if (key === 'category') {
    delete next.subcategory;
  }

  const params = new URLSearchParams();
  for (const [filterKey, filterValue] of Object.entries(next)) {
    if (filterValue === undefined || filterValue === '') continue;
    params.set(FILTER_PARAM_NAMES[filterKey as FilterKey], String(filterValue));
  }

  const query = params.toString();
  return query === '' ? basePath : `${basePath}?${query}`;
}

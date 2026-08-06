import type { CatalogueFilters } from '@/modules/catalogue/types';

export const FILTER_PARAM_NAMES: Record<keyof CatalogueFilters, string> = {
  query: 'q',
  category: 'category',
  subcategory: 'subcategory',
  tag: 'tag',
  kind: 'kind',
  lang: 'lang',
};

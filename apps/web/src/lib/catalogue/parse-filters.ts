import { isLocale } from '@/i18n/config';
import type { CatalogueFilters, Kind } from '@/lib/types';

const KINDS: readonly Kind[] = ['book', 'guide', 'reference'];

function single(value: string | string[] | undefined): string | undefined {
  if (value === undefined) return undefined;
  const first = Array.isArray(value) ? value[0] : value;
  return first === undefined || first === '' ? undefined : first;
}

export function parseFilters(
  searchParams: Record<string, string | string[] | undefined>,
): CatalogueFilters {
  const filters: CatalogueFilters = {};

  const query = single(searchParams['q']);
  if (query !== undefined) filters.query = query;

  const category = single(searchParams['category']);
  if (category !== undefined) filters.category = category;

  const subcategory = single(searchParams['subcategory']);
  if (subcategory !== undefined) filters.subcategory = subcategory;

  const tag = single(searchParams['tag']);
  if (tag !== undefined) filters.tag = tag;

  const kind = single(searchParams['kind']);
  if (kind !== undefined && KINDS.includes(kind as Kind)) filters.kind = kind as Kind;

  const lang = single(searchParams['lang']);
  if (lang !== undefined && isLocale(lang)) filters.lang = lang;

  return filters;
}

import type { CatalogueBook, CatalogueFilters } from '@/lib/types';
import { fold } from '@/lib/utils/fold';

import { searchHaystack } from './search-haystack';

export function filterBooks(
  books: readonly CatalogueBook[],
  filters: CatalogueFilters,
): CatalogueBook[] {
  const trimmedQuery = filters.query?.trim() ?? '';
  const searchTerms = trimmedQuery === '' ? [] : fold(trimmedQuery).split(/\s+/);

  return books.filter((book) => {
    if (filters.category !== undefined && book.category !== filters.category) return false;
    if (filters.subcategory !== undefined && book.subcategory !== filters.subcategory) return false;
    if (filters.tag !== undefined && !book.tags.includes(filters.tag)) return false;
    if (filters.kind !== undefined && book.kind !== filters.kind) return false;
    if (filters.lang !== undefined && !book.languages.includes(filters.lang)) return false;

    if (searchTerms.length === 0) return true;

    const haystack = searchHaystack(book);
    return searchTerms.every((term) => haystack.includes(term));
  });
}

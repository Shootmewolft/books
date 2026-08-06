import type { CatalogueBook } from '@/lib/types';
import { fold } from '@/lib/utils/fold';

export function searchHaystack(book: CatalogueBook): string {
  return fold(
    [
      book.title,
      book.subtitle ?? '',
      book.authors.join(' '),
      book.publisher ?? '',
      book.tags.join(' '),
      book.callNumber,
      String(book.year ?? ''),
    ].join(' '),
  );
}

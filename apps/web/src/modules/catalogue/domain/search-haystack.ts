import type { CatalogueBook } from '@/modules/catalogue/types';
import { fold } from '@/utils/fold';

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

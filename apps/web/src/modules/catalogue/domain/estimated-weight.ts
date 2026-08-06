import type { CatalogueBook } from '@/modules/catalogue/types';

const BYTES_PER_ESTIMATED_PAGE = 12_000;

export function estimatedWeight(book: CatalogueBook): number {
  return book.pages ?? Math.round(book.totalBytes / BYTES_PER_ESTIMATED_PAGE);
}

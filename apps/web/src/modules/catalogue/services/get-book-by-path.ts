import type { CatalogueBook } from '@/modules/catalogue/types';

import { getCatalogue } from './get-catalogue';

export async function getBookByPath(path: string): Promise<CatalogueBook | null> {
  const { books } = await getCatalogue();
  return books.find((book) => book.path === path) ?? null;
}

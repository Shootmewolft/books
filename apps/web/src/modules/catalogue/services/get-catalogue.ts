import type { Catalogue, CatalogueBook, Kind } from '@/modules/catalogue/types';
import { LIBRARY_ROOT } from '@/server/library-path/library-root';
import { uniqueSorted } from '@/utils/unique-sorted';
import { CATEGORIES, TAG_VOCABULARY } from '../constants/taxonomy';
import { toCallNumber } from '../domain/to-call-number';
import { findBookDirectories } from './find-book-directories';
import { readBookDirectory } from './read-book-directory';

export async function getCatalogue(): Promise<Catalogue> {
  'use cache';

  const directories = (await findBookDirectories(LIBRARY_ROOT)).sort();
  const entries = await Promise.all(directories.map(readBookDirectory));

  const countPerSubcategory = new Map<string, number>();
  const books: CatalogueBook[] = entries.map(({ book, path, coverFile }) => {
    const subcategoryKey = `${book.category}/${book.subcategory}`;
    const positionInSubcategory = countPerSubcategory.get(subcategoryKey) ?? 0;
    countPerSubcategory.set(subcategoryKey, positionInSubcategory + 1);

    return {
      ...book,
      path,
      callNumber: toCallNumber(book, positionInSubcategory),
      cover: coverFile === undefined ? null : `/api/file/${path}/${coverFile}`,
      languages: uniqueSorted(book.files.map((file) => file.lang)),
      formats: uniqueSorted(book.files.map((file) => file.format)),
      totalBytes: book.files.reduce((sum, file) => sum + file.bytes, 0),
    };
  });

  books.sort((a, b) => a.title.localeCompare(b.title));

  const byKind: Record<Kind, number> = { book: 0, guide: 0, reference: 0 };
  const tagsInUse = new Set<string>();
  let totalFiles = 0;
  let totalBytes = 0;
  let totalPages = 0;

  for (const book of books) {
    byKind[book.kind] += 1;
    totalFiles += book.files.length;
    totalBytes += book.totalBytes;
    totalPages += book.pages ?? 0;
    for (const tag of book.tags) tagsInUse.add(tag);
  }

  return {
    books,
    categories: [...CATEGORIES].sort((a, b) => a.order - b.order),
    tags: TAG_VOCABULARY.filter((tag) => tagsInUse.has(tag)).sort((a, b) => a.localeCompare(b)),
    stats: {
      books: books.length,
      files: totalFiles,
      bytes: totalBytes,
      pages: totalPages,
      byKind,
    },
  };
}

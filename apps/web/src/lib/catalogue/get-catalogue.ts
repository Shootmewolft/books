import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

import { LIBRARY_ROOT } from '@/lib/paths/library-root';
import type { Book, Catalogue, CatalogueBook, Kind } from '@/lib/types';
import { uniqueSorted } from '@/lib/utils/unique-sorted';

import { findBookDirectories } from './find-book-directories';
import { CATEGORIES, TAG_VOCABULARY } from './taxonomy';
import { toCallNumber } from './to-call-number';

const COVER_FILENAMES = ['cover.webp', 'cover.jpg'];

export async function getCatalogue(): Promise<Catalogue> {
  'use cache';

  const directories = (await findBookDirectories(LIBRARY_ROOT)).sort();
  const countPerSubcategory = new Map<string, number>();
  const books: CatalogueBook[] = [];

  for (const directory of directories) {
    const raw = await readFile(join(directory, 'book.json'), 'utf8');
    const book = JSON.parse(raw) as Book;
    const path = relative(LIBRARY_ROOT, directory);

    const subcategoryKey = `${book.category}/${book.subcategory}`;
    const positionInSubcategory = countPerSubcategory.get(subcategoryKey) ?? 0;
    countPerSubcategory.set(subcategoryKey, positionInSubcategory + 1);

    const entries = await readdir(directory);
    const coverFile = entries.find((entry) => COVER_FILENAMES.includes(entry));

    books.push({
      ...book,
      path,
      callNumber: toCallNumber(book, positionInSubcategory),
      cover: coverFile === undefined ? null : `/api/file/${path}/${coverFile}`,
      languages: uniqueSorted(book.files.map((file) => file.lang)),
      formats: uniqueSorted(book.files.map((file) => file.format)),
      totalBytes: book.files.reduce((sum, file) => sum + file.bytes, 0),
    });
  }

  books.sort((a, b) => a.title.localeCompare(b.title));

  const byKind: Record<Kind, number> = { book: 0, guide: 0, reference: 0 };
  for (const book of books) {
    byKind[book.kind] += 1;
  }

  return {
    books,
    categories: [...CATEGORIES].sort((a, b) => a.order - b.order),
    tags: TAG_VOCABULARY.filter((tag) => books.some((book) => book.tags.includes(tag))).sort(
      (a, b) => a.localeCompare(b),
    ),
    stats: {
      books: books.length,
      files: books.reduce((sum, book) => sum + book.files.length, 0),
      bytes: books.reduce((sum, book) => sum + book.totalBytes, 0),
      pages: books.reduce((sum, book) => sum + (book.pages ?? 0), 0),
      byKind,
    },
  };
}

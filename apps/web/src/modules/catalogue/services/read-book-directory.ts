import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import type { Book } from '@/modules/catalogue/types';
import { LIBRARY_ROOT } from '@/server/library-path/library-root';

const COVER_FILENAMES = ['cover.webp', 'cover.jpg'];

export interface RawBookEntry {
  book: Book;
  path: string;
  coverFile: string | undefined;
}

export async function readBookDirectory(directory: string): Promise<RawBookEntry> {
  const [raw, entries] = await Promise.all([
    readFile(join(directory, 'book.json'), 'utf8'),
    readdir(directory),
  ]);

  return {
    book: JSON.parse(raw) as Book,
    path: relative(LIBRARY_ROOT, directory),
    coverFile: entries.find((entry) => COVER_FILENAMES.includes(entry)),
  };
}

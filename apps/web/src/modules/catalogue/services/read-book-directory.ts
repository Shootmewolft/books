import { readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

import type { Book } from '@/modules/catalogue/types';
import { LIBRARY_ROOT } from '@/server/library-path/library-root';

export interface RawBookEntry {
  book: Book;
  path: string;
}

export async function readBookDirectory(directory: string): Promise<RawBookEntry> {
  const raw = await readFile(join(directory, 'book.json'), 'utf8');

  return {
    book: JSON.parse(raw) as Book,
    path: relative(LIBRARY_ROOT, directory),
  };
}

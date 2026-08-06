import { readdir, readFile } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';

import type { Book } from './types.ts';

const BOOK_EXTENSIONS = new Set(['.pdf', '.epub']);

async function collectBookFiles(
  directory: string,
  root: string,
  found: Set<string>,
): Promise<Set<string>> {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const full = join(directory, entry.name);

    if (entry.isDirectory()) {
      await collectBookFiles(full, root, found);
    } else if (BOOK_EXTENSIONS.has(extname(entry.name).toLowerCase())) {
      found.add(relative(root, full));
    }
  }

  return found;
}

async function collectDeclaredFiles(
  directory: string,
  root: string,
  declared: Set<string>,
): Promise<Set<string>> {
  const entries = await readdir(directory, { withFileTypes: true });

  if (entries.some((entry) => entry.isFile() && entry.name === 'book.json')) {
    const manifest = JSON.parse(await readFile(join(directory, 'book.json'), 'utf8')) as Book;
    for (const file of manifest.files ?? []) {
      declared.add(relative(root, join(directory, file.path)));
    }
    return declared;
  }

  for (const entry of entries) {
    if (entry.isDirectory()) {
      await collectDeclaredFiles(join(directory, entry.name), root, declared);
    }
  }

  return declared;
}

export async function findOrphanFiles(libraryRoot: string): Promise<string[]> {
  const onDisk = await collectBookFiles(libraryRoot, libraryRoot, new Set());
  const declared = await collectDeclaredFiles(libraryRoot, libraryRoot, new Set());

  return [...onDisk].filter((path) => !declared.has(path)).sort();
}

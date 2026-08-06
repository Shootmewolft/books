import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

export async function findBookDirectories(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });

  if (entries.some((entry) => entry.isFile() && entry.name === 'book.json')) {
    return [directory];
  }

  const found: string[] = [];
  for (const entry of entries) {
    if (entry.isDirectory()) {
      found.push(...(await findBookDirectories(join(directory, entry.name))));
    }
  }

  return found;
}

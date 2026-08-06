#!/usr/bin/env node

import { execFile } from 'node:child_process';
import { access, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { promisify } from 'node:util';

import { findBookDirectories } from './find-book-directories.ts';
import type { Book, Finding } from './types.ts';

const run = promisify(execFile);
const ROOT = process.cwd();
const LIBRARY = join(ROOT, 'library');

const COVER_WIDTH = 480;
const JPEG_QUALITY = 82;
const WEBP_QUALITY = 80;

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function extractCover(directory: string, pdfPath: string): Promise<void> {
  const stem = join(directory, 'cover');

  await run('pdftocairo', [
    '-jpeg',
    '-jpegopt',
    `quality=${JPEG_QUALITY}`,
    '-f',
    '1',
    '-l',
    '1',
    '-scale-to-x',
    String(COVER_WIDTH),
    '-scale-to-y',
    '-1',
    '-singlefile',
    pdfPath,
    stem,
  ]);

  const jpeg = `${stem}.jpg`;
  if (!(await exists(jpeg))) throw new Error('pdftocairo produced no output');

  try {
    const { default: sharp } = await import('sharp');
    await sharp(jpeg).webp({ quality: WEBP_QUALITY }).toFile(`${stem}.webp`);
    await rm(jpeg);
  } catch {
    await rename(jpeg, `${stem}.jpg`);
  }
}

async function main(): Promise<void> {
  const force = process.argv.includes('--force');
  const directories = await findBookDirectories(LIBRARY);

  let created = 0;
  let skipped = 0;
  const failures: Finding[] = [];

  for (const directory of directories) {
    const relativeDirectory = relative(ROOT, directory);
    const book = JSON.parse(await readFile(join(directory, 'book.json'), 'utf8')) as Book;

    const declareCover = async (name: string | null) => {
      if (book.cover === name) return;
      book.cover = name;
      await writeFile(join(directory, 'book.json'), `${JSON.stringify(book, null, 2)}\n`, 'utf8');
    };

    const existing = (await exists(join(directory, 'cover.webp')))
      ? 'cover.webp'
      : (await exists(join(directory, 'cover.jpg')))
        ? 'cover.jpg'
        : null;

    if (!force && existing !== null) {
      await declareCover(existing);
      skipped += 1;
      continue;
    }

    const pdf = book.files.find((file) => file.format === 'pdf');
    if (pdf === undefined) {
      await declareCover(null);
      failures.push({ where: relativeDirectory, message: 'no PDF (EPUB-only book)' });
      continue;
    }

    try {
      await extractCover(directory, join(directory, pdf.path));
      await declareCover('cover.webp');
      created += 1;
    } catch (cause) {
      failures.push({
        where: relativeDirectory,
        message: (cause as Error).message.split('\n')[0] ?? 'unknown error',
      });
    }
  }

  console.info(`Covers created: ${created}   skipped (already present): ${skipped}`);

  if (failures.length > 0) {
    console.info(`\n${failures.length} without a cover:`);
    for (const { where, message } of failures) console.info(`  ${where} — ${message}`);
  }
}

main().catch((cause: unknown) => {
  console.error(cause);
  process.exit(1);
});

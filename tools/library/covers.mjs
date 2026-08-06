#!/usr/bin/env node

import { execFile } from 'node:child_process';
import { access, readdir, readFile, rename, rm } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { promisify } from 'node:util';

const run = promisify(execFile);
const ROOT = process.cwd();
const LIBRARY = join(ROOT, 'library');

const COVER_WIDTH = 480;

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function findBookDirectories(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  if (entries.some((entry) => entry.isFile() && entry.name === 'book.json')) return [directory];

  const found = [];
  for (const entry of entries) {
    if (entry.isDirectory()) {
      found.push(...(await findBookDirectories(join(directory, entry.name))));
    }
  }
  return found;
}

async function extractCover(directory, pdfPath) {
  const stem = join(directory, 'cover');

  await run('pdftocairo', [
    '-jpeg',
    '-jpegopt',
    'quality=82',
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
    await sharp(jpeg).webp({ quality: 80 }).toFile(`${stem}.webp`);
    await rm(jpeg);
    return 'webp';
  } catch {
    await rename(jpeg, `${stem}.jpg`);
    return 'jpg';
  }
}

async function main() {
  const force = process.argv.includes('--force');
  const directories = await findBookDirectories(LIBRARY);

  let created = 0;
  let skipped = 0;
  const failures = [];

  for (const directory of directories) {
    const relativeDirectory = relative(ROOT, directory);
    const book = JSON.parse(await readFile(join(directory, 'book.json'), 'utf8'));

    if (
      !force &&
      ((await exists(join(directory, 'cover.webp'))) ||
        (await exists(join(directory, 'cover.jpg'))))
    ) {
      skipped += 1;
      continue;
    }

    const pdf = book.files.find((file) => file.format === 'pdf');
    if (!pdf) {
      failures.push({ where: relativeDirectory, reason: 'no PDF (EPUB-only book)' });
      continue;
    }

    try {
      await extractCover(directory, join(directory, pdf.path));
      created += 1;
    } catch (cause) {
      failures.push({ where: relativeDirectory, reason: cause.message.split('\n')[0] });
    }
  }

  console.info(`Covers created: ${created}   skipped (already present): ${skipped}`);
  if (failures.length > 0) {
    console.info(`\n${failures.length} without a cover:`);
    for (const { where, reason } of failures) console.info(`  ${where} — ${reason}`);
  }
}

main().catch((cause) => {
  console.error(cause);
  process.exit(1);
});

#!/usr/bin/env node

import { execFile } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { promisify } from 'node:util';

import { DROPPED_PATHS, resolveMapping } from './mapping.mjs';

const run = promisify(execFile);
const ROOT = process.cwd();

export function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[’'`]/g, '')
    .replace(/&/g, ' and ')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, 72)
    .replace(/-+$/, '');
}

function bookDirectoryName(slug, edition) {
  return edition && edition > 1 ? `${slug}-${edition}e` : slug;
}

function detectLanguage(sourcePath) {
  const marker = sourcePath.match(/[.\-_[(](es|spanish|espanol|español)[.\-_\])]/i);
  return marker ? 'es' : 'en';
}

function buildPlan(inventory) {
  const books = new Map();
  const collisions = [];
  const dropped = [];

  for (const record of inventory.books) {
    const mapping = resolveMapping(record.sourcePath);
    if (mapping === null) {
      dropped.push(record.sourcePath);
      continue;
    }

    const parsed = record.parsed;
    const title = mapping.title ?? parsed.title;
    const edition = mapping.edition ?? parsed.edition ?? null;
    const slug = slugify(title);
    const directoryName = bookDirectoryName(slug, edition);
    const destinationDirectory = join(
      'library',
      mapping.category,
      mapping.subcategory,
      directoryName,
    );

    const language = detectLanguage(record.sourcePath);
    const fileName = `${language}.${record.format}`;

    if (!books.has(destinationDirectory)) {
      books.set(destinationDirectory, {
        dir: destinationDirectory,
        meta: {
          slug: directoryName,
          title,
          subtitle: mapping.subtitle ?? parsed.subtitle ?? null,
          authors: mapping.authors ?? parsed.authors ?? [],
          year: mapping.year ?? parsed.year ?? null,
          edition,
          publisher: mapping.publisher ?? parsed.publisher ?? null,
          pages: record.pages ?? null,
          kind: mapping.kind ?? 'book',
          category: mapping.category,
          subcategory: mapping.subcategory,
          tags: mapping.tags,
        },
        files: [],
      });
    }

    const book = books.get(destinationDirectory);

    if (record.pages && (!book.meta.pages || record.pages > book.meta.pages)) {
      book.meta.pages = record.pages;
    }

    const clash = book.files.find((file) => file.name === fileName);
    if (clash) {
      collisions.push({
        destination: join(destinationDirectory, fileName),
        existing: clash.from,
        incoming: record.sourcePath,
        existingBytes: clash.bytes,
        incomingBytes: record.bytes,
      });
      continue;
    }

    book.files.push({
      name: fileName,
      from: record.sourcePath,
      lang: language,
      format: record.format,
      bytes: record.bytes,
      md5: record.md5,
    });
  }

  return { books: [...books.values()], collisions, dropped };
}

function renderBookJson(book) {
  const { meta, files } = book;
  return `${JSON.stringify(
    {
      $schema: '../../../../schema/book.schema.json',
      slug: meta.slug,
      title: meta.title,
      subtitle: meta.subtitle,
      authors: meta.authors,
      year: meta.year,
      edition: meta.edition,
      publisher: meta.publisher,
      pages: meta.pages,
      kind: meta.kind,
      category: meta.category,
      subcategory: meta.subcategory,
      tags: meta.tags.sort(),
      files: files
        .map((file) => ({
          lang: file.lang,
          format: file.format,
          path: file.name,
          bytes: file.bytes,
          md5: file.md5,
        }))
        .sort((a, b) => a.path.localeCompare(b.path)),
    },
    null,
    2,
  )}\n`;
}

async function gitMove(from, to) {
  await mkdir(dirname(join(ROOT, to)), { recursive: true });
  await run('git', ['mv', from, to], { cwd: ROOT });
}

async function main() {
  const apply = process.argv.includes('--apply');
  const inventory = JSON.parse(await readFile(join(ROOT, 'tools/library/inventory.json'), 'utf8'));

  const plan = buildPlan(inventory);
  const movedFileCount = plan.books.reduce((sum, book) => sum + book.files.length, 0);

  console.log('=== MIGRATION PLAN ===');
  console.log(`books:      ${plan.books.length}`);
  console.log(`files:      ${movedFileCount}`);
  console.log(`duplicates: ${plan.dropped.length} (deleted)`);
  console.log(`collisions: ${plan.collisions.length}`);

  if (plan.collisions.length > 0) {
    console.log('\n--- COLLISIONS (two files claim one destination) ---');
    for (const collision of plan.collisions) {
      console.log(`\n  ${collision.destination}`);
      console.log(
        `    keep?   ${collision.existing}  (${(collision.existingBytes / 1048576).toFixed(1)} MB)`,
      );
      console.log(
        `    keep?   ${collision.incoming}  (${(collision.incomingBytes / 1048576).toFixed(1)} MB)`,
      );
    }
  }

  const multiFile = plan.books.filter((book) => book.files.length > 1);
  if (multiFile.length > 0) {
    console.log(`\n--- MULTI-FILE BOOKS (${multiFile.length}) ---`);
    for (const book of multiFile) {
      console.log(`  ${book.dir}  ->  ${book.files.map((f) => f.name).join(', ')}`);
    }
  }

  await writeFile(
    join(ROOT, 'tools/library/migration-plan.json'),
    `${JSON.stringify(plan, null, 2)}\n`,
    'utf8',
  );
  console.log('\nWrote tools/library/migration-plan.json');

  if (!apply) {
    console.log('\nDry run. Re-run with --apply to execute.');
    return;
  }

  if (plan.collisions.length > 0) {
    console.error('\nRefusing to apply: resolve collisions first.');
    process.exit(1);
  }

  console.log('\n=== APPLYING ===');
  for (const book of plan.books) {
    for (const file of book.files) {
      await gitMove(file.from, join(book.dir, file.name));
    }
    await writeFile(join(ROOT, book.dir, 'book.json'), renderBookJson(book), 'utf8');
  }

  for (const path of DROPPED_PATHS) {
    await run('git', ['rm', '-q', '--', path], { cwd: ROOT });
  }

  await run('bash', ['-c', 'find . -type d -empty -not -path "./.git/*" -delete'], { cwd: ROOT });

  console.log(`Moved ${movedFileCount} files into ${plan.books.length} book directories.`);
  console.log(`Deleted ${plan.dropped.length} duplicate files.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

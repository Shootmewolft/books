#!/usr/bin/env node

import { readdir, readFile, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';

import { findBookDirectories } from './find-book-directories.ts';
import { findOrphanFiles } from './find-orphan-files.ts';
import { hashFile } from './hash-file.ts';
import { FORMATS, findCategory, LANGUAGES, TAG_SET, VALID_PATHS } from './taxonomy.ts';
import type { Book, Finding, Kind, Language } from './types.ts';

const ROOT = process.cwd();
const LIBRARY = join(ROOT, 'library');

const MAX_FILE_BYTES = 100 * 1024 * 1024;
const WARN_FILE_BYTES = 50 * 1024 * 1024;
const KINDS: readonly Kind[] = ['book', 'guide', 'reference'];
const REQUIRED_FIELDS = ['title', 'kind', 'category', 'subcategory'] as const;

const errors: Finding[] = [];
const warnings: Finding[] = [];

const error = (where: string, message: string) => errors.push({ where, message });
const warn = (where: string, message: string) => warnings.push({ where, message });

const toMegabytes = (bytes: number) => (bytes / 1048576).toFixed(1);

async function validateBook(
  directory: string,
  seenSlugs: Map<string, string>,
  seenHashes: Map<string, string>,
): Promise<void> {
  const relativeDirectory = relative(ROOT, directory);

  let book: Book;
  try {
    book = JSON.parse(await readFile(join(directory, 'book.json'), 'utf8')) as Book;
  } catch (cause) {
    error(relativeDirectory, `book.json is not valid JSON: ${(cause as Error).message}`);
    return;
  }

  const directoryName = relativeDirectory.split('/').pop();
  if (book.slug !== directoryName) {
    error(relativeDirectory, `slug "${book.slug}" does not match directory "${directoryName}"`);
  }

  const previousSlug = seenSlugs.get(book.slug);
  if (previousSlug !== undefined) {
    error(relativeDirectory, `duplicate slug "${book.slug}", already used by ${previousSlug}`);
  } else {
    seenSlugs.set(book.slug, relativeDirectory);
  }

  for (const field of REQUIRED_FIELDS) {
    if (book[field] === undefined || book[field] === null || book[field] === '') {
      error(relativeDirectory, `missing required field "${field}"`);
    }
  }

  if (!Array.isArray(book.files) || book.files.length === 0) {
    error(relativeDirectory, 'must declare at least one file');
    return;
  }

  const taxonomyPath = `${book.category}/${book.subcategory}`;
  if (!VALID_PATHS.has(taxonomyPath)) {
    error(
      relativeDirectory,
      `unknown category path "${taxonomyPath}" — add it to taxonomy.ts first`,
    );
  }

  const expectedPrefix = join('library', book.category, book.subcategory);
  if (!relativeDirectory.startsWith(expectedPrefix)) {
    error(
      relativeDirectory,
      `filed under "${relativeDirectory}" but metadata says "${expectedPrefix}"`,
    );
  }

  if (!KINDS.includes(book.kind)) {
    error(relativeDirectory, `invalid kind "${book.kind}"`);
  }

  if (book.edition !== null && book.edition > 1) {
    const suffix = `-${book.edition}e`;
    if (!book.slug.endsWith(suffix)) {
      error(relativeDirectory, `edition ${book.edition} requires slug ending in "${suffix}"`);
    }
  } else if (/-\d+e$/.test(book.slug)) {
    error(
      relativeDirectory,
      `slug has an edition suffix but "edition" is ${book.edition ?? 'null'}`,
    );
  }

  for (const tag of book.tags ?? []) {
    if (!TAG_SET.has(tag)) {
      error(relativeDirectory, `unknown tag "${tag}" — add it to TAGS in taxonomy.ts first`);
    }
  }

  const seenVariants = new Set<string>();
  for (const file of book.files) {
    const where = `${relativeDirectory}/${file.path}`;

    if (LANGUAGES[file.lang as Language] === undefined) {
      error(where, `unsupported language "${file.lang}"`);
    }
    if (!FORMATS.includes(file.format)) {
      error(where, `unsupported format "${file.format}"`);
    }
    if (file.path !== `${file.lang}.${file.format}`) {
      error(where, `filename must be "${file.lang}.${file.format}"`);
    }

    const variant = `${file.lang}.${file.format}`;
    if (seenVariants.has(variant)) error(where, `duplicate ${variant} variant`);
    seenVariants.add(variant);

    const absolute = join(directory, file.path);
    let size: number;
    try {
      const stats = await stat(absolute);
      size = stats.size;
    } catch {
      error(where, 'declared in book.json but missing on disk');
      continue;
    }

    if (size !== file.bytes) {
      error(where, `size mismatch: book.json says ${file.bytes}, file is ${size}`);
    }
    if (size > MAX_FILE_BYTES) {
      error(where, `${toMegabytes(size)} MB exceeds GitHub's 100 MB hard limit`);
    } else if (size > WARN_FILE_BYTES) {
      warn(where, `${toMegabytes(size)} MB — above GitHub's 50 MB warning threshold`);
    }

    if (file.md5 !== undefined) {
      const actual = await hashFile(absolute);
      if (actual !== file.md5) {
        error(where, `md5 mismatch: book.json says ${file.md5}, file hashes to ${actual}`);
      }

      const previous = seenHashes.get(actual);
      if (previous !== undefined && previous !== where) {
        error(where, `identical content already exists at ${previous}`);
      } else {
        seenHashes.set(actual, where);
      }
    }
  }

  const declared = new Set(['book.json', 'cover.webp', ...book.files.map((file) => file.path)]);
  for (const entry of await readdir(directory)) {
    if (!declared.has(entry)) {
      warn(`${relativeDirectory}/${entry}`, 'present on disk but not declared in book.json');
    }
  }

  if (book.authors.length === 0) warn(relativeDirectory, 'no authors recorded');
  if (book.year === null) warn(relativeDirectory, 'no publication year recorded');
}

async function main(): Promise<void> {
  const directories = await findBookDirectories(LIBRARY);
  const seenSlugs = new Map<string, string>();
  const seenHashes = new Map<string, string>();

  for (const directory of directories) {
    await validateBook(directory, seenSlugs, seenHashes);
  }

  for (const entry of await readdir(LIBRARY, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (findCategory(entry.name) === undefined) {
      error(`library/${entry.name}`, 'directory is not a category declared in taxonomy.ts');
    }
  }

  for (const orphan of await findOrphanFiles(LIBRARY)) {
    error(
      `library/${orphan}`,
      'book file is not declared by any book.json — run: pnpm library:add',
    );
  }

  console.info(`Validated ${directories.length} books.`);

  if (warnings.length > 0) {
    console.info(`\n${warnings.length} warning(s):`);
    for (const { where, message } of warnings) console.info(`  ${where}\n    ${message}`);
  }

  if (errors.length > 0) {
    console.error(`\n${errors.length} error(s):`);
    for (const { where, message } of errors) console.error(`  ${where}\n    ${message}`);
    process.exit(1);
  }

  console.info('\nAll checks passed.');
}

main().catch((cause: unknown) => {
  console.error(cause);
  process.exit(1);
});

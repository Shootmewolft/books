#!/usr/bin/env node

import { access, copyFile, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { basename, extname, join } from 'node:path';

import { findBookDirectories } from './find-book-directories.ts';
import { hashFile } from './hash-file.ts';
import { readPdfMetadata } from './read-pdf-metadata.ts';
import { slugify } from './slugify.ts';
import { FORMATS, LANGUAGES, TAG_SET, VALID_PATHS } from './taxonomy.ts';
import type { Book, Format, Kind, Language, PdfMetadata } from './types.ts';

const ROOT = process.cwd();
const LIBRARY = join(ROOT, 'library');
const KINDS: readonly Kind[] = ['book', 'guide', 'reference'];

const USAGE = `
Add a book to the library.

  pnpm library:add <file> --category <c> --subcategory <s> [options]

Required
  --category      category slug from taxonomy.ts
  --subcategory   subcategory slug from taxonomy.ts

Optional
  --lang          en | es                    (default: en)
  --kind          book | guide | reference   (default: book)
  --title         override the title embedded in the PDF
  --authors       comma-separated
  --year          publication year
  --edition       edition number; 2 or higher appends -Ne to the slug
  --publisher
  --tags          comma-separated, must already exist in TAGS
  --into <slug>   add this file to an EXISTING book instead of creating one.
                  This is how a translation is added.
  --move          move the source file instead of copying it

Examples
  pnpm library:add ~/ddd.pdf --category architecture \\
    --subcategory domain-driven-design --tags ddd,oop

  pnpm library:add ~/ddd-es.pdf --into domain-driven-design --lang es
`;

interface Options {
  positional: string[];
  move: boolean;
  [key: string]: string | boolean | string[] | undefined;
}

function parseArgs(argv: string[]): Options {
  const options: Options = { positional: [], move: false };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === undefined) continue;

    if (token === '--move') {
      options.move = true;
    } else if (token.startsWith('--')) {
      const value = argv[index + 1];
      index += 1;
      options[token.slice(2)] = value;
    } else {
      options.positional.push(token);
    }
  }

  return options;
}

function readOption(options: Options, key: string): string | undefined {
  const value = options[key];
  return typeof value === 'string' ? value : undefined;
}

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

function fail(message: string): never {
  console.error(`\n  ${message}\n`);
  process.exit(1);
}

function parseList(value: string | undefined): string[] {
  if (value === undefined) return [];
  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter((entry) => entry !== '');
}

async function findBookBySlug(slug: string): Promise<string | null> {
  const directories = await findBookDirectories(LIBRARY);
  return directories.find((directory) => basename(directory) === slug) ?? null;
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const source = options.positional[0];

  if (source === undefined || options['help'] !== undefined) {
    console.info(USAGE);
    process.exit(source === undefined ? 1 : 0);
  }

  if (!(await exists(source))) fail(`No such file: ${source}`);

  const format = extname(source).toLowerCase().slice(1) as Format;
  if (!FORMATS.includes(format)) {
    fail(`Unsupported format ".${format}" — expected ${FORMATS.join(' or ')}`);
  }

  const lang = (readOption(options, 'lang') ?? 'en') as Language;
  if (LANGUAGES[lang] === undefined) {
    fail(`Unsupported language "${lang}" — expected ${Object.keys(LANGUAGES).join(' or ')}`);
  }

  const metadata: PdfMetadata =
    format === 'pdf'
      ? await readPdfMetadata(source)
      : { title: null, authors: [], pages: null, year: null, encrypted: false };

  const stats = await stat(source);
  const md5 = await hashFile(source);
  const fileName = `${lang}.${format}`;

  const into = readOption(options, 'into');
  let directory: string;
  let book: Book;

  if (into !== undefined) {
    const existing = await findBookBySlug(into);
    if (existing === null) fail(`No book with slug "${into}" found in the library`);

    directory = existing;
    book = JSON.parse(await readFile(join(directory, 'book.json'), 'utf8')) as Book;

    if (book.files.some((file) => file.path === fileName)) {
      fail(`${book.slug} already has a ${fileName} — remove it first or pick another language`);
    }

    book.files.push({ lang, format, path: fileName, bytes: stats.size, md5 });
    book.files.sort((a, b) => a.path.localeCompare(b.path));
  } else {
    const category = readOption(options, 'category');
    const subcategory = readOption(options, 'subcategory');

    if (category === undefined || subcategory === undefined) {
      fail('--category and --subcategory are required (or use --into to extend an existing book)');
    }
    if (!VALID_PATHS.has(`${category}/${subcategory}`)) {
      fail(`Unknown path "${category}/${subcategory}" — add it to taxonomy.ts first`);
    }

    const kind = (readOption(options, 'kind') ?? 'book') as Kind;
    if (!KINDS.includes(kind)) fail(`Invalid kind "${kind}" — expected ${KINDS.join(', ')}`);

    const tags = parseList(readOption(options, 'tags'));
    const unknownTags = tags.filter((tag) => !TAG_SET.has(tag));
    if (unknownTags.length > 0) {
      fail(`Unknown tag(s): ${unknownTags.join(', ')} — add them to TAGS in taxonomy.ts first`);
    }

    const title =
      readOption(options, 'title') ?? metadata.title ?? basename(source, extname(source));
    const editionOption = readOption(options, 'edition');
    const edition = editionOption === undefined ? null : Number(editionOption);
    const baseSlug = slugify(title);
    const slug = edition !== null && edition > 1 ? `${baseSlug}-${edition}e` : baseSlug;

    directory = join(LIBRARY, category, subcategory, slug);
    if (await exists(directory)) {
      fail(`"${slug}" already exists — use --into ${slug} to add another language or format`);
    }

    const yearOption = readOption(options, 'year');
    const authorsOption = readOption(options, 'authors');

    book = {
      $schema: '../../../../schema/book.schema.json',
      slug,
      title,
      subtitle: null,
      authors: authorsOption === undefined ? metadata.authors : parseList(authorsOption),
      year: yearOption === undefined ? metadata.year : Number(yearOption),
      edition,
      publisher: readOption(options, 'publisher') ?? null,
      pages: metadata.pages,
      kind,
      category,
      subcategory,
      tags: tags.sort(),
      files: [{ lang, format, path: fileName, bytes: stats.size, md5 }],
    };
  }

  await mkdir(directory, { recursive: true });
  await copyFile(source, join(directory, fileName));
  await writeFile(join(directory, 'book.json'), `${JSON.stringify(book, null, 2)}\n`, 'utf8');

  if (options.move) await rm(source);

  console.info(`\n  Added ${book.title}`);
  console.info(`  ${directory.replace(`${ROOT}/`, '')}/${fileName}\n`);
  console.info('  Next:');
  console.info('    pnpm library:covers     extract the cover from page 1');
  console.info('    pnpm library:validate   check it against the schema');
  console.info('    pnpm library:readme     regenerate the catalogue\n');

  if (book.year === null) console.info('  Note: no year detected — add one with --year.');
  if (book.authors.length === 0)
    console.info('  Note: no authors detected — add them with --authors.');
}

main().catch((cause: unknown) => {
  console.error(cause);
  process.exit(1);
});

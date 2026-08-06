#!/usr/bin/env node

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

import { TAXONOMY } from './taxonomy.mjs';

const ROOT = process.cwd();
const LIBRARY = join(ROOT, 'library');
const GITHUB_USER = 'shootmewolft';
const REPO = 'books';

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  if (entries.some((entry) => entry.isFile() && entry.name === 'book.json')) return [directory];
  const found = [];
  for (const entry of entries) {
    if (entry.isDirectory()) found.push(...(await walk(join(directory, entry.name))));
  }
  return found;
}

function repoLink(directory) {
  return relative(ROOT, directory).split('/').map(encodeURIComponent).join('/');
}

function formatAuthors(authors) {
  if (!authors || authors.length === 0) return '—';
  if (authors.length <= 2) return authors.join(' & ');
  return `${authors[0]} et al.`;
}

function bookRow(book, directory) {
  const link = repoLink(directory);
  const title = book.subtitle ? `${book.title}` : book.title;
  const edition = book.edition && book.edition > 1 ? ` *(${book.edition}e)*` : '';
  const badge = book.kind === 'book' ? '' : ` \`${book.kind}\``;
  const formats = [...new Set(book.files.map((file) => file.format))].sort().join(', ');
  const languages = [...new Set(book.files.map((file) => file.lang))].sort().join(', ');

  return `| [${title}](${link})${edition}${badge} | ${formatAuthors(book.authors)} | ${
    book.year ?? '—'
  } | ${formats} | ${languages} |`;
}

async function build() {
  const directories = await walk(LIBRARY);
  const books = [];
  for (const directory of directories) {
    books.push({
      directory,
      data: JSON.parse(await readFile(join(directory, 'book.json'), 'utf8')),
    });
  }

  const totalFiles = books.reduce((sum, book) => sum + book.data.files.length, 0);
  const totalBytes = books.reduce(
    (sum, book) => sum + book.data.files.reduce((inner, file) => inner + file.bytes, 0),
    0,
  );
  const kinds = books.reduce((acc, book) => {
    acc[book.data.kind] = (acc[book.data.kind] ?? 0) + 1;
    return acc;
  }, {});

  const lines = [];

  lines.push('<div align="center">');
  lines.push('');
  lines.push('# 📚 Library');
  lines.push('');
  lines.push('**A curated collection of software engineering books, with a reader built in.**');
  lines.push('');
  lines.push(
    `\`${books.length} books\` · \`${totalFiles} files\` · \`${(totalBytes / 1024 ** 3).toFixed(
      2,
    )} GB\` · \`${TAXONOMY.length} categories\``,
  );
  lines.push('');
  lines.push(
    `[![Stars](https://img.shields.io/github/stars/${GITHUB_USER}/${REPO}?style=flat-square&label=stars&color=8b5cf6)](https://github.com/${GITHUB_USER}/${REPO}/stargazers)`,
  );
  lines.push(
    `[![Last commit](https://img.shields.io/github/last-commit/${GITHUB_USER}/${REPO}?style=flat-square&color=6366f1)](https://github.com/${GITHUB_USER}/${REPO}/commits)`,
  );
  lines.push(
    '[![License](https://img.shields.io/badge/code-MIT-blue?style=flat-square)](./LICENSE)',
  );
  lines.push('');
  lines.push(`Built by [**Shoot**](https://github.com/${GITHUB_USER})`);
  lines.push('');
  lines.push('</div>');
  lines.push('');
  lines.push('---');
  lines.push('');

  lines.push('## ⚖️ The books are not mine');
  lines.push('');
  lines.push('Every file under `library/` belongs to its authors and publishers. The MIT license');
  lines.push('covers the software in this repository — the reader, the tooling, the schemas — and');
  lines.push('nothing else. See [COPYRIGHT.md](./COPYRIGHT.md).');
  lines.push('');
  lines.push(
    '**If a book here is useful to you, buy it.** Removal requests from rights holders are',
  );
  lines.push('honoured immediately and without argument.');
  lines.push('');
  lines.push('---');
  lines.push('');

  lines.push('## How it is organised');
  lines.push('');
  lines.push('Every book is a directory holding its files and its metadata:');
  lines.push('');
  lines.push('```');
  lines.push('library/{category}/{subcategory}/{slug}/');
  lines.push('    book.json      metadata: title, authors, tags, files');
  lines.push('    cover.webp     extracted from page 1');
  lines.push('    en.pdf         one file per language and format');
  lines.push('    es.pdf         the same book in Spanish, when available');
  lines.push('```');
  lines.push('');
  lines.push(
    'A book lives in exactly one place. Everything cross-cutting is a **tag**, which is what',
  );
  lines.push(
    'the reader filters on — so a book that spans three topics stays findable without being',
  );
  lines.push('copied three times.');
  lines.push('');
  lines.push(
    `Content shapes: \`book\` (${kinds.book ?? 0}) · \`guide\` (${kinds.guide ?? 0}) · \`reference\` (${
      kinds.reference ?? 0
    }).`,
  );
  lines.push('');
  lines.push('---');
  lines.push('');

  lines.push('## Catalogue');
  lines.push('');
  for (const category of TAXONOMY) {
    const inCategory = books.filter((book) => book.data.category === category.slug);
    if (inCategory.length === 0) continue;

    lines.push(`### ${category.label.en} <sup>${inCategory.length}</sup>`);
    lines.push('');
    lines.push(`*${category.summary.en}*`);
    lines.push('');

    for (const subcategory of category.subcategories) {
      const inSubcategory = inCategory
        .filter((book) => book.data.subcategory === subcategory.slug)
        .sort((a, b) => a.data.title.localeCompare(b.data.title));
      if (inSubcategory.length === 0) continue;

      lines.push(`<details>`);
      lines.push(
        `<summary><b>${subcategory.label.en}</b> — ${inSubcategory.length} title${
          inSubcategory.length === 1 ? '' : 's'
        }</summary>`,
      );
      lines.push('');
      lines.push('| Title | Author | Year | Formats | Languages |');
      lines.push('|---|---|:---:|:---:|:---:|');
      for (const book of inSubcategory) lines.push(bookRow(book.data, book.directory));
      lines.push('');
      lines.push('</details>');
      lines.push('');
    }
  }

  lines.push('---');
  lines.push('');
  lines.push('## Running the reader');
  lines.push('');
  lines.push('```bash');
  lines.push('pnpm install');
  lines.push('pnpm dev');
  lines.push('```');
  lines.push('');
  lines.push('| Command | What it does |');
  lines.push('|---|---|');
  lines.push('| `pnpm dev` | Start the reader in development |');
  lines.push('| `pnpm build` | Production build |');
  lines.push('| `pnpm lint` | Biome lint + format check |');
  lines.push('| `pnpm library:validate` | Validate every book against the schema |');
  lines.push('| `pnpm library:covers` | Extract missing covers from page 1 |');
  lines.push('| `pnpm library:readme` | Regenerate this file |');
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Contributing');
  lines.push('');
  lines.push(
    'Adding a book is welcome — read [CONTRIBUTING.md](./CONTRIBUTING.md) first. CI validates',
  );
  lines.push(
    'structure, rejects duplicates by hash, and enforces the naming rules, so a malformed',
  );
  lines.push('submission fails before review rather than after.');
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('<div align="center">');
  lines.push('');
  lines.push('<sub>This file is generated by `pnpm library:readme`. Do not edit it by hand.</sub>');
  lines.push('');
  lines.push('</div>');
  lines.push('');

  return lines.join('\n');
}

async function main() {
  const content = await build();
  const target = join(ROOT, 'README.md');

  if (process.argv.includes('--check')) {
    const current = await readFile(target, 'utf8').catch(() => '');
    if (current !== content) {
      console.error('README.md is stale. Run: pnpm library:readme');
      process.exit(1);
    }
    console.info('README.md is up to date.');
    return;
  }

  await writeFile(target, content, 'utf8');
  console.info('Wrote README.md');
}

main().catch((cause) => {
  console.error(cause);
  process.exit(1);
});

# Contributing

Thanks for wanting to add something. This library is organised strictly on
purpose — the version before it had the same book stored three times under
three different names, so the rules below exist to stop that happening again.

Read [COPYRIGHT.md](./COPYRIGHT.md) before adding any file. CI can enforce
structure; it cannot enforce judgement about what belongs here.

---

## Adding a book

### 1. Find its home

A book lives in exactly **one** place:

```
library/{category}/{subcategory}/{slug}/
```

Valid categories and subcategories are defined in
[`tools/library/taxonomy.mjs`](./tools/library/taxonomy.mjs). Nothing outside
that list is accepted.

If a book genuinely spans several topics — *Designing Data-Intensive
Applications* is the canonical example — pick the single best home and express
the rest as **tags**. Do not copy the file. Tags are what the reader filters on,
so nothing is lost.

### 2. Name the directory

The directory name is the slug: lowercase, hyphenated, derived from the title.

```
domain-driven-design
kubernetes-in-action-2e     <- second edition and later carry a -Ne suffix
```

**Editions are separate books.** *Kubernetes in Action* 1st and 2nd editions get
their own directories. They are not duplicates and must not be merged.

### 3. Name the files

Files are named `{lang}.{format}`. Nothing else.

```
en.pdf      en.epub      es.pdf
```

The original filename is discarded. All bibliographic information belongs in
`book.json`, not in the filename — that is what kept the old tree unreadable.

### 4. Write `book.json`

```json
{
  "$schema": "../../../../schema/book.schema.json",
  "slug": "domain-driven-design",
  "title": "Domain-Driven Design",
  "subtitle": "Tackling Complexity in the Heart of Software",
  "authors": ["Eric Evans"],
  "year": 2003,
  "edition": null,
  "publisher": "Addison-Wesley",
  "pages": 560,
  "kind": "book",
  "category": "architecture",
  "subcategory": "domain-driven-design",
  "tags": ["ddd", "oop"],
  "files": [
    { "lang": "en", "format": "pdf", "path": "en.pdf", "bytes": 8123456 }
  ]
}
```

Pick `kind` honestly:

| kind | Meaning |
|---|---|
| `book` | A full-length published book |
| `guide` | A short-form guide, booklet, or vendor whitepaper |
| `reference` | A cheatsheet, poster, or single-diagram reference |

A 16-page vendor PDF is a `guide`, not a `book`. This is not pedantry — the
gallery groups by kind, and mixing a 1-page poster in with a 1300-page textbook
makes both harder to find.

Tags must already exist in `TAGS` in `taxonomy.mjs`. Adding a new tag is a
one-line change in the same pull request; inventing one inline fails CI. This
keeps `k8s` and `kubernetes` from both existing.

### 5. Generate the cover and verify

```bash
pnpm library:covers      # extracts page 1 into cover.webp
pnpm library:validate    # must pass before you open the PR
pnpm library:readme      # regenerates the catalogue
```

---

## Adding a language

A translation of a book that is **already here** is not a new book. Drop it into
the existing directory and add an entry to `files`:

```
library/architecture/fundamentals/clean-architecture/
    en.pdf
    es.pdf     <- add this
```

```json
"files": [
  { "lang": "en", "format": "pdf", "path": "en.pdf", "bytes": 8449671 },
  { "lang": "es", "format": "pdf", "path": "es.pdf", "bytes": 7210044 }
]
```

The reader can display two languages side by side, which only works when both
files belong to the same book entry.

---

## Adding a category

Only with a real book to put in it. The previous tree carried three categories
— Blockchain & Web3, Cloud Computing, Web & Mobile Development — each with a
README listing books that did not exist. Empty categories are worse than no
category.

Add it to `TAXONOMY` in `taxonomy.mjs`, with `en` and `es` labels, in the same
pull request as the book that justifies it.

---

## What CI checks

| Check | Failure |
|---|---|
| `book.json` parses and matches the schema | error |
| `slug` equals the directory name | error |
| Directory path matches `category`/`subcategory` | error |
| Edition > 1 has a `-Ne` slug suffix | error |
| Every tag exists in the vocabulary | error |
| Declared files exist, with matching size | error |
| No file exceeds 100 MB (GitHub's hard limit) | error |
| No md5 already present elsewhere in the library | error |
| Filenames follow `{lang}.{format}` | error |
| File above 50 MB | warning |
| Missing author or year | warning |

Run `pnpm check` locally to see exactly what CI will see.

---

## Code

Biome handles lint and formatting. There is no separate ESLint or Prettier.

```bash
pnpm lint         # check
pnpm lint:fix     # fix
```

Commits follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(reader): add synchronised scrolling to dual-pane view
fix(library): correct inverted title and authors on Pro Git
chore(deps): bump next to 16.3.0
```

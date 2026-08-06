# Contributing

Thanks for wanting to add something. This library is organised strictly on
purpose — the version before it had the same book stored three times under
three different names, so the rules below exist to stop that happening again.

Read [COPYRIGHT.md](./COPYRIGHT.md) before adding any file. CI can enforce
structure; it cannot enforce judgement about what belongs here.

---

## Adding a book

One command does the work:

```bash
pnpm library:add ~/Downloads/ddd.pdf \
  --category architecture \
  --subcategory domain-driven-design \
  --tags ddd,oop
```

It reads the PDF's embedded metadata for the title, authors and page count,
derives the slug, creates the directory, renames the file to `en.pdf`, and
writes `book.json`. Then:

```bash
pnpm library:covers     # extract the cover from page 1
pnpm library:validate   # check it against the schema
pnpm library:readme     # regenerate the catalogue in README.md
```

Open the pull request once `pnpm check` passes.

### Options

| Flag | Meaning |
|---|---|
| `--category` | Category slug, required |
| `--subcategory` | Subcategory slug, required |
| `--title` | Override the title embedded in the PDF |
| `--authors` | Comma-separated, if the PDF has none |
| `--year` | Publication year |
| `--edition` | Edition number; 2 or higher appends `-Ne` to the slug |
| `--publisher` | |
| `--tags` | Comma-separated, must already exist in `TAGS` |
| `--lang` | `en` or `es`, default `en` |
| `--kind` | `book`, `guide` or `reference`, default `book` |
| `--into <slug>` | Add the file to an existing book instead of creating one |
| `--move` | Move the source file instead of copying it |

Embedded PDF metadata is often wrong — plenty of files claim a title of
"Microsoft Word - final2.doc". Check what the command reports and override it.

### Adding a translation

A translation of a book that is **already here** is not a new book. Point it
at the existing slug:

```bash
pnpm library:add ~/Downloads/ddd-es.pdf --into domain-driven-design --lang es
```

That produces:

```
library/architecture/domain-driven-design/domain-driven-design/
    en.pdf
    es.pdf     <- added
    book.json  <- files[] updated
```

The reader can show two languages side by side, which only works when both
files belong to the same book entry.

---

## The rules the tooling enforces

**One home per book.** If a book genuinely spans several topics — *Designing
Data-Intensive Applications* is the canonical example — pick the single best
category and express the rest as **tags**. Do not copy the file. Tags are what
the reader filters on, so nothing is lost.

**Editions are separate books.** *Kubernetes in Action* 1st and 2nd editions
get their own directories, and any edition past the first carries a `-Ne`
suffix in its slug so URLs stay stable when another edition arrives.

**Filenames carry no information.** Every file is `{lang}.{format}`. The
bibliographic data lives in `book.json`. Filenames like
`_Grokking...libgen.li (1).pdf` are what made the old tree unreadable.

**Pick `kind` honestly.** A 16-page vendor PDF is a `guide`, not a `book`.
This is not pedantry: the gallery groups by kind, and mixing a one-page poster
in with a 1300-page textbook makes both harder to find.

**Tags must already exist** in `TAGS` in `tools/library/taxonomy.ts`. Adding a
new tag is a one-line change in the same pull request. This is what stops `k8s`
and `kubernetes` both existing.

---

## Adding a category

Only with a real book to put in it. The previous tree carried three categories
— Blockchain & Web3, Cloud Computing, Web & Mobile Development — each with a
README listing books that did not exist. Empty categories are worse than no
category.

Add it to `TAXONOMY` in `tools/library/taxonomy.ts`, with `en` and `es` labels,
in the same pull request as the book that justifies it.

---

## What CI checks

| Check | Failure |
|---|---|
| `book.json` parses and matches the schema | error |
| `slug` equals the directory name | error |
| Directory path matches `category`/`subcategory` | error |
| Edition > 1 has a `-Ne` slug suffix | error |
| Every tag exists in the vocabulary | error |
| Declared files exist, with matching size and md5 | error |
| **A book file exists that no `book.json` declares** | error |
| No file exceeds 100 MB (GitHub's hard limit) | error |
| No md5 already present elsewhere in the library | error |
| Filenames follow `{lang}.{format}` | error |
| README catalogue is up to date | error |
| File above 50 MB | warning |
| Missing author or year | warning |

Run `pnpm check` locally to see exactly what CI sees.

---

## Code

The tooling in `tools/` is TypeScript executed directly by Node — there is no
build step. Node 24 strips the types natively.

Biome handles lint and formatting. There is no separate ESLint or Prettier.

```bash
pnpm lint         # check
pnpm lint:fix     # fix
pnpm typecheck    # tools + web
pnpm check        # everything CI runs
```

Two conventions apply throughout:

- **No comments or JSDoc.** Naming and structure carry the meaning. Explanation
  belongs in commit messages and in docs like this one.
- **One exported function or component per file.** Shared helpers get their own
  file; framework-mandated co-exports (`generateMetadata`, route handlers) are
  the only exception.

Commits follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(reader): add synchronised scrolling to dual-pane view
fix(library): correct inverted title and authors on Pro Git
chore(deps): bump next to 16.3.0
```

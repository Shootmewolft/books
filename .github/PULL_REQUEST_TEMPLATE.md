<!--
  Adding a book? Run `pnpm check` first — it runs exactly what CI runs.
  Changing code only? Delete the book section below.
-->

## What this changes

<!-- One or two sentences. -->

## Adding a book

- [ ] Lives at `library/{category}/{subcategory}/{slug}/`
- [ ] Files named `{lang}.{format}` — the original filename is discarded
- [ ] `book.json` present, with `kind` chosen honestly (`book` / `guide` / `reference`)
- [ ] Tags already exist in `TAGS`, or are added in this same PR
- [ ] A later edition of an existing book uses a `-Ne` slug suffix
- [ ] A translation of an existing book was added to that book's directory, not a new one
- [ ] `pnpm library:covers` run
- [ ] `pnpm library:readme` run
- [ ] `pnpm library:validate` passes
- [ ] Not leaked, pre-release, or embargoed material

## Code changes

- [ ] `pnpm lint` passes
- [ ] Conventional commit messages

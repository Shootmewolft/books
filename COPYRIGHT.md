# Copyright and Ownership

## Short version

**The books in this repository are not mine.**

Every file under `library/` was written by its authors and published by its
publisher. I hold no rights over any of them. The MIT license in this
repository covers the software I wrote — the reader application, the tooling,
and the schemas — and nothing else.

## What is mine

| Path | Owner | License |
|---|---|---|
| `apps/` | Repository maintainer | MIT |
| `tools/` | Repository maintainer | MIT |
| `schema/` | Repository maintainer | MIT |
| Root config files | Repository maintainer | MIT |
| `library/**/book.json` | Repository maintainer | MIT (metadata only) |

## What is not mine

| Path | Owner |
|---|---|
| `library/**/*.pdf` | The respective authors and publishers |
| `library/**/*.epub` | The respective authors and publishers |
| `library/**/cover.*` | The respective publishers (cover artwork) |

Each `book.json` records the `authors` and `publisher` of its book. That
metadata exists partly so attribution is never ambiguous.

## Nature of this repository

This is a personal reading library. It is not a distribution service, not a
commercial product, and not an attempt to represent these works as my own.

I did not acquire these files from the publishers, and I make no claim that
their inclusion here is authorised by the rights holders.

**If you value a book here, buy it.** These are working texts by people who
spent years writing them. Links to purchase are the right way to support that
work, and the catalogue links to publishers wherever a canonical page exists.

## Requests for removal

If you are an author, publisher, or rights holder and want a work removed:

1. Open an issue titled `Removal request: <book title>`, or
2. Contact the maintainer directly at https://github.com/shootmewolft

**Removal requests are honoured without argument and without requiring proof
of ownership.** I would rather remove a book I was entitled to keep than keep
one I was not. No justification is needed and none will be requested.

## For contributors

Read this before adding anything:

- Do not add material you know to be leaked, pre-release, or under embargo.
- Do not add anything that is not a book, guide, or technical reference.
  Notably: no torrents, no media files, no software distributions.
- Do not add DRM-stripped commercial ebooks purchased under a licence that
  forbids redistribution.
- Prefer works the publisher has released freely (O'Reilly open titles, vendor
  whitepapers, university course texts). These carry no risk and are genuinely
  useful.

CI enforces the structural rules. It cannot enforce this one — that part is on
you.

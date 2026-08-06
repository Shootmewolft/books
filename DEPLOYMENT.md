# Deployment

The site runs on Vercel. The books do not.

## Why they are separate

The first deploy attempt failed with `ENOSPC`: the build container ran out of
disk. The cause was a 1.27 GB `.git/objects` pack, because 1.5 GB of PDFs were
committed to the repository.

Disk was not the only problem. The build output contained **zero PDFs** — Next
does not bundle files it is not importing. Even with enough disk, the deploy
would have gone out broken: the catalogue and all 302 book pages would render
(that data is baked in at build time), but every cover, every download and the
reader itself would have returned 404, because `/api/file/*` reads from a
`library/` directory that does not exist inside a serverless function.

So the books live in Cloudflare R2 and the repository keeps only metadata.

R2 rather than S3 or Vercel Blob for one reason: **egress is free**. A library
of 1.5 GB that people actually download would cost real money on the others.

---

## One-time setup

### 1. Create the R2 bucket

In the Cloudflare dashboard: **R2 → Create bucket**, named `library`.

Then **Settings → Public access**, and either enable the `r2.dev` subdomain or
connect a custom domain such as `books.your-domain.com`. A custom domain is
better: `r2.dev` is rate-limited and not meant for production.

### 2. Create an API token

**R2 → Manage API Tokens → Create token**, with *Object Read & Write* scoped to
the `library` bucket. Copy the values into `.env`:

```bash
cp .env.example .env
```

```
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET=library
```

### 3. Upload the library

```bash
pnpm library:upload
```

Roughly 1.5 GB across 158 files plus covers. The script skips objects already
present at the same size, so it is safe to re-run after adding a book. Use
`--force` to overwrite.

### 4. Purge the binaries from git history

`.gitignore` only stops *future* commits. The 1.27 GB is already in the history
and every clone still pays for it, including Vercel's.

**This rewrites history and requires a force push. Back up first.**

```bash
# from a copy of the repo, not your working one
pip install git-filter-repo

git filter-repo \
  --path-glob 'library/**/*.pdf' \
  --path-glob 'library/**/*.epub' \
  --path-glob 'library/**/cover.webp' \
  --path-glob 'library/**/cover.jpg' \
  --invert-paths

git remote add origin git@github.com:Shootmewolft/books.git
git push --force origin main
```

Expected result: the repository drops from ~1.3 GB to a few MB. The book files
stay on your disk — `git filter-repo` only rewrites history, and they are now
ignored.

Verify before pushing:

```bash
du -sh .git          # should be single-digit MB
git ls-files | wc -l # 151 book.json + code, no binaries
ls library/architecture/fundamentals/clean-architecture/  # files still there
```

### 5. Configure Vercel

**Project → Settings → Environment Variables**:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.com` |
| `LIBRARY_CDN_URL` | `https://books.your-domain.com` |

`LIBRARY_CDN_URL` is what flips the file route from reading disk to redirecting
to R2. Without it a deployed build serves 404s for every file.

Do **not** put the `R2_*` credentials in Vercel. They are only needed by
`pnpm library:upload`, which runs from your machine.

---

## How file serving works

```
browser → /api/file/architecture/fundamentals/clean-architecture/en.pdf
        → 308 redirect
        → https://books.your-domain.com/architecture/fundamentals/.../en.pdf
```

The redirect is deliberate. Proxying the bytes through the route handler would
bill every megabyte as Vercel bandwidth; redirecting means the file goes
straight from R2 to the reader, and R2 charges nothing for egress.

Range requests still work — the browser follows the redirect and negotiates
ranges with R2 directly, which is what lets the reader open page 1 of a 74 MB
PDF without fetching the rest.

Locally, `LIBRARY_CDN_URL` is unset, so the same route streams from disk. No
code path differs between environments beyond that one branch.

---

## Adding a book after the migration

```bash
pnpm library:add ~/Downloads/book.pdf --category data --subcategory kafka
pnpm library:covers
pnpm library:validate
pnpm library:readme
pnpm library:upload      # push the new file to R2
git add library tools README.md && git commit -m "feat(library): add ..."
git push
```

Only the metadata reaches git. The binary goes to R2.

---

## What CI can and cannot check

With the binaries out of the repository, CI has no files to hash, so it runs:

```bash
node tools/library/validate.ts --no-binaries
```

Still enforced: schema, slugs, taxonomy paths, edition suffixes, tag
vocabulary, filename convention, size limits from the declared `bytes`, and
duplicate detection across declared md5 values.

No longer verifiable in CI: that a file's real bytes match its declared size
and hash. That check still runs locally on the full `pnpm library:validate`,
which is what you run before uploading.

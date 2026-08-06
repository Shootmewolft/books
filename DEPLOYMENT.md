# Deployment

The site runs on Vercel. The books live in Cloudflare R2.

## Why they are separate

The first deploy failed with `ENOSPC`: the build container ran out of disk
against a 1.27 GB `.git` pack, caused by committing 1.5 GB of PDFs.

Disk was not the real problem. The build output contained **zero PDFs** — Next
does not bundle files nothing imports. Even with enough disk the deploy would
have shipped broken: the catalogue and all 302 book pages render fine because
that data is baked in at build time, but every cover, every download and the
reader itself would return 404, because `/api/file/*` reads a `library/`
directory that does not exist inside a serverless function.

R2 rather than S3 for one reason: **egress is free**. Storing 1.5 GB costs
roughly the same on both (cents per month), but S3 bills about $0.09 per GB
transferred out. For a library people actually download, the transfer is the
entire cost, and on R2 it is zero.

---

## One-time setup

### 1. Create the bucket

**Cloudflare dashboard → R2 → Create bucket**, named `library`.

### 2. Make it publicly readable

**Bucket → Settings → Public access.** Two options:

- **Custom domain** (recommended): connect `books.your-domain.com`. Needs the
  domain on Cloudflare. Gives a stable URL and no rate limiting.
- **r2.dev subdomain**: works immediately, but it is rate-limited and
  explicitly not meant for production traffic.

Then add a CORS policy, or the reader cannot issue range requests
cross-origin:

```json
[
  {
    "AllowedOrigins": ["https://your-domain.com", "http://localhost:3000"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["Range", "Content-Type"],
    "ExposeHeaders": ["Content-Length", "Content-Range", "Accept-Ranges"],
    "MaxAgeSeconds": 3000
  }
]
```

`ExposeHeaders` is load bearing. Without `Content-Range` and `Accept-Ranges`
visible to the browser, pdf.js cannot use range requests and downloads whole
files instead of single pages.

### 3. Create an API token

**R2 → Manage API Tokens → Create token**, permission *Object Read & Write*,
scoped to the `library` bucket only.

### 4. Configure `.env`

The file goes at the **repository root**, next to `package.json` — not in
`apps/web`. `pnpm library:upload` loads it with Node's `--env-file-if-exists`,
which resolves relative to where pnpm runs, so run the command from the root.

```bash
cp .env.example .env
```

```
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Custom domain:  https://books.your-domain.com
# r2.dev:         https://pub-<hash>.r2.dev
LIBRARY_CDN_URL=

R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=library
```

The `R2_*` values are used **only** by `pnpm library:upload`, which runs from
your machine. They never go to Vercel — the deployed site only redirects to
public URLs and never calls the R2 API.

Note that the reader does not read this file. Next loads env files from
`apps/web`, not from the root, and it does not need to: locally every variable
has a working default (`LIBRARY_CDN_URL` unset means serve from disk), and in
production Vercel supplies them. The root `.env` exists for the tooling.

### 5. Upload the library

```bash
pnpm library:upload
```

About 1.5 GB across 158 files plus covers. Multipart upload above 8 MB, four
parts in flight. Objects already present at the same size are skipped, so it is
safe to re-run after adding a book. `--force` overwrites.

### 6. Purge the binaries from git history

`.gitignore` only stops *future* commits. The 1.27 GB is already in history and
every clone still pays for it, Vercel's included. This is the step that
actually fixes the `ENOSPC`.

**This rewrites history and needs a force push. Back up first.**

```bash
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

Verify before pushing:

```bash
du -sh .git           # single-digit MB
git ls-files | wc -l  # 151 book.json plus code, no binaries
ls library/architecture/fundamentals/clean-architecture/   # files still on disk
```

`git filter-repo` only rewrites history. The book files stay in your working
directory; they are simply no longer tracked.

### 7. Configure Vercel

**Project → Settings → Environment Variables**:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.com` |
| `LIBRARY_CDN_URL` | your R2 public URL |

`LIBRARY_CDN_URL` is what flips the file route from reading disk to
redirecting. Without it, a deployed build returns 404 for every file.

---

## How file serving works

```
browser → /api/file/architecture/fundamentals/clean-architecture/en.pdf
        → 308 redirect
        → https://books.your-domain.com/architecture/fundamentals/.../en.pdf
```

The redirect is deliberate. Proxying the bytes through the route handler would
bill every megabyte as Vercel bandwidth. Redirecting means the file goes
straight from R2 to the reader, and R2 charges nothing for egress.

Range requests survive the redirect: the browser follows it and negotiates
ranges with R2 directly, which is what lets the reader open page 1 of a 74 MB
PDF without fetching the rest. This is why the CORS `ExposeHeaders` above are
not optional.

Locally `LIBRARY_CDN_URL` is unset, so the same route streams from disk. That
single branch is the only difference between environments.

---

## Adding a book after the migration

```bash
pnpm library:add ~/Downloads/book.pdf --category data --subcategory kafka
pnpm library:covers
pnpm library:validate
pnpm library:readme
pnpm library:upload
git add library tools README.md && git commit -m "feat(library): add ..."
git push
```

Only metadata reaches git. The binary goes to R2.

---

## What CI can and cannot check

With the binaries out of the repository, CI has no files to hash:

```bash
node tools/library/validate.ts --no-binaries
```

Still enforced: schema, slugs, taxonomy paths, edition suffixes, tag
vocabulary, filename convention, size limits from the declared `bytes`, and
duplicate detection across declared md5 values.

No longer verifiable in CI: that a file's real bytes match its declared size
and hash. That runs locally on the full `pnpm library:validate`, which is what
you run before uploading.

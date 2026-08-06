# Deployment

The site runs on Vercel. The books do not — they live in S3.

## Why they are separate

The first deploy failed with `ENOSPC`: the build container ran out of disk
against a 1.27 GB `.git` pack, caused by committing 1.5 GB of PDFs.

Disk was not the real problem. The build output contained **zero PDFs** — Next
does not bundle files nothing imports. Even with enough disk the deploy would
have shipped broken: the catalogue and all 302 book pages render fine because
that data is baked in at build time, but every cover, every download and the
reader itself would return 404, because `/api/file/*` reads a `library/`
directory that does not exist inside a serverless function.

---

## Cost, stated plainly

S3 charges for egress: roughly **$0.09 per GB** transferred out. Storing 1.5 GB
costs about $0.035/month, which is nothing. The transfer is the variable.

| Scenario | Rough monthly egress cost |
|---|---|
| Personal use, a few reads | under $0.10 |
| 100 downloads of a 10 MB book | ~$0.09 |
| 1000 book downloads averaging 10 MB | ~$0.90 |
| A post that gets traction, 100 GB | ~$9 |

Putting **CloudFront in front of S3 is worth it**, and not only for cost:
CloudFront's free tier covers 1 TB/month of egress, caches at the edge so
repeat reads never touch S3, and gives far better latency for a PDF reader
issuing many range requests. Direct S3 access works, but every byte is billed
and served from a single region.

---

## One-time setup

### 1. Make the bucket readable

The reader fetches files straight from the bucket URL, so the objects must be
publicly readable.

**S3 → your bucket → Permissions**:

- Turn off *Block all public access*
- Add this bucket policy, replacing `YOUR-BUCKET`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadForLibrary",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR-BUCKET/*"
    }
  ]
}
```

Also add a CORS rule, or the PDF reader cannot issue range requests
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

`ExposeHeaders` matters. Without `Content-Range` and `Accept-Ranges` visible to
the browser, pdf.js falls back to downloading the whole file.

### 2. Create an IAM user for uploads

An access key scoped to this bucket only. Minimum policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject", "s3:HeadObject", "s3:ListBucket"],
      "Resource": [
        "arn:aws:s3:::YOUR-BUCKET",
        "arn:aws:s3:::YOUR-BUCKET/*"
      ]
    }
  ]
}
```

### 3. Configure `.env`

```bash
cp .env.example .env
```

Replace the contents with:

```
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# S3 direct:  https://YOUR-BUCKET.s3.YOUR-REGION.amazonaws.com
# CloudFront: https://books.your-domain.com
LIBRARY_CDN_URL=

AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
S3_BUCKET=
```

The `AWS_*` values are used **only** by `pnpm library:upload`, which runs from
your machine. They never go to Vercel — the deployed site only redirects to
public URLs and never calls the AWS API.

### 4. Upload the library

```bash
pnpm library:upload
```

About 1.5 GB across 158 files plus covers. Uses multipart upload for anything
over 8 MB, and skips objects already present at the same size, so it is safe to
re-run after adding a book. `--force` overwrites.

### 5. Purge the binaries from git history

`.gitignore` only stops *future* commits. The 1.27 GB is already in history and
every clone still pays for it, Vercel's included.

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

### 6. Configure Vercel

**Project → Settings → Environment Variables**:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.com` |
| `LIBRARY_CDN_URL` | your bucket or CloudFront URL |

`LIBRARY_CDN_URL` is what flips the file route from reading disk to redirecting.
Without it, a deployed build returns 404 for every file.

---

## How file serving works

```
browser → /api/file/architecture/fundamentals/clean-architecture/en.pdf
        → 308 redirect
        → https://<bucket-or-cloudfront>/architecture/fundamentals/.../en.pdf
```

The redirect is deliberate. Proxying the bytes through the route handler would
bill every megabyte as Vercel bandwidth on top of the S3 egress. Redirecting
means the file travels once, from the bucket to the reader.

Range requests survive the redirect: the browser follows it and negotiates
ranges with S3 directly, which is what lets the reader open page 1 of a 74 MB
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

Only metadata reaches git. The binary goes to S3.

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

#!/usr/bin/env node

import { createReadStream } from 'node:fs';
import { readdir, stat } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';

import { HeadObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

const ROOT = process.cwd();
const LIBRARY = join(ROOT, 'library');

const UPLOADABLE = new Set(['.pdf', '.epub', '.webp', '.jpg', '.jpeg', '.png']);

const CONTENT_TYPES: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.epub': 'application/epub+zip',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
};

const ONE_YEAR_IMMUTABLE = 'public, max-age=31536000, immutable';
const MULTIPART_THRESHOLD_BYTES = 8 * 1024 * 1024;
const REQUIRED_ENV = ['AWS_REGION', 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'S3_BUCKET'];

function requireEnv(name: string): string {
  const value = process.env[name];
  if (value === undefined || value === '') {
    console.error(`\n  Missing ${name}.\n  Required: ${REQUIRED_ENV.join(', ')}\n`);
    process.exit(1);
  }
  return value;
}

async function collectFiles(directory: string, found: string[]): Promise<string[]> {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const full = join(directory, entry.name);
    if (entry.isDirectory()) {
      await collectFiles(full, found);
    } else if (UPLOADABLE.has(extname(entry.name).toLowerCase())) {
      found.push(full);
    }
  }
  return found;
}

async function objectMatches(
  client: S3Client,
  bucket: string,
  key: string,
  size: number,
): Promise<boolean> {
  try {
    const head = await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return head.ContentLength === size;
  } catch {
    return false;
  }
}

async function main(): Promise<void> {
  const bucket = requireEnv('S3_BUCKET');

  const client = new S3Client({
    region: requireEnv('AWS_REGION'),
    credentials: {
      accessKeyId: requireEnv('AWS_ACCESS_KEY_ID'),
      secretAccessKey: requireEnv('AWS_SECRET_ACCESS_KEY'),
    },
  });

  const files = (await collectFiles(LIBRARY, [])).sort();
  const force = process.argv.includes('--force');

  let uploaded = 0;
  let skipped = 0;
  let uploadedBytes = 0;

  for (const [index, file] of files.entries()) {
    const key = relative(LIBRARY, file);
    const { size } = await stat(file);

    if (!force && (await objectMatches(client, bucket, key, size))) {
      skipped += 1;
      continue;
    }

    const transfer = new Upload({
      client,
      params: {
        Bucket: bucket,
        Key: key,
        Body: createReadStream(file),
        ContentType: CONTENT_TYPES[extname(file).toLowerCase()] ?? 'application/octet-stream',
        CacheControl: ONE_YEAR_IMMUTABLE,
      },
      partSize: MULTIPART_THRESHOLD_BYTES,
      queueSize: 4,
    });

    await transfer.done();

    uploaded += 1;
    uploadedBytes += size;
    console.info(`[${index + 1}/${files.length}] ${key} (${(size / 1048576).toFixed(1)} MB)`);
  }

  console.info(`\n  Uploaded ${uploaded}, skipped ${skipped} already present at the same size.`);
  console.info(`  ${(uploadedBytes / 1024 ** 3).toFixed(2)} GB transferred.\n`);
}

main().catch((cause: unknown) => {
  console.error(cause);
  process.exit(1);
});

#!/usr/bin/env node

import { createReadStream } from 'node:fs';
import { readdir, stat } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';

import { HeadObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

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

function requireEnv(name: string): string {
  const value = process.env[name];
  if (value === undefined || value === '') {
    console.error(
      `\n  Missing ${name}. Required: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET\n`,
    );
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

async function objectExists(client: S3Client, bucket: string, key: string, size: number) {
  try {
    const head = await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return head.ContentLength === size;
  } catch {
    return false;
  }
}

async function main(): Promise<void> {
  const accountId = requireEnv('R2_ACCOUNT_ID');
  const bucket = requireEnv('R2_BUCKET');

  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: requireEnv('R2_ACCESS_KEY_ID'),
      secretAccessKey: requireEnv('R2_SECRET_ACCESS_KEY'),
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
    const position = `[${index + 1}/${files.length}]`;

    if (!force && (await objectExists(client, bucket, key, size))) {
      skipped += 1;
      continue;
    }

    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: createReadStream(file),
        ContentLength: size,
        ContentType: CONTENT_TYPES[extname(file).toLowerCase()] ?? 'application/octet-stream',
        CacheControl: ONE_YEAR_IMMUTABLE,
      }),
    );

    uploaded += 1;
    uploadedBytes += size;
    console.info(`${position} ${key} (${(size / 1048576).toFixed(1)} MB)`);
  }

  console.info(`\n  Uploaded ${uploaded}, skipped ${skipped} already present.`);
  console.info(`  ${(uploadedBytes / 1024 ** 3).toFixed(2)} GB transferred.\n`);
}

main().catch((cause: unknown) => {
  console.error(cause);
  process.exit(1);
});

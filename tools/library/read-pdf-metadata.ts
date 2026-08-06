import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

import type { PdfMetadata } from './types.ts';

const run = promisify(execFile);
const MAX_OUTPUT_BYTES = 1024 * 1024;

function splitAuthors(value: string | undefined): string[] {
  if (value === undefined || value === '') return [];

  return value
    .split(/\s*(?:,|&|;|\band\b|_)\s*/i)
    .map((name) => name.trim())
    .filter((name) => name.length > 1 && /[a-zA-Z]/.test(name));
}

const EMPTY: PdfMetadata = {
  title: null,
  authors: [],
  pages: null,
  year: null,
  encrypted: false,
};

export async function readPdfMetadata(filePath: string): Promise<PdfMetadata> {
  try {
    const { stdout } = await run('pdfinfo', [filePath], { maxBuffer: MAX_OUTPUT_BYTES });
    const fields = new Map<string, string>();

    for (const line of stdout.split('\n')) {
      const separator = line.indexOf(':');
      if (separator === -1) continue;
      fields.set(line.slice(0, separator).trim(), line.slice(separator + 1).trim());
    }

    const pages = fields.get('Pages');
    const encrypted = fields.get('Encrypted');
    const yearMatch = (fields.get('CreationDate') ?? '').match(/\b((?:19|20)\d{2})\b/);

    return {
      title: fields.get('Title') ?? null,
      authors: splitAuthors(fields.get('Author')),
      pages: pages === undefined ? null : Number(pages),
      year: yearMatch?.[1] === undefined ? null : Number(yearMatch[1]),
      encrypted: encrypted === undefined ? false : !encrypted.startsWith('no'),
    };
  } catch {
    return EMPTY;
  }
}

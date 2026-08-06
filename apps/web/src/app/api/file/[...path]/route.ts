import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { Readable } from 'node:stream';
import type { NextRequest } from 'next/server';
import { LIBRARY_CDN_URL } from '@/constants/library-cdn';
import { buildCdnUrl } from '@/modules/library-files/domain/build-cdn-url';
import { resolveInLibrary } from '@/server/library-path/resolve-in-library';

const ONE_YEAR_IMMUTABLE = 'public, max-age=31536000, immutable';

const CONTENT_TYPES: Record<string, string> = {
  pdf: 'application/pdf',
  epub: 'application/epub+zip',
  webp: 'image/webp',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
};

interface ByteRange {
  start: number;
  end: number;
}

function contentTypeFor(path: string): string {
  const extension = path.split('.').pop()?.toLowerCase() ?? '';
  return CONTENT_TYPES[extension] ?? 'application/octet-stream';
}

function parseRange(header: string | null, size: number): ByteRange | null {
  if (header === null) return null;

  const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (match === null) return null;

  const [, rawStart = '', rawEnd = ''] = match;

  if (rawStart === '') {
    if (rawEnd === '') return null;
    const suffixLength = Number(rawEnd);
    if (suffixLength <= 0) return null;
    return { start: Math.max(0, size - suffixLength), end: size - 1 };
  }

  const start = Number(rawStart);
  const end = rawEnd === '' ? size - 1 : Math.min(Number(rawEnd), size - 1);

  const isValid = !Number.isNaN(start) && !Number.isNaN(end) && start <= end && start < size;
  return isValid ? { start, end } : null;
}

function toWebStream(nodeStream: ReturnType<typeof createReadStream>): ReadableStream<Uint8Array> {
  return Readable.toWeb(nodeStream) as ReadableStream<Uint8Array>;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
): Promise<Response> {
  const { path: segments } = await context.params;

  if (segments.some((segment) => segment === '..' || segment.includes('/'))) {
    return new Response('Forbidden', { status: 403 });
  }

  if (LIBRARY_CDN_URL !== null) {
    return Response.redirect(buildCdnUrl(LIBRARY_CDN_URL, segments), 308);
  }

  let absolutePath: string;
  try {
    absolutePath = resolveInLibrary(...segments);
  } catch {
    return new Response('Forbidden', { status: 403 });
  }

  let size: number;
  try {
    const stats = await stat(absolutePath);
    if (!stats.isFile()) return new Response('Not found', { status: 404 });
    size = stats.size;
  } catch {
    return new Response('Not found', { status: 404 });
  }

  const isDownload = request.nextUrl.searchParams.get('download') === '1';
  const filename = segments.at(-1) ?? 'file';

  const headers = new Headers({
    'Content-Type': contentTypeFor(absolutePath),
    'Accept-Ranges': 'bytes',
    'Cache-Control': ONE_YEAR_IMMUTABLE,
    'Content-Disposition': `${isDownload ? 'attachment' : 'inline'}; filename="${filename}"`,
  });

  const range = parseRange(request.headers.get('range'), size);

  if (range === null) {
    headers.set('Content-Length', String(size));
    return new Response(toWebStream(createReadStream(absolutePath)), {
      status: 200,
      headers,
    });
  }

  headers.set('Content-Length', String(range.end - range.start + 1));
  headers.set('Content-Range', `bytes ${range.start}-${range.end}/${size}`);

  return new Response(
    toWebStream(createReadStream(absolutePath, { start: range.start, end: range.end })),
    { status: 206, headers },
  );
}

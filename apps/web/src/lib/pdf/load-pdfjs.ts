import type * as PdfJs from 'pdfjs-dist';

let cached: typeof PdfJs | null = null;

export async function loadPdfJs(): Promise<typeof PdfJs> {
  if (cached !== null) return cached;

  const pdfjs = await import('pdfjs-dist');

  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString();

  cached = pdfjs;
  return pdfjs;
}

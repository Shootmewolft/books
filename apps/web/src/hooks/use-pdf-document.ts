'use client';

import type { PDFDocumentLoadingTask, PDFDocumentProxy } from 'pdfjs-dist';
import { useEffect, useState } from 'react';

import { loadPdfJs } from '@/lib/pdf/load-pdfjs';

export type PdfStatus = 'idle' | 'loading' | 'ready' | 'failed';

export interface PdfDocumentState {
  document: PDFDocumentProxy | null;
  pageCount: number;
  status: PdfStatus;
}

const RANGE_CHUNK_SIZE = 65_536;

export function usePdfDocument(url: string | null): PdfDocumentState {
  const [state, setState] = useState<PdfDocumentState>({
    document: null,
    pageCount: 0,
    status: 'idle',
  });

  useEffect(() => {
    if (url === null) {
      setState({ document: null, pageCount: 0, status: 'idle' });
      return;
    }

    let cancelled = false;
    let task: PDFDocumentLoadingTask | null = null;

    setState({ document: null, pageCount: 0, status: 'loading' });

    loadPdfJs()
      .then((pdfjs) => {
        if (cancelled) return null;
        task = pdfjs.getDocument({ url, rangeChunkSize: RANGE_CHUNK_SIZE });
        return task.promise;
      })
      .then((document) => {
        if (cancelled || document === null) return;
        setState({ document, pageCount: document.numPages, status: 'ready' });
      })
      .catch(() => {
        if (!cancelled) setState({ document: null, pageCount: 0, status: 'failed' });
      });

    return () => {
      cancelled = true;
      void task?.destroy();
    };
  }, [url]);

  return state;
}

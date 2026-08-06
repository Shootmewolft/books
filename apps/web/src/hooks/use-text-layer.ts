'use client';

import type { PDFDocumentProxy } from 'pdfjs-dist';
import { type RefObject, useEffect } from 'react';

import { loadPdfJs } from '@/lib/pdfjs/load-pdfjs';

interface UseTextLayerOptions {
  document: PDFDocumentProxy | null;
  pageNumber: number;
  scale: number;
  containerRef: RefObject<HTMLDivElement | null>;
}

export function useTextLayer({
  document,
  pageNumber,
  scale,
  containerRef,
}: UseTextLayerOptions): void {
  useEffect(() => {
    if (document === null) return;

    const container = containerRef.current;
    if (container === null) return;

    let cancelled = false;
    let layer: { cancel: () => void } | null = null;

    const run = async () => {
      const pdfjs = await loadPdfJs();
      const page = await document.getPage(pageNumber);
      if (cancelled) return;

      const viewport = page.getViewport({ scale });
      container.replaceChildren();
      container.style.setProperty('--scale-factor', String(scale));
      container.style.width = `${viewport.width}px`;
      container.style.height = `${viewport.height}px`;

      const textLayer = new pdfjs.TextLayer({
        textContentSource: page.streamTextContent(),
        container,
        viewport,
      });

      layer = textLayer;
      await textLayer.render();
    };

    void run().catch(() => undefined);

    return () => {
      cancelled = true;
      layer?.cancel();
    };
  }, [document, pageNumber, scale, containerRef]);
}

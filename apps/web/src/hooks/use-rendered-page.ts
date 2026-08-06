'use client';

import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist';
import { type RefObject, useEffect } from 'react';

interface UseRenderedPageOptions {
  document: PDFDocumentProxy | null;
  pageNumber: number;
  scale: number;
  canvasRef: RefObject<HTMLCanvasElement | null>;
}

export function useRenderedPage({
  document,
  pageNumber,
  scale,
  canvasRef,
}: UseRenderedPageOptions): void {
  useEffect(() => {
    if (document === null) return;

    const canvas = canvasRef.current;
    if (canvas === null) return;

    let cancelled = false;
    let task: RenderTask | null = null;

    document
      .getPage(pageNumber)
      .then((page) => {
        if (cancelled) return;

        const context = canvas.getContext('2d');
        if (context === null) return;

        const devicePixelRatio = window.devicePixelRatio || 1;
        const viewport = page.getViewport({ scale: scale * devicePixelRatio });

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = `${viewport.width / devicePixelRatio}px`;
        canvas.style.height = `${viewport.height / devicePixelRatio}px`;

        task = page.render({ canvas, canvasContext: context, viewport });
        return task.promise;
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
      task?.cancel();
    };
  }, [document, pageNumber, scale, canvasRef]);
}

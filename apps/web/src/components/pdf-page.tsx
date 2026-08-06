'use client';

import type { PDFDocumentProxy } from 'pdfjs-dist';
import { useRef } from 'react';

import { HighlightLayer } from '@/components/highlight-layer';
import { useRenderedPage } from '@/hooks/use-rendered-page';
import { useTextLayer } from '@/hooks/use-text-layer';
import type { Highlight } from '@/modules/reader/domain/highlight';

interface PdfPageProps {
  document: PDFDocumentProxy | null;
  pageNumber: number;
  scale: number;
  highlights: readonly Highlight[];
  onRemoveHighlight: (id: string) => void;
  removeLabel: string;
}

export function PdfPage({
  document,
  pageNumber,
  scale,
  highlights,
  onRemoveHighlight,
  removeLabel,
}: PdfPageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textLayerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  useRenderedPage({ document, pageNumber, scale, canvasRef });
  useTextLayer({ document, pageNumber, scale, containerRef: textLayerRef });

  return (
    <div ref={pageRef} data-pdf-page className="relative mx-auto w-fit">
      <canvas
        ref={canvasRef}
        className="block rounded-card shadow-[0_18px_40px_-18px_rgb(0_0_0/0.9)]"
      />
      <HighlightLayer
        highlights={highlights}
        onRemove={onRemoveHighlight}
        removeLabel={removeLabel}
      />
      <div ref={textLayerRef} className="textLayer" />
    </div>
  );
}

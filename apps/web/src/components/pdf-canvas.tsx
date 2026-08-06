'use client';

import type { PDFDocumentProxy } from 'pdfjs-dist';
import { useRef } from 'react';

import { useRenderedPage } from '@/hooks/use-rendered-page';

interface PdfCanvasProps {
  document: PDFDocumentProxy | null;
  pageNumber: number;
  scale: number;
}

export function PdfCanvas({ document, pageNumber, scale }: PdfCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useRenderedPage({ document, pageNumber, scale, canvasRef });

  return (
    <canvas
      ref={canvasRef}
      className="mx-auto block max-w-full rounded-card shadow-[0_18px_40px_-18px_rgb(0_0_0/0.9)]"
    />
  );
}

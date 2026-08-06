'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { HighlightPicker } from '@/components/highlight-picker';
import { PdfPage } from '@/components/pdf-page';
import { ReaderToolbar } from '@/components/reader-toolbar';
import { useHighlights } from '@/hooks/use-highlights';
import { usePdfDocument } from '@/hooks/use-pdf-document';
import { useReaderShortcuts } from '@/hooks/use-reader-shortcuts';
import { useTextSelection } from '@/hooks/use-text-selection';
import type { Messages } from '@/i18n/types';
import type { CatalogueBook } from '@/modules/catalogue/types';
import { DEFAULT_ZOOM, PAGE_HORIZONTAL_PADDING_PX } from '@/modules/reader/constants/zoom';
import { fileUrl } from '@/modules/reader/domain/file-url';
import type { HighlightColor } from '@/modules/reader/domain/highlight';
import { nextZoomLevel } from '@/modules/reader/domain/next-zoom-level';

interface ReaderPaneProps {
  book: CatalogueBook;
  initialFilePath: string;
  pageNumber: number;
  messages: Messages;
  isFocused: boolean;
  onFocus: () => void;
  onPageChange: (page: number) => void;
  onClose?: () => void;
}

export function ReaderPane({
  book,
  initialFilePath,
  pageNumber,
  messages,
  isFocused,
  onFocus,
  onPageChange,
  onClose,
}: ReaderPaneProps) {
  const [filePath, setFilePath] = useState(initialFilePath);
  const [scale, setScale] = useState(DEFAULT_ZOOM);

  const scrollRef = useRef<HTMLElement>(null);
  const { document: pdf, pageCount, status } = usePdfDocument(fileUrl(`${book.path}/${filePath}`));
  const { highlights, addHighlight, removeHighlight } = useHighlights(book.path, filePath);
  const { selection, clear } = useTextSelection(scrollRef);

  const clampPage = useCallback(
    (page: number) => {
      if (page < 1) return 1;
      if (pageCount > 0 && page > pageCount) return pageCount;
      return page;
    },
    [pageCount],
  );

  useEffect(() => {
    if (pageCount > 0 && pageNumber > pageCount) onPageChange(pageCount);
  }, [pageCount, pageNumber, onPageChange]);

  const fitWidth = useCallback(async () => {
    if (pdf === null || scrollRef.current === null) return;
    const page = await pdf.getPage(pageNumber);
    const base = page.getViewport({ scale: 1 });
    const available = scrollRef.current.clientWidth - PAGE_HORIZONTAL_PADDING_PX;
    if (available > 0) setScale(available / base.width);
  }, [pdf, pageNumber]);

  useReaderShortcuts({
    enabled: isFocused && status === 'ready',
    onPreviousPage: () => onPageChange(clampPage(pageNumber - 1)),
    onNextPage: () => onPageChange(clampPage(pageNumber + 1)),
    onFirstPage: () => onPageChange(1),
    onLastPage: () => onPageChange(pageCount > 0 ? pageCount : 1),
    onZoomIn: () => setScale((current) => nextZoomLevel(current, 1)),
    onZoomOut: () => setScale((current) => nextZoomLevel(current, -1)),
    onResetZoom: () => setScale(DEFAULT_ZOOM),
    onFitWidth: () => void fitWidth(),
  });

  const applyHighlight = (color: HighlightColor) => {
    if (selection === null) return;
    addHighlight({ page: pageNumber, color, text: selection.text, rects: selection.rects });
    clear();
  };

  const pageHighlights = highlights.filter((entry) => entry.page === pageNumber);

  return (
    <section
      aria-label={book.title}
      onFocusCapture={onFocus}
      className={`flex min-h-0 flex-1 flex-col overflow-hidden rounded-card border bg-void transition-colors ${
        isFocused ? 'border-brass-dim' : 'border-edge'
      }`}
    >
      <ReaderToolbar
        title={book.title}
        pageNumber={pageNumber}
        pageCount={pageCount}
        scale={scale}
        files={book.files}
        activeFilePath={filePath}
        messages={messages}
        onPageChange={(page) => onPageChange(clampPage(page))}
        onZoomIn={() => setScale((current) => nextZoomLevel(current, 1))}
        onZoomOut={() => setScale((current) => nextZoomLevel(current, -1))}
        onFitWidth={() => void fitWidth()}
        onFileChange={setFilePath}
        {...(onClose === undefined ? {} : { onClose })}
      />

      <section
        ref={scrollRef}
        // biome-ignore lint/a11y/noNoninteractiveTabindex: WCAG 2.1.1 — a scrollable region must be reachable by keyboard, otherwise the page cannot be scrolled without a pointer
        tabIndex={0}
        aria-label={messages.reader.title}
        className="min-h-0 flex-1 overflow-auto bg-deep p-4 focus-visible:outline-none"
      >
        {status === 'loading' && (
          <p className="py-16 text-center text-paper-faint text-small">{messages.reader.loading}</p>
        )}

        {status === 'failed' && (
          <div className="rule-brass py-16 pl-6">
            <p className="text-paper text-small">{messages.reader.failed}</p>
            <p className="mt-1 text-paper-dim text-small">{messages.reader.failedHint}</p>
            <a
              href={fileUrl(`${book.path}/${filePath}`, true)}
              download
              className="mt-3 inline-block text-brass text-small underline decoration-brass-dim underline-offset-4"
            >
              {messages.book.download}
            </a>
          </div>
        )}

        {status === 'ready' && (
          <PdfPage
            document={pdf}
            pageNumber={pageNumber}
            scale={scale}
            highlights={pageHighlights}
            onRemoveHighlight={removeHighlight}
            removeLabel={messages.reader.removeHighlight}
          />
        )}
      </section>

      {selection !== null && (
        <HighlightPicker
          position={selection.anchor}
          label={messages.reader.highlight}
          onPick={applyHighlight}
        />
      )}
    </section>
  );
}

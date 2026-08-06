'use client';

import { useEffect, useState } from 'react';

import { PdfCanvas } from '@/components/pdf-canvas';
import { ReaderToolbar } from '@/components/reader-toolbar';
import { usePdfDocument } from '@/hooks/use-pdf-document';
import type { Messages } from '@/i18n/types';
import type { CatalogueBook } from '@/modules/catalogue/types';
import { fileUrl } from '@/modules/reader/domain/file-url';

const MIN_SCALE = 0.4;
const MAX_SCALE = 3;
const DEFAULT_SCALE = 1.1;

interface ReaderPaneProps {
  book: CatalogueBook;
  initialFilePath: string;
  pageNumber: number;
  messages: Messages;
  onPageChange: (page: number) => void;
  onClose?: () => void;
}

export function ReaderPane({
  book,
  initialFilePath,
  pageNumber,
  messages,
  onPageChange,
  onClose,
}: ReaderPaneProps) {
  const [filePath, setFilePath] = useState(initialFilePath);
  const [scale, setScale] = useState(DEFAULT_SCALE);

  const { document, pageCount, status } = usePdfDocument(fileUrl(`${book.path}/${filePath}`));

  useEffect(() => {
    if (pageCount > 0 && pageNumber > pageCount) onPageChange(pageCount);
  }, [pageCount, pageNumber, onPageChange]);

  const clampPage = (page: number) => {
    if (page < 1) return 1;
    if (pageCount > 0 && page > pageCount) return pageCount;
    return page;
  };

  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-card border border-edge bg-void">
      <ReaderToolbar
        title={book.title}
        pageNumber={pageNumber}
        pageCount={pageCount}
        files={book.files}
        activeFilePath={filePath}
        messages={messages}
        onPageChange={(page) => onPageChange(clampPage(page))}
        onScaleChange={(delta) =>
          setScale((current) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, current + delta)))
        }
        onFileChange={setFilePath}
        {...(onClose === undefined ? {} : { onClose })}
      />

      <div className="min-h-0 flex-1 overflow-auto bg-deep p-4">
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
          <PdfCanvas document={document} pageNumber={pageNumber} scale={scale} />
        )}
      </div>
    </section>
  );
}

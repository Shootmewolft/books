'use client';

import { IconButton } from '@/components/icon-button';
import { PaneLanguageSwitch } from '@/components/pane-language-switch';
import type { Messages } from '@/i18n/types';
import type { BookFile } from '@/modules/catalogue/types';

interface ReaderToolbarProps {
  title: string;
  pageNumber: number;
  pageCount: number;
  files: readonly BookFile[];
  activeFilePath: string;
  messages: Messages;
  onPageChange: (page: number) => void;
  onScaleChange: (delta: number) => void;
  onFileChange: (path: string) => void;
  onClose?: () => void;
}

export function ReaderToolbar({
  title,
  pageNumber,
  pageCount,
  files,
  activeFilePath,
  messages,
  onPageChange,
  onScaleChange,
  onFileChange,
  onClose,
}: ReaderToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-edge border-b bg-deep px-4 py-2.5">
      <p className="min-w-0 flex-1 truncate font-display font-semibold text-paper text-small">
        {title}
      </p>

      <PaneLanguageSwitch files={files} activePath={activeFilePath} onSelect={onFileChange} />

      <div className="flex items-center gap-1.5">
        <IconButton
          label={messages.reader.previousPage}
          onClick={() => onPageChange(pageNumber - 1)}
          disabled={pageNumber <= 1}
        >
          ‹
        </IconButton>

        <span className="font-mono text-micro text-paper-dim tabular-nums">
          {pageNumber} / {pageCount || '—'}
        </span>

        <IconButton
          label={messages.reader.nextPage}
          onClick={() => onPageChange(pageNumber + 1)}
          disabled={pageCount === 0 || pageNumber >= pageCount}
        >
          ›
        </IconButton>
      </div>

      <div className="flex items-center gap-1.5">
        <IconButton label={messages.reader.zoomOut} onClick={() => onScaleChange(-0.2)}>
          −
        </IconButton>
        <IconButton label={messages.reader.zoomIn} onClick={() => onScaleChange(0.2)}>
          +
        </IconButton>
      </div>

      {onClose !== undefined && (
        <IconButton label={messages.reader.closeSecond} onClick={onClose}>
          ×
        </IconButton>
      )}
    </div>
  );
}

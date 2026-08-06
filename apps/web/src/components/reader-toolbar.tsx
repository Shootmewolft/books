'use client';

import { IconButton } from '@/components/icon-button';
import { PaneLanguageSwitch } from '@/components/pane-language-switch';
import type { Messages } from '@/i18n/types';
import type { BookFile } from '@/modules/catalogue/types';

interface ReaderToolbarProps {
  title: string;
  pageNumber: number;
  pageCount: number;
  scale: number;
  files: readonly BookFile[];
  activeFilePath: string;
  messages: Messages;
  onPageChange: (page: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitWidth: () => void;
  onFileChange: (path: string) => void;
  onClose?: () => void;
}

export function ReaderToolbar({
  title,
  pageNumber,
  pageCount,
  scale,
  files,
  activeFilePath,
  messages,
  onPageChange,
  onZoomIn,
  onZoomOut,
  onFitWidth,
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

        <label className="sr-only" htmlFor={`page-${activeFilePath}`}>
          {messages.reader.page}
        </label>
        <input
          id={`page-${activeFilePath}`}
          type="number"
          min={1}
          max={pageCount > 0 ? pageCount : 1}
          value={pageNumber}
          onChange={(event) => {
            const next = Number(event.target.value);
            if (!Number.isNaN(next)) onPageChange(next);
          }}
          className="w-12 rounded-card border border-edge bg-void px-1.5 py-0.5 text-center font-mono text-micro text-paper tabular-nums focus:border-brass-dim focus:outline-none"
        />
        <span className="font-mono text-micro text-paper-faint tabular-nums">
          {messages.reader.of} {pageCount > 0 ? pageCount : '—'}
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
        <IconButton label={messages.reader.zoomOut} onClick={onZoomOut}>
          −
        </IconButton>
        <span className="w-11 text-center font-mono text-micro text-paper-dim tabular-nums">
          {Math.round(scale * 100)}%
        </span>
        <IconButton label={messages.reader.zoomIn} onClick={onZoomIn}>
          +
        </IconButton>
        <IconButton label={messages.reader.fitWidth} onClick={onFitWidth}>
          ⇔
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

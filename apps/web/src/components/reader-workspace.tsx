'use client';

import Link from 'next/link';
import { useCallback, useState } from 'react';

import { ReaderPane } from '@/components/reader-pane';
import type { Locale } from '@/i18n/config';
import type { Messages } from '@/i18n/types';
import type { CatalogueBook } from '@/modules/catalogue/types';

interface PaneTarget {
  book: CatalogueBook;
  filePath: string;
}

interface ReaderWorkspaceProps {
  primary: PaneTarget;
  secondary: PaneTarget | null;
  messages: Messages;
  locale: Locale;
}

export function ReaderWorkspace({ primary, secondary, messages, locale }: ReaderWorkspaceProps) {
  const [primaryPage, setPrimaryPage] = useState(1);
  const [secondaryPage, setSecondaryPage] = useState(1);
  const [hasSecondary, setHasSecondary] = useState(secondary !== null);
  const [isSynced, setIsSynced] = useState(false);
  const [focusedPane, setFocusedPane] = useState<'primary' | 'secondary'>('primary');

  const changePrimaryPage = useCallback(
    (page: number) => {
      setPrimaryPage(page);
      if (isSynced) setSecondaryPage(page);
    },
    [isSynced],
  );

  const changeSecondaryPage = useCallback(
    (page: number) => {
      setSecondaryPage(page);
      if (isSynced) setPrimaryPage(page);
    },
    [isSynced],
  );

  const showSecondary = hasSecondary && secondary !== null;

  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col gap-3 px-3 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/${locale}/book/${primary.book.path}`}
          className="text-paper-faint text-small transition-colors hover:text-brass"
        >
          ← {messages.book.backToCatalogue}
        </Link>

        <div className="flex items-center gap-4">
          {showSecondary && (
            <label className="flex cursor-pointer items-center gap-2 text-paper-dim text-small">
              <input
                type="checkbox"
                checked={isSynced}
                onChange={(event) => setIsSynced(event.target.checked)}
                className="size-3.5 accent-[var(--color-brass)]"
              />
              <span title={messages.reader.syncScrollHint}>{messages.reader.syncScroll}</span>
            </label>
          )}

          {secondary !== null && !hasSecondary && (
            <button
              type="button"
              onClick={() => setHasSecondary(true)}
              className="rounded-card border border-patina-dim px-3 py-1 text-patina text-small transition-colors hover:border-patina"
            >
              {messages.reader.openSecond}
            </button>
          )}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 lg:flex-row">
        <ReaderPane
          book={primary.book}
          initialFilePath={primary.filePath}
          pageNumber={primaryPage}
          messages={messages}
          isFocused={focusedPane === 'primary'}
          onFocus={() => setFocusedPane('primary')}
          onPageChange={changePrimaryPage}
        />

        {showSecondary && (
          <ReaderPane
            book={secondary.book}
            initialFilePath={secondary.filePath}
            pageNumber={secondaryPage}
            messages={messages}
            isFocused={focusedPane === 'secondary'}
            onFocus={() => setFocusedPane('secondary')}
            onPageChange={changeSecondaryPage}
            onClose={() => setHasSecondary(false)}
          />
        )}
      </div>
    </div>
  );
}

import Link from 'next/link';

import type { Locale } from '@/i18n/config';
import { getMessages } from '@/i18n/get-messages';
import type { CatalogueBook } from '@/lib/types';
import { formatBytes } from '@/lib/utils/format-bytes';

export function BookFileActions({ book, locale }: { book: CatalogueBook; locale: Locale }) {
  const messages = getMessages(locale);
  const readable = book.files.filter((file) => file.format === 'pdf');

  return (
    <div className="flex flex-col gap-3">
      {readable.length > 0 && (
        <Link
          href={`/${locale}/read?a=${encodeURIComponent(`${book.path}/${readable[0]?.path ?? ''}`)}`}
          className="inline-flex w-fit items-center gap-2 rounded-card bg-brass px-5 py-2.5 font-medium text-small text-void transition-colors hover:bg-brass-glow"
        >
          {messages.book.read}
        </Link>
      )}

      {readable.length > 1 && (
        <Link
          href={`/${locale}/read?a=${encodeURIComponent(
            `${book.path}/${readable[0]?.path ?? ''}`,
          )}&b=${encodeURIComponent(`${book.path}/${readable[1]?.path ?? ''}`)}`}
          className="inline-flex w-fit items-center gap-2 rounded-card border border-patina-dim px-5 py-2.5 font-medium text-patina text-small transition-colors hover:border-patina"
        >
          {messages.book.compare}
        </Link>
      )}

      <ul className="mt-2 flex list-none flex-col gap-1.5">
        {book.files.map((file) => (
          <li key={file.path}>
            <a
              href={`/api/file/${book.path}/${file.path}?download=1`}
              download
              className="group inline-flex items-baseline gap-2 text-paper-dim text-small transition-colors hover:text-paper"
            >
              <span className="font-mono text-micro text-brass uppercase">
                {file.lang} · {file.format}
              </span>
              <span>{messages.book.download}</span>
              <span className="font-mono text-micro text-paper-faint tabular-nums">
                {formatBytes(file.bytes)}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

import Link from 'next/link';

import { BookCardMeta } from '@/components/book-card-meta';
import { BookCover } from '@/components/book-cover';
import type { Locale } from '@/i18n/config';
import { getMessages } from '@/i18n/get-messages';
import type { CatalogueBook } from '@/lib/types';
import { formatAuthors } from '@/lib/utils/format-authors';

interface BookCardProps {
  book: CatalogueBook;
  locale: Locale;
}

export function BookCard({ book, locale }: BookCardProps) {
  const messages = getMessages(locale);
  const isLaterEdition = book.edition !== null && book.edition > 1;

  return (
    <Link href={`/${locale}/book/${book.path}`} className="group flex flex-col gap-3 outline-none">
      <div
        className="cover-frame relative aspect-[1/1.42] overflow-hidden rounded-card transition-transform duration-500 ease-out-quart group-hover:-translate-y-1.5 group-focus-visible:-translate-y-1.5"
        style={{ borderTop: `2px solid var(--color-cat-${book.category})` }}
      >
        <BookCover
          book={book}
          className="transition-[filter] duration-500 group-hover:brightness-110"
        />

        {book.kind !== 'book' && (
          <span className="absolute top-2 right-2 rounded-pill bg-void/85 px-2 py-0.5 font-mono text-[0.625rem] text-paper-dim uppercase tracking-widest backdrop-blur">
            {messages.kind[book.kind]}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <span className="call-number">{book.callNumber}</span>

        <h3 className="font-display font-semibold text-paper text-small leading-snug transition-colors group-hover:text-brass-glow">
          {book.title}
          {isLaterEdition && (
            <span className="ml-1 font-mono font-normal text-micro text-paper-faint">
              {book.edition}e
            </span>
          )}
        </h3>

        <p className="text-micro text-paper-dim">{formatAuthors(book.authors)}</p>

        <BookCardMeta book={book} />
      </div>
    </Link>
  );
}

import { ShelfSpine } from '@/components/shelf-spine';
import type { Locale } from '@/i18n/config';
import { estimatedWeight } from '@/lib/catalogue/estimated-weight';
import type { CatalogueBook } from '@/lib/types';

interface ShelfProps {
  books: readonly CatalogueBook[];
  locale: Locale;
}

export function Shelf({ books, locale }: ShelfProps) {
  const maxWeight = Math.max(...books.map(estimatedWeight), 1);

  return (
    <ul className="shelf flex h-56 list-none items-end gap-0.5 overflow-x-auto overflow-y-hidden px-1 sm:h-72">
      {books.map((book) => (
        <li key={book.path} className="contents">
          <ShelfSpine book={book} maxWeight={maxWeight} locale={locale} />
        </li>
      ))}
    </ul>
  );
}

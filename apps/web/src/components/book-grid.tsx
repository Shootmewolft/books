import { BookCard } from '@/components/book-card';
import type { Locale } from '@/i18n/config';
import type { CatalogueBook } from '@/modules/catalogue/types';

interface BookGridProps {
  books: readonly CatalogueBook[];
  locale: Locale;
}

export function BookGrid({ books, locale }: BookGridProps) {
  return (
    <ul className="grid list-none grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 lg:grid-cols-5">
      {books.map((book) => (
        <li key={book.path}>
          <BookCard book={book} locale={locale} />
        </li>
      ))}
    </ul>
  );
}

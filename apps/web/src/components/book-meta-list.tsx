import type { Locale } from '@/i18n/config';
import { format } from '@/i18n/format';
import { getMessages } from '@/i18n/get-messages';
import type { CatalogueBook } from '@/modules/catalogue/types';

interface MetaEntry {
  term: string;
  value: string;
}

export function BookMetaList({ book, locale }: { book: CatalogueBook; locale: Locale }) {
  const messages = getMessages(locale);

  const entries: MetaEntry[] = [{ term: messages.book.callNumber, value: book.callNumber }];

  if (book.authors.length > 0) {
    entries.push({ term: messages.book.authors, value: book.authors.join(', ') });
  }
  if (book.publisher !== null) {
    entries.push({ term: messages.book.publisher, value: book.publisher });
  }
  if (book.year !== null) {
    entries.push({ term: messages.book.published, value: String(book.year) });
  }
  if (book.edition !== null) {
    entries.push({ term: 'Edition', value: format(messages.book.edition, { n: book.edition }) });
  }
  if (book.pages !== null) {
    entries.push({
      term: messages.book.pages.replace('{count} ', ''),
      value: String(book.pages),
    });
  }
  entries.push({ term: messages.book.formats, value: book.formats.join(', ').toUpperCase() });
  entries.push({ term: messages.book.languages, value: book.languages.join(', ').toUpperCase() });

  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2.5">
      {entries.map((entry) => (
        <div key={entry.term} className="contents">
          <dt className="text-micro text-paper-faint uppercase tracking-[0.12em]">{entry.term}</dt>
          <dd className="font-mono text-paper text-small">{entry.value}</dd>
        </div>
      ))}
    </dl>
  );
}

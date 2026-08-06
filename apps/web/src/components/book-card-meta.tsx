import type { CatalogueBook } from '@/modules/catalogue/types';

export function BookCardMeta({ book }: { book: CatalogueBook }) {
  const hasMultipleLanguages = book.languages.length > 1;
  const showSeparatorAfterYear = book.year !== null && book.pages !== null;

  return (
    <p className="flex items-center gap-1.5 font-mono text-micro text-paper-faint tabular-nums">
      {book.year !== null && <span>{book.year}</span>}
      {showSeparatorAfterYear && <span aria-hidden>·</span>}
      {book.pages !== null && <span>{book.pages}p</span>}
      <span aria-hidden>·</span>
      <span className="uppercase">{book.formats.join(' ')}</span>
      {hasMultipleLanguages && (
        <span className="rounded bg-patina-dim/30 px-1 text-patina uppercase">
          {book.languages.join('/')}
        </span>
      )}
    </p>
  );
}

import type { CatalogueBook } from '@/modules/catalogue/types';

interface BookCoverProps {
  book: CatalogueBook;
  className?: string;
}

export function BookCover({ book, className = '' }: BookCoverProps) {
  if (book.cover === null) {
    return (
      <div
        className={`flex h-full flex-col items-center justify-center gap-2 p-4 text-center ${className}`}
      >
        <span className="call-number">{book.callNumber}</span>
        <span className="font-display text-paper-dim text-small leading-tight">{book.title}</span>
      </div>
    );
  }

  return (
    // biome-ignore lint/performance/noImgElement: pre-sized at extraction, served locally
    <img
      src={book.cover}
      alt=""
      loading="lazy"
      decoding="async"
      className={`h-full w-full object-cover ${className}`}
    />
  );
}

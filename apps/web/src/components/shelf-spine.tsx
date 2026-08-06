import Link from 'next/link';
import type { CSSProperties } from 'react';

import type { Locale } from '@/i18n/config';
import { estimatedWeight } from '@/lib/catalogue/estimated-weight';
import { spineDimensions } from '@/lib/shelf/spine-dimensions';
import type { CatalogueBook } from '@/lib/types';

interface ShelfSpineProps {
  book: CatalogueBook;
  maxWeight: number;
  locale: Locale;
}

export function ShelfSpine({ book, maxWeight, locale }: ShelfSpineProps) {
  const { heightPercent, widthPx } = spineDimensions(estimatedWeight(book), maxWeight);

  const style = {
    '--spine-tint': `var(--color-cat-${book.category})`,
    '--spine-height': `${heightPercent}%`,
    '--spine-width': `${widthPx}px`,
  } as CSSProperties;

  return (
    <Link
      href={`/${locale}/book/${book.path}`}
      className="spine"
      style={style}
      title={book.pages === null ? book.title : `${book.title} — ${book.pages}p`}
    >
      <span className="sr-only">{book.title}</span>
    </Link>
  );
}

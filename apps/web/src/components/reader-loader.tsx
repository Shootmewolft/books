import { notFound } from 'next/navigation';

import { ReaderWorkspace } from '@/components/reader-workspace';
import type { Locale } from '@/i18n/config';
import { getMessages } from '@/i18n/get-messages';
import { getBookByPath } from '@/modules/catalogue/services/get-book-by-path';
import type { CatalogueBook } from '@/modules/catalogue/types';

interface PaneTarget {
  book: CatalogueBook;
  filePath: string;
}

interface ReaderLoaderProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  locale: Locale;
}

function firstValue(value: string | string[] | undefined): string | undefined {
  if (value === undefined) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

async function resolvePane(reference: string | undefined): Promise<PaneTarget | null> {
  if (reference === undefined) return null;

  const segments = reference.split('/');
  const filePath = segments.pop();
  if (filePath === undefined || segments.length === 0) return null;

  const book = await getBookByPath(segments.join('/'));
  if (book === null) return null;
  if (!book.files.some((file) => file.path === filePath && file.format === 'pdf')) return null;

  return { book, filePath };
}

export async function ReaderLoader({ searchParams, locale }: ReaderLoaderProps) {
  const params = await searchParams;

  const [primary, secondary] = await Promise.all([
    resolvePane(firstValue(params['a'])),
    resolvePane(firstValue(params['b'])),
  ]);

  if (primary === undefined || primary === null) notFound();

  return (
    <ReaderWorkspace
      primary={primary}
      secondary={secondary}
      messages={getMessages(locale)}
      locale={locale}
    />
  );
}

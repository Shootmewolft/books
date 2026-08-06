import Link from 'next/link';

import { BookGrid } from '@/components/book-grid';
import { CatalogueFilters } from '@/components/catalogue-filters';
import { EmptyState } from '@/components/empty-state';
import { SearchField } from '@/components/search-field';
import type { Locale } from '@/i18n/config';
import { format } from '@/i18n/format';
import { getMessages } from '@/i18n/get-messages';
import { filterBooks } from '@/lib/catalogue/filter-books';
import { getCatalogue } from '@/lib/catalogue/get-catalogue';
import { parseFilters } from '@/lib/catalogue/parse-filters';

interface CatalogueResultsProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  locale: Locale;
}

export async function CatalogueResults({ searchParams, locale }: CatalogueResultsProps) {
  const filters = parseFilters(await searchParams);

  const messages = getMessages(locale);
  const { books, categories, tags } = await getCatalogue();
  const visible = filterBooks(books, filters);

  const basePath = `/${locale}/catalogue`;
  const hasFilters = Object.keys(filters).length > 0;

  return (
    <>
      <p className="call-number mb-8">
        {format(messages.filters.results, { count: visible.length, total: books.length })}
      </p>

      <div className="mb-8 max-w-xl">
        <SearchField
          action={basePath}
          label={messages.filters.search}
          submitLabel={messages.filters.submit}
          placeholder={messages.filters.searchPlaceholder}
          filters={filters}
        />
      </div>

      <div className="mb-12 border-edge border-y py-6">
        <CatalogueFilters
          basePath={basePath}
          filters={filters}
          categories={categories}
          tags={tags}
          books={books}
          locale={locale}
        />

        {hasFilters && (
          <div className="mt-5">
            <Link
              href={basePath}
              className="text-brass text-small underline decoration-brass-dim underline-offset-4 transition-colors hover:text-brass-glow"
            >
              {messages.filters.clear}
            </Link>
          </div>
        )}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          title={messages.filters.empty}
          hint={messages.filters.emptyHint}
          actionHref={basePath}
          actionLabel={messages.filters.clear}
        />
      ) : (
        <BookGrid books={visible} locale={locale} />
      )}
    </>
  );
}

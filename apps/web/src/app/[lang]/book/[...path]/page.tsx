import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { BookCover } from '@/components/book-cover';
import { BookFileActions } from '@/components/book-file-actions';
import { BookGrid } from '@/components/book-grid';
import { BookMetaList } from '@/components/book-meta-list';
import { JsonLd } from '@/components/json-ld';
import { TagList } from '@/components/tag-list';
import { SITE_URL } from '@/constants/site-url';
import { isLocale, LOCALES } from '@/i18n/config';
import { getMessages } from '@/i18n/get-messages';
import { buildBookSchema } from '@/modules/catalogue/domain/build-book-schema';
import { getRelatedBooks } from '@/modules/catalogue/domain/get-related-books';
import { getBookByPath } from '@/modules/catalogue/services/get-book-by-path';
import { getCatalogue } from '@/modules/catalogue/services/get-catalogue';
import { buildAlternates } from '@/seo/build-alternates';

import type { BookPageProps } from '../../../route-props';

export async function generateStaticParams(): Promise<Array<{ lang: string; path: string[] }>> {
  const { books } = await getCatalogue();

  return LOCALES.flatMap((lang) => books.map((book) => ({ lang, path: book.path.split('/') })));
}

export async function generateMetadata(props: BookPageProps): Promise<Metadata> {
  const { lang, path } = await props.params;
  if (!isLocale(lang)) return {};

  const book = await getBookByPath(path.join('/'));
  if (book === null) return {};

  return {
    alternates: buildAlternates(lang, `/book/${path.join('/')}`),
    title: book.title,
    description: book.subtitle ?? `${book.title} — ${book.authors.join(', ')}`,
  };
}

export default async function BookPage(props: BookPageProps) {
  const { lang, path } = await props.params;
  if (!isLocale(lang)) notFound();

  const book = await getBookByPath(path.join('/'));
  if (book === null) notFound();

  const messages = getMessages(lang);
  const { books } = await getCatalogue();
  const related = getRelatedBooks(book, books);

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <JsonLd schema={buildBookSchema({ book, locale: lang, siteUrl: SITE_URL })} />

      <Link
        href={`/${lang}/catalogue?category=${book.category}`}
        className="text-paper-faint text-small transition-colors hover:text-brass"
      >
        ← {messages.book.backToCatalogue}
      </Link>

      <article className="mt-8 grid gap-12 lg:grid-cols-[280px_1fr]">
        <div
          className="cover-frame aspect-[1/1.42] overflow-hidden rounded-card"
          style={{ borderTop: `3px solid var(--color-cat-${book.category})` }}
        >
          <BookCover book={book} />
        </div>

        <div className="flex flex-col gap-8">
          <header>
            <p className="call-number mb-3">{book.callNumber}</p>
            <h1 className="font-display font-semibold text-paper text-title">{book.title}</h1>
            {book.subtitle !== null && (
              <p className="mt-3 max-w-2xl text-paper-dim leading-relaxed">{book.subtitle}</p>
            )}
          </header>

          <BookFileActions book={book} locale={lang} />

          <div className="border-edge border-t pt-6">
            <BookMetaList book={book} locale={lang} />
          </div>

          <TagList tags={book.tags} locale={lang} />
        </div>
      </article>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-7 border-edge border-b pb-4 font-display font-semibold text-heading text-paper">
            {messages.book.alsoIn}
          </h2>
          <BookGrid books={related} locale={lang} />
        </section>
      )}
    </div>
  );
}

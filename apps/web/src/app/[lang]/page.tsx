import Link from 'next/link';
import { notFound } from 'next/navigation';

import { BookGrid } from '@/components/book-grid';
import { CategoryNav } from '@/components/category-nav';
import { LibraryStats } from '@/components/library-stats';
import { Shelf } from '@/components/shelf';
import { isLocale } from '@/i18n/config';
import { getMessages } from '@/i18n/get-messages';
import { getCatalogue } from '@/lib/catalogue/get-catalogue';

import type { LocalePageProps } from '../route-props';

const RECENT_COUNT = 10;

export default async function HomePage(props: LocalePageProps) {
  const { lang } = await props.params;
  if (!isLocale(lang)) notFound();

  const messages = getMessages(lang);
  const { books, categories, stats } = await getCatalogue();

  const counts = new Map<string, number>();
  for (const book of books) {
    counts.set(book.category, (counts.get(book.category) ?? 0) + 1);
  }

  const heaviest = [...books]
    .filter((book) => book.pages !== null)
    .sort((a, b) => (b.pages ?? 0) - (a.pages ?? 0))
    .slice(0, RECENT_COUNT);

  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-10">
        <p className="call-number mb-4">{stats.books} volumes</p>
        <h1 className="font-display font-semibold text-display text-paper">
          {messages.hero.title}
        </h1>
        <p className="mt-5 max-w-xl text-paper-dim leading-relaxed">{messages.hero.lead}</p>

        <div className="mt-8">
          <LibraryStats stats={stats} categoryCount={categories.length} locale={lang} />
        </div>
      </section>

      <section className="mb-20 px-2 sm:px-6">
        <Shelf books={books} locale={lang} />
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <CategoryNav categories={categories} counts={counts} locale={lang} />
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-10">
        <div className="mb-7 flex items-baseline justify-between gap-4 border-edge border-b pb-4">
          <h2 className="font-display font-semibold text-paper text-title">The heavy shelf</h2>
          <Link
            href={`/${lang}/catalogue`}
            className="text-brass text-small transition-colors hover:text-brass-glow"
          >
            {messages.hero.browse}
          </Link>
        </div>
        <BookGrid books={heaviest} locale={lang} />
      </section>
    </>
  );
}

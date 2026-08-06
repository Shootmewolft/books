import type { CatalogueBook } from '@/modules/catalogue/types';

interface BuildBookSchemaInput {
  book: CatalogueBook;
  locale: string;
  siteUrl: string;
}

export function buildBookSchema({
  book,
  locale,
  siteUrl,
}: BuildBookSchemaInput): Record<string, unknown> {
  const url = `${siteUrl}/${locale}/book/${book.path}`;

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title,
    url,
    inLanguage: book.languages,
    bookFormat: 'https://schema.org/EBook',
  };

  if (book.subtitle !== null) schema['alternativeHeadline'] = book.subtitle;
  if (book.authors.length > 0) {
    schema['author'] = book.authors.map((name) => ({ '@type': 'Person', name }));
  }
  if (book.publisher !== null) {
    schema['publisher'] = { '@type': 'Organization', name: book.publisher };
  }
  if (book.year !== null) schema['datePublished'] = String(book.year);
  if (book.pages !== null) schema['numberOfPages'] = book.pages;
  if (book.edition !== null) schema['bookEdition'] = String(book.edition);
  if (book.isbn13 !== undefined && book.isbn13 !== null) schema['isbn'] = book.isbn13;
  if (book.cover !== null) schema['image'] = `${siteUrl}${book.cover}`;
  if (book.tags.length > 0) schema['keywords'] = book.tags.join(', ');

  return schema;
}

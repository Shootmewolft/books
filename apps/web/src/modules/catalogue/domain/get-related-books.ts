import type { CatalogueBook } from '@/modules/catalogue/types';

const DEFAULT_LIMIT = 6;

function overlapScore(a: CatalogueBook, b: CatalogueBook): number {
  const sharedTags = a.tags.filter((tag) => b.tags.includes(tag)).length;
  const sameSubcategory = a.subcategory === b.subcategory ? 3 : 0;
  const sameCategory = a.category === b.category ? 1 : 0;

  return sharedTags * 2 + sameSubcategory + sameCategory;
}

export function getRelatedBooks(
  book: CatalogueBook,
  all: readonly CatalogueBook[],
  limit: number = DEFAULT_LIMIT,
): CatalogueBook[] {
  return all
    .filter((candidate) => candidate.path !== book.path)
    .map((candidate) => ({ candidate, score: overlapScore(book, candidate) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.candidate);
}

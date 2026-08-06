import type { Book } from '@/lib/types';

const SEGMENT_LENGTH = 3;
const POSITION_DIGITS = 2;

export function toCallNumber(book: Book, positionInSubcategory: number): string {
  const category = book.category.slice(0, SEGMENT_LENGTH).toUpperCase();
  const subcategory = book.subcategory.replace(/-/g, '').slice(0, SEGMENT_LENGTH).toUpperCase();
  const position = String(positionInSubcategory + 1).padStart(POSITION_DIGITS, '0');

  return `${category}·${subcategory}·${position}`;
}

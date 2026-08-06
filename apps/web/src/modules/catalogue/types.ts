import type { Locale } from '@/i18n/config';

export type Format = 'pdf' | 'epub';
export type Kind = 'book' | 'guide' | 'reference';

export interface BookFile {
  lang: Locale;
  format: Format;
  path: string;
  bytes: number;
  md5?: string;
}

export interface Book {
  slug: string;
  title: string;
  subtitle: string | null;
  authors: string[];
  year: number | null;
  edition: number | null;
  publisher: string | null;
  pages: number | null;
  cover?: string | null;
  isbn13?: string | null;
  kind: Kind;
  category: string;
  subcategory: string;
  tags: string[];
  summary?: string | null;
  files: BookFile[];
}

export interface CatalogueBook extends Book {
  path: string;
  callNumber: string;
  cover: string | null;
  languages: Locale[];
  formats: Format[];
  totalBytes: number;
}

export interface LocalisedLabel {
  en: string;
  es: string;
}

export interface Subcategory {
  slug: string;
  label: LocalisedLabel;
}

export interface Category {
  slug: string;
  label: LocalisedLabel;
  summary: LocalisedLabel;
  order: number;
  subcategories: Subcategory[];
}

export interface CatalogueStats {
  books: number;
  files: number;
  bytes: number;
  pages: number;
  byKind: Record<Kind, number>;
}

export interface Catalogue {
  books: CatalogueBook[];
  categories: Category[];
  tags: string[];
  stats: CatalogueStats;
}

export interface CatalogueFilters {
  query?: string;
  category?: string;
  subcategory?: string;
  tag?: string;
  kind?: Kind;
  lang?: Locale;
}

export type Language = 'en' | 'es';
export type Format = 'pdf' | 'epub';
export type Kind = 'book' | 'guide' | 'reference';

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

export interface BookFile {
  lang: Language;
  format: Format;
  path: string;
  bytes: number;
  md5?: string;
}

export interface Book {
  $schema?: string;
  slug: string;
  title: string;
  subtitle: string | null;
  authors: string[];
  year: number | null;
  edition: number | null;
  publisher: string | null;
  pages: number | null;
  isbn13?: string | null;
  kind: Kind;
  category: string;
  subcategory: string;
  tags: string[];
  summary?: string | null;
  files: BookFile[];
}

export interface PdfMetadata {
  title: string | null;
  authors: string[];
  pages: number | null;
  year: number | null;
  encrypted: boolean;
}

export interface Finding {
  where: string;
  message: string;
}

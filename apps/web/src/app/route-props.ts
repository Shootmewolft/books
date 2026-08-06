import type { ReactNode } from 'react';

export interface LocaleParams {
  lang: string;
}

export interface LocalePageProps {
  params: Promise<LocaleParams>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export interface LocaleLayoutProps {
  params: Promise<LocaleParams>;
  children: ReactNode;
}

export interface BookPageProps {
  params: Promise<LocaleParams & { path: string[] }>;
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { CatalogueResults } from '@/components/catalogue-results';
import { CatalogueSkeleton } from '@/components/catalogue-skeleton';
import { isLocale } from '@/i18n/config';
import { getMessages } from '@/i18n/get-messages';

import type { LocalePageProps } from '../../route-props';

export async function generateMetadata(props: LocalePageProps): Promise<Metadata> {
  const { lang } = await props.params;
  if (!isLocale(lang)) return {};
  return { title: getMessages(lang).nav.catalogue };
}

export default async function CataloguePage(props: LocalePageProps) {
  const { lang } = await props.params;
  if (!isLocale(lang)) notFound();

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <h1 className="mb-3 font-display font-semibold text-paper text-title">
        {getMessages(lang).nav.catalogue}
      </h1>

      <Suspense fallback={<CatalogueSkeleton />}>
        <CatalogueResults searchParams={props.searchParams} locale={lang} />
      </Suspense>
    </div>
  );
}

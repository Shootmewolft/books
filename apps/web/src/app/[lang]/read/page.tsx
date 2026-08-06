import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { ReaderLoader } from '@/components/reader-loader';
import { isLocale } from '@/i18n/config';
import { getMessages } from '@/i18n/get-messages';

import type { LocalePageProps } from '../../route-props';

export async function generateMetadata(props: LocalePageProps): Promise<Metadata> {
  const { lang } = await props.params;
  if (!isLocale(lang)) return {};
  return { title: getMessages(lang).reader.title };
}

export default async function ReadPage(props: LocalePageProps) {
  const { lang } = await props.params;
  if (!isLocale(lang)) notFound();

  return (
    <Suspense
      fallback={
        <p className="py-24 text-center text-paper-faint text-small">
          {getMessages(lang).reader.loading}
        </p>
      }
    >
      <ReaderLoader searchParams={props.searchParams} locale={lang} />
    </Suspense>
  );
}

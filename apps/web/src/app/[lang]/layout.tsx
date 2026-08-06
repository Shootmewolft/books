import type { Metadata, Viewport } from 'next';
import { Fraunces, IBM_Plex_Mono, Instrument_Sans } from 'next/font/google';
import { notFound } from 'next/navigation';

import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { SITE_NAME } from '@/constants/site-name';
import { SITE_URL } from '@/constants/site-url';
import { isLocale, LOCALES } from '@/i18n/config';
import { getMessages } from '@/i18n/get-messages';
import { GITHUB_PROFILE_URL } from '@/modules/repository/constants/repository';
import { buildAlternates } from '@/seo/build-alternates';

import type { LocaleLayoutProps } from '../route-props';

import '../globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['SOFT', 'WONK', 'opsz'],
});

const instrument = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument',
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
});

const fontVariables = `${fraunces.variable} ${instrument.variable} ${plexMono.variable}`;

export function generateStaticParams(): Array<{ lang: string }> {
  return LOCALES.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: '#0b0d12',
  colorScheme: 'dark',
};

export async function generateMetadata(props: LocaleLayoutProps): Promise<Metadata> {
  const { lang } = await props.params;
  if (!isLocale(lang)) return {};

  const messages = getMessages(lang);

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: SITE_NAME,
      template: `%s · ${SITE_NAME}`,
    },
    description: messages.meta.description,
    applicationName: SITE_NAME,
    authors: [{ name: 'Shoot', url: GITHUB_PROFILE_URL }],
    creator: 'Shoot',
    publisher: 'Shoot',
    alternates: buildAlternates(lang),
    formatDetection: { telephone: false, address: false, email: false },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: SITE_NAME,
      description: messages.meta.description,
      url: `${SITE_URL}/${lang}`,
      locale: lang === 'es' ? 'es_ES' : 'en_US',
      alternateLocale: lang === 'es' ? ['en_US'] : ['es_ES'],
    },
    twitter: {
      card: 'summary_large_image',
      title: SITE_NAME,
      description: messages.meta.description,
    },
  };
}

export default async function LocaleLayout(props: LocaleLayoutProps) {
  const { lang } = await props.params;
  if (!isLocale(lang)) notFound();

  const messages = getMessages(lang);

  return (
    <html lang={lang} className={fontVariables} suppressHydrationWarning>
      <head>
        <meta name="darkreader-lock" />
      </head>
      <body className="min-h-dvh antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:bg-brass focus:px-4 focus:py-2 focus:font-medium focus:text-void"
        >
          {messages.nav.skipToContent}
        </a>

        <div className="flex min-h-dvh flex-col">
          <SiteHeader locale={lang} />
          <main id="main" className="flex-1">
            {props.children}
          </main>
          <SiteFooter locale={lang} />
        </div>
      </body>
    </html>
  );
}

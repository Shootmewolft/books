import { type NextRequest, NextResponse } from 'next/server';

import { DEFAULT_LOCALE, LOCALES } from '@/i18n/config';

const DEFAULT_QUALITY = 1;

interface LanguageRange {
  tag: string;
  quality: number;
}

function parseAcceptLanguage(header: string): LanguageRange[] {
  return header
    .split(',')
    .map((part) => {
      const [tag = '', ...parameters] = part.trim().split(';');
      const quality = parameters
        .map((parameter) => parameter.trim())
        .find((parameter) => parameter.startsWith('q='))
        ?.slice(2);

      return {
        tag: tag.trim().toLowerCase(),
        quality: quality === undefined ? DEFAULT_QUALITY : Number(quality),
      };
    })
    .filter((range) => range.tag !== '' && !Number.isNaN(range.quality))
    .sort((a, b) => b.quality - a.quality);
}

function negotiateLocale(header: string | null): string {
  if (header === null) return DEFAULT_LOCALE;

  for (const { tag } of parseAcceptLanguage(header)) {
    const baseSubtag = tag.split('-')[0] ?? '';
    const supported = LOCALES.find((locale) => locale === baseSubtag);
    if (supported !== undefined) return supported;
  }

  return DEFAULT_LOCALE;
}

function hasLocalePrefix(pathname: string): boolean {
  return LOCALES.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));
}

export function proxy(request: NextRequest): NextResponse | undefined {
  const { pathname } = request.nextUrl;
  if (hasLocalePrefix(pathname)) return undefined;

  const locale = negotiateLocale(request.headers.get('accept-language'));
  const target = new URL(`/${locale}${pathname === '/' ? '' : pathname}`, request.url);
  target.search = request.nextUrl.search;

  return NextResponse.redirect(target);
}

export const config = {
  matcher: [
    '/((?!api|_next|opengraph-image|twitter-image|icon|apple-icon|favicon.ico|.*\\.).*)',
  ],
};

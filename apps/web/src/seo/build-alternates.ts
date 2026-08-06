import { SITE_URL } from '@/constants/site-url';
import { DEFAULT_LOCALE, LOCALES } from '@/i18n/config';

export interface AlternateLinks {
  canonical: string;
  languages: Record<string, string>;
}

export function buildAlternates(locale: string, path = ''): AlternateLinks {
  const languages: Record<string, string> = Object.fromEntries(
    LOCALES.map((code) => [code, `${SITE_URL}/${code}${path}`]),
  );

  languages['x-default'] = `${SITE_URL}/${DEFAULT_LOCALE}${path}`;

  return {
    canonical: `${SITE_URL}/${locale}${path}`,
    languages,
  };
}

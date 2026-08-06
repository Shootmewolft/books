import { SITE_NAME } from '@/constants/site-name';
import { SITE_URL } from '@/constants/site-url';

export function buildWebsiteSchema(locale: string, description: string): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    description,
    url: `${SITE_URL}/${locale}`,
    inLanguage: locale,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/${locale}/catalogue?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

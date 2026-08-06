import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/constants/site-url';
import { LOCALES } from '@/i18n/config';
import { getCatalogue } from '@/modules/catalogue/services/get-catalogue';

function alternates(path: string): Record<string, string> {
  return Object.fromEntries(LOCALES.map((locale) => [locale, `${SITE_URL}/${locale}${path}`]));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { books } = await getCatalogue();

  const staticPaths = ['', '/catalogue'];

  const staticEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    staticPaths.map((path) => ({
      url: `${SITE_URL}/${locale}${path}`,
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1 : 0.8,
      alternates: { languages: alternates(path) },
    })),
  );

  const bookEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    books.map((book) => ({
      url: `${SITE_URL}/${locale}/book/${book.path}`,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
      alternates: { languages: alternates(`/book/${book.path}`) },
    })),
  );

  return [...staticEntries, ...bookEntries];
}

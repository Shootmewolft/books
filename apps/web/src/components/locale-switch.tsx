'use client';

import { usePathname, useSearchParams } from 'next/navigation';

import { LocaleLink } from '@/components/locale-link';
import { LocaleSwitchShell } from '@/components/locale-switch-shell';
import { LOCALES, type Locale } from '@/i18n/config';

export function LocaleSwitch({ current }: { current: Locale }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pathWithoutLocale = pathname.replace(/^\/[^/]+/, '');
  const query = searchParams.toString();
  const querySuffix = query === '' ? '' : `?${query}`;

  return (
    <LocaleSwitchShell>
      {LOCALES.map((locale) => (
        <LocaleLink
          key={locale}
          locale={locale}
          href={`/${locale}${pathWithoutLocale}${querySuffix}`}
          isActive={locale === current}
        />
      ))}
    </LocaleSwitchShell>
  );
}

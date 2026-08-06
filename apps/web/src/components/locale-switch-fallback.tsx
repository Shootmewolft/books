import { LocaleLink } from '@/components/locale-link';
import { LocaleSwitchShell } from '@/components/locale-switch-shell';
import { LOCALES, type Locale } from '@/i18n/config';

export function LocaleSwitchFallback({ current }: { current: Locale }) {
  return (
    <LocaleSwitchShell>
      {LOCALES.map((locale) => (
        <LocaleLink
          key={locale}
          locale={locale}
          href={`/${locale}`}
          isActive={locale === current}
        />
      ))}
    </LocaleSwitchShell>
  );
}

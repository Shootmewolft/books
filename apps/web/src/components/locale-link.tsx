import Link from 'next/link';

import type { Locale } from '@/i18n/config';

interface LocaleLinkProps {
  locale: Locale;
  href: string;
  isActive: boolean;
}

export function LocaleLink({ locale, href, isActive }: LocaleLinkProps) {
  return (
    <Link
      href={href}
      aria-current={isActive ? 'true' : undefined}
      className={`rounded-pill px-2.5 py-1 font-mono text-micro uppercase tracking-[0.1em] transition-colors ${
        isActive ? 'bg-brass text-void' : 'text-paper-faint hover:text-paper'
      }`}
    >
      {locale}
    </Link>
  );
}

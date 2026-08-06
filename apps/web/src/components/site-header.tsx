import Link from 'next/link';
import { Suspense } from 'react';

import { LocaleSwitch } from '@/components/locale-switch';
import { LocaleSwitchFallback } from '@/components/locale-switch-fallback';
import { RepoStarLink } from '@/components/repo-star-link';
import { RepoStarLinkFallback } from '@/components/repo-star-link-fallback';
import { SITE_NAME } from '@/constants/site-name';
import type { Locale } from '@/i18n/config';
import { getMessages } from '@/i18n/get-messages';

export function SiteHeader({ locale }: { locale: Locale }) {
  const messages = getMessages(locale);

  return (
    <header className="sticky top-0 z-40 border-edge/70 border-b bg-void/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-6">
        <Link href={`/${locale}`} className="flex items-baseline gap-2.5">
          <span className="font-display font-semibold text-heading text-paper leading-none">
            {SITE_NAME}
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href={`/${locale}/catalogue`}
            className="text-paper-dim text-small transition-colors hover:text-paper"
          >
            {messages.nav.catalogue}
          </Link>

          <Suspense fallback={<RepoStarLinkFallback />}>
            <RepoStarLink locale={locale} />
          </Suspense>

          <Suspense fallback={<LocaleSwitchFallback current={locale} />}>
            <LocaleSwitch current={locale} />
          </Suspense>
        </nav>
      </div>
    </header>
  );
}

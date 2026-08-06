import { Suspense } from 'react';

import { CreatorCredit } from '@/components/creator-credit';
import { RepoStats } from '@/components/repo-stats';
import { RightsNotice } from '@/components/rights-notice';
import { StatsPlaceholder } from '@/components/stats-placeholder';
import type { Locale } from '@/i18n/config';
import { getMessages } from '@/i18n/get-messages';
import { GITHUB_URL } from '@/modules/repository/constants/repository';

export function SiteFooter({ locale }: { locale: Locale }) {
  const messages = getMessages(locale);

  return (
    <footer className="mt-24 border-edge border-t">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="mb-12">
          <RightsNotice locale={locale} />
        </div>

        <div className="flex flex-col gap-6 border-edge border-t pt-8 sm:flex-row sm:items-center sm:justify-between">
          <CreatorCredit locale={locale} />

          <div className="flex items-center gap-5">
            <Suspense fallback={<StatsPlaceholder />}>
              <RepoStats locale={locale} />
            </Suspense>
            <a
              href={GITHUB_URL}
              className="text-micro text-paper-faint uppercase tracking-[0.12em] transition-colors hover:text-brass"
            >
              {messages.footer.viewSource}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

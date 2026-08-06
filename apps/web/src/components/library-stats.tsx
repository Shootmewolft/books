import type { Locale } from '@/i18n/config';
import { getMessages } from '@/i18n/get-messages';
import type { CatalogueStats } from '@/modules/catalogue/types';
import { formatBytes } from '@/utils/format-bytes';

interface LibraryStatsProps {
  stats: CatalogueStats;
  categoryCount: number;
  locale: Locale;
}

export function LibraryStats({ stats, categoryCount, locale }: LibraryStatsProps) {
  const messages = getMessages(locale);

  const entries = [
    { value: String(stats.books), label: messages.stats.books },
    { value: stats.pages.toLocaleString(locale), label: messages.stats.pages },
    { value: String(categoryCount), label: messages.stats.categories },
    { value: formatBytes(stats.bytes), label: messages.stats.onDisk },
  ];

  return (
    <dl className="flex flex-wrap items-baseline gap-x-8 gap-y-3">
      {entries.map((entry) => (
        <div key={entry.label} className="flex items-baseline gap-2">
          <dt className="sr-only">{entry.label}</dt>
          <dd className="font-mono text-brass text-heading tabular-nums">{entry.value}</dd>
          <span aria-hidden className="text-micro text-paper-faint uppercase tracking-[0.12em]">
            {entry.label}
          </span>
        </div>
      ))}
    </dl>
  );
}

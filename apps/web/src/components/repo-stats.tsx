import { StatSlot } from '@/components/stat-slot';
import type { Locale } from '@/i18n/config';
import { getMessages } from '@/i18n/get-messages';
import { getRepoStats } from '@/lib/github/get-repo-stats';
import { formatCount } from '@/lib/utils/format-count';

export async function RepoStats({ locale }: { locale: Locale }) {
  const stats = await getRepoStats();
  if (stats === null) return null;

  const messages = getMessages(locale);

  return (
    <div className="flex items-center gap-5">
      <StatSlot label={messages.footer.stars} value={formatCount(stats.stars)} />
      <span aria-hidden className="h-3 w-px bg-edge-bright" />
      <StatSlot label={messages.footer.forks} value={formatCount(stats.forks)} />
    </div>
  );
}

import { StarIcon } from '@/components/star-icon';
import type { Locale } from '@/i18n/config';
import { getMessages } from '@/i18n/get-messages';
import { GITHUB_STARGAZERS_URL } from '@/lib/github/constants';
import { getRepoStats } from '@/lib/github/get-repo-stats';
import { formatCount } from '@/lib/utils/format-count';

export async function RepoStarLink({ locale }: { locale: Locale }) {
  const stats = await getRepoStats();
  if (stats === null) return null;

  const messages = getMessages(locale);

  return (
    <a
      href={GITHUB_STARGAZERS_URL}
      className="group inline-flex items-center gap-1.5 rounded-pill border border-edge px-2.5 py-1 text-paper-dim transition-colors hover:border-brass-dim hover:text-brass"
      aria-label={`${stats.stars} ${messages.footer.stars}`}
    >
      <span className="text-paper-faint transition-colors group-hover:text-brass">
        <StarIcon />
      </span>
      <span className="font-mono text-micro tabular-nums">{formatCount(stats.stars)}</span>
    </a>
  );
}

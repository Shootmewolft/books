import type { Locale } from '@/i18n/config';
import { getMessages } from '@/i18n/get-messages';
import { GITHUB_PROFILE_URL } from '@/lib/github/constants';

export function CreatorCredit({ locale }: { locale: Locale }) {
  const messages = getMessages(locale);

  return (
    <p className="text-paper-dim text-small">
      {messages.footer.builtBy}{' '}
      <a href={GITHUB_PROFILE_URL} className="group relative font-medium text-paper">
        Shoot
        <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-brass transition-transform duration-300 ease-out-quart group-hover:scale-x-100" />
      </a>
    </p>
  );
}

import type { Locale } from '@/i18n/config';
import { getMessages } from '@/i18n/get-messages';
import { COPYRIGHT_URL } from '@/lib/github/constants';

export function RightsNotice({ locale }: { locale: Locale }) {
  const messages = getMessages(locale);

  return (
    <section className="rule-brass max-w-2xl pl-5">
      <h2 className="font-display font-semibold text-heading text-paper">
        {messages.footer.rightsTitle}
      </h2>
      <p className="mt-2 text-paper-dim text-small leading-relaxed">{messages.footer.rights}</p>
      <p className="mt-2 text-paper-faint text-small leading-relaxed">{messages.footer.removal}</p>
      <a
        href={COPYRIGHT_URL}
        className="mt-3 inline-block text-brass text-small underline decoration-brass-dim underline-offset-4 transition-colors hover:text-brass-glow"
      >
        {messages.footer.rightsLink}
      </a>
    </section>
  );
}

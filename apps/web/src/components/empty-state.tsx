import Link from 'next/link';

interface EmptyStateProps {
  title: string;
  hint: string;
  actionHref: string;
  actionLabel: string;
}

export function EmptyState({ title, hint, actionHref, actionLabel }: EmptyStateProps) {
  return (
    <div className="rule-brass py-16 pl-6">
      <p className="font-display text-heading text-paper">{title}</p>
      <p className="mt-2 text-paper-dim text-small">{hint}</p>
      <Link
        href={actionHref}
        className="mt-4 inline-block text-brass text-small underline decoration-brass-dim underline-offset-4 transition-colors hover:text-brass-glow"
      >
        {actionLabel}
      </Link>
    </div>
  );
}

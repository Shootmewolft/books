import Link from 'next/link';

import type { Locale } from '@/i18n/config';

interface TagListProps {
  tags: readonly string[];
  locale: Locale;
}

export function TagList({ tags, locale }: TagListProps) {
  if (tags.length === 0) return null;

  return (
    <ul className="flex list-none flex-wrap gap-2">
      {tags.map((tag) => (
        <li key={tag}>
          <Link
            href={`/${locale}/catalogue?tag=${tag}`}
            className="inline-block rounded-pill border border-edge px-2.5 py-0.5 font-mono text-micro text-paper-dim transition-colors hover:border-brass-dim hover:text-brass"
          >
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}

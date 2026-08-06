import Link from 'next/link';

import type { Locale } from '@/i18n/config';
import type { Category } from '@/modules/catalogue/types';
import { localise } from '@/utils/localise';

interface CategoryNavProps {
  categories: readonly Category[];
  counts: ReadonlyMap<string, number>;
  locale: Locale;
}

export function CategoryNav({ categories, counts, locale }: CategoryNavProps) {
  return (
    <ul className="grid list-none gap-px overflow-hidden rounded-card bg-edge sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <li key={category.slug}>
          <Link
            href={`/${locale}/catalogue?category=${category.slug}`}
            className="group flex h-full flex-col gap-2 bg-deep p-5 transition-colors hover:bg-raised"
          >
            <div className="flex items-baseline justify-between gap-3">
              <span
                className="font-display font-semibold text-heading text-paper"
                style={{ color: `var(--color-cat-${category.slug})` }}
              >
                {localise(category.label, locale)}
              </span>
              <span className="font-mono text-paper-faint text-small tabular-nums">
                {counts.get(category.slug) ?? 0}
              </span>
            </div>
            <p className="text-paper-dim text-small leading-relaxed">
              {localise(category.summary, locale)}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}

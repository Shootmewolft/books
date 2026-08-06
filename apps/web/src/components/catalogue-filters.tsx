import { FilterChip } from '@/components/filter-chip';
import { FilterRow } from '@/components/filter-row';
import { LOCALES, type Locale } from '@/i18n/config';
import { getMessages } from '@/i18n/get-messages';
import { buildFilterHref } from '@/modules/catalogue/domain/build-filter-href';
import type { CatalogueBook, CatalogueFilters, Category, Kind } from '@/modules/catalogue/types';
import { localise } from '@/utils/localise';

const KINDS: readonly Kind[] = ['book', 'guide', 'reference'];
const MAX_VISIBLE_TAGS = 24;

interface CatalogueFiltersProps {
  basePath: string;
  filters: CatalogueFilters;
  categories: readonly Category[];
  tags: readonly string[];
  books: readonly CatalogueBook[];
  locale: Locale;
}

export function CatalogueFilters({
  basePath,
  filters,
  categories,
  tags,
  books,
  locale,
}: CatalogueFiltersProps) {
  const messages = getMessages(locale);

  const countByCategory = new Map<string, number>();
  for (const book of books) {
    countByCategory.set(book.category, (countByCategory.get(book.category) ?? 0) + 1);
  }

  const activeCategory = categories.find((category) => category.slug === filters.category);
  const href = (key: keyof CatalogueFilters, value: string | undefined) =>
    buildFilterHref(basePath, filters, key, value);

  return (
    <div className="flex flex-col gap-4">
      <FilterRow label={messages.filters.category}>
        <FilterChip
          href={href('category', undefined)}
          label={messages.filters.all}
          isActive={filters.category === undefined}
        />
        {categories.map((category) => (
          <FilterChip
            key={category.slug}
            href={href('category', category.slug)}
            label={localise(category.label, locale)}
            count={countByCategory.get(category.slug) ?? 0}
            isActive={filters.category === category.slug}
            accentVar={`--color-cat-${category.slug}`}
          />
        ))}
      </FilterRow>

      {activeCategory !== undefined && (
        <FilterRow label={messages.filters.subcategory}>
          <FilterChip
            href={href('subcategory', undefined)}
            label={messages.filters.all}
            isActive={filters.subcategory === undefined}
          />
          {activeCategory.subcategories.map((subcategory) => (
            <FilterChip
              key={subcategory.slug}
              href={href('subcategory', subcategory.slug)}
              label={localise(subcategory.label, locale)}
              isActive={filters.subcategory === subcategory.slug}
            />
          ))}
        </FilterRow>
      )}

      <FilterRow label={messages.filters.kind}>
        <FilterChip
          href={href('kind', undefined)}
          label={messages.filters.all}
          isActive={filters.kind === undefined}
        />
        {KINDS.map((kind) => (
          <FilterChip
            key={kind}
            href={href('kind', kind)}
            label={messages.kind[kind]}
            isActive={filters.kind === kind}
          />
        ))}
      </FilterRow>

      <FilterRow label={messages.filters.language}>
        <FilterChip
          href={href('lang', undefined)}
          label={messages.filters.all}
          isActive={filters.lang === undefined}
        />
        {LOCALES.map((code) => (
          <FilterChip
            key={code}
            href={href('lang', code)}
            label={code.toUpperCase()}
            isActive={filters.lang === code}
          />
        ))}
      </FilterRow>

      <FilterRow label={messages.filters.tag}>
        <FilterChip
          href={href('tag', undefined)}
          label={messages.filters.all}
          isActive={filters.tag === undefined}
        />
        {tags.slice(0, MAX_VISIBLE_TAGS).map((tag) => (
          <FilterChip
            key={tag}
            href={href('tag', tag)}
            label={tag}
            isActive={filters.tag === tag}
          />
        ))}
      </FilterRow>
    </div>
  );
}

import Form from 'next/form';

import { FILTER_PARAM_NAMES } from '@/modules/catalogue/constants/filter-param-names';
import type { CatalogueFilters } from '@/modules/catalogue/types';

interface SearchFieldProps {
  action: string;
  placeholder: string;
  label: string;
  submitLabel: string;
  filters: CatalogueFilters;
}

export function SearchField({
  action,
  placeholder,
  label,
  submitLabel,
  filters,
}: SearchFieldProps) {
  const preserved = Object.entries(filters).filter(
    ([key, value]) => key !== 'query' && value !== undefined,
  );

  return (
    <Form action={action} scroll={false} className="relative">
      {preserved.map(([key, value]) => (
        <input
          key={key}
          type="hidden"
          name={FILTER_PARAM_NAMES[key as keyof CatalogueFilters]}
          value={String(value)}
        />
      ))}

      <label htmlFor="catalogue-search" className="sr-only">
        {label}
      </label>

      <input
        id="catalogue-search"
        type="search"
        name={FILTER_PARAM_NAMES.query}
        defaultValue={filters.query ?? ''}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full rounded-card border border-edge bg-deep px-4 py-3 pr-24 text-paper placeholder:text-paper-faint focus:border-brass-dim focus:outline-none"
      />

      <button
        type="submit"
        className="-translate-y-1/2 absolute top-1/2 right-2 rounded-card px-3 py-1.5 font-mono text-micro text-paper-faint uppercase tracking-[0.12em] transition-colors hover:text-brass"
      >
        {submitLabel}
      </button>
    </Form>
  );
}

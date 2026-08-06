import type { CatalogueFilters } from '@/lib/types';

interface SearchFieldProps {
  action: string;
  placeholder: string;
  label: string;
  filters: CatalogueFilters;
}

export function SearchField({ action, placeholder, label, filters }: SearchFieldProps) {
  const preserved = Object.entries(filters).filter(
    ([key, value]) => key !== 'query' && value !== undefined,
  );

  return (
    <form action={action} method="get" role="search" className="relative">
      {preserved.map(([key, value]) => (
        <input key={key} type="hidden" name={key} value={String(value)} />
      ))}

      <label htmlFor="catalogue-search" className="sr-only">
        {label}
      </label>
      <input
        id="catalogue-search"
        type="search"
        name="q"
        defaultValue={filters.query ?? ''}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full rounded-card border border-edge bg-deep px-4 py-3 text-paper placeholder:text-paper-faint focus:border-brass-dim focus:outline-none"
      />
    </form>
  );
}

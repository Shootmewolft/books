import Link from 'next/link';

interface FilterChipProps {
  href: string;
  label: string;
  count?: number;
  isActive: boolean;
  accentVar?: string;
}

export function FilterChip({ href, label, count, isActive, accentVar }: FilterChipProps) {
  const activeStyle =
    isActive && accentVar !== undefined
      ? { backgroundColor: `var(${accentVar})`, color: 'var(--color-void)' }
      : undefined;

  return (
    <Link
      href={href}
      aria-current={isActive ? 'true' : undefined}
      style={activeStyle}
      className={`inline-flex items-baseline gap-1.5 rounded-pill border px-3 py-1 text-small transition-colors ${
        isActive
          ? 'border-transparent bg-brass text-void'
          : 'border-edge text-paper-dim hover:border-edge-bright hover:text-paper'
      }`}
    >
      {label}
      {count !== undefined && (
        <span className="font-mono text-micro tabular-nums opacity-60">{count}</span>
      )}
    </Link>
  );
}

import type { ReactNode } from 'react';

interface FilterRowProps {
  label: string;
  children: ReactNode;
}

export function FilterRow({ label, children }: FilterRowProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-4">
      <span className="w-24 shrink-0 text-micro text-paper-faint uppercase tracking-[0.12em]">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

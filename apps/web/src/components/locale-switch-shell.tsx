import type { ReactNode } from 'react';

export function LocaleSwitchShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-0.5 rounded-pill border border-edge p-0.5">
      {children}
    </div>
  );
}

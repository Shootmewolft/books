'use client';

import type { ReactNode } from 'react';

interface IconButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}

export function IconButton({ label, onClick, disabled = false, children }: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="inline-flex h-8 w-8 items-center justify-center rounded-card border border-edge text-paper-dim transition-colors hover:border-edge-bright hover:text-paper disabled:cursor-not-allowed disabled:opacity-30"
    >
      {children}
    </button>
  );
}

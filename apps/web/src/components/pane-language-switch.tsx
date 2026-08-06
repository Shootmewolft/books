'use client';

import type { BookFile } from '@/modules/catalogue/types';

interface PaneLanguageSwitchProps {
  files: readonly BookFile[];
  activePath: string;
  onSelect: (path: string) => void;
}

export function PaneLanguageSwitch({ files, activePath, onSelect }: PaneLanguageSwitchProps) {
  const readable = files.filter((file) => file.format === 'pdf');
  if (readable.length < 2) return null;

  return (
    <div className="flex items-center gap-0.5 rounded-pill border border-edge p-0.5">
      {readable.map((file) => {
        const isActive = file.path === activePath;

        return (
          <button
            key={file.path}
            type="button"
            onClick={() => onSelect(file.path)}
            aria-pressed={isActive}
            className={`rounded-pill px-2 py-0.5 font-mono text-micro uppercase tracking-[0.1em] transition-colors ${
              isActive ? 'bg-patina text-void' : 'text-paper-faint hover:text-paper'
            }`}
          >
            {file.lang}
          </button>
        );
      })}
    </div>
  );
}

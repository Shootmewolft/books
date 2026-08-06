interface StatSlotProps {
  label: string;
  value: string;
}

export function StatSlot({ label, value }: StatSlotProps) {
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span className="font-mono text-paper text-small tabular-nums">{value}</span>
      <span className="text-micro text-paper-faint uppercase tracking-[0.12em]">{label}</span>
    </span>
  );
}

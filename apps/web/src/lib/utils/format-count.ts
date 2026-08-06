const THOUSAND = 1000;

export function formatCount(value: number): string {
  return value >= THOUSAND ? `${(value / THOUSAND).toFixed(1)}k` : String(value);
}

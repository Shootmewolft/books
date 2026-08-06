const UNITS = ['B', 'KB', 'MB', 'GB', 'TB'] as const;
const STEP = 1024;

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';

  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(STEP)), UNITS.length - 1);
  const value = bytes / STEP ** exponent;
  const precision = exponent === 0 || value >= 100 ? 0 : 1;

  return `${value.toFixed(precision)} ${UNITS[exponent]}`;
}

export function buildCdnUrl(baseUrl: string, segments: readonly string[]): string {
  const path = segments.map(encodeURIComponent).join('/');
  return `${baseUrl}/${path}`;
}

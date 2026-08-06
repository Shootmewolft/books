export function fileUrl(path: string, download = false): string {
  const encoded = path.split('/').map(encodeURIComponent).join('/');
  return download ? `/api/file/${encoded}?download=1` : `/api/file/${encoded}`;
}

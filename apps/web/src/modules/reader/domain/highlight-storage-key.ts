export function highlightStorageKey(bookPath: string, filePath: string): string {
  return `library:highlights:${bookPath}/${filePath}`;
}

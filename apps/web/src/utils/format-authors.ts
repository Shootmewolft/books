const MAX_LISTED_AUTHORS = 2;

export function formatAuthors(authors: readonly string[]): string {
  if (authors.length === 0) return '—';
  if (authors.length <= MAX_LISTED_AUTHORS) return authors.join(' & ');
  return `${authors[0]} et al.`;
}

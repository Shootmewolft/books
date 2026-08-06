export class PathEscapesLibraryError extends Error {
  constructor(attempted: string) {
    super(`Path escapes the library root: ${attempted}`);
    this.name = 'PathEscapesLibraryError';
  }
}

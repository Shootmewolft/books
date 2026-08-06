import { join, resolve } from 'node:path';

import { LIBRARY_ROOT } from './library-root';
import { PathEscapesLibraryError } from './path-escapes-library-error';

export function resolveInLibrary(...segments: string[]): string {
  const target = resolve(join(LIBRARY_ROOT, ...segments));
  const isInsideLibrary = target === LIBRARY_ROOT || target.startsWith(`${LIBRARY_ROOT}/`);

  if (!isInsideLibrary) {
    throw new PathEscapesLibraryError(segments.join('/'));
  }

  return target;
}

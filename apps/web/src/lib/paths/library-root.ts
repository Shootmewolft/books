import { resolve } from 'node:path';

const configuredPath = process.env['LIBRARY_PATH'];

export const LIBRARY_ROOT =
  configuredPath === undefined ? resolve(process.cwd(), '../../library') : resolve(configuredPath);

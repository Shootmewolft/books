import type { Locale } from './config';
import { en } from './messages/en';
import { es } from './messages/es';
import type { Messages } from './types';

const DICTIONARIES: Record<Locale, Messages> = { en, es };

export function getMessages(locale: Locale): Messages {
  return DICTIONARIES[locale];
}

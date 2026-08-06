import type { Locale } from '@/i18n/config';
import type { LocalisedLabel } from '@/modules/catalogue/types';

export function localise(label: LocalisedLabel, locale: Locale): string {
  return label[locale];
}

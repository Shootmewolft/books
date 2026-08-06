import type { Category } from '@/lib/types';

import { TAGS, TAXONOMY } from '../../../../../tools/library/taxonomy.mjs';

export const CATEGORIES: readonly Category[] = TAXONOMY as Category[];
export const TAG_VOCABULARY: readonly string[] = TAGS as string[];

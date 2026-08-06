export const ZOOM_LEVELS = [0.5, 0.67, 0.8, 1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4] as const;

export const DEFAULT_ZOOM = 1;
export const MIN_ZOOM = ZOOM_LEVELS[0];
export const MAX_ZOOM = ZOOM_LEVELS[ZOOM_LEVELS.length - 1] ?? 4;

export const PAGE_HORIZONTAL_PADDING_PX = 32;

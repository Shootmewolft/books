import { MAX_ZOOM, MIN_ZOOM, ZOOM_LEVELS } from '@/modules/reader/constants/zoom';

export function nextZoomLevel(current: number, direction: 1 | -1): number {
  if (direction === 1) {
    return ZOOM_LEVELS.find((level) => level > current + 0.001) ?? MAX_ZOOM;
  }

  const lower = ZOOM_LEVELS.filter((level) => level < current - 0.001);
  return lower[lower.length - 1] ?? MIN_ZOOM;
}

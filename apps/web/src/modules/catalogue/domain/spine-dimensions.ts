const MIN_HEIGHT_PERCENT = 28;
const HEIGHT_RANGE_PERCENT = 72;
const HEIGHT_CURVE = 0.55;

const MIN_WIDTH_PX = 9;
const WIDTH_RANGE_PX = 13;
const WIDTH_CURVE = 0.7;

export interface SpineDimensions {
  heightPercent: number;
  widthPx: number;
}

export function spineDimensions(weight: number, maxWeight: number): SpineDimensions {
  const normalised = Math.min(weight / maxWeight, 1);

  return {
    heightPercent: MIN_HEIGHT_PERCENT + normalised ** HEIGHT_CURVE * HEIGHT_RANGE_PERCENT,
    widthPx: MIN_WIDTH_PX + normalised ** WIDTH_CURVE * WIDTH_RANGE_PX,
  };
}

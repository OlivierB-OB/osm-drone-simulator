import type { CanvasDrawContext } from '../types';
import { drawPolygon } from '../canvasHelpers';
import type { LanduseVisual } from './types';

export function drawLanduse(
  features: LanduseVisual[],
  draw: CanvasDrawContext
): void {
  const { ctx, bounds, scaleX, scaleY } = draw;

  const sorted = [...features].sort((a, b) => b.area - a.area);

  for (const lu of sorted) {
    ctx.fillStyle = lu.color;
    drawPolygon(ctx, lu.geometry, bounds, scaleX, scaleY);
  }
}

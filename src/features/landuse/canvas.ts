import area from '@turf/area';
import type { LanduseVisual } from '../../data/contextual/types';
import type { CanvasDrawContext } from '../types';
import { drawPolygon } from '../canvasHelpers';

export function drawLanduse(
  features: LanduseVisual[],
  draw: CanvasDrawContext
): void {
  const { ctx, bounds, scaleX, scaleY } = draw;

  const sorted = [...features].sort((a, b) => {
    return area(b.geometry) - area(a.geometry);
  });

  for (const lu of sorted) {
    ctx.fillStyle = lu.color;
    drawPolygon(ctx, lu.geometry, bounds, scaleX, scaleY);
  }
}

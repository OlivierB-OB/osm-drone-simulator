import type { VegetationVisual } from '../../data/contextual/types';
import type { CanvasDrawContext } from '../types';
import { drawPolygon } from '../canvasHelpers';

export function drawVegetation(
  features: VegetationVisual[],
  draw: CanvasDrawContext
): void {
  const { ctx, bounds, scaleX, scaleY } = draw;

  for (const veg of features) {
    if (veg.type === 'tree' || veg.type === 'tree_row') continue;
    if (veg.geometry.type !== 'Polygon') continue;
    ctx.fillStyle = veg.color;
    drawPolygon(ctx, veg.geometry, bounds, scaleX, scaleY);
  }
}

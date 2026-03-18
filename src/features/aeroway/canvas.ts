import type { CanvasDrawContext } from '../types';
import { drawPolygon, drawLineString } from '../canvasHelpers';
import type { AerowayVisual } from './types';

export function drawAeroways(
  features: AerowayVisual[],
  draw: CanvasDrawContext
): void {
  const { ctx, bounds, scaleX, scaleY } = draw;

  ctx.setLineDash([]);
  for (const aeroway of features) {
    ctx.fillStyle = aeroway.color;
    ctx.strokeStyle = aeroway.color;

    if (aeroway.geometry.type === 'Polygon') {
      drawPolygon(ctx, aeroway.geometry, bounds, scaleX, scaleY);
    } else if (aeroway.geometry.type === 'LineString') {
      ctx.lineWidth = (aeroway.widthMeters ?? 45) * scaleX;
      drawLineString(ctx, aeroway.geometry, bounds, scaleX, scaleY);
    } else if (aeroway.geometry.type === 'Point') {
      const [x, y] = aeroway.geometry.coordinates as [number, number];
      const canvasX = (x - bounds.minX) * scaleX;
      const canvasY = (bounds.maxY - y) * scaleY;
      ctx.beginPath();
      ctx.arc(canvasX, canvasY, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

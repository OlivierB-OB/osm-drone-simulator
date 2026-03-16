import type { LineString, Polygon } from 'geojson';
import type { MercatorBounds } from '../gis/types';

export function drawPolygon(
  ctx: CanvasRenderingContext2D,
  geometry: Polygon,
  bounds: MercatorBounds,
  scaleX: number,
  scaleY: number
): void {
  const rings = geometry.coordinates as [number, number][][];

  ctx.beginPath();
  for (const ring of rings) {
    let first = true;
    for (const [x, y] of ring) {
      const canvasX = (x - bounds.minX) * scaleX;
      const canvasY = (bounds.maxY - y) * scaleY;
      if (first) {
        ctx.moveTo(canvasX, canvasY);
        first = false;
      } else {
        ctx.lineTo(canvasX, canvasY);
      }
    }
    ctx.closePath();
  }

  ctx.fill('evenodd');
}

export function drawLineString(
  ctx: CanvasRenderingContext2D,
  geometry: LineString,
  bounds: MercatorBounds,
  scaleX: number,
  scaleY: number
): void {
  const coordinates = geometry.coordinates as [number, number][];

  ctx.beginPath();
  let firstPoint = true;

  for (const [x, y] of coordinates) {
    const canvasX = (x - bounds.minX) * scaleX;
    const canvasY = (bounds.maxY - y) * scaleY;

    if (firstPoint) {
      ctx.moveTo(canvasX, canvasY);
      firstPoint = false;
    } else {
      ctx.lineTo(canvasX, canvasY);
    }
  }

  ctx.stroke();
}

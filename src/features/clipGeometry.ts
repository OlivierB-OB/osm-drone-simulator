import type { LineString, Polygon } from 'geojson';
import type { GeoBounds } from '../data/elevation/types';
import { rectClip, rectClipLines, RectDUtils } from '@countertype/clipper2-ts';

export function clipPolygonToBounds(
  geometry: Polygon,
  bounds: GeoBounds
): Polygon | null {
  const rect = RectDUtils.create(
    bounds.minLng,
    bounds.minLat,
    bounds.maxLng,
    bounds.maxLat
  );
  const outerRing = (geometry.coordinates[0] ?? []).map((pt) => ({
    x: pt[0]!,
    y: pt[1]!,
  }));
  const result = rectClip(rect, outerRing);
  if (!result || result.length === 0 || result[0]!.length < 3) return null;
  const ring = result[0]!.map((p) => [p.x, p.y] as [number, number]);
  ring.push(ring[0]!);
  return { type: 'Polygon', coordinates: [ring] };
}

export function clipLineStringToBounds(
  geometry: LineString,
  bounds: GeoBounds
): LineString | null {
  const rect = RectDUtils.create(
    bounds.minLng,
    bounds.minLat,
    bounds.maxLng,
    bounds.maxLat
  );
  const path = geometry.coordinates.map((pt) => ({ x: pt[0]!, y: pt[1]! }));
  const result = rectClipLines(rect, path);
  if (!result || result.length === 0 || result[0]!.length < 2) return null;
  const coords = result[0]!.map((p) => [p.x, p.y] as [number, number]);
  return { type: 'LineString', coordinates: coords };
}

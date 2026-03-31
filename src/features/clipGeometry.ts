import type { Feature, LineString, MultiPolygon, Polygon } from 'geojson';
import { intersect } from '@turf/intersect';
import { lineSplit } from '@turf/line-split';
import { booleanIntersects } from '@turf/boolean-intersects';
import { feature, featureCollection } from '@turf/helpers';

export function clipPolygonToBounds(
  geometry: Polygon,
  boundsPolygon: Feature<Polygon>
): Polygon | null {
  const result = intersect(
    featureCollection([feature(geometry), boundsPolygon])
  );
  if (!result) return null;
  const g = result.geometry;
  if (g.type === 'Polygon') {
    return g.coordinates[0] && g.coordinates[0].length >= 3 ? g : null;
  }
  // MultiPolygon — take the first polygon
  const multiCoords = (g as MultiPolygon).coordinates;
  const first = multiCoords[0];
  if (!first || first[0] == null || first[0].length < 3) return null;
  return { type: 'Polygon', coordinates: first };
}

export function clipLineStringToBounds(
  geometry: LineString,
  boundsPolygon: Feature<Polygon>
): LineString | null {
  const lineFeature = feature(geometry);
  const segments = lineSplit(lineFeature, boundsPolygon);
  if (segments.features.length === 0) {
    // Line not split — either fully inside or fully outside
    return booleanIntersects(lineFeature, boundsPolygon) &&
      geometry.coordinates.length >= 2
      ? geometry
      : null;
  }
  const inside = segments.features.find(
    (seg) =>
      booleanIntersects(seg, boundsPolygon) &&
      seg.geometry.coordinates.length >= 2
  );
  return inside ? inside.geometry : null;
}

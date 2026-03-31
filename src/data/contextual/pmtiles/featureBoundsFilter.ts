import booleanIntersects from '@turf/boolean-intersects';
import { polygon } from '@turf/helpers';
import type { Geometry } from 'geojson';
import type { ModulesFeatures } from '../../../features/registrationTypes';
import type { GeoBounds } from '../../elevation/types';

/**
 * Returns a new ModulesFeatures containing only features whose geometry
 * intersects the given geo bounds.
 */
export function filterFeaturesByBounds(
  features: ModulesFeatures,
  bounds: GeoBounds
): ModulesFeatures {
  const { minLng, minLat, maxLng, maxLat } = bounds;
  const boundsPolygon = polygon([
    [
      [minLng, minLat],
      [maxLng, minLat],
      [maxLng, maxLat],
      [minLng, maxLat],
      [minLng, minLat],
    ],
  ]);
  const result: Record<string, unknown[]> = {};
  for (const key of Object.keys(features)) {
    const arr =
      (features as unknown as Record<string, Array<{ geometry: Geometry }>>)[
        key
      ] ?? [];
    result[key] = arr.filter((f) =>
      booleanIntersects(f.geometry, boundsPolygon)
    );
  }
  return result as unknown as ModulesFeatures;
}

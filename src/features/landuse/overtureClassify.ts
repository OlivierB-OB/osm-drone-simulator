import type { LanduseVisual } from './types';
import type { Polygon } from 'geojson';
import type { GeoBounds } from '../../data/elevation/types';
import { groundColors } from '../../config';
import area from '@turf/area';
import { clipPolygonToBounds } from '../clipGeometry';

export function classifyOvertureLanduse(
  id: string,
  props: Record<string, unknown>,
  geometry: Polygon,
  bounds: GeoBounds
): LanduseVisual | null {
  const luType = (props.class as string) ?? 'other';
  const landuseColors = groundColors.landuse as Record<
    string,
    string | undefined
  >;

  const featureArea = area(geometry);
  const clipped = clipPolygonToBounds(geometry, bounds);
  if (!clipped) return null;

  return {
    id,
    geometry: clipped,
    type: luType,
    color: landuseColors[luType] ?? groundColors.default,
    area: featureArea,
  };
}

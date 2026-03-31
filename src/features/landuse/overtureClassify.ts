import type { LanduseVisual } from './types';
import type { Feature, Polygon } from 'geojson';
import { groundColors } from '../../config';
import area from '@turf/area';
import { clipPolygonToBounds } from '../clipGeometry';

export function classifyOvertureLanduse(
  id: string,
  props: Record<string, unknown>,
  geometry: Polygon,
  boundsPolygon: Feature<Polygon>
): LanduseVisual | null {
  const luType = (props.class as string) ?? 'other';
  const landuseColors = groundColors.landuse as Record<
    string,
    string | undefined
  >;

  const featureArea = area(geometry);
  const clipped = clipPolygonToBounds(geometry, boundsPolygon);
  if (!clipped) return null;

  return {
    id,
    geometry: clipped,
    type: luType,
    color: landuseColors[luType] ?? groundColors.default,
    area: featureArea,
  };
}

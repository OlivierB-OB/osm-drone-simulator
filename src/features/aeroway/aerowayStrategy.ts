import type { AerowayVisual } from '../../data/contextual/types';
import { groundColors } from '../../config';
import type { LineString, Point, Polygon } from 'geojson';

export const AEROWAY_TYPES = new Set([
  'aerodrome',
  'runway',
  'taxiway',
  'taxilane',
  'apron',
  'helipad',
]);

const aerowayLineWidthsMeters: Record<string, number> = {
  runway: 45,
  taxiway: 23,
  taxilane: 12,
};

export function classifyAeroway(
  id: string,
  tags: Record<string, string>,
  geometry: Polygon | LineString | Point
): AerowayVisual {
  const aerowayType = tags.aeroway!;
  const aerowayColors = groundColors.aeroways as Record<
    string,
    string | undefined
  >;

  return {
    id,
    geometry,
    type: aerowayType,
    color: aerowayColors[aerowayType] ?? groundColors.aeroways.aerodrome,
    widthMeters: aerowayLineWidthsMeters[aerowayType]!,
  };
}

import type { ContextDataTile, AerowayVisual } from '../types';
import { groundColors } from '../../../config';
import type { LineString, Point, Polygon } from 'geojson';

export const AEROWAY_TYPES = new Set([
  'aerodrome',
  'runway',
  'taxiway',
  'taxilane',
  'apron',
  'helipad',
]);

export function classifyAeroway(
  id: string,
  tags: Record<string, string>,
  geometry: Polygon | LineString | Point,
  features: ContextDataTile['features']
): void {
  const aerowayType = tags.aeroway!;
  const aerowayColors = groundColors.aeroways as Record<
    string,
    string | undefined
  >;
  const aerowayLineWidthsMeters: Record<string, number> = {
    runway: 45,
    taxiway: 23,
    taxilane: 12,
  };

  const aeroway: AerowayVisual = {
    id,
    geometry,
    type: aerowayType,
    color: aerowayColors[aerowayType] ?? groundColors.aeroways.aerodrome,
    widthMeters: aerowayLineWidthsMeters[aerowayType]!,
  };
  features.airports.push(aeroway);
}

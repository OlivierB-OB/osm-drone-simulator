import type { LanduseVisual } from './types';
import { groundColors } from '../../config';
import type { Polygon } from 'geojson';

export const LANDUSE_TYPES = new Set([
  'grassland',
  'meadow',
  'park',
  'recreation_ground',
  'plant_nursery',
  'grass',
  'farmland',
  'orchard',
  'vineyard',
  'allotments',
  'cemetery',
  'construction',
  'residential',
  'commercial',
  'retail',
  'industrial',
  'military',
  'sand',
  'beach',
  'dune',
  'bare_rock',
  'scree',
  'mud',
  'glacier',
]);

export const NATURAL_LANDUSE_TYPES = new Set([
  'sand',
  'beach',
  'dune',
  'bare_rock',
  'scree',
  'mud',
  'glacier',
  'grassland',
]);

export function classifyLanduse(
  id: string,
  tags: Record<string, string>,
  geometry: Polygon,
  isNatural: boolean
): LanduseVisual {
  const landuseColors = groundColors.landuse as Record<
    string,
    string | undefined
  >;

  if (isNatural) {
    const naturalType = tags.natural!;
    return {
      id,
      geometry,
      type: naturalType,
      color: landuseColors[naturalType] ?? groundColors.default,
    };
  }

  const luType =
    tags.leisure === 'park'
      ? 'park'
      : tags.leisure === 'garden'
        ? 'garden'
        : (tags.landuse ?? 'other');
  return {
    id,
    geometry,
    type: luType,
    color: landuseColors[luType] ?? groundColors.default,
  };
}

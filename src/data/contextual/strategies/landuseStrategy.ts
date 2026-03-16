import type { ContextDataTile, LanduseVisual } from '../types';
import { groundColors } from '../../../config';
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

/**
 * Classifies landuse features (both landuse=* and natural landuse types).
 */
export function classifyLanduse(
  id: string,
  tags: Record<string, string>,
  geometry: Polygon,
  features: ContextDataTile['features'],
  isNatural: boolean
): void {
  const landuseColors = groundColors.landuse as Record<
    string,
    string | undefined
  >;

  if (isNatural) {
    const naturalType = tags.natural!;
    const landuse: LanduseVisual = {
      id,
      geometry,
      type: naturalType,
      color: landuseColors[naturalType] ?? groundColors.default,
    };
    features.landuse.push(landuse);
  } else {
    const luType =
      tags.leisure === 'park'
        ? 'park'
        : tags.leisure === 'garden'
          ? 'garden'
          : (tags.landuse ?? 'other');
    const landuse: LanduseVisual = {
      id,
      geometry,
      type: luType,
      color: landuseColors[luType] ?? groundColors.default,
    };
    features.landuse.push(landuse);
  }
}

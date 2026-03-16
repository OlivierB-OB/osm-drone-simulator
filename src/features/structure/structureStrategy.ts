import type { StructureVisual } from '../../data/contextual/types';
import { structureDefaults } from '../../config';
import type { Point, Polygon } from 'geojson';

const STRUCTURE_TYPES = new Set([
  'tower',
  'chimney',
  'mast',
  'communications_tower',
  'water_tower',
  'silo',
  'storage_tank',
  'lighthouse',
  'crane',
]);

function getStructureType(tags: Record<string, string>): string | null {
  if (tags.man_made && STRUCTURE_TYPES.has(tags.man_made)) {
    return tags.man_made;
  }
  if (tags.power === 'tower') return 'power_tower';
  if (tags.power === 'pole') return 'power_pole';
  if (tags.aerialway === 'pylon') return 'aerialway_pylon';
  return null;
}

export { STRUCTURE_TYPES };

export function classifyStructure(
  id: string,
  tags: Record<string, string>,
  geometry: Polygon | Point
): StructureVisual | null {
  const structureType = getStructureType(tags);
  if (!structureType) return null;

  const defaults = structureDefaults[structureType];
  if (!defaults) return null;

  return {
    id,
    geometry,
    type: structureType,
    height: tags.height ? parseFloat(tags.height) : undefined,
    diameter:
      (structureType === 'storage_tank' || structureType === 'silo') &&
      tags.diameter
        ? parseFloat(tags.diameter)
        : undefined,
    color: defaults.color,
  };
}

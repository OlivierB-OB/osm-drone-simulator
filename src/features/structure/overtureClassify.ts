import type { StructureVisual } from './types';
import type { Point, Polygon } from 'geojson';
import { structureDefaults } from '../../config';

const STRUCTURE_CLASSES = new Set([
  'tower',
  'mast',
  'chimney',
  'lighthouse',
  'water_tower',
  'crane',
  'power_tower',
  'power_pole',
]);

export { STRUCTURE_CLASSES };

export function classifyOvertureStructure(
  id: string,
  props: Record<string, unknown>,
  geometry: Point | Polygon
): StructureVisual | null {
  const structureType = (props.class as string) ?? '';
  if (!STRUCTURE_CLASSES.has(structureType)) return null;

  const defaults = structureDefaults[structureType];
  if (!defaults) return null;

  return {
    id,
    geometry,
    type: structureType,
    height: typeof props.height === 'number' ? props.height : undefined,
    color: defaults.color,
  };
}

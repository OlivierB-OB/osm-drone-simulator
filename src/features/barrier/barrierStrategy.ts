import { barrierDefaults } from '../../config';
import type { LineString } from 'geojson';
import type { BarrierVisual } from './types';

const BARRIER_TYPES = new Set(['wall', 'city_wall', 'retaining_wall', 'hedge']);

export { BARRIER_TYPES };

export function classifyBarrier(
  id: string,
  tags: Record<string, string>,
  geometry: LineString
): BarrierVisual | null {
  const barrierType = tags.barrier;
  if (!barrierType || !BARRIER_TYPES.has(barrierType)) return null;

  const defaults = barrierDefaults[barrierType];
  if (!defaults) return null;

  return {
    id,
    geometry,
    type: barrierType,
    height: tags.height ? parseFloat(tags.height) : undefined,
    width: defaults.width,
    color: defaults.color,
    material: tags.material,
  };
}

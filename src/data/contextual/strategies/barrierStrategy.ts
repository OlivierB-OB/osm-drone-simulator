import type { ContextDataTile, BarrierVisual } from '../types';
import { barrierDefaults } from '../../../config';
import type { LineString } from 'geojson';

const BARRIER_TYPES = new Set(['wall', 'city_wall', 'retaining_wall', 'hedge']);

export { BARRIER_TYPES };

export function classifyBarrier(
  id: string,
  tags: Record<string, string>,
  geometry: LineString,
  features: ContextDataTile['features']
): void {
  const barrierType = tags.barrier;
  if (!barrierType || !BARRIER_TYPES.has(barrierType)) return;

  const defaults = barrierDefaults[barrierType];
  if (!defaults) return;

  const barrier: BarrierVisual = {
    id,
    geometry,
    type: barrierType,
    height: tags.height ? parseFloat(tags.height) : undefined,
    width: defaults.width,
    color: defaults.color,
    material: tags.material,
  };
  features.barriers.push(barrier);
}

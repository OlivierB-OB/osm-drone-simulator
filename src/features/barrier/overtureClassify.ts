import type { BarrierVisual } from './types';
import type { LineString } from 'geojson';
import { barrierDefaults } from '../../config';

const BARRIER_CLASSES = new Set([
  'wall',
  'city_wall',
  'retaining_wall',
  'hedge',
]);

export { BARRIER_CLASSES };

export function classifyOvertureBarrier(
  id: string,
  props: Record<string, unknown>,
  geometry: LineString
): BarrierVisual | null {
  const barrierType = (props.class as string) ?? '';
  if (!BARRIER_CLASSES.has(barrierType)) return null;

  const defaults = barrierDefaults[barrierType];
  if (!defaults) return null;

  return {
    id,
    geometry,
    type: barrierType,
    height: typeof props.height === 'number' ? props.height : undefined,
    width: defaults.width,
    color: defaults.color,
  };
}

import type { BufferGeometry } from 'three';
import type { IRoofGeometryStrategy, RoofParams } from './strategies/types';
import { PyramidalRoofStrategy } from './strategies/PyramidalRoofStrategy';
import { GabledRoofStrategy } from './strategies/GabledRoofStrategy';
import { HippedRoofStrategy } from './strategies/HippedRoofStrategy';
import { SkillionRoofStrategy } from './strategies/SkillionRoofStrategy';
import { DomeRoofStrategy } from './strategies/DomeRoofStrategy';
import { OnionRoofStrategy } from './strategies/OnionRoofStrategy';
import { ConeRoofStrategy } from './strategies/ConeRoofStrategy';

export type { OBB, RoofParams } from './strategies/types';
export { computeOBB, resolveRidgeAngle } from './strategies/roofGeometryUtils';

/**
 * Creates roof BufferGeometry for non-flat roof shapes.
 * Geometry is built in Three.js local space:
 *   X = local Mercator X offset from centroid
 *   Y = height above wall top (0 at base, roofHeight at apex)
 *   Z = -local Mercator Y offset from centroid
 */
export class RoofGeometryFactory {
  private readonly strategies = new Map<string, IRoofGeometryStrategy>([
    ['pyramidal', new PyramidalRoofStrategy()],
    ['cone', new ConeRoofStrategy()],
    ['gabled', new GabledRoofStrategy()],
    ['hipped', new HippedRoofStrategy()],
    ['skillion', new SkillionRoofStrategy()],
    ['dome', new DomeRoofStrategy()],
    ['onion', new OnionRoofStrategy()],
  ]);

  create(params: RoofParams): BufferGeometry | null {
    return this.strategies.get(params.roofShape)?.create(params) ?? null;
  }
}

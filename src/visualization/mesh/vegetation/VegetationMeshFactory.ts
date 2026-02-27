import type { Object3D } from 'three';
import type { VegetationVisual } from '../../../data/contextual/types';
import type { ElevationSampler } from '../util/ElevationSampler';
import type { IVegetationStrategy } from './strategies/types';
import { ForestStrategy } from './strategies/ForestStrategy';
import { ScrubStrategy } from './strategies/ScrubStrategy';
import { OrchardStrategy } from './strategies/OrchardStrategy';
import { VineyardStrategy } from './strategies/VineyardStrategy';
import { SingleTreeStrategy } from './strategies/SingleTreeStrategy';
import { TreeRowStrategy } from './strategies/TreeRowStrategy';

/**
 * Creates 3D vegetation meshes using InstancedMesh for performance.
 * Handles forests, scrub, orchards, vineyards, single trees, and tree rows.
 */
export class VegetationMeshFactory {
  private readonly strategies: Map<string, IVegetationStrategy>;

  constructor(elevation: ElevationSampler) {
    const forest = new ForestStrategy(elevation);
    const scrub = new ScrubStrategy(elevation);
    this.strategies = new Map<string, IVegetationStrategy>([
      ['forest', forest],
      ['wood', forest],
      ['scrub', scrub],
      ['heath', scrub],
      ['orchard', new OrchardStrategy(elevation)],
      ['vineyard', new VineyardStrategy(elevation)],
      ['tree', new SingleTreeStrategy(elevation)],
      ['tree_row', new TreeRowStrategy(elevation)],
    ]);
  }

  create(vegetation: VegetationVisual[]): Object3D[] {
    const meshes: Object3D[] = [];
    for (const veg of vegetation) {
      try {
        meshes.push(...(this.strategies.get(veg.type)?.create(veg) ?? []));
      } catch {
        // Skip problematic vegetation features
      }
    }
    return meshes;
  }
}

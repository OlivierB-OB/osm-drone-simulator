import type { Object3D } from 'three';
import type { StructureVisual } from '../../../data/contextual/types';
import type { ElevationSampler } from '../util/ElevationSampler';
import { structureDefaults } from '../../../config';
import type { IStructureStrategy } from './strategies/types';
import { CylinderStrategy } from './strategies/CylinderStrategy';
import { TaperedCylinderStrategy } from './strategies/TaperedCylinderStrategy';
import { BoxStrategy } from './strategies/BoxStrategy';
import { WaterTowerStrategy } from './strategies/WaterTowerStrategy';
import { CraneStrategy } from './strategies/CraneStrategy';

/**
 * Creates 3D meshes for man-made structures (towers, chimneys, masts, etc.)
 * using parametric shapes from config defaults.
 */
const cylinderStrategy = new CylinderStrategy();

export class StructureMeshFactory {
  private readonly strategies = new Map<string, IStructureStrategy>([
    ['cylinder', cylinderStrategy],
    ['tapered_cylinder', new TaperedCylinderStrategy()],
    ['box', new BoxStrategy()],
    ['water_tower', new WaterTowerStrategy()],
    ['crane', new CraneStrategy()],
  ]);

  constructor(private readonly elevation: ElevationSampler) {}

  create(structures: StructureVisual[]): Object3D[] {
    const meshes: Object3D[] = [];
    for (const structure of structures) {
      const mesh = this.createStructureMesh(structure);
      if (mesh) meshes.push(mesh);
    }
    return meshes;
  }

  private createStructureMesh(structure: StructureVisual): Object3D | null {
    const defaults = structureDefaults[structure.type];
    if (!defaults) return null;

    const height = structure.height ?? defaults.height;
    const radius = structure.diameter
      ? structure.diameter / 2
      : defaults.radius;
    const color = structure.color;

    const [mx, my] = this.getPosition(structure);
    const terrainY = this.elevation.sampleAt(mx, my);

    const strategy = this.strategies.get(defaults.shape) ?? cylinderStrategy;
    const obj = strategy.create({ radius, height, color });
    obj.position.set(mx, terrainY + height / 2, -my);
    return obj;
  }

  private getPosition(structure: StructureVisual): [number, number] {
    if (structure.geometry.type === 'Point') {
      return structure.geometry.coordinates;
    }
    // Polygon: use centroid
    const ring = structure.geometry.coordinates[0];
    if (!ring || ring.length < 2) return [0, 0];
    let sx = 0,
      sy = 0;
    const n = ring.length - 1;
    for (let i = 0; i < n; i++) {
      sx += ring[i]![0];
      sy += ring[i]![1];
    }
    return [sx / n, sy / n];
  }
}

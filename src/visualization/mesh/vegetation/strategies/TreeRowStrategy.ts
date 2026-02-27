import type { Object3D } from 'three';
import type {
  VegetationVisual,
  LineString,
} from '../../../../data/contextual/types';
import type { ElevationSampler } from '../../util/ElevationSampler';
import { vegetationMeshConfig } from '../../../../config';
import type { IVegetationStrategy } from './types';
import {
  BROADLEAF_COLORS,
  NEEDLELEAF_COLORS,
  createInstancedTrees,
} from './vegetationUtils';

export class TreeRowStrategy implements IVegetationStrategy {
  constructor(private readonly elevation: ElevationSampler) {}

  create(veg: VegetationVisual): Object3D[] {
    if (veg.geometry.type !== 'LineString') return [];
    const coords = (veg.geometry as LineString).coordinates;
    if (coords.length < 2) return [];

    const config = vegetationMeshConfig.treeRow;
    const interval = config.intervalMeters;
    const isNeedle = veg.leafType === 'needleleaved';
    const colors = isNeedle ? NEEDLELEAF_COLORS : BROADLEAF_COLORS;

    const points: [number, number][] = [];
    let accumulated = 0;

    for (let i = 0; i < coords.length - 1; i++) {
      const [x1, y1] = coords[i]!;
      const [x2, y2] = coords[i + 1]!;
      const dx = x2 - x1;
      const dy = y2 - y1;
      const segLen = Math.sqrt(dx * dx + dy * dy);
      if (segLen < 0.1) continue;

      const nx = dx / segLen;
      const ny = dy / segLen;

      while (accumulated < segLen) {
        const px = x1 + nx * accumulated;
        const py = y1 + ny * accumulated;
        points.push([px, py]);
        accumulated += interval;
      }
      accumulated -= segLen;
    }

    if (points.length === 0) return [];

    return createInstancedTrees(
      points,
      config.trunkHeightMin,
      config.trunkHeightMax,
      config.crownRadiusMin,
      config.crownRadiusMax,
      isNeedle,
      colors,
      this.elevation
    );
  }
}

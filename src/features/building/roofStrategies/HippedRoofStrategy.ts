import { BufferGeometry } from 'three';
import type { IRoofGeometryStrategy, RoofParams } from './types';
import {
  computeOBB,
  normalizeRing,
  buildOutlineRoofGeometry,
} from './roofGeometryUtils';
import { PyramidalRoofStrategy } from './PyramidalRoofStrategy';

export class HippedRoofStrategy implements IRoofGeometryStrategy {
  create(params: RoofParams): BufferGeometry {
    const ring = params.outerRing;
    const h = params.roofHeight;
    const { count, isCCW } = normalizeRing(ring);
    if (count < 3) return new BufferGeometry();

    const obb = computeOBB(params.outerRing);
    const halfLength = obb.halfLength;
    const halfWidth = obb.halfWidth;

    // Degenerate check: square or near-square → pyramidal
    if (halfWidth <= 0.01 || halfLength <= halfWidth + 0.01) {
      return new PyramidalRoofStrategy().create(params);
    }

    const cosA = Math.cos(params.ridgeAngle);
    const sinA = Math.sin(params.ridgeAngle);
    const ocx = obb.center[0];
    const ocy = obb.center[1];

    const computeHeight = (x: number, y: number): number => {
      const dx = x - ocx;
      const dy = y - ocy;
      const alongProj = dx * cosA + dy * sinA;
      const acrossProj = -dx * sinA + dy * cosA;
      const tAcross = 1 - Math.abs(acrossProj) / halfWidth;
      const tAlong = (halfLength - Math.abs(alongProj)) / halfWidth;
      return h * Math.max(0, Math.min(1, Math.min(tAcross, tAlong)));
    };

    const heights = new Float64Array(count);
    for (let i = 0; i < count; i++) {
      heights[i] = computeHeight(ring[i]![0], ring[i]![1]);
    }

    let innerHeights: Float64Array[] | undefined;
    if (params.innerRings) {
      innerHeights = params.innerRings.map((inner) => {
        const { count: hCount } = normalizeRing(inner);
        const hArr = new Float64Array(hCount);
        for (let i = 0; i < hCount; i++) {
          hArr[i] = computeHeight(inner[i]![0], inner[i]![1]);
        }
        return hArr;
      });
    }

    return buildOutlineRoofGeometry(
      ring,
      heights,
      isCCW,
      count,
      params.innerRings,
      innerHeights
    );
  }
}

import { BufferGeometry } from 'three';
import type { IRoofGeometryStrategy, RoofParams } from './types';
import {
  computeOBB,
  normalizeRing,
  buildOutlineRoofGeometry,
} from './roofGeometryUtils';

export class CrosspitchedRoofStrategy implements IRoofGeometryStrategy {
  create(params: RoofParams): BufferGeometry {
    const ring = params.outerRing;
    const h = params.roofHeight;
    const obb = computeOBB(ring);

    // Equal-pitch half-width: both ridges use the shorter OBB dimension
    const hW = Math.min(obb.halfLength, obb.halfWidth);
    if (hW < 1e-6) return new BufferGeometry();

    const { count, isCCW } = normalizeRing(ring);

    // Two perpendicular ridge axes
    const angle1 = params.ridgeAngle;
    const angle2 = params.ridgeAngle + Math.PI / 2;
    const across1X = -Math.sin(angle1);
    const across1Y = Math.cos(angle1);
    const across2X = -Math.sin(angle2);
    const across2Y = Math.cos(angle2);

    const computeHeight = (x: number, y: number): number => {
      const p1 = x * across1X + y * across1Y;
      const p2 = x * across2X + y * across2Y;
      const h1 = h * Math.max(0, 1 - Math.abs(p1) / hW);
      const h2 = h * Math.max(0, 1 - Math.abs(p2) / hW);
      return Math.max(h1, h2);
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

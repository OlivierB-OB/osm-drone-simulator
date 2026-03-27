import type { BufferGeometry } from 'three';
import type { IRoofGeometryStrategy, RoofParams } from './types';
import {
  computeOBB,
  normalizeRing,
  buildOutlineRoofGeometry,
} from './roofGeometryUtils';

/**
 * Round (barrel vault) roof: semi-elliptical cross-section across the building width.
 * Height = roofHeight * sqrt(1 - (acrossProj/halfWidth)^2)
 *
 * Uses outline-based triangulation.
 */
export class RoundRoofStrategy implements IRoofGeometryStrategy {
  create(params: RoofParams): BufferGeometry {
    const ring = params.outerRing;
    const h = params.roofHeight;
    const obb = computeOBB(ring);
    const { count, isCCW } = normalizeRing(ring);

    // If wider than long, swap axes so barrel spans the longer dimension
    let halfWidth = obb.halfWidth;
    let ridgeAngle = params.ridgeAngle;
    if (obb.halfWidth > obb.halfLength) {
      halfWidth = obb.halfLength;
      ridgeAngle += Math.PI / 2;
    }

    const acrossX = -Math.sin(ridgeAngle);
    const acrossY = Math.cos(ridgeAngle);

    const computeHeight = (x: number, y: number): number => {
      const proj = x * acrossX + y * acrossY;
      const t = proj / halfWidth; // -1..+1
      if (Math.abs(t) >= 1) return 0;
      return h * Math.sqrt(1 - t * t);
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

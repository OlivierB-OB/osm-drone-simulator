import type { BufferGeometry } from 'three';
import type { IRoofGeometryStrategy, RoofParams } from './types';
import { normalizeRing, buildOutlineRoofGeometry } from './roofGeometryUtils';

export class ButterflyRoofStrategy implements IRoofGeometryStrategy {
  create(params: RoofParams): BufferGeometry {
    const ring = params.outerRing;
    const h = params.roofHeight;
    const { count, isCCW } = normalizeRing(ring);

    const acrossX = -Math.sin(params.ridgeAngle);
    const acrossY = Math.cos(params.ridgeAngle);

    // Project vertices onto across-valley axis
    let maxAbsAcross = 0;
    const projections = new Float64Array(count);
    for (let i = 0; i < count; i++) {
      const p = ring[i]![0] * acrossX + ring[i]![1] * acrossY;
      projections[i] = p;
      if (Math.abs(p) > maxAbsAcross) maxAbsAcross = Math.abs(p);
    }

    // Butterfly: inverse of gabled — valley at centre (Y=0), eaves at top (Y=h)
    const heights = new Float64Array(count);
    if (maxAbsAcross > 0.001) {
      for (let i = 0; i < count; i++) {
        heights[i] = (h * Math.abs(projections[i]!)) / maxAbsAcross;
      }
    }

    let innerHeights: Float64Array[] | undefined;
    if (params.innerRings) {
      innerHeights = params.innerRings.map((inner) => {
        const { count: hCount } = normalizeRing(inner);
        const hArr = new Float64Array(hCount);
        if (maxAbsAcross > 0.001) {
          for (let i = 0; i < hCount; i++) {
            const p = inner[i]![0] * acrossX + inner[i]![1] * acrossY;
            hArr[i] = (h * Math.abs(p)) / maxAbsAcross;
          }
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

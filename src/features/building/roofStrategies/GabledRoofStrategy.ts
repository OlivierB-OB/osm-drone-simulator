import type { BufferGeometry } from 'three';
import type { IRoofGeometryStrategy, RoofParams } from './types';
import { normalizeRing, buildOutlineRoofGeometry } from './roofGeometryUtils';

export class GabledRoofStrategy implements IRoofGeometryStrategy {
  create(params: RoofParams): BufferGeometry {
    const ring = params.outerRing;
    const h = params.roofHeight;
    const { count, isCCW } = normalizeRing(ring);

    // Across-ridge axis (perpendicular to ridge direction)
    const acrossX = -Math.sin(params.ridgeAngle);
    const acrossY = Math.cos(params.ridgeAngle);

    // Project vertices onto across-ridge axis
    let maxAbsAcross = 0;
    const acrossProj = new Float64Array(count);
    for (let i = 0; i < count; i++) {
      const p = ring[i]![0] * acrossX + ring[i]![1] * acrossY;
      acrossProj[i] = p;
      if (Math.abs(p) > maxAbsAcross) maxAbsAcross = Math.abs(p);
    }

    // Per-vertex height: max at ridge centreline, zero at eaves
    const heights = new Float64Array(count);
    if (maxAbsAcross > 1e-6) {
      for (let i = 0; i < count; i++) {
        heights[i] = h * (1 - Math.abs(acrossProj[i]!) / maxAbsAcross);
      }
    }

    // Compute inner ring heights with same formula
    let innerHeights: Float64Array[] | undefined;
    if (params.innerRings) {
      innerHeights = params.innerRings.map((inner) => {
        const { count: hCount } = normalizeRing(inner);
        const hArr = new Float64Array(hCount);
        if (maxAbsAcross > 1e-6) {
          for (let i = 0; i < hCount; i++) {
            const p = inner[i]![0] * acrossX + inner[i]![1] * acrossY;
            hArr[i] = h * (1 - Math.abs(p) / maxAbsAcross);
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

import type { BufferGeometry } from 'three';
import type { IRoofGeometryStrategy, RoofParams } from './types';
import { normalizeRing, buildOutlineRoofGeometry } from './roofGeometryUtils';

export class SkillionRoofStrategy implements IRoofGeometryStrategy {
  create(params: RoofParams): BufferGeometry {
    const ring = params.outerRing;
    const h = params.roofHeight;
    const { count, isCCW } = normalizeRing(ring);

    // "+across" direction = high side of the slope
    const acrossX = -Math.sin(params.ridgeAngle);
    const acrossY = Math.cos(params.ridgeAngle);

    // Project each vertex onto the across direction
    let minProj = Infinity;
    let maxProj = -Infinity;
    const projections = new Float64Array(count);
    for (let i = 0; i < count; i++) {
      const proj = ring[i]![0] * acrossX + ring[i]![1] * acrossY;
      projections[i] = proj;
      if (proj < minProj) minProj = proj;
      if (proj > maxProj) maxProj = proj;
    }

    const projRange = maxProj - minProj;
    const heights = new Float64Array(count);
    for (let i = 0; i < count; i++) {
      heights[i] =
        projRange > 0 ? (h * (projections[i]! - minProj)) / projRange : 0;
    }

    // Compute inner ring heights with same formula
    let innerHeights: Float64Array[] | undefined;
    if (params.innerRings) {
      innerHeights = params.innerRings.map((inner) => {
        const { count: hCount } = normalizeRing(inner);
        const hArr = new Float64Array(hCount);
        for (let i = 0; i < hCount; i++) {
          const proj = inner[i]![0] * acrossX + inner[i]![1] * acrossY;
          hArr[i] = projRange > 0 ? (h * (proj - minProj)) / projRange : 0;
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

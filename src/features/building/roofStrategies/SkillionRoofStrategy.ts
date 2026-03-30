import type { BufferGeometry } from 'three';
import type { IRoofGeometryStrategy, RoofParams } from './types';
import { normalizeRing, buildOutlineRoofGeometry } from './roofGeometryUtils';

/**
 * Skillion roof: a single planar slope with no ridge, apex, or breaks.
 *
 * Slope direction: `ridgeAngle` is the along-ridge angle in local Mercator radians.
 * For skillion, `BuildingMeshFactory` adds `PI/2` to the resolved ridge angle when
 * `roofDirection` is provided (line 227-229), so `ridgeAngle` effectively points
 * along the across-slope (high-to-low) axis. The across-slope unit vector is:
 *   acrossX = -sin(ridgeAngle), acrossY = cos(ridgeAngle)
 * Vertices with higher projection values sit at the high eave (height = roofHeight);
 * vertices with lower projections sit at the low eave (height = 0).
 *
 * Height formula: height[i] = roofHeight * (proj[i] - minProj) / projRange
 *
 * Inner rings (courtyards) are projected using the outer ring's minProj/maxProj,
 * ensuring courtyard edges sit on the same continuous slope plane as the outer ring.
 */
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

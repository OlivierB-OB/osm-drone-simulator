import type { BufferGeometry } from 'three';
import type { IRoofGeometryStrategy, RoofParams } from './types';
import {
  computeOBB,
  normalizeRing,
  buildOutlineRoofGeometry,
} from './roofGeometryUtils';
import { GabledRoofStrategy } from './GabledRoofStrategy';
import { HippedRoofStrategy } from './HippedRoofStrategy';

/**
 * Half-hipped (jerkinhead) roof: gabled with small hip triangles clipping the
 * top portion of each gable end.
 *
 * Uses outline-based triangulation with a height function that blends
 * gabled and hipped profiles at the building ends.
 */
export class HalfHippedRoofStrategy implements IRoofGeometryStrategy {
  private readonly HIP_FRACTION = 0.3; // top 30% of gable end is hipped

  create(params: RoofParams): BufferGeometry {
    if (this.HIP_FRACTION <= 0) return new GabledRoofStrategy().create(params);
    if (this.HIP_FRACTION >= 1) return new HippedRoofStrategy().create(params);

    const ring = params.outerRing;
    const h = params.roofHeight;
    const obb = computeOBB(ring);
    const { count, isCCW } = normalizeRing(ring);

    const halfLength = obb.halfLength;
    const halfWidth = obb.halfWidth;
    const cosA = Math.cos(params.ridgeAngle);
    const sinA = Math.sin(params.ridgeAngle);
    const ocx = obb.center[0];
    const ocy = obb.center[1];

    const computeHeight = (x: number, y: number): number => {
      const dx = x - ocx;
      const dy = y - ocy;
      const alongProj = dx * cosA + dy * sinA;
      const acrossProj = -dx * sinA + dy * cosA;

      // Gabled profile: slopes from eave to ridge across width
      const tAcross = 1 - Math.abs(acrossProj) / halfWidth;
      const gabledH = h * Math.max(0, tAcross);

      // Hipped profile at ends
      const tAlong = (halfLength - Math.abs(alongProj)) / halfWidth;
      const hippedH = h * Math.max(0, Math.min(tAcross, tAlong));

      // Blend: bottom (1-HIP_FRACTION) is pure gabled, top HIP_FRACTION is hipped
      return Math.max(hippedH, gabledH * (1 - this.HIP_FRACTION));
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

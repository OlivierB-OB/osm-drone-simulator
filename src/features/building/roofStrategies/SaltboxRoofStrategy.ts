import type { BufferGeometry } from 'three';
import type { IRoofGeometryStrategy, RoofParams } from './types';
import {
  computeOBB,
  normalizeRing,
  buildOutlineRoofGeometry,
} from './roofGeometryUtils';

export class SaltboxRoofStrategy implements IRoofGeometryStrategy {
  private readonly RIDGE_OFFSET_FRACTION = 0.3;

  create(params: RoofParams): BufferGeometry {
    const ring = params.outerRing;
    const h = params.roofHeight;
    const obb = computeOBB(ring);
    const { count, isCCW } = normalizeRing(ring);

    // Ridge offset: clamp to at most 90% of halfWidth
    const ridgeOffset = Math.min(
      obb.halfWidth * this.RIDGE_OFFSET_FRACTION,
      obb.halfWidth * 0.9
    );
    const halfWidthShort = obb.halfWidth - ridgeOffset; // steep side (+across)
    const halfWidthLong = obb.halfWidth + ridgeOffset; // gentle side (-across)

    const acrossX = -Math.sin(params.ridgeAngle);
    const acrossY = Math.cos(params.ridgeAngle);

    const computeHeight = (x: number, y: number): number => {
      const proj = x * acrossX + y * acrossY;
      if (proj >= ridgeOffset) {
        return h * Math.max(0, 1 - (proj - ridgeOffset) / halfWidthShort);
      }
      return h * Math.max(0, 1 - (ridgeOffset - proj) / halfWidthLong);
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

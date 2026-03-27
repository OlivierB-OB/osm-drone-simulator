import type { BufferGeometry } from 'three';
import type { IRoofGeometryStrategy, RoofParams } from './types';
import {
  computeOBB,
  normalizeRing,
  buildOutlineRoofGeometry,
} from './roofGeometryUtils';
import { PyramidalRoofStrategy } from './PyramidalRoofStrategy';

/**
 * Mansard roof: four-sided, each side has two slopes (steep lower + shallow upper).
 * The four-sided analog of a gambrel. Common on Haussmann-era Parisian buildings.
 *
 * Uses outline-based triangulation with a piecewise height function based on
 * distance from nearest OBB edge.
 */
export class MansardRoofStrategy implements IRoofGeometryStrategy {
  private readonly BREAK_HEIGHT_FRACTION = 0.6;
  private readonly BREAK_INSET_FRACTION = 0.4;
  private readonly TOP_INSET_FRACTION = 0.15;

  create(params: RoofParams): BufferGeometry {
    const ring = params.outerRing;
    const h = params.roofHeight;
    const obb = computeOBB(ring);
    const { count, isCCW } = normalizeRing(ring);

    const halfLength = obb.halfLength;
    const halfWidth = obb.halfWidth;
    const breakH = h * this.BREAK_HEIGHT_FRACTION;
    const breakInset = halfWidth * this.BREAK_INSET_FRACTION;
    const topInset = halfWidth * this.TOP_INSET_FRACTION;

    // Guard: if break inset collapses the OBB, fall back to pyramidal
    if (breakInset >= Math.min(halfLength, halfWidth)) {
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

      // Distance from nearest OBB edge
      const acrossDist = halfWidth - Math.abs(acrossProj);
      const alongDist = halfLength - Math.abs(alongProj);
      const edgeDist = Math.min(acrossDist, alongDist);

      if (edgeDist <= 0) return 0;
      if (edgeDist <= breakInset) {
        // Steep lower section
        return breakH * (edgeDist / breakInset);
      }
      if (edgeDist <= breakInset + topInset) {
        // Shallow upper section
        return breakH + (h - breakH) * ((edgeDist - breakInset) / topInset);
      }
      // Flat top plateau
      return h;
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

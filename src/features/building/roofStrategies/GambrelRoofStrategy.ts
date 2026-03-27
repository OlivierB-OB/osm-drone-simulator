import type { BufferGeometry } from 'three';
import type { IRoofGeometryStrategy, RoofParams } from './types';
import {
  computeOBB,
  normalizeRing,
  buildOutlineRoofGeometry,
} from './roofGeometryUtils';

/**
 * Gambrel roof: barn-style, two slope zones per side of the ridge.
 * Each side has a steep lower section rising to a break line, then a
 * shallower upper section rising to the central ridge.
 *
 * Uses outline-based triangulation with a piecewise height function.
 */
export class GambrelRoofStrategy implements IRoofGeometryStrategy {
  private readonly BREAK_HEIGHT_FRACTION = 0.5;
  private readonly BREAK_WIDTH_FRACTION = 0.6;

  create(params: RoofParams): BufferGeometry {
    const ring = params.outerRing;
    const h = params.roofHeight;
    const obb = computeOBB(ring);
    const { count, isCCW } = normalizeRing(ring);

    const halfWidth = obb.halfWidth;
    const breakH = h * this.BREAK_HEIGHT_FRACTION;
    const breakWidthFrac = Math.min(this.BREAK_WIDTH_FRACTION, 1 - 0.01 / halfWidth);

    const acrossX = -Math.sin(params.ridgeAngle);
    const acrossY = Math.cos(params.ridgeAngle);

    const computeHeight = (x: number, y: number): number => {
      const proj = x * acrossX + y * acrossY;
      const tAcross = Math.abs(proj) / halfWidth; // 0=ridge, 1=eave
      if (tAcross <= breakWidthFrac) {
        // Upper shallow section: h → breakH
        return h - (h - breakH) * (tAcross / breakWidthFrac);
      }
      // Lower steep section: breakH → 0
      return breakH * Math.max(0, 1 - (tAcross - breakWidthFrac) / (1 - breakWidthFrac));
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

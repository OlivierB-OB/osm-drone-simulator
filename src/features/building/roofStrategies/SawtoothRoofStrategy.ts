import { BufferGeometry } from 'three';
import type { IRoofGeometryStrategy, RoofParams } from './types';
import {
  computeOBB,
  normalizeRing,
  buildOutlineRoofGeometry,
} from './roofGeometryUtils';

/**
 * Sawtooth roof: N parallel skillion bays repeated across the building width.
 * Each bay has a slope rising from 0 to roofHeight across its width.
 *
 * Uses outline-based triangulation with a modular height function.
 */
export class SawtoothRoofStrategy implements IRoofGeometryStrategy {
  private readonly BAY_WIDTH_METERS = 5;
  private readonly MIN_BAYS = 2;
  private readonly MAX_BAYS = 20;

  create(params: RoofParams): BufferGeometry {
    const ring = params.outerRing;
    const h = params.roofHeight;
    const obb = computeOBB(ring);
    const { count, isCCW } = normalizeRing(ring);

    const hW = obb.halfWidth;
    if (hW < 1e-3) return new BufferGeometry();

    const N = Math.min(
      this.MAX_BAYS,
      Math.max(this.MIN_BAYS, Math.floor((hW * 2) / this.BAY_WIDTH_METERS))
    );
    const bayWidth = (hW * 2) / N;

    const acrossX = -Math.sin(params.ridgeAngle);
    const acrossY = Math.cos(params.ridgeAngle);

    const computeHeight = (x: number, y: number): number => {
      const proj = x * acrossX + y * acrossY;
      // Map projection to position within bay (0..1)
      const acrossPos = proj + hW; // 0..2*hW
      const bayPos = ((acrossPos % bayWidth) + bayWidth) % bayWidth; // handle negatives
      return h * (bayPos / bayWidth);
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

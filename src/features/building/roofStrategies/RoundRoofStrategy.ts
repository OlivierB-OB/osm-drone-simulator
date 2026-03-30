import type { BufferGeometry } from 'three';
import type { IRoofGeometryStrategy, RoofParams } from './types';
import {
  computeOBB,
  normalizeRing,
  buildOutlineRoofGeometry,
  enrichRingWithSubdivisions,
} from './roofGeometryUtils';

/**
 * Round (barrel vault) roof: semi-elliptical cross-section across the shorter
 * building axis. Uses ring enrichment to produce visible curvature.
 *
 * Height = roofHeight * sqrt(1 - (acrossProj/halfWidth)^2)
 */
export class RoundRoofStrategy implements IRoofGeometryStrategy {
  create(params: RoofParams): BufferGeometry {
    const { outerRing, innerRings, roofHeight: h } = params;
    const obb = computeOBB(outerRing);

    // Barrel spans the shorter dimension
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
      const t = proj / halfWidth;
      if (Math.abs(t) >= 1) return 0;
      return h * Math.sqrt(1 - t * t);
    };

    // Enrich outer ring with subdivision vertices
    const { count: outerCount, isCCW } = normalizeRing(outerRing);
    const enrichedOuter = enrichRingWithSubdivisions(
      outerRing,
      outerCount,
      acrossX,
      acrossY,
      halfWidth
    );
    const outerHeights = new Float64Array(enrichedOuter.length);
    for (let i = 0; i < enrichedOuter.length; i++) {
      outerHeights[i] = computeHeight(
        enrichedOuter[i]![0],
        enrichedOuter[i]![1]
      );
    }

    // Enrich inner rings
    let enrichedInners: [number, number][][] | undefined;
    let innerHeights: Float64Array[] | undefined;
    if (innerRings && innerRings.length > 0) {
      enrichedInners = [];
      innerHeights = [];
      for (const inner of innerRings) {
        const { count: ic } = normalizeRing(inner);
        const enriched = enrichRingWithSubdivisions(
          inner,
          ic,
          acrossX,
          acrossY,
          halfWidth
        );
        enrichedInners.push(enriched);
        const hArr = new Float64Array(enriched.length);
        for (let i = 0; i < enriched.length; i++) {
          hArr[i] = computeHeight(enriched[i]![0], enriched[i]![1]);
        }
        innerHeights.push(hArr);
      }
    }

    return buildOutlineRoofGeometry(
      enrichedOuter,
      outerHeights,
      isCCW,
      enrichedOuter.length,
      enrichedInners,
      innerHeights
    );
  }
}

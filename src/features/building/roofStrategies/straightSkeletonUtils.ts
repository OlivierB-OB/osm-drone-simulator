import { SkeletonBuilder } from 'straight-skeleton';
import { normalizeRing } from './roofGeometryUtils';

export interface SkeletonResult {
  vertices: [number, number, number?][];
  polygons: number[][];
}

let _ready = false;
// Kick off WASM init at module import time — done before tiles are processed.
SkeletonBuilder.init().then(() => {
  _ready = true;
});

export function isSkeletonReady(): boolean {
  return _ready;
}

/**
 * Builds the straight skeleton of a building footprint.
 * Input rings are in local Mercator XY coordinates.
 * Returns null on invalid input or if the skeleton library fails.
 *
 * Input format required by straight-skeleton:
 * - First ring: CCW winding, closed (last === first)
 * - Remaining rings (holes): CW winding, closed
 */
export function buildSkeleton(
  outerRing: [number, number][],
  innerRings?: [number, number][][]
): SkeletonResult | null {
  const { isCCW: outerIsCCW } = normalizeRing(outerRing);
  const outerOrdered = outerIsCCW ? outerRing : [...outerRing].reverse();
  // Ensure closed (last === first)
  const outerClosed: [number, number][] =
    outerOrdered[0]![0] === outerOrdered[outerOrdered.length - 1]![0] &&
    outerOrdered[0]![1] === outerOrdered[outerOrdered.length - 1]![1]
      ? (outerOrdered as [number, number][])
      : [...outerOrdered, outerOrdered[0]!];

  const rings: [number, number][][] = [outerClosed];

  if (innerRings) {
    for (const inner of innerRings) {
      const { isCCW: innerIsCCW } = normalizeRing(inner);
      // Holes must be CW
      const cwRing = innerIsCCW ? [...inner].reverse() : inner;
      const closed: [number, number][] =
        cwRing[0]![0] === cwRing[cwRing.length - 1]![0] &&
        cwRing[0]![1] === cwRing[cwRing.length - 1]![1]
          ? (cwRing as [number, number][])
          : [...cwRing, cwRing[0]!];
      rings.push(closed);
    }
  }

  try {
    const result = SkeletonBuilder.buildFromPolygon(
      rings as [number, number][][]
    );
    return result as SkeletonResult | null;
  } catch {
    return null;
  }
}

/**
 * Returns the scale factor to convert skeleton shrink distances (z values)
 * into actual roof heights.
 */
export function skeletonHeightScale(
  result: SkeletonResult,
  roofHeight: number
): number {
  let maxZ = 0;
  for (const v of result.vertices) {
    const z = v[2] ?? 0;
    if (z > maxZ) maxZ = z;
  }
  return maxZ > 0 ? roofHeight / maxZ : 0;
}

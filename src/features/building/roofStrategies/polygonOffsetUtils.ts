import { inflatePaths, JoinType, EndType } from '@countertype/clipper2-ts';

/**
 * Insets (shrinks) a polygon ring by the given distance.
 * Returns the inset ring, or null if the polygon collapses entirely.
 *
 * Used by future mansard and gambrel roof strategies to compute break lines.
 *
 * @param ring     Outer ring vertices as [x, y][]
 * @param distance Positive inset distance in meters
 */
export function insetPolygon(
  ring: [number, number][],
  distance: number
): [number, number][] | null {
  if (distance <= 0 || ring.length < 3) return null;

  const path = ring.map(([x, y]) => ({ x, y }));

  const result = inflatePaths(
    [path],
    -distance,
    JoinType.Miter,
    EndType.Polygon
  );

  if (!result || result.length === 0 || result[0]!.length < 3) return null;

  return result[0]!.map((p) => [p.x, p.y] as [number, number]);
}

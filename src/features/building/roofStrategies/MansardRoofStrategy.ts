import { BufferGeometry, Float32BufferAttribute } from 'three';
import type { IRoofGeometryStrategy, RoofParams } from './types';
import { computeOBB, normalizeRing } from './roofGeometryUtils';
import { insetPolygon } from './polygonOffsetUtils';
import { PyramidalRoofStrategy } from './PyramidalRoofStrategy';

/**
 * Mansard roof: four-sided, each side has two slopes (steep lower + shallow upper).
 * The four-sided analog of a gambrel. Common on Haussmann-era Parisian buildings.
 *
 * Algorithm:
 *  1. Compute break polygon via polygon inset (breakInset = halfWidth * 0.35)
 *  2. Compute top/plateau polygon via further polygon inset (topInset = halfWidth * 0.70)
 *  3. Stitch outer ring → break ring (lower slope, Y: 0 → breakH)
 *  4. Stitch break ring → top ring (upper slope, Y: breakH → roofH), or fan to apex if collapsed
 *  5. Triangulate plateau face at Y=roofH
 */
export class MansardRoofStrategy implements IRoofGeometryStrategy {
  private readonly BREAK_INSET_FRACTION = 0.35;
  private readonly BREAK_HEIGHT_FRACTION = 0.6;
  private readonly TOP_INSET_FRACTION = 0.7;

  create(params: RoofParams): BufferGeometry {
    const ring = params.outerRing;
    const { count } = normalizeRing(ring);
    const h = params.roofHeight;

    if (count < 3) return new BufferGeometry();

    const obb = computeOBB(ring);
    const halfWidth = Math.min(obb.halfLength, obb.halfWidth);
    const breakInset = halfWidth * this.BREAK_INSET_FRACTION;
    const breakH = h * this.BREAK_HEIGHT_FRACTION;

    const outerVerts = ring.slice(0, count);

    const breakRing = insetPolygon(outerVerts, breakInset);
    if (!breakRing || breakRing.length < 3) {
      return new PyramidalRoofStrategy().create(params);
    }

    const topInset = halfWidth * this.TOP_INSET_FRACTION;
    const topRing =
      topInset > breakInset ? insetPolygon(outerVerts, topInset) : null;

    const positions: number[] = [];

    // Lower slope: outer ring (Y=0) → break ring (Y=breakH)
    stitchRings(positions, outerVerts, 0, breakRing, breakH);

    if (topRing && topRing.length >= 3) {
      // Upper slope: break ring (Y=breakH) → top ring (Y=h)
      stitchRings(positions, breakRing, breakH, topRing, h);
      // Plateau face at Y=h
      writePlateau(positions, topRing, h);
    } else {
      // Top ring collapsed: upper slopes fan to centroid apex
      const cx = breakRing.reduce((s, v) => s + v[0], 0) / breakRing.length;
      const cy = breakRing.reduce((s, v) => s + v[1], 0) / breakRing.length;
      fanToApex(positions, breakRing, breakH, [cx, cy], h);
    }

    const geom = new BufferGeometry();
    geom.setAttribute(
      'position',
      new Float32BufferAttribute(new Float32Array(positions), 3)
    );
    geom.computeVertexNormals();
    return geom;
  }
}

// ---------------------------------------------------------------------------
// Ring stitching — minimum-diagonal zipper algorithm
// ---------------------------------------------------------------------------

/**
 * Stitches two closed polygon rings with triangles to form an annular slope band.
 * Both rings must share the same winding direction (CCW).
 * Uses the minimum-diagonal heuristic: at each step, advance the ring whose
 * next edge would create the shorter diagonal.
 * Total triangles created = outerRing.length + innerRing.length.
 */
function stitchRings(
  out: number[],
  outerRing: [number, number][],
  outerH: number,
  innerRing: [number, number][],
  innerH: number
): void {
  const n = outerRing.length;
  const m = innerRing.length;
  if (n < 2 || m < 2) return;

  // Find alignment: inner vertex closest to outer[0]
  let j0 = 0;
  let bestDist = Infinity;
  for (let j = 0; j < m; j++) {
    const dx = innerRing[j]![0] - outerRing[0]![0];
    const dy = innerRing[j]![1] - outerRing[0]![1];
    const d = dx * dx + dy * dy;
    if (d < bestDist) {
      bestDist = d;
      j0 = j;
    }
  }

  const getO = (k: number): [number, number] => outerRing[k % n]!;
  const getI = (k: number): [number, number] => innerRing[(k + j0) % m]!;

  let i = 0; // outer ring cursor (0..n)
  let j = 0; // inner ring cursor (0..m)
  const total = n + m;

  for (let step = 0; step < total; step++) {
    const canAdvI = i < n;
    const canAdvJ = j < m;

    if (!canAdvI && !canAdvJ) break;

    let advI: boolean;
    if (!canAdvI) {
      advI = false;
    } else if (!canAdvJ) {
      advI = true;
    } else {
      // Minimum diagonal: advance whichever creates the shorter cross-diagonal
      const d1 = dist2(getO(i + 1), getI(j)); // diagonal after advancing i
      const d2 = dist2(getO(i), getI(j + 1)); // diagonal after advancing j
      advI = d1 <= d2;
    }

    if (advI) {
      writeTri(out, getO(i), outerH, getI(j), innerH, getO(i + 1), outerH);
      i++;
    } else {
      writeTri(out, getO(i), outerH, getI(j + 1), innerH, getI(j), innerH);
      j++;
    }
  }
}

// ---------------------------------------------------------------------------
// Face geometry helpers
// ---------------------------------------------------------------------------

function writePlateau(
  out: number[],
  ring: [number, number][],
  h: number
): void {
  if (ring.length < 3) return;
  const p0 = ring[0]!;
  for (let k = 1; k + 1 < ring.length; k++) {
    writeTri(out, p0, h, ring[k]!, h, ring[k + 1]!, h);
  }
}

function fanToApex(
  out: number[],
  ring: [number, number][],
  ringH: number,
  apex: [number, number],
  apexH: number
): void {
  const n = ring.length;
  for (let i = 0; i < n; i++) {
    writeTri(out, ring[i]!, ringH, ring[(i + 1) % n]!, ringH, apex, apexH);
  }
}

/**
 * Writes a single triangle, ensuring the winding produces an upward-facing normal.
 * Uses the 2D cross product: if CCW in XY (cross > 0), normal.y > 0 in Three.js space.
 */
function writeTri(
  out: number[],
  p0: [number, number],
  h0: number,
  p1: [number, number],
  h1: number,
  p2: [number, number],
  h2: number
): void {
  const cross =
    (p1[0] - p0[0]) * (p2[1] - p0[1]) - (p1[1] - p0[1]) * (p2[0] - p0[0]);
  if (Math.abs(cross) < 1e-10) return; // degenerate
  if (cross > 0) {
    out.push(p0[0], h0, -p0[1], p1[0], h1, -p1[1], p2[0], h2, -p2[1]);
  } else {
    out.push(p0[0], h0, -p0[1], p2[0], h2, -p2[1], p1[0], h1, -p1[1]);
  }
}

function dist2(a: [number, number], b: [number, number]): number {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  return dx * dx + dy * dy;
}

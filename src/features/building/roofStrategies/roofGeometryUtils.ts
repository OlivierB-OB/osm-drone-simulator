import {
  BufferGeometry,
  Float32BufferAttribute,
  ShapeUtils,
  Vector2,
} from 'three';
import type { OBB } from './types';

export interface RidgeLine {
  start: [number, number];
  end: [number, number];
}

/**
 * Computes the oriented bounding box of a polygon ring by finding the
 * longest edge and projecting all vertices onto that axis.
 */
export function computeOBB(ring: [number, number][]): OBB {
  const count =
    ring.length > 0 &&
    ring[0]![0] === ring[ring.length - 1]![0] &&
    ring[0]![1] === ring[ring.length - 1]![1]
      ? ring.length - 1
      : ring.length;

  // Find longest edge to determine primary axis
  let longestSq = 0;
  let ax = 1;
  let ay = 0;
  for (let i = 0; i < count; i++) {
    const j = (i + 1) % count;
    const dx = ring[j]![0] - ring[i]![0];
    const dy = ring[j]![1] - ring[i]![1];
    const lenSq = dx * dx + dy * dy;
    if (lenSq > longestSq) {
      longestSq = lenSq;
      const len = Math.sqrt(lenSq);
      ax = dx / len;
      ay = dy / len;
    }
  }

  // Perpendicular axis
  const bx = -ay;
  const by = ax;

  // Project all vertices onto both axes
  let minA = Infinity,
    maxA = -Infinity;
  let minB = Infinity,
    maxB = -Infinity;
  for (let i = 0; i < count; i++) {
    const px = ring[i]![0];
    const py = ring[i]![1];
    const projA = px * ax + py * ay;
    const projB = px * bx + py * by;
    if (projA < minA) minA = projA;
    if (projA > maxA) maxA = projA;
    if (projB < minB) minB = projB;
    if (projB > maxB) maxB = projB;
  }

  const halfLength = (maxA - minA) / 2;
  const halfWidth = (maxB - minB) / 2;
  const centerA = (minA + maxA) / 2;
  const centerB = (minB + maxB) / 2;

  return {
    center: [centerA * ax + centerB * bx, centerA * ay + centerB * by],
    halfLength,
    halfWidth,
    angle: Math.atan2(ay, ax),
  };
}

/**
 * Resolves the ridge direction angle in local Mercator radians.
 *
 * Priority:
 * 1. roof:direction (compass degrees) → converted to local Mercator radians
 * 2. roof:orientation=across → OBB angle + 90°
 * 3. Default (along) → OBB angle
 */
export function resolveRidgeAngle(
  obbAngle: number,
  roofDirection?: number,
  roofOrientation?: 'along' | 'across'
): number {
  if (roofDirection !== undefined) {
    // Compass degrees (0=North, CW) → local Mercator radians (0=+X East, CCW)
    return Math.PI / 2 - (roofDirection * Math.PI) / 180;
  }
  if (roofOrientation === 'across') {
    return obbAngle + Math.PI / 2;
  }
  return obbAngle;
}

/**
 * Returns the 4 OBB corner positions in Three.js XZ space (Y=0) for a given
 * OBB and ridge angle. Corner order:
 *   [0]: +along, +across (C0)
 *   [1]: +along, -across (C1)
 *   [2]: -along, -across (C2)
 *   [3]: -along, +across (C3)
 *
 * Along-ridge Three.js XZ: (cos, -sin)
 * Across-ridge Three.js XZ: (-sin, -cos)
 */
export function getOBBCorners(
  obb: OBB,
  ridgeAngle: number
): [number, number, number][] {
  const cos = Math.cos(ridgeAngle);
  const sin = Math.sin(ridgeAngle);
  const cx = obb.center[0];
  const cz = -obb.center[1]; // Three.js Z = -Mercator Y
  const hL = obb.halfLength;
  const hW = obb.halfWidth;
  return [
    [cx + hL * cos - hW * sin, 0, cz - hL * sin - hW * cos], // C0: +along +across
    [cx + hL * cos + hW * sin, 0, cz - hL * sin + hW * cos], // C1: +along -across
    [cx - hL * cos + hW * sin, 0, cz + hL * sin + hW * cos], // C2: -along -across
    [cx - hL * cos - hW * sin, 0, cz + hL * sin - hW * cos], // C3: -along +across
  ];
}

/**
 * Returns the distance from the polygon centroid (origin) to the polygon
 * boundary in direction `theta` (radians, Mercator XY plane).
 * Ring vertices are centroid-relative: [mercX, mercY].
 * Falls back to OBB half-extent if no intersection is found (concave edge case).
 */
export function polygonExtentAtAngle(
  ring: [number, number][],
  theta: number
): number {
  const dx = Math.cos(theta);
  const dz = Math.sin(theta);
  let best = Infinity;
  for (let i = 0; i < ring.length; i++) {
    const [ax, ay] = ring[i]!;
    const [bx, by] = ring[(i + 1) % ring.length]!;
    const ex = bx - ax;
    const ey = by - ay;
    const denom = dx * ey - dz * ex;
    if (Math.abs(denom) < 1e-10) continue;
    const t = (ax * ey - ay * ex) / denom;
    const s = (ax * dz - ay * dx) / denom;
    if (t > 0 && s >= 0 && s <= 1) best = Math.min(best, t);
  }
  if (isFinite(best)) return best;
  // Fallback: OBB half-extent
  const obb = computeOBB(ring);
  const localTheta = theta - obb.angle;
  return Math.sqrt(
    Math.pow(obb.halfLength * Math.cos(localTheta), 2) +
      Math.pow(obb.halfWidth * Math.sin(localTheta), 2)
  );
}

/**
 * Normalizes a polygon ring: detects closed-ring (last==first) and winding
 * direction (CCW vs CW via shoelace formula).
 */
export function normalizeRing(ring: [number, number][]): {
  count: number;
  isCCW: boolean;
} {
  const isClosedRing =
    ring.length > 1 &&
    ring[0]![0] === ring[ring.length - 1]![0] &&
    ring[0]![1] === ring[ring.length - 1]![1];
  const count = isClosedRing ? ring.length - 1 : ring.length;

  let signedArea = 0;
  for (let i = 0; i < count; i++) {
    const j = (i + 1) % count;
    signedArea += ring[i]![0] * ring[j]![1] - ring[j]![0] * ring[i]![1];
  }
  return { count, isCCW: signedArea > 0 };
}

/**
 * Converts ring vertices to Vector2 contour and inner rings to Vector2 holes
 * for use with ShapeUtils.triangulateShape.
 */
export function prepareContourAndHoles(
  ring: [number, number][],
  count: number,
  innerRings?: [number, number][][]
): { contour: Vector2[]; holes: Vector2[][] } {
  const contour: Vector2[] = [];
  for (let i = 0; i < count; i++) {
    contour.push(new Vector2(ring[i]![0], ring[i]![1]));
  }
  const holes: Vector2[][] = [];
  if (innerRings) {
    for (const inner of innerRings) {
      const { count: hCount } = normalizeRing(inner);
      const hole: Vector2[] = [];
      for (let i = 0; i < hCount; i++) {
        hole.push(new Vector2(inner[i]![0], inner[i]![1]));
      }
      holes.push(hole);
    }
  }
  return { contour, holes };
}

/**
 * Builds a complete roof BufferGeometry from an outline ring, per-vertex heights,
 * and optional inner rings (holes). Handles triangulation, top face, and side walls.
 *
 * This is the shared implementation pattern used by all outline-based roof strategies.
 * Each strategy only needs to compute the `heights` array.
 */
export function buildOutlineRoofGeometry(
  ring: [number, number][],
  heights: Float64Array,
  isCCW: boolean,
  count: number,
  innerRings?: [number, number][][],
  innerHeights?: Float64Array[]
): BufferGeometry {
  const { contour, holes } = prepareContourAndHoles(ring, count, innerRings);
  const triangles = ShapeUtils.triangulateShape(contour, holes);

  // Collect all rings and their heights for wall generation
  const allRings: {
    ring: [number, number][];
    heights: Float64Array;
    count: number;
    isInner: boolean;
  }[] = [{ ring, heights, count, isInner: false }];
  if (innerRings && innerHeights) {
    for (let r = 0; r < innerRings.length; r++) {
      const { count: hCount } = normalizeRing(innerRings[r]!);
      allRings.push({
        ring: innerRings[r]!,
        heights: innerHeights[r]!,
        count: hCount,
        isInner: true,
      });
    }
  }

  // Build combined vertex array for contour + holes (for triangle index lookup)
  const allVertices: [number, number][] = [];
  const allHeightValues: number[] = [];
  for (let i = 0; i < count; i++) {
    allVertices.push(ring[i]!);
    allHeightValues.push(heights[i]!);
  }
  if (innerRings && innerHeights) {
    for (let r = 0; r < innerRings.length; r++) {
      const { count: hCount } = normalizeRing(innerRings[r]!);
      for (let i = 0; i < hCount; i++) {
        allVertices.push(innerRings[r]![i]!);
        allHeightValues.push(innerHeights[r]![i]!);
      }
    }
  }

  // Count triangles
  const topTriCount = triangles.length;
  let sideTriCount = 0;
  for (const entry of allRings) sideTriCount += entry.count * 2;
  const totalVertices = (topTriCount + sideTriCount) * 3;
  const positions = new Float32Array(totalVertices * 3);
  let o = 0;

  // Top face
  for (const tri of triangles) {
    for (const idx of tri) {
      const v = allVertices[idx]!;
      const h = allHeightValues[idx]!;
      positions[o++] = v[0];
      positions[o++] = h;
      positions[o++] = -v[1];
    }
  }

  // Side walls for each ring
  for (const entry of allRings) {
    // Inner rings have opposite winding for outward-facing normals
    const outward = entry.isInner ? !isCCW : isCCW;
    for (let i = 0; i < entry.count; i++) {
      const j = (i + 1) % entry.count;
      const a = outward ? i : j;
      const b = outward ? j : i;

      // Triangle 1: base[a] → base[b] → roof[b]
      positions[o++] = entry.ring[a]![0];
      positions[o++] = 0;
      positions[o++] = -entry.ring[a]![1];
      positions[o++] = entry.ring[b]![0];
      positions[o++] = 0;
      positions[o++] = -entry.ring[b]![1];
      positions[o++] = entry.ring[b]![0];
      positions[o++] = entry.heights[b]!;
      positions[o++] = -entry.ring[b]![1];

      // Triangle 2: base[a] → roof[b] → roof[a]
      positions[o++] = entry.ring[a]![0];
      positions[o++] = 0;
      positions[o++] = -entry.ring[a]![1];
      positions[o++] = entry.ring[b]![0];
      positions[o++] = entry.heights[b]!;
      positions[o++] = -entry.ring[b]![1];
      positions[o++] = entry.ring[a]![0];
      positions[o++] = entry.heights[a]!;
      positions[o++] = -entry.ring[a]![1];
    }
  }

  const geom = new BufferGeometry();
  geom.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geom.computeVertexNormals();
  return geom;
}

// ---------------------------------------------------------------------------
// Minimum Bounding Circle (Welzl's algorithm)
// ---------------------------------------------------------------------------

type P2 = [number, number];
interface MBC {
  center: [number, number];
  radius: number;
}

function trivialMBC(R: P2[]): MBC {
  if (R.length === 0) return { center: [0, 0], radius: 0 };
  if (R.length === 1) return { center: [R[0]![0], R[0]![1]], radius: 0 };
  if (R.length === 2) {
    const cx = (R[0]![0] + R[1]![0]) / 2;
    const cy = (R[0]![1] + R[1]![1]) / 2;
    return {
      center: [cx, cy],
      radius: Math.hypot(R[0]![0] - cx, R[0]![1] - cy),
    };
  }
  // 3 points: circumcircle
  const [a, b, c] = [R[0]!, R[1]!, R[2]!];
  const ax = b[0] - a[0],
    ay = b[1] - a[1];
  const bx = c[0] - a[0],
    by = c[1] - a[1];
  const D = 2 * (ax * by - ay * bx);
  if (Math.abs(D) < 1e-10) {
    // Collinear: diameter of the longest-span pair
    const dab = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const dbc = Math.hypot(c[0] - b[0], c[1] - b[1]);
    const dac = Math.hypot(c[0] - a[0], c[1] - a[1]);
    if (dab >= dbc && dab >= dac)
      return {
        center: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2],
        radius: dab / 2,
      };
    if (dbc >= dac)
      return {
        center: [(b[0] + c[0]) / 2, (b[1] + c[1]) / 2],
        radius: dbc / 2,
      };
    return { center: [(a[0] + c[0]) / 2, (a[1] + c[1]) / 2], radius: dac / 2 };
  }
  const sq_a = ax * ax + ay * ay,
    sq_b = bx * bx + by * by;
  const ux = (by * sq_a - ay * sq_b) / D;
  const uy = (ax * sq_b - bx * sq_a) / D;
  return { center: [a[0] + ux, a[1] + uy], radius: Math.hypot(ux, uy) };
}

function welzlRec(pts: P2[], n: number, R: P2[]): MBC {
  if (n === 0 || R.length === 3) return trivialMBC(R);
  const p = pts[n - 1]!;
  const d = welzlRec(pts, n - 1, R);
  const dx = p[0] - d.center[0],
    dy = p[1] - d.center[1];
  if (dx * dx + dy * dy <= d.radius * d.radius + 1e-10) return d;
  return welzlRec(pts, n - 1, [...R, p]);
}

/**
 * Computes the minimum bounding circle (smallest enclosing circle) of a polygon
 * ring using Welzl's randomized algorithm (O(n) expected time).
 * Inner holes are not considered; pass only the outer ring.
 */
export function computeMinBoundingCircle(ring: [number, number][]): {
  center: [number, number];
  radius: number;
} {
  if (ring.length === 0) return { center: [0, 0], radius: 0 };
  const isClose =
    ring.length > 1 &&
    ring[0]![0] === ring[ring.length - 1]![0] &&
    ring[0]![1] === ring[ring.length - 1]![1];
  const pts: P2[] = (isClose ? ring.slice(0, -1) : ring).slice() as P2[];
  for (let i = pts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pts[i], pts[j]] = [pts[j]!, pts[i]!];
  }
  return welzlRec(pts, pts.length, []);
}

// ---------------------------------------------------------------------------
// Gabled roof helpers
// ---------------------------------------------------------------------------

/**
 * Classifies a building footprint as 'rectangular' (suitable for OBB fast path)
 * or 'complex' (requires straight skeleton).
 *
 * A footprint is rectangular if every vertex lies within `threshold` meters of
 * its nearest OBB edge.
 */
export function classifyFootprintComplexity(
  ring: [number, number][],
  obb: OBB,
  threshold = 0.5
): 'rectangular' | 'complex' {
  const cos = Math.cos(obb.angle);
  const sin = Math.sin(obb.angle);
  const cx = obb.center[0];
  const cy = obb.center[1];

  for (const [px, py] of ring) {
    const dx = px - cx;
    const dy = py - cy;
    const localA = dx * cos + dy * sin; // along-ridge projection
    const localB = -dx * sin + dy * cos; // across-ridge projection

    // Distance from nearest OBB edge (axis-aligned in OBB frame)
    const distA = Math.abs(Math.abs(localA) - obb.halfLength);
    const distB = Math.abs(Math.abs(localB) - obb.halfWidth);
    const minDist = Math.min(distA, distB);

    if (minDist > threshold) return 'complex';
  }
  return 'rectangular';
}

/**
 * Computes the ridge line endpoints for an OBB-based gabled roof.
 * Ridge runs along the OBB's long axis (ridgeAngle direction).
 */
export function computeRidgeLine(obb: OBB, ridgeAngle: number): RidgeLine {
  const cos = Math.cos(ridgeAngle);
  const sin = Math.sin(ridgeAngle);
  return {
    start: [
      obb.center[0] + obb.halfLength * cos,
      obb.center[1] + obb.halfLength * sin,
    ],
    end: [
      obb.center[0] - obb.halfLength * cos,
      obb.center[1] - obb.halfLength * sin,
    ],
  };
}

/**
 * Partitions ring vertex indices into two groups by their projection onto the
 * across-ridge axis: positive-side (left) and negative-side (right).
 *
 * Vertices exactly on the centreline (|proj| < 1e-9) are assigned to `left`.
 */
export function partitionVerticesBySide(
  ring: [number, number][],
  count: number,
  ridgeAngle: number
): { left: number[]; right: number[] } {
  const acrossX = -Math.sin(ridgeAngle);
  const acrossY = Math.cos(ridgeAngle);
  const left: number[] = [];
  const right: number[] = [];
  for (let i = 0; i < count; i++) {
    const proj = ring[i]![0] * acrossX + ring[i]![1] * acrossY;
    if (proj >= 0) {
      left.push(i);
    } else {
      right.push(i);
    }
  }
  return { left, right };
}

// ---------------------------------------------------------------------------
// Round roof helpers: edge subdivision for barrel vault curvature
// ---------------------------------------------------------------------------

const N_ARC_SEGMENTS = 8;

/**
 * Inserts subdivision vertices into a polygon ring at evenly-spaced
 * across-ridge positions so that the semi-ellipse height formula produces
 * visible curvature (rather than a flat quad for a 4-vertex building).
 *
 * Returns an open ring (no closing duplicate) with N_ARC_SEGMENTS-1 interior
 * subdivision lines inserted wherever a footprint edge crosses them.
 */
export function enrichRingWithSubdivisions(
  ring: [number, number][],
  count: number,
  acrossX: number,
  acrossY: number,
  halfWidth: number
): [number, number][] {
  // Interior across-values: skip ±halfWidth (those are the eave extremes)
  const values: number[] = [];
  for (let k = 1; k < N_ARC_SEGMENTS; k++) {
    values.push(halfWidth * (-1 + (2 * k) / N_ARC_SEGMENTS));
  }

  const result: [number, number][] = [];
  for (let i = 0; i < count; i++) {
    const p1 = ring[i]!;
    const p2 = ring[(i + 1) % count]!;
    result.push(p1);

    const proj1 = p1[0] * acrossX + p1[1] * acrossY;
    const proj2 = p2[0] * acrossX + p2[1] * acrossY;
    const dProj = proj2 - proj1;
    if (Math.abs(dProj) < 1e-10) continue;

    const hits: { t: number; pt: [number, number] }[] = [];
    for (const v of values) {
      const t = (v - proj1) / dProj;
      if (t <= 0 || t >= 1) continue;
      hits.push({
        t,
        pt: [p1[0] + t * (p2[0] - p1[0]), p1[1] + t * (p2[1] - p1[1])],
      });
    }
    hits.sort((a, b) => a.t - b.t);
    for (const h of hits) result.push(h.pt);
  }
  return result;
}

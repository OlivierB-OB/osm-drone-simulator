import { BufferGeometry, Float32BufferAttribute } from 'three';
import type { IRoofGeometryStrategy, RoofParams } from './types';
import type { OBB } from './types';
import {
  normalizeRing,
  computeOBB,
  classifyFootprintComplexity,
} from './roofGeometryUtils';
import type { RidgeLine } from './roofGeometryUtils';
import { isSkeletonReady, buildSkeleton } from './straightSkeletonUtils';
import { insetPolygon } from './polygonOffsetUtils';
import { GabledRoofStrategy } from './GabledRoofStrategy';

/**
 * Gambrel roof: barn-style with two slope pitches on each side of the ridge.
 * Lower slopes are steep, upper slopes are shallow. Ridge ends are gable walls.
 *
 * Algorithm:
 *  1. Determine ridge via OBB (fast) or straight skeleton (complex footprints)
 *  2. Compute break line polygon via polygon inset (clipper2-ts)
 *  3. Build 6 face zones: lower slopes A/B, upper slopes A/B, gable ends A/B
 *  4. Triangulate each face and assemble BufferGeometry
 */
export class GambrelRoofStrategy implements IRoofGeometryStrategy {
  private readonly BREAK_INSET_FRACTION = 0.35;
  private readonly BREAK_HEIGHT_FRACTION = 0.55;

  create(params: RoofParams): BufferGeometry {
    const ring = params.outerRing;
    const { count, isCCW } = normalizeRing(ring);

    if (count < 3) return new BufferGeometry();

    const obb = computeOBB(ring);
    const ridgeAngle = params.ridgeAngle;
    const h = params.roofHeight;

    const alongX = Math.cos(ridgeAngle);
    const alongY = Math.sin(ridgeAngle);
    const acrossX = -Math.sin(ridgeAngle);
    const acrossY = Math.cos(ridgeAngle);

    // Compute actual ring extents in ridge-aligned axes
    let maxAlong = -Infinity,
      minAlong = Infinity;
    let maxAcross = -Infinity,
      minAcross = Infinity;
    for (let i = 0; i < count; i++) {
      const v = ring[i]!;
      const a = v[0] * alongX + v[1] * alongY;
      const c = v[0] * acrossX + v[1] * acrossY;
      if (a > maxAlong) maxAlong = a;
      if (a < minAlong) minAlong = a;
      if (c > maxAcross) maxAcross = c;
      if (c < minAcross) minAcross = c;
    }
    const halfAcross = (maxAcross - minAcross) / 2;
    const acrossMid = (maxAcross + minAcross) / 2;
    const alongMid = (maxAlong + minAlong) / 2;

    const breakInset = halfAcross * this.BREAK_INSET_FRACTION;
    if (breakInset >= halfAcross) {
      return new GabledRoofStrategy().create(params);
    }

    const breakPoly = insetPolygon(ring, breakInset);
    if (!breakPoly || breakPoly.length < 3) {
      return new GabledRoofStrategy().create(params);
    }

    const breakH = h * this.BREAK_HEIGHT_FRACTION;

    // Ridge: runs along the along-axis at the mid across-position
    const ridge = this.computeRidge(
      ring,
      count,
      isCCW,
      obb,
      ridgeAngle,
      alongX,
      alongY,
      acrossX,
      acrossY,
      maxAlong,
      minAlong,
      acrossMid,
      alongMid
    );

    const ridgeAlongA = ridge.start[0] * alongX + ridge.start[1] * alongY;
    const ridgeAlongB = ridge.end[0] * alongX + ridge.end[1] * alongY;
    const ridgeEndA = ridgeAlongA >= ridgeAlongB ? ridge.start : ridge.end;
    const ridgeEndB = ridgeAlongA >= ridgeAlongB ? ridge.end : ridge.start;
    const ridgeAlongMax = Math.max(ridgeAlongA, ridgeAlongB);
    const ridgeAlongMin = Math.min(ridgeAlongA, ridgeAlongB);

    const EPS = 1e-3;

    const outerSideA: [number, number][] = [];
    const outerSideB: [number, number][] = [];
    const outerGableA: [number, number][] = [];
    const outerGableB: [number, number][] = [];

    for (let i = 0; i < count; i++) {
      const v = ring[i]!;
      const across = v[0] * acrossX + v[1] * acrossY;
      const along = v[0] * alongX + v[1] * alongY;
      if (across >= acrossMid) outerSideA.push(v);
      else outerSideB.push(v);
      if (along >= ridgeAlongMax - EPS) outerGableA.push(v);
      if (along <= ridgeAlongMin + EPS) outerGableB.push(v);
    }

    const breakSideA: [number, number][] = [];
    const breakSideB: [number, number][] = [];
    const breakGableA: [number, number][] = [];
    const breakGableB: [number, number][] = [];

    let maxBreakAlong = -Infinity;
    let minBreakAlong = Infinity;
    for (const v of breakPoly) {
      const a = v[0] * alongX + v[1] * alongY;
      if (a > maxBreakAlong) maxBreakAlong = a;
      if (a < minBreakAlong) minBreakAlong = a;
    }

    for (const v of breakPoly) {
      const across = v[0] * acrossX + v[1] * acrossY;
      const along = v[0] * alongX + v[1] * alongY;
      if (across >= acrossMid) breakSideA.push(v);
      else breakSideB.push(v);
      if (along >= maxBreakAlong - EPS) breakGableA.push(v);
      if (along <= minBreakAlong + EPS) breakGableB.push(v);
    }

    const positions: number[] = [];

    writeSlopeBand(
      positions,
      outerSideA,
      0,
      breakSideA,
      breakH,
      alongX,
      alongY
    );
    writeSlopeBand(
      positions,
      outerSideB,
      0,
      breakSideB,
      breakH,
      alongX,
      alongY
    );

    const ridgeLine: [number, number][] = [ridgeEndA, ridgeEndB];
    writeSlopeBand(positions, breakSideA, breakH, ridgeLine, h, alongX, alongY);
    writeSlopeBand(positions, breakSideB, breakH, ridgeLine, h, alongX, alongY);

    writeGableWall(
      positions,
      outerGableA,
      breakGableA,
      ridgeEndA,
      breakH,
      h,
      acrossX,
      acrossY,
      acrossMid,
      alongX,
      alongY,
      true
    );
    writeGableWall(
      positions,
      outerGableB,
      breakGableB,
      ridgeEndB,
      breakH,
      h,
      acrossX,
      acrossY,
      acrossMid,
      alongX,
      alongY,
      false
    );

    const geom = new BufferGeometry();
    geom.setAttribute(
      'position',
      new Float32BufferAttribute(new Float32Array(positions), 3)
    );
    geom.computeVertexNormals();
    return geom;
  }

  private computeRidge(
    ring: [number, number][],
    count: number,
    isCCW: boolean,
    obb: OBB,
    ridgeAngle: number,
    alongX: number,
    alongY: number,
    acrossX: number,
    acrossY: number,
    maxAlong: number,
    minAlong: number,
    acrossMid: number,
    alongMid: number
  ): RidgeLine {
    // Ridge center is at (acrossMid in across direction, alongMid in along direction)
    const cx = acrossMid * acrossX + alongMid * alongX;
    const cy = acrossMid * acrossY + alongMid * alongY;

    const complexity = classifyFootprintComplexity(ring, obb);
    if (complexity === 'rectangular' || !isSkeletonReady()) {
      // OBB fast path: ridge at the along-extent of the ring
      return {
        start: [
          cx + maxAlong * alongX + (0 - alongMid) * alongX,
          cy + maxAlong * alongY + (0 - alongMid) * alongY,
        ],
        end: [
          cx + minAlong * alongX + (0 - alongMid) * alongX,
          cy + minAlong * alongY + (0 - alongMid) * alongY,
        ],
      };
    }

    const result = buildSkeleton(ring);
    if (!result) {
      return {
        start: [
          cx + (maxAlong - alongMid) * alongX + acrossMid * acrossX,
          cy + (maxAlong - alongMid) * alongY + acrossMid * acrossY,
        ],
        end: [
          cx + (minAlong - alongMid) * alongX + acrossMid * acrossX,
          cy + (minAlong - alongMid) * alongY + acrossMid * acrossY,
        ],
      };
    }

    const verts = result.vertices;
    let bestScore = -Infinity;
    let bestStart: [number, number] = [0, 0];
    let bestEnd: [number, number] = [0, 0];

    for (const poly of result.polygons) {
      for (let k = 0; k < poly.length; k++) {
        const a = verts[poly[k]!]!;
        const b = verts[poly[(k + 1) % poly.length]!]!;
        const dx = b[0] - a[0];
        const dy = b[1] - a[1];
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len < 1e-6) continue;
        const dot = Math.abs((dx * alongX + dy * alongY) / len);
        const score = (dot * ((a[2] ?? 0) + (b[2] ?? 0))) / 2;
        if (score > bestScore) {
          bestScore = score;
          bestStart = [a[0], a[1]];
          bestEnd = [b[0], b[1]];
        }
      }
    }

    if (bestScore === -Infinity) {
      return {
        start: [
          (maxAlong - alongMid) * alongX + acrossMid * acrossX,
          (maxAlong - alongMid) * alongY + acrossMid * acrossY,
        ],
        end: [
          (minAlong - alongMid) * alongX + acrossMid * acrossX,
          (minAlong - alongMid) * alongY + acrossMid * acrossY,
        ],
      };
    }

    return extendRidgeToFootprint(bestStart, bestEnd, ring, count, ridgeAngle);
  }
}

// ---------------------------------------------------------------------------
// Geometry assembly helpers
// ---------------------------------------------------------------------------

function writeSlopeBand(
  out: number[],
  bottomVerts: [number, number][],
  bottomH: number,
  topVerts: [number, number][],
  topH: number,
  alongX: number,
  alongY: number
): void {
  if (bottomVerts.length === 0 || topVerts.length === 0) return;

  const proj = (v: [number, number]) => v[0] * alongX + v[1] * alongY;
  const bot = [...bottomVerts].sort((a, b) => proj(a) - proj(b));
  const top = [...topVerts].sort((a, b) => proj(a) - proj(b));

  // Polygon: bot low→high, then top high→low (non-self-intersecting CCW contour)
  const pts: [number, number][] = [...bot, ...[...top].reverse()];
  const hs: number[] = [
    ...bot.map(() => bottomH),
    ...[...top].reverse().map(() => topH),
  ];

  fanTriangulatePoly(out, pts, hs);
}

function writeGableWall(
  out: number[],
  outerGable: [number, number][],
  breakGable: [number, number][],
  ridgeEnd: [number, number],
  breakH: number,
  roofH: number,
  acrossX: number,
  acrossY: number,
  acrossMid: number,
  alongX: number,
  alongY: number,
  isEndA: boolean
): void {
  if (outerGable.length === 0 || breakGable.length === 0) return;

  // Sort by across-ridge projection (relative to mid) for consistent winding
  const projAcross = (v: [number, number]) =>
    v[0] * acrossX + v[1] * acrossY - acrossMid;

  const outer = [...outerGable].sort((a, b) => projAcross(a) - projAcross(b));
  const brk = [...breakGable].sort((a, b) => projAcross(a) - projAcross(b));

  // Contour (3D Three.js): outer (Y=0, low→high across), brk reversed (Y=breakH, high→low), ridgeEnd (Y=roofH)
  const pts3D: [number, number, number][] = [
    ...outer.map((v): [number, number, number] => [v[0], 0, -v[1]]),
    ...[...brk]
      .reverse()
      .map((v): [number, number, number] => [v[0], breakH, -v[1]]),
    [ridgeEnd[0], roofH, -ridgeEnd[1]],
  ];

  const n = pts3D.length;
  if (n < 3) return;

  // Determine correct winding: fan from pts3D[0], check normal vs expected outward direction
  const p0 = pts3D[0]!,
    p1 = pts3D[1]!,
    p2 = pts3D[2]!;
  const e1x = p1[0] - p0[0],
    e1y = p1[1] - p0[1],
    e1z = p1[2] - p0[2];
  const e2x = p2[0] - p0[0],
    e2y = p2[1] - p0[1],
    e2z = p2[2] - p0[2];
  const nx = e1y * e2z - e1z * e2y;
  const nz = e1x * e2y - e1y * e2x;
  // Expected outward: +along for isEndA, -along for !isEndA (in Three.js XZ: along=(cos,-sin))
  const outX = isEndA ? alongX : -alongX;
  const outZ = isEndA ? -alongY : alongY;
  const flip = nx * outX + nz * outZ < 0;

  for (let k = 1; k + 1 < n; k++) {
    const a = pts3D[0]!;
    const b = flip ? pts3D[k + 1]! : pts3D[k]!;
    const c = flip ? pts3D[k]! : pts3D[k + 1]!;
    out.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]);
  }
}

function fanTriangulatePoly(
  out: number[],
  pts: [number, number][],
  heights: number[]
): void {
  const n = pts.length;
  if (n < 3) return;

  const p0 = pts[0]!,
    h0 = heights[0]!;

  for (let k = 1; k + 1 < n; k++) {
    const p1 = pts[k]!,
      p2 = pts[k + 1]!;
    const h1 = heights[k]!,
      h2 = heights[k + 1]!;

    // XY signed area: CCW → upward normal in Three.js
    const cross =
      (p1[0] - p0[0]) * (p2[1] - p0[1]) - (p1[1] - p0[1]) * (p2[0] - p0[0]);
    if (Math.abs(cross) < 1e-10) continue;

    if (cross > 0) {
      out.push(p0[0], h0, -p0[1], p1[0], h1, -p1[1], p2[0], h2, -p2[1]);
    } else {
      out.push(p0[0], h0, -p0[1], p2[0], h2, -p2[1], p1[0], h1, -p1[1]);
    }
  }
}

function extendRidgeToFootprint(
  p1: [number, number],
  p2: [number, number],
  ring: [number, number][],
  count: number,
  ridgeAngle: number
): RidgeLine {
  const alongX = Math.cos(ridgeAngle);
  const alongY = Math.sin(ridgeAngle);
  const cx = (p1[0] + p2[0]) / 2;
  const cy = (p1[1] + p2[1]) / 2;

  const tMax = rayToPolygon(cx, cy, alongX, alongY, ring, count);
  const tMin = rayToPolygon(cx, cy, -alongX, -alongY, ring, count);

  return {
    start: [cx + tMax * alongX, cy + tMax * alongY],
    end: [cx - tMin * alongX, cy - tMin * alongY],
  };
}

function rayToPolygon(
  ox: number,
  oy: number,
  dx: number,
  dy: number,
  ring: [number, number][],
  count: number
): number {
  let best = Infinity;
  for (let i = 0; i < count; i++) {
    const ax = ring[i]![0],
      ay = ring[i]![1];
    const bx = ring[(i + 1) % count]![0],
      by = ring[(i + 1) % count]![1];
    const ex = bx - ax,
      ey = by - ay;
    const denom = dx * ey - dy * ex;
    if (Math.abs(denom) < 1e-10) continue;
    const t = ((ax - ox) * ey - (ay - oy) * ex) / denom;
    const s = ((ax - ox) * dy - (ay - oy) * dx) / denom;
    if (t > 0 && s >= 0 && s <= 1) best = Math.min(best, t);
  }
  return isFinite(best) ? best : 0;
}

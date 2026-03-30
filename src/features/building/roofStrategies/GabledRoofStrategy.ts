import {
  BufferGeometry,
  Float32BufferAttribute,
  ShapeUtils,
  Vector2,
} from 'three';
import type { IRoofGeometryStrategy, RoofParams } from './types';
import type { OBB } from './types';
import {
  normalizeRing,
  computeOBB,
  classifyFootprintComplexity,
  computeRidgeLine,
  partitionVerticesBySide,
} from './roofGeometryUtils';
import {
  isSkeletonReady,
  buildSkeleton,
  skeletonHeightScale,
} from './straightSkeletonUtils';

export class GabledRoofStrategy implements IRoofGeometryStrategy {
  create(params: RoofParams): BufferGeometry {
    const ring = params.outerRing;
    const { count, isCCW } = normalizeRing(ring);

    if (count < 3) return new BufferGeometry();

    const obb = computeOBB(ring);
    const complexity = classifyFootprintComplexity(ring, obb);

    if (complexity === 'rectangular' || !isSkeletonReady()) {
      return this.rectangularPath(params, count, isCCW, obb);
    }
    return this.skeletonPath(params, count, isCCW, obb);
  }

  // ---------------------------------------------------------------------------
  // OBB fast path — handles the vast majority of real-world buildings
  // ---------------------------------------------------------------------------

  private rectangularPath(
    params: RoofParams,
    count: number,
    isCCW: boolean,
    obb: OBB
  ): BufferGeometry {
    const ring = params.outerRing;
    const h = params.roofHeight;
    const ridgeAngle = params.ridgeAngle;

    const ridge = computeRidgeLine(obb, ridgeAngle);
    const { left, right } = partitionVerticesBySide(ring, count, ridgeAngle);

    // Build slope face polygons with vertices in non-self-intersecting order.
    // Eave vertices are sorted from near ridge.start to near ridge.end along the ridge axis.
    const slopeAContour = buildSlopeContour(
      ridge.start,
      ridge.end,
      left,
      ring,
      ridgeAngle
    );
    const slopeBContour = buildSlopeContour(
      ridge.end,
      ridge.start,
      right,
      ring,
      ridgeAngle
    );

    // Triangulate slope faces (earcut); slope polygons are always CCW in XY space.
    const triA = ShapeUtils.triangulateShape(
      slopeAContour.map(([x, y]) => new Vector2(x, y)),
      []
    );
    const triB = ShapeUtils.triangulateShape(
      slopeBContour.map(([x, y]) => new Vector2(x, y)),
      []
    );

    // Gable walls: two vertices closest to each ridge endpoint
    const gableA = closestTwoVertices(ridge.start, ring, count);
    const gableB = closestTwoVertices(ridge.end, ring, count);

    const totalTri = triA.length + triB.length + 2; // 2 gable walls
    const positions = new Float32Array(totalTri * 9);
    let o = 0;

    // Slope faces: slope polygons are always CCW → always write without winding swap.
    o = writeSlopeFace(positions, o, slopeAContour, triA, ridge, h);
    o = writeSlopeFace(positions, o, slopeBContour, triB, ridge, h);

    // Gable walls: write with outward-facing normal.
    o = writeGableWall(positions, o, gableA, ridge.start, ridgeAngle, h, true);
    o = writeGableWall(positions, o, gableB, ridge.end, ridgeAngle, h, false);

    const geom = new BufferGeometry();
    geom.setAttribute(
      'position',
      new Float32BufferAttribute(positions.slice(0, o), 3)
    );
    geom.computeVertexNormals();
    return geom;
  }

  // ---------------------------------------------------------------------------
  // Skeleton path — for L-shaped, T-shaped, and other complex footprints
  // ---------------------------------------------------------------------------

  private skeletonPath(
    params: RoofParams,
    count: number,
    isCCW: boolean,
    obb: OBB
  ): BufferGeometry {
    const ring = params.outerRing;
    const h = params.roofHeight;

    const result = buildSkeleton(ring, params.innerRings);
    if (!result) {
      return this.rectangularPath(params, count, isCCW, obb);
    }

    const scale = skeletonHeightScale(result, h);
    const verts = result.vertices;
    const vertexHeights = verts.map((v) => (v[2] ?? 0) * scale);

    // Fan-triangulate each skeleton face
    let totalTri = 0;
    for (const poly of result.polygons) {
      if (poly.length >= 3) totalTri += poly.length - 2;
    }

    const positions = new Float32Array(totalTri * 9);
    let o = 0;

    for (const poly of result.polygons) {
      if (poly.length < 3) continue;

      const p0 = verts[poly[0]!]!;
      const h0 = vertexHeights[poly[0]!]!;

      for (let k = 1; k + 1 < poly.length; k++) {
        const p1 = verts[poly[k]!]!;
        const p2 = verts[poly[k + 1]!]!;
        const h1 = vertexHeights[poly[k]!]!;
        const h2 = vertexHeights[poly[k + 1]!]!;

        const v0: [number, number] = [p0[0], p0[1]];
        const v1: [number, number] = [p1[0], p1[1]];
        const v2: [number, number] = [p2[0], p2[1]];

        // Preserve face winding from the skeleton output
        const cross =
          (v1[0] - v0[0]) * (v2[1] - v0[1]) - (v1[1] - v0[1]) * (v2[0] - v0[0]);
        const faceIsCCW = cross > 0;
        o = writeTriangle(
          positions,
          o,
          v0,
          h0,
          v1,
          h1,
          v2,
          h2,
          faceIsCCW === isCCW
        );
      }
    }

    const geom = new BufferGeometry();
    geom.setAttribute(
      'position',
      new Float32BufferAttribute(positions.slice(0, o), 3)
    );
    geom.computeVertexNormals();
    return geom;
  }
}

// ---------------------------------------------------------------------------
// Geometry assembly helpers (module-level)
// ---------------------------------------------------------------------------

/**
 * Builds a non-self-intersecting slope face polygon:
 * [ridgeP1, ...eaveVertices sorted near→far from ridgeP1..., ridgeP2]
 *
 * This ensures earcut can triangulate the polygon correctly.
 */
function buildSlopeContour(
  ridgeP1: [number, number],
  ridgeP2: [number, number],
  eaveIndices: number[],
  ring: [number, number][],
  ridgeAngle: number
): [number, number][] {
  const alongX = Math.cos(ridgeAngle);
  const alongY = Math.sin(ridgeAngle);

  // Project ridgeP1 onto the along-ridge axis to determine sort direction.
  // ridgeP1 has higher projection → sort descending; lower → sort ascending.
  const proj1 = ridgeP1[0] * alongX + ridgeP1[1] * alongY;

  const sorted = [...eaveIndices].sort((a, b) => {
    const pA = ring[a]![0] * alongX + ring[a]![1] * alongY;
    const pB = ring[b]![0] * alongX + ring[b]![1] * alongY;
    // Sort so eave vertices go from the ridgeP1 side to the ridgeP2 side
    return proj1 >= 0 ? pB - pA : pA - pB;
  });

  const contour: [number, number][] = [ridgeP1];
  for (const i of sorted) {
    contour.push(ring[i]!);
  }
  contour.push(ridgeP2);
  return contour;
}

/** Returns the two ring vertices closest to the given point (by Euclidean distance). */
function closestTwoVertices(
  point: [number, number],
  ring: [number, number][],
  count: number
): [[number, number], [number, number]] {
  const dists = Array.from({ length: count }, (_, i) => {
    const dx = ring[i]![0] - point[0];
    const dy = ring[i]![1] - point[1];
    return { i, d: dx * dx + dy * dy };
  });
  dists.sort((a, b) => a.d - b.d);
  return [ring[dists[0]!.i]!, ring[dists[1]!.i]!];
}

/**
 * Writes slope face triangles.
 * Slope polygons are always CCW in XY → always written without winding swap.
 */
function writeSlopeFace(
  pos: Float32Array,
  o: number,
  contour: [number, number][],
  triangles: number[][],
  ridge: { start: [number, number]; end: [number, number] },
  roofHeight: number
): number {
  const EPS = 0.01;
  for (const tri of triangles) {
    const [i0, i1, i2] = tri as [number, number, number];
    const v0 = contour[i0]!;
    const v1 = contour[i1]!;
    const v2 = contour[i2]!;
    const h0 = isRidgePoint(v0, ridge, EPS) ? roofHeight : 0;
    const h1 = isRidgePoint(v1, ridge, EPS) ? roofHeight : 0;
    const h2 = isRidgePoint(v2, ridge, EPS) ? roofHeight : 0;
    // Always write CCW (slope polygons are CCW)
    o = writeTriangle(pos, o, v0, h0, v1, h1, v2, h2, true);
  }
  return o;
}

function isRidgePoint(
  v: [number, number],
  ridge: { start: [number, number]; end: [number, number] },
  eps: number
): boolean {
  return (
    (Math.abs(v[0] - ridge.start[0]) < eps &&
      Math.abs(v[1] - ridge.start[1]) < eps) ||
    (Math.abs(v[0] - ridge.end[0]) < eps && Math.abs(v[1] - ridge.end[1]) < eps)
  );
}

/**
 * Writes a gable wall triangle with outward-facing normal.
 *
 * @param isStart  true if this is the ridge.start gable (outward = +along direction)
 *                 false if ridge.end gable (outward = -along direction)
 */
function writeGableWall(
  pos: Float32Array,
  o: number,
  eave: [[number, number], [number, number]],
  ridgePoint: [number, number],
  ridgeAngle: number,
  roofHeight: number,
  isStart: boolean
): number {
  const [e1, e2] = eave;
  // Compute the cross product of the proposed triangle in Three.js space,
  // then check if the normal points in the correct along-ridge direction.
  // Three.js: (x, height, -y)
  const ax = e1[0],
    ay = 0,
    az = -e1[1];
  const bx = e2[0],
    by = 0,
    bz = -e2[1];
  const cx = ridgePoint[0],
    cy = roofHeight,
    cz = -ridgePoint[1];

  const v01x = bx - ax,
    v01y = by - ay,
    v01z = bz - az;
  const v02x = cx - ax,
    v02y = cy - ay,
    v02z = cz - az;
  const nx = v01y * v02z - v01z * v02y;
  const nz = v01x * v02y - v01y * v02x;

  // Along-ridge direction in Three.js XZ: (cos θ, -sin θ) [since Z = -mercY]
  const alongX = Math.cos(ridgeAngle);
  const alongZ = -Math.sin(ridgeAngle);
  const dot = nx * alongX + nz * alongZ;

  // For isStart: outward = +along → dot should be > 0. Flip if not.
  // For !isStart: outward = -along → dot should be < 0. Flip if not.
  const shouldFlip = isStart ? dot < 0 : dot > 0;

  if (shouldFlip) {
    return writeTriangle(pos, o, e1, 0, ridgePoint, roofHeight, e2, 0, true);
  }
  return writeTriangle(pos, o, e1, 0, e2, 0, ridgePoint, roofHeight, true);
}

function writeTriangle(
  pos: Float32Array,
  o: number,
  v0: [number, number],
  h0: number,
  v1: [number, number],
  h1: number,
  v2: [number, number],
  h2: number,
  isCCW: boolean
): number {
  const [a, b, c] = isCCW ? [v0, v1, v2] : [v0, v2, v1];
  const [ha, hb, hc] = isCCW ? [h0, h1, h2] : [h0, h2, h1];

  pos[o++] = a![0];
  pos[o++] = ha!;
  pos[o++] = -a![1];
  pos[o++] = b![0];
  pos[o++] = hb!;
  pos[o++] = -b![1];
  pos[o++] = c![0];
  pos[o++] = hc!;
  pos[o++] = -c![1];
  return o;
}

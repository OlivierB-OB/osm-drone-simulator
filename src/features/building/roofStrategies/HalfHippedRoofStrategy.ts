import { BufferGeometry, Float32BufferAttribute } from 'three';
import type { IRoofGeometryStrategy, RoofParams } from './types';
import { computeOBB, normalizeRing } from './roofGeometryUtils';
import { GabledRoofStrategy } from './GabledRoofStrategy';
import { HippedRoofStrategy } from './HippedRoofStrategy';
import { PyramidalRoofStrategy } from './PyramidalRoofStrategy';
import {
  isSkeletonReady,
  buildSkeleton,
  skeletonHeightScale,
} from './straightSkeletonUtils';

const HIP_FRACTION = 0.3; // top 30% of gable end is hipped

export class HalfHippedRoofStrategy implements IRoofGeometryStrategy {
  create(params: RoofParams): BufferGeometry {
    if (HIP_FRACTION <= 0) return new GabledRoofStrategy().create(params);
    if (HIP_FRACTION >= 1) return new HippedRoofStrategy().create(params);

    const ring = params.outerRing;
    const { count, isCCW } = normalizeRing(ring);
    if (count < 3) return new BufferGeometry();

    const obb = computeOBB(ring);
    if (obb.halfWidth <= 0.01 || obb.halfLength <= obb.halfWidth + 0.01) {
      return new PyramidalRoofStrategy().create(params);
    }

    if (isSkeletonReady()) {
      const result = buildSkeleton(ring, params.innerRings);
      if (result) {
        return buildSkeletonGeometry(
          result,
          params.roofHeight,
          params.ridgeAngle,
          isCCW
        );
      }
    }

    return buildOBBGeometry(params, obb, isCCW);
  }
}

// ---------------------------------------------------------------------------
// Shared triangle writer
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// OBB fast path
// ---------------------------------------------------------------------------

function buildOBBGeometry(
  params: RoofParams,
  obb: ReturnType<typeof computeOBB>,
  isCCW: boolean
): BufferGeometry {
  const h = params.roofHeight;
  const clipH = h * (1 - HIP_FRACTION);
  const ridgeAngle = params.ridgeAngle;
  const cosA = Math.cos(ridgeAngle);
  const sinA = Math.sin(ridgeAngle);
  const cx = obb.center[0];
  const cy = obb.center[1];
  const hL = obb.halfLength;
  const hW = obb.halfWidth;

  // Ridge endpoints (hipped-style: shorter than building by halfWidth on each end)
  const ridgeDist = hL - hW;
  const R1: [number, number] = [cx + ridgeDist * cosA, cy + ridgeDist * sinA];
  const R2: [number, number] = [cx - ridgeDist * cosA, cy - ridgeDist * sinA];

  // OBB corner positions in footprint XY (Mercator)
  // Along = ridgeDir, Across = perpendicular
  const acrossX = -sinA;
  const acrossY = cosA;
  // C0: R1-end, +across (left of ridge looking along)
  const C0: [number, number] = [
    cx + hL * cosA + hW * acrossX,
    cy + hL * sinA + hW * acrossY,
  ];
  // C1: R1-end, -across (right)
  const C1: [number, number] = [
    cx + hL * cosA - hW * acrossX,
    cy + hL * sinA - hW * acrossY,
  ];
  // C2: R2-end, -across
  const C2: [number, number] = [
    cx - hL * cosA - hW * acrossX,
    cy - hL * sinA - hW * acrossY,
  ];
  // C3: R2-end, +across
  const C3: [number, number] = [
    cx - hL * cosA + hW * acrossX,
    cy - hL * sinA + hW * acrossY,
  ];

  // Slope face A (+across side): C0, C3, R2, R1
  // Slope face B (-across side): C1, C2, R2 → wait, need consistent winding
  // Use CCW polygon order for face A: C0 → C3 → R2 → R1 (left side looking +along)
  // Use CCW polygon order for face B: C2 → C1 → R1 → R2 (right side)

  // Truncation points for hip faces
  // Hip at R1-end: triangle [C0, C1, R1] heights [0, 0, h]
  //   P0 on edge C0→R1 at t=(1-HIP_FRACTION): lerp
  //   P1 on edge C1→R1 at t=(1-HIP_FRACTION): lerp
  const t = 1 - HIP_FRACTION;
  const P0: [number, number] = [
    C0[0] + t * (R1[0] - C0[0]),
    C0[1] + t * (R1[1] - C0[1]),
  ];
  const P1: [number, number] = [
    C1[0] + t * (R1[0] - C1[0]),
    C1[1] + t * (R1[1] - C1[1]),
  ];
  // Hip at R2-end: triangle [C3, C2, R2] heights [0, 0, h]
  const P2: [number, number] = [
    C3[0] + t * (R2[0] - C3[0]),
    C3[1] + t * (R2[1] - C3[1]),
  ];
  const P3: [number, number] = [
    C2[0] + t * (R2[0] - C2[0]),
    C2[1] + t * (R2[1] - C2[1]),
  ];

  // Total triangles:
  //   2 slope faces × 2 triangles each = 4
  //   2 hip upper triangles = 2
  //   2 gable lower trapezoids × 2 triangles = 4
  // Total = 10 triangles
  const positions = new Float32Array(10 * 9);
  let o = 0;

  // --- Slope face A (+across side): [C0, R1, R2, C3] at heights [0, h, h, 0]
  o = writeTriangle(positions, o, C0, 0, R1, h, C3, 0, isCCW);
  o = writeTriangle(positions, o, R1, h, R2, h, C3, 0, isCCW);

  // --- Slope face B (-across side): [C1, C2, R2, R1] at heights [0, 0, h, h]
  o = writeTriangle(positions, o, C1, 0, C2, 0, R1, h, isCCW);
  o = writeTriangle(positions, o, C2, 0, R2, h, R1, h, isCCW);

  // --- Hip upper at R1-end: [P0, P1, R1] at [clipH, clipH, h]
  o = writeTriangle(positions, o, P0, clipH, P1, clipH, R1, h, isCCW);

  // --- Gable lower at R1-end: [C0, C1, P1, P0] at [0, 0, clipH, clipH]
  o = writeTriangle(positions, o, C0, 0, C1, 0, P0, clipH, isCCW);
  o = writeTriangle(positions, o, C1, 0, P1, clipH, P0, clipH, isCCW);

  // --- Hip upper at R2-end: [P2, P3, R2] at [clipH, clipH, h]
  o = writeTriangle(positions, o, P2, clipH, P3, clipH, R2, h, isCCW);

  // --- Gable lower at R2-end: [C3, C2, P3, P2] at [0, 0, clipH, clipH]
  o = writeTriangle(positions, o, C3, 0, C2, 0, P2, clipH, isCCW);
  o = writeTriangle(positions, o, C2, 0, P3, clipH, P2, clipH, isCCW);

  const geom = new BufferGeometry();
  geom.setAttribute(
    'position',
    new Float32BufferAttribute(positions.slice(0, o), 3)
  );
  geom.computeVertexNormals();
  return geom;
}

// ---------------------------------------------------------------------------
// Skeleton path
// ---------------------------------------------------------------------------

function buildSkeletonGeometry(
  result: { vertices: [number, number, number?][]; polygons: number[][] },
  roofHeight: number,
  ridgeAngle: number,
  isCCW: boolean
): BufferGeometry {
  const clipH = roofHeight * (1 - HIP_FRACTION);
  const scale = skeletonHeightScale(result, roofHeight);
  const verts = result.vertices;
  const vertexHeights = verts.map((v) => (v[2] ?? 0) * scale);

  // Pre-count triangles (upper bound: each n-gon needs n-2 tris; hip faces split into 2 polys)
  // Use a growable approach: collect positions dynamically
  const posBuf: number[] = [];

  function emit(
    v0: [number, number],
    h0: number,
    v1: [number, number],
    h1: number,
    v2: [number, number],
    h2: number,
    faceIsCCW: boolean
  ): void {
    const [a, b, c] = faceIsCCW ? [v0, v1, v2] : [v0, v2, v1];
    const [ha, hb, hc] = faceIsCCW ? [h0, h1, h2] : [h0, h2, h1];
    posBuf.push(a![0], ha!, -a![1], b![0], hb!, -b![1], c![0], hc!, -c![1]);
  }

  const cosR = Math.cos(ridgeAngle);
  const sinR = Math.sin(ridgeAngle);

  for (const poly of result.polygons) {
    if (poly.length < 3) continue;

    const polyVerts = poly.map((i) => verts[i]!);
    const polyHeights = poly.map((i) => vertexHeights[i]!);

    // Determine if this is a hip face:
    // Find the two vertices with lowest height (the footprint eave edge)
    const sorted = [...poly.keys()].sort(
      (a, b) => polyHeights[a]! - polyHeights[b]!
    );
    const i0 = sorted[0]!;
    const i1 = sorted[1]!;
    const ev0 = polyVerts[i0]!;
    const ev1 = polyVerts[i1]!;
    const edgeDx = ev1[0] - ev0[0];
    const edgeDy = ev1[1] - ev0[1];
    const edgeLen = Math.sqrt(edgeDx * edgeDx + edgeDy * edgeDy);
    const dotWithRidge =
      edgeLen > 1e-6 ? Math.abs(edgeDx * cosR + edgeDy * sinR) / edgeLen : 1;
    // dot < 0.5 means base edge is roughly perpendicular to ridge → hip face
    const isHip = dotWithRidge < 0.5;

    if (!isHip) {
      // Slope face: fan-triangulate from vertex 0 (same as HippedRoofStrategy)
      const p0 = polyVerts[0]!;
      const h0 = polyHeights[0]!;
      for (let k = 1; k + 1 < poly.length; k++) {
        const p1 = polyVerts[k]!;
        const p2 = polyVerts[k + 1]!;
        const h1 = polyHeights[k]!;
        const h2 = polyHeights[k + 1]!;
        const cross =
          (p1[0] - p0[0]) * (p2[1] - p0[1]) - (p1[1] - p0[1]) * (p2[0] - p0[0]);
        emit(
          [p0[0], p0[1]],
          h0,
          [p1[0], p1[1]],
          h1,
          [p2[0], p2[1]],
          h2,
          cross > 0 === isCCW
        );
      }
    } else {
      // Hip face: truncate at clipH
      // Split edges that cross clipH, collect upper and lower vertex lists
      const n = poly.length;
      const upper: Array<[number, number]> = [];
      const upperH: number[] = [];
      const lower: Array<[number, number]> = [];
      const lowerH: number[] = [];

      for (let k = 0; k < n; k++) {
        const va = polyVerts[k]!;
        const ha = polyHeights[k]!;
        const vb = polyVerts[(k + 1) % n]!;
        const hb = polyHeights[(k + 1) % n]!;
        const pt: [number, number] = [va[0], va[1]];

        if (ha <= clipH) {
          lower.push(pt);
          lowerH.push(ha);
          if (ha < clipH && hb > clipH) {
            // Crossing up: add split point to both
            const s = (clipH - ha) / (hb - ha);
            const sp: [number, number] = [
              va[0] + s * (vb[0] - va[0]),
              va[1] + s * (vb[1] - va[1]),
            ];
            lower.push(sp);
            lowerH.push(clipH);
            upper.push(sp);
            upperH.push(clipH);
          }
        } else {
          upper.push(pt);
          upperH.push(ha);
          if (ha > clipH && hb < clipH) {
            // Crossing down
            const s = (ha - clipH) / (ha - hb);
            const sp: [number, number] = [
              va[0] + s * (vb[0] - va[0]),
              va[1] + s * (vb[1] - va[1]),
            ];
            upper.push(sp);
            upperH.push(clipH);
            lower.push(sp);
            lowerH.push(clipH);
          }
        }
      }

      // Fan-triangulate upper (hip) polygon
      fanEmit(upper, upperH, isCCW, emit);
      // Fan-triangulate lower (gable) polygon
      fanEmit(lower, lowerH, isCCW, emit);
    }
  }

  const positions = new Float32Array(posBuf);
  const geom = new BufferGeometry();
  geom.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geom.computeVertexNormals();
  return geom;
}

function fanEmit(
  verts: Array<[number, number]>,
  heights: number[],
  isCCW: boolean,
  emit: (
    v0: [number, number],
    h0: number,
    v1: [number, number],
    h1: number,
    v2: [number, number],
    h2: number,
    faceIsCCW: boolean
  ) => void
): void {
  if (verts.length < 3) return;
  const p0 = verts[0]!;
  const h0 = heights[0]!;
  for (let k = 1; k + 1 < verts.length; k++) {
    const p1 = verts[k]!;
    const p2 = verts[k + 1]!;
    const h1 = heights[k]!;
    const h2 = heights[k + 1]!;
    const cross =
      (p1[0] - p0[0]) * (p2[1] - p0[1]) - (p1[1] - p0[1]) * (p2[0] - p0[0]);
    emit(p0, h0, p1, h1, p2, h2, cross > 0 === isCCW);
  }
}

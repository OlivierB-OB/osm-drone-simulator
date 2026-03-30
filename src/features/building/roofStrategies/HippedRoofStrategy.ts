import { BufferGeometry, Float32BufferAttribute } from 'three';
import type { IRoofGeometryStrategy, RoofParams } from './types';
import type { OBB } from './types';
import {
  computeOBB,
  normalizeRing,
  buildOutlineRoofGeometry,
} from './roofGeometryUtils';
import { PyramidalRoofStrategy } from './PyramidalRoofStrategy';
import {
  isSkeletonReady,
  buildSkeleton,
  skeletonHeightScale,
} from './straightSkeletonUtils';

export class HippedRoofStrategy implements IRoofGeometryStrategy {
  create(params: RoofParams): BufferGeometry {
    const ring = params.outerRing;
    const { count, isCCW } = normalizeRing(ring);
    if (count < 3) return new BufferGeometry();

    const obb = computeOBB(ring);

    // Square/near-square → pyramidal
    if (obb.halfWidth <= 0.01 || obb.halfLength <= obb.halfWidth + 0.01) {
      return new PyramidalRoofStrategy().create(params);
    }

    // Primary: straight skeleton — naturally computes ridge + hip faces for any footprint shape
    if (isSkeletonReady()) {
      const result = buildSkeleton(ring, params.innerRings);
      if (result) {
        return buildSkeletonGeometry(result, params.roofHeight, isCCW);
      }
    }

    // Fallback: OBB-based gradient approximation
    return buildOBBFallback(params, count, isCCW, obb);
  }
}

// ---------------------------------------------------------------------------
// Skeleton path — fan-triangulate each face polygon produced by the skeleton
// ---------------------------------------------------------------------------

function buildSkeletonGeometry(
  result: { vertices: [number, number, number?][]; polygons: number[][] },
  roofHeight: number,
  isCCW: boolean
): BufferGeometry {
  const scale = skeletonHeightScale(result, roofHeight);
  const verts = result.vertices;
  const vertexHeights = verts.map((v) => (v[2] ?? 0) * scale);

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

      // Preserve face winding from skeleton output
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

// ---------------------------------------------------------------------------
// OBB fallback — gradient-based height approximation
// ---------------------------------------------------------------------------

function buildOBBFallback(
  params: RoofParams,
  count: number,
  isCCW: boolean,
  obb: OBB
): BufferGeometry {
  const ring = params.outerRing;
  const h = params.roofHeight;
  const cosA = Math.cos(params.ridgeAngle);
  const sinA = Math.sin(params.ridgeAngle);
  const ocx = obb.center[0];
  const ocy = obb.center[1];
  const halfLength = obb.halfLength;
  const halfWidth = obb.halfWidth;

  const computeHeight = (x: number, y: number): number => {
    const dx = x - ocx;
    const dy = y - ocy;
    const alongProj = dx * cosA + dy * sinA;
    const acrossProj = -dx * sinA + dy * cosA;
    const tAcross = 1 - Math.abs(acrossProj) / halfWidth;
    const tAlong = (halfLength - Math.abs(alongProj)) / halfWidth;
    return h * Math.max(0, Math.min(1, Math.min(tAcross, tAlong)));
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

// ---------------------------------------------------------------------------
// Triangle writer
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

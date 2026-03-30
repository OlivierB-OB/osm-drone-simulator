import { ShapeUtils, Vector2 } from 'three';
import * as poly2tri from 'poly2tri';

/**
 * Triangulates a polygon contour (with optional holes) and returns triangle
 * index triples into the combined vertex list [contour, ...holes].
 *
 * Strategy:
 * - No holes → ShapeUtils.triangulateShape (earcut, lightweight, already in project)
 * - With holes → poly2tri CDT; falls back to earcut if CDT throws
 *
 * @param contour Outer boundary vertices as [x, y][]
 * @param holes   Inner hole vertices as [x, y][][]
 * @returns Array of [i0, i1, i2] index triples
 */
export function triangulateFace(
  contour: [number, number][],
  holes?: [number, number][][]
): [number, number, number][] {
  if (!holes || holes.length === 0) {
    // Fast path: earcut via ShapeUtils
    const v2contour = contour.map(([x, y]) => new Vector2(x, y));
    return ShapeUtils.triangulateShape(v2contour, []) as [
      number,
      number,
      number,
    ][];
  }

  // CDT path: poly2tri
  try {
    return cdtTriangulate(contour, holes);
  } catch {
    // Fallback: earcut with holes (may produce incorrect topology for holes
    // but won't crash; acceptable as last resort)
    const v2contour = contour.map(([x, y]) => new Vector2(x, y));
    const v2holes = holes.map((h) => h.map(([x, y]) => new Vector2(x, y)));
    return ShapeUtils.triangulateShape(v2contour, v2holes) as [
      number,
      number,
      number,
    ][];
  }
}

function cdtTriangulate(
  contour: [number, number][],
  holes: [number, number][][]
): [number, number, number][] {
  // Build combined vertex list for index mapping
  const allVerts: [number, number][] = [...contour];
  for (const h of holes) allVerts.push(...h);

  // Deduplicate points within tolerance to avoid poly2tri errors
  const dedupedContour = deduplicateRing(contour);
  const swctx = new poly2tri.SweepContext(
    dedupedContour.map(([x, y]) => new poly2tri.Point(x, y))
  );

  for (const hole of holes) {
    swctx.addHole(
      deduplicateRing(hole).map(([x, y]) => new poly2tri.Point(x, y))
    );
  }

  swctx.triangulate();

  const triangles = swctx.getTriangles();
  const result: [number, number, number][] = [];

  for (const tri of triangles) {
    const pts = tri.getPoints();
    const indices = pts.map((p) => findIndex(allVerts, p.x, p.y));
    if (indices.some((i) => i === -1)) continue;
    result.push([indices[0]!, indices[1]!, indices[2]!]);
  }

  return result;
}

function deduplicateRing(ring: [number, number][]): [number, number][] {
  const EPS = 1e-6;
  const out: [number, number][] = [];
  for (const p of ring) {
    if (
      out.length === 0 ||
      Math.abs(p[0] - out[out.length - 1]![0]) > EPS ||
      Math.abs(p[1] - out[out.length - 1]![1]) > EPS
    ) {
      out.push(p);
    }
  }
  return out;
}

function findIndex(verts: [number, number][], x: number, y: number): number {
  const EPS = 1e-6;
  for (let i = 0; i < verts.length; i++) {
    if (Math.abs(verts[i]![0] - x) < EPS && Math.abs(verts[i]![1] - y) < EPS) {
      return i;
    }
  }
  return -1;
}

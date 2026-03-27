# Roof Library APIs — Confirmed Reference

This document records the verified API for each external package used by skeleton-based roof strategies. It resolves Open Question 1 across all affected implementation plans.

## Package Summary

| Implementation Plans Say | Correct npm Package |
|--------------------------|---------------------|
| `poly2tri-js` | **`poly2tri`** — no `-js` suffix |
| `clipper-lib` | **`@countertype/clipper2-ts`** — Clipper2, native float, TypeScript |
| `straight-skeleton` | `straight-skeleton` ✓ — unchanged |

**Install all three at once:**
```bash
bun add straight-skeleton poly2tri @countertype/clipper2-ts
```

---

## `straight-skeleton`

CGAL straight skeleton compiled to WebAssembly. TypeScript types bundled. No separate `@types` package needed.

### Critical: Async WASM Initialization

`SkeletonBuilder.init()` is async (loads the WASM binary). The current `IRoofGeometryStrategy.create()` is synchronous and must stay that way to avoid cascading async changes.

**Solution — eager singleton in `straightSkeletonUtils.ts`:**

```typescript
import { SkeletonBuilder } from 'straight-skeleton';

let _ready = false;
// Kick off init at module import time — WASM loads in background.
// By the time tiles are fetched, parsed and buildings computed, init is done.
SkeletonBuilder.init().then(() => { _ready = true; });

export function isSkeletonReady(): boolean { return _ready; }
```

Any strategy that calls the skeleton utility falls back to OBB if `isSkeletonReady()` returns false.

### Input Format

```typescript
SkeletonBuilder.buildFromPolygon(rings: Ring[]): SkeletonResult | null
// Ring = [number, number][]
```

- First ring: **outer boundary, CCW winding, closed** (last point === first point)
- Remaining rings: **holes, CW winding, closed**
- Returns `null` on invalid input — never throws

**Preparing rings from existing code:**

```typescript
// normalizeRing() from roofGeometryUtils.ts detects winding
const { isCCW } = normalizeRing(outerRing);
const outerCCW = isCCW ? outerRing : [...outerRing].reverse();
// Append closure vertex
const outerClosed = [...outerCCW, outerCCW[0]!];

// Inner rings must be CW
const holesClosed = (innerRings ?? []).map((inner) => {
  const { isCCW: innerCCW } = normalizeRing(inner);
  const cwRing = innerCCW ? [...inner].reverse() : inner;
  return [...cwRing, cwRing[0]!];
});
```

### Output Format

```typescript
interface SkeletonResult {
  vertices: [x: number, y: number, z?: number][];
  polygons: number[][];
}
```

- **`vertices`**: all vertices (boundary + skeleton interior)
  - Boundary vertices: `z = 0`
  - Interior skeleton vertices: `z = shrink distance` = distance from nearest edge = roof height proxy
- **`polygons`**: each entry is a face — array of indices into `vertices`
  - One face per original footprint edge → directly maps to one slope face per eave edge
  - Vertices ordered CCW

### Height Mapping

```typescript
const maxZ = Math.max(...result.vertices.map(v => v[2] ?? 0));
const scale = maxZ > 0 ? roofHeight / maxZ : 0;
const vertexHeight = (v: [number, number, number?]) => (v[2] ?? 0) * scale;
```

---

## `poly2tri`

Constrained Delaunay Triangulation (CDT). TypeScript types bundled. Package name on npm is `poly2tri` (not `poly2tri-js`).

### API

```typescript
import * as poly2tri from 'poly2tri';

// Contour: any object with {x, y} — duck typed
const contour = ring.map(([x, y]) => ({ x, y }));

const swctx = new poly2tri.SweepContext(contour);

// Add holes
swctx.addHole(holeRing.map(([x, y]) => ({ x, y })));

// Triangulate
swctx.triangulate();

// Read results
const triangles = swctx.getTriangles(); // poly2tri.Triangle[]
for (const tri of triangles) {
  const [p0, p1, p2] = tri.getPoints(); // {x, y}[]
  // or: tri.getPoint(0), tri.getPoint(1), tri.getPoint(2)
}
```

### Critical Edge Cases — Library Throws, Does Not Return Null

| Condition | Mitigation |
|-----------|------------|
| Duplicate points (within ~1e-6) | Deduplicate input before calling |
| Collinear points on boundary | Remove collinear vertices from ring |
| Hole touching outer boundary | Validate topology before calling |

### When to Use poly2tri vs ShapeUtils

- **`ShapeUtils.triangulateShape`** (earcut, already in project): use for all top-face triangulation with holes. Sufficient for flat, skillion, and slope faces where no interior edges need to be constrained.
- **`poly2tri`**: only when Steiner points or interior constrained edges (ridge/break lines embedded in the triangulation) are required.

Start with `ShapeUtils` everywhere. Add `poly2tri` only if constraint edge failures appear (YAGNI).

---

## `@countertype/clipper2-ts`

Polygon offset/inset. Package name is `@countertype/clipper2-ts` (not `clipper-lib`). Native float coordinates — no 1e6 scaling factor needed. TypeScript-native. Actively maintained (last release Dec 2025).

### API

```typescript
import { inflatePaths, JoinType, EndType } from '@countertype/clipper2-ts';

// Input: array of paths, each path is {x, y}[]
// Negative delta = inset (shrink inward)
const result = inflatePaths(
  [ring.map(([x, y]) => ({ x, y }))],
  -insetDistance,       // negative = shrink
  JoinType.Miter,       // sharp corners — correct for architectural break lines
  EndType.Polygon       // closed polygon
);
// result: {x, y}[][] — empty array if polygon collapses entirely
```

### Why Not `clipper-lib`

`clipper-lib` (Clipper1) requires integer coordinates with a manual scale factor (typically 1e6), has no TypeScript types, and is not actively maintained. `@countertype/clipper2-ts` is the direct successor: native float, full TypeScript, same algorithm.

---

## Shared Utility Files

These utilities wrap the three libraries and are shared across all skeleton-based strategies:

| File | Wraps | Used By |
|------|-------|---------|
| `src/features/building/roofStrategies/straightSkeletonUtils.ts` | `straight-skeleton` | Gabled, Hipped, Half-Hipped, Gambrel, Mansard, Saltbox |
| `src/features/building/roofStrategies/polygonOffsetUtils.ts` | `@countertype/clipper2-ts` | Gambrel, Mansard |
| `src/features/building/roofStrategies/cdtUtils.ts` | `poly2tri` + `ShapeUtils` fallback | All complex roof types |

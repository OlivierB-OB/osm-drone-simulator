# Hipped Roof Implementation Plan

## 1. Architecture & Algorithms

### 1.1 Algorithm Overview

The hipped roof is a pitched roof with slopes on all sides. Unlike a gabled roof (which has vertical walls at the ridge ends), a hipped roof has triangular sloped faces (hip faces) at the short ends that connect the ridge to the eave corners. The spec mandates using the **Straight Skeleton** algorithm as the primary approach.

**Why Straight Skeleton (not OBB projection):**

The current (invalid) implementation uses OBB-based distance projections to compute per-vertex heights. This approach has fundamental limitations:
- It cannot produce correct geometry for L-shaped, T-shaped, or irregular footprints
- It does not identify distinct roof faces (slopes vs. hips)
- It produces smooth height gradients instead of sharp ridge/hip edges
- It cannot handle courtyards correctly

The straight skeleton naturally computes:
- **Ridge lines** where opposing edges collapse toward each other
- **Hip edges** where corners collapse toward the ridge
- **Roof face polygons** bounded by skeleton edges, ridge, and eave segments

### 1.2 Algorithm Pipeline

```
Footprint polygon → [Straight Skeleton] → Skeleton graph → [Face extraction]
→ [Height assignment] → [Per-face CDT triangulation] → BufferGeometry
```

### 1.3 Degenerate Cases

| Condition | Behavior |
|-----------|----------|
| Square / near-square footprint | Delegate to `PyramidalRoofStrategy` |
| Triangle footprint (3 vertices) | Skeleton collapses to single apex; becomes pyramidal |
| Very thin footprint (aspect ratio > 10:1) | Skeleton produces a long ridge with tiny hip faces |
| Fewer than 3 vertices | Return empty `BufferGeometry` |
| Courtyard (inner rings) | Inner holes remain open |

### 1.4 Height Computation

The straight skeleton assigns each interior node a **distance from the nearest edge** (the shrink distance). For a hipped roof:

- **Eave vertices** (original footprint): height = 0
- **Ridge/skeleton vertices**: height = `min(skeletonDistance * scaleFactor, roofHeight)` where `scaleFactor = roofHeight / maxSkeletonDistance`

## 2. Implementation Steps

### Step 1: Install Dependencies

```bash
bun add straight-skeleton poly2tri
```

### Step 2: Create Skeleton-to-Faces Utility

**File**: `src/features/building/roofStrategies/straightSkeletonUtils.ts`

```typescript
interface SkeletonVertex {
  x: number;
  y: number;
  height: number;
}

interface RoofFace {
  vertices: SkeletonVertex[];
  isHip: boolean;
}

interface SkeletonResult {
  faces: RoofFace[];
  ridgeVertices: SkeletonVertex[];
  naturalRidgeAngle: number;
}
```

Functions:
- `computeRoofSkeleton(outerRing, innerRings?, roofHeight): SkeletonResult`
- `extractFacesFromSkeleton(skeletonGraph): RoofFace[]`
- `assignHeights(faces, roofHeight, maxShrinkDistance): void`

### Step 3: Create CDT Triangulation Utility

**File**: `src/features/building/roofStrategies/cdtUtils.ts`

Functions:
- `triangulateFace(vertices): number[][]`
- `triangulateFaceWithHoles(outer, holes): number[][]`

### Step 4: Implement HippedRoofStrategy

**File**: `src/features/building/roofStrategies/HippedRoofStrategy.ts` -- Complete rewrite.

Algorithm:
1. Normalize ring, guard count < 3
2. Compute OBB → check degenerate (square) → delegate to PyramidalRoofStrategy
3. Compute straight skeleton of footprint
4. Extract roof faces, assign heights
5. Triangulate each face using CDT
6. Assemble all triangles into BufferGeometry
7. computeVertexNormals()

### Step 5: Fallback Path

If skeleton library fails, fall back to OBB-based hipped approximation using the existing height function approach.

## 3. File Structure

| File | Action | Purpose |
|------|--------|---------|
| `src/features/building/roofStrategies/straightSkeletonUtils.ts` | **Create** | Skeleton wrapper + face extraction |
| `src/features/building/roofStrategies/cdtUtils.ts` | **Create** | CDT triangulation wrapper |
| `src/features/building/roofStrategies/HippedRoofStrategy.ts` | **Replace** | Skeleton-based hipped strategy |
| `src/features/building/roofStrategies/HippedRoofStrategy.test.ts` | **Create** | Unit tests |
| `src/features/building/roofStrategies/straightSkeletonUtils.test.ts` | **Create** | Skeleton utility tests |
| `src/features/building/roofStrategies/cdtUtils.test.ts` | **Create** | CDT utility tests |
| `src/features/building/RoofGeometryFactory.test.ts` | **Modify** | Update expectations |
| `package.json` | **Modify** | Add dependencies |

## 4. Testing Strategy

### Skeleton Utility Tests

- Rectangle: 2 ridge vertices + correct face count
- Square: single apex (4 faces converging to center)
- L-shaped: correct branching skeleton
- Triangle: single apex point
- Courtyard: faces only on outer ring
- Height scaling: correctly scaled to roofHeight

### HippedRoofStrategy Tests

| Test Case | Validation |
|-----------|------------|
| Rectangle produces valid geometry | Non-null, non-zero vertex count |
| Vertex heights in [0, roofHeight] | All Y values in range |
| Square degenerates to pyramidal | Vertex count = 12 |
| All face normals have positive Y | Normals check |
| Non-indexed geometry | `geom.index === null` |
| Ridge at roofHeight | Max Y = roofHeight |
| Eave at Y=0 | Min Y = 0 |
| L-shaped footprint | Valid geometry, correct face count |
| CW winding | Same result as CCW |
| Inner ring (courtyard) | Hole preserved |
| Fallback on degenerate polygon | Returns valid geometry |
| ridgeAngle=0 vs PI/2 | Ridge runs along expected axis |

### Performance Targets

| Metric | Target |
|--------|--------|
| Skeleton computation | < 5ms per roof |
| CDT per face | < 2ms per face |
| Total per roof | < 15ms |

## 5. Dependencies

| Package | Purpose |
|---------|---------|
| `straight-skeleton` | Polygon medial axis computation for ridge/hip extraction |
| `poly2tri` | Constrained Delaunay Triangulation for face meshing |

## 6. Open Questions

1. **`straight-skeleton` API shape**: **RESOLVED** — See `roof/library-apis.md` for confirmed API, input/output format, WASM async init strategy, and winding conversion helpers. TypeScript types are bundled — no `.d.ts` needed.
2. **`poly2tri` vs `earcut` for simple faces**: **RESOLVED** — Use `ShapeUtils.triangulateShape` (earcut) for all top-face triangulation. `poly2tri` deferred until constrained edges are needed (YAGNI). See `roof/library-apis.md`.
3. **Ridge direction alignment**: For hipped roofs, the skeleton's natural direction is architecturally correct -- use it as-is.
4. **TypeScript types for `straight-skeleton`**: **RESOLVED** — Types are bundled with the package. No local `.d.ts` needed.
5. **Inner ring handling**: Skeleton computation should include inner rings; no roof faces should cover courtyard area.

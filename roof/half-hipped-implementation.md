# Half-Hipped Roof Implementation Plan

## 1. Architecture & Algorithms

### 1.1 What Is a Half-Hipped Roof

A half-hipped (jerkinhead / clipped-gable) roof is a hybrid between gabled and hipped roofs. The ridge runs along the building's long axis. On the short (gable-end) sides, the upper portion of what would be a vertical gable wall is replaced by a small sloped hip face. The lower portion remains a vertical gable wall. This creates a distinctive profile: full slopes on the long sides, and at each short end, a vertical gable wall capped by a small triangular hip slope.

### 1.2 Algorithm Selection

The spec mandates the **Straight Skeleton** algorithm as the primary approach for ridge-based roofs, including half-hipped. The straight skeleton computes the medial axis of the building footprint, which naturally produces:

- The **ridge line** (where opposite building edges collapse toward each other)
- **Hip endpoints** (where corners collapse to the ridge)
- Correct geometry for **any footprint shape** (L-shaped, T-shaped, irregular)

**Why Straight Skeleton (not OBB-only):**

The current implementation uses an OBB-based height function that has fundamental limitations:
- Cannot produce correct geometry for L-shaped, T-shaped, or irregular footprints
- Does not identify distinct roof faces (slopes vs. hips vs. gable walls)
- Produces smooth height gradients instead of sharp ridge/hip edges
- Cannot properly separate gable wall geometry from hip face geometry
- The height blending formula is geometrically incorrect (scales entire gabled profile instead of capping at a constant height)

### 1.3 Two-Tier Strategy

1. **Fast path (OBB)**: For buildings where the footprint is approximately rectangular (all vertices within a small tolerance of the OBB), use the OBB to directly compute ridge, hip truncation points, and face polygons without skeleton computation
2. **Full path (Straight Skeleton)**: For irregular/complex footprints, compute the straight skeleton and derive ridge, slopes, hip faces, and gable walls from skeleton topology

Both paths produce the same geometry types and feed into the same CDT triangulation and BufferGeometry assembly.

### 1.4 Geometry Components

A half-hipped roof produces four types of geometry:

| Component | Description | Triangulation |
|-----------|-------------|---------------|
| **Slope faces** (2) | Inclined planes from ridge to eave edges on long sides | CDT (poly2tri) for robustness with holes |
| **Hip faces** (2) | Small triangular/trapezoidal sloped faces at the top of each gable end | Simple triangle fan |
| **Gable walls** (2) | Vertical trapezoidal walls below the hip line at each gable end | Quad strip (2 triangles) |
| **Side walls** | Vertical walls connecting eave to wall top around perimeter | Quad strips (2 triangles per edge) |

### 1.5 Key Parameter

**`hipFraction = 0.3`** -- the top 30% of the gable end height is hipped, the bottom 70% remains a vertical gable wall. The hip truncation height is `clipH = roofHeight * (1 - hipFraction)`.

## 2. Algorithm Pipeline

```
Footprint polygon
  → [Straight Skeleton] → Skeleton graph (ridge + hip edges)
  → [Face extraction] → Hipped roof faces
  → [Hip truncation] → Split hip faces at clipH, generate gable walls below
  → [Height assignment] → Per-vertex heights
  → [Per-face CDT triangulation] → Triangle lists
  → [Assembly] → BufferGeometry
```

### 2.1 Hip Truncation Algorithm

The half-hipped roof starts from a fully hipped skeleton and truncates:

1. Compute the full hipped skeleton (same as `HippedRoofStrategy`)
2. For each **hip face** (end faces where corners collapse to ridge):
   - Compute `clipH = roofHeight * (1 - hipFraction)`
   - Split the hip face horizontally at height `clipH`
   - The **upper portion** (above `clipH`) becomes the sloped hip face
   - The **lower portion** (below `clipH`) becomes a vertical gable wall
3. The split creates new vertices along the `clipH` contour on each hip face
4. Slope faces on the long sides are unaffected

### 2.2 Height Assignment

- **Eave vertices** (original footprint): height = 0
- **Ridge vertices**: height = `roofHeight`
- **Hip truncation vertices**: height = `clipH = roofHeight * (1 - hipFraction)`
- **Skeleton interior vertices**: `min(skeletonDistance * scaleFactor, roofHeight)` where `scaleFactor = roofHeight / maxSkeletonDistance`

## 3. Implementation Steps

### Step 1: Install Dependencies

```bash
bun add straight-skeleton poly2tri
```

Shared with other skeleton-based strategies; may already be installed.

### Step 2: Create Skeleton-to-Faces Utility (shared)

**File**: `src/features/building/roofStrategies/straightSkeletonUtils.ts`

This utility is shared across hipped, half-hipped, gabled, mansard, gambrel, and saltbox strategies. If it already exists from the hipped implementation, reuse it.

```typescript
interface SkeletonVertex {
  x: number;
  y: number;
  height: number;
}

interface RoofFace {
  vertices: SkeletonVertex[];
  isHip: boolean;
  sourceEdgeIndex: number;
}

interface SkeletonResult {
  faces: RoofFace[];
  ridgeVertices: SkeletonVertex[];
  maxShrinkDistance: number;
}
```

Functions:
- `computeRoofSkeleton(outerRing, innerRings?): SkeletonResult`
- `extractFacesFromSkeleton(skeletonGraph): RoofFace[]`
- `assignHeights(faces, roofHeight, maxShrinkDistance): void`

### Step 3: Create CDT Triangulation Utility (shared)

**File**: `src/features/building/roofStrategies/cdtUtils.ts`

Functions:
- `triangulateFace(vertices: [number, number][]): number[][]`
- `triangulateFaceWithHoles(outer, holes): number[][]`

### Step 4: Implement HalfHippedRoofStrategy

**File**: `src/features/building/roofStrategies/HalfHippedRoofStrategy.ts` -- Complete rewrite.

Algorithm:
1. Normalize ring, guard `count < 3`
2. Compute OBB, check for degenerate cases:
   - `hipFraction <= 0` → delegate to `GabledRoofStrategy`
   - `hipFraction >= 1` → delegate to `HippedRoofStrategy`
   - Square/near-square → delegate to `PyramidalRoofStrategy`
3. Classify footprint complexity (rectangular vs complex)
4. Compute skeleton or use OBB fast path → produces full hipped faces
5. **Truncate hip faces at `clipH`**:
   - For each hip face, find the horizontal line at `clipH`
   - Interpolate new vertices along hip face edges where height = `clipH`
   - Upper portion → sloped hip face polygon
   - Lower portion → vertical gable wall polygon (Y=0 at bottom, Y=`clipH` at top)
6. Triangulate each face using CDT
7. Build side walls from original footprint perimeter
8. Assemble all triangles into BufferGeometry
9. `computeVertexNormals()`

### Step 5: OBB Fast Path (optimization)

For rectangular buildings, skip straight skeleton entirely:

1. Compute ridge endpoints from OBB center ± `halfLength` along ridge axis
2. Compute hip endpoints by insetting ridge endpoints by `halfWidth` along ridge (same as hipped)
3. Compute `clipH = roofHeight * (1 - hipFraction)`
4. Find the hip face split line at `clipH` by linear interpolation along hip edges
5. Construct face polygons directly:
   - 2 slope faces (long sides): trapezoids from eave to ridge
   - 2 hip faces (short ends, upper): small triangles/trapezoids above `clipH`
   - 2 gable walls (short ends, lower): vertical trapezoids from Y=0 to Y=`clipH`
6. Triangulate and assemble

### Step 6: Fallback Path

If the skeleton library fails on a degenerate polygon, fall back to the OBB fast path with a logged warning.

## 4. Data Structures

```typescript
/** Half-hip truncation result for one gable end */
interface HipTruncation {
  hipFace: SkeletonVertex[];
  gableWall: SkeletonVertex[];
  clipHeight: number;
}

/** A slope face polygon before triangulation */
interface SlopeFace {
  boundary: [number, number][];
  heights: number[];
}

/** A gable wall polygon (vertical) */
interface GableWall {
  vertices: [number, number][];
  heights: number[];
}
```

## 5. File Structure

| File | Action | Purpose |
|------|--------|---------|
| `src/features/building/roofStrategies/HalfHippedRoofStrategy.ts` | **Rewrite** | Skeleton-based half-hipped with hip truncation |
| `src/features/building/roofStrategies/HalfHippedRoofStrategy.test.ts` | **Rewrite** | Comprehensive test suite |
| `src/features/building/roofStrategies/straightSkeletonUtils.ts` | **Create** (if not exists) | Skeleton wrapper + face extraction |
| `src/features/building/roofStrategies/cdtUtils.ts` | **Create** (if not exists) | CDT triangulation wrapper |
| `src/features/building/RoofGeometryFactory.ts` | **No change** | Already registers half-hipped |
| `src/features/building/RoofGeometryFactory.test.ts` | **Extend** | Update half-hipped test expectations |
| `src/features/building/roofStrategies/types.ts` | **No change** | Existing interfaces sufficient |
| `package.json` | **Modify** (if needed) | Add `straight-skeleton` and `poly2tri` |

## 6. Testing Strategy

### HalfHippedRoofStrategy Tests

| Test Case | Validation |
|-----------|------------|
| Rectangle produces valid geometry | Non-null, non-zero vertex count |
| Vertex heights in [0, roofHeight] | All Y values in range |
| Ridge vertices at roofHeight | Max Y = roofHeight |
| Eave at Y=0 | Min Y = 0 |
| Hip truncation vertices at clipH | Vertices at `roofHeight * (1 - hipFraction)` exist |
| Gable walls are vertical | Gable wall face normals have Y=0 (horizontal outward) |
| Hip faces are sloped | Hip face normals have positive Y component |
| Square degenerates to pyramidal | Delegated correctly |
| hipFraction=0 degenerates to gabled | Delegated correctly |
| hipFraction=1 degenerates to hipped | Delegated correctly |
| All face normals have positive Y (slope/hip) | Normal direction correctness |
| Non-indexed geometry | `geom.index === null` |
| CW winding produces same result as CCW | Winding independence |
| L-shaped footprint | Valid geometry, correct face count |
| Inner ring (courtyard) | Hole preserved, no roof over courtyard |
| ridgeAngle=0 vs PI/2 | Ridge runs along expected axis |
| Fallback on degenerate polygon | Returns valid geometry |

### Hip Truncation Tests

- clipH correctly computed as `roofHeight * (1 - hipFraction)`
- Hip face split produces upper triangle and lower trapezoid
- Interpolated vertices lie on original hip face edges
- Total area before and after split is preserved

### Performance Targets

| Metric | Target |
|--------|--------|
| Rectangular fast path | < 1ms per roof |
| Skeleton computation | < 5ms per roof |
| CDT per face | < 2ms per face |
| Total per roof (complex) | < 15ms |

## 7. Dependencies

| Package | Purpose |
|---------|---------|
| `straight-skeleton` | Polygon medial axis computation for ridge/hip extraction |
| `poly2tri` | Constrained Delaunay Triangulation for face meshing |

These are shared with other skeleton-based roof strategies (hipped, gabled, mansard, gambrel, saltbox).

## 8. Edge Cases

| Condition | Behavior |
|-----------|----------|
| `hipFraction <= 0` | Delegate to `GabledRoofStrategy` |
| `hipFraction >= 1` | Delegate to `HippedRoofStrategy` |
| Square / near-square footprint | Delegate to `PyramidalRoofStrategy` |
| Triangle footprint (3 vertices) | Skeleton collapses to single apex; becomes pyramidal |
| Very thin footprint (aspect ratio > 10:1) | Skeleton produces long ridge with tiny hip faces; truncation still applies |
| Fewer than 3 vertices | Return empty `BufferGeometry` |
| Courtyard (inner rings) | Inner holes remain open; slope faces have voids |
| CW winding | Detected by `normalizeRing()`; handled consistently |
| Closed ring (last==first) | Detected by `normalizeRing()`; count adjusted |
| roofHeight = 0 | Produces flat triangulation at Y=0 |
| Skeleton library failure | Fallback to OBB fast path with logged warning |

## 9. Open Questions

1. **`straight-skeleton` API shape**: **RESOLVED** — See `roof/library-apis.md` for confirmed API, input/output format, WASM async init strategy, and winding conversion helpers. TypeScript types are bundled — no `.d.ts` needed.

2. **Hip face identification**: The skeleton naturally classifies faces, but the method to distinguish hip faces (at gable ends) from slope faces (on long sides) needs verification. Heuristic: hip faces are those whose source edge is a "short" edge of the polygon.

3. **TypeScript types for `straight-skeleton`**: **RESOLVED** — Types are bundled with the package. No local `.d.ts` needed.

4. **Shared skeleton infrastructure**: If the hipped strategy is implemented first, the shared utilities (`straightSkeletonUtils.ts`, `cdtUtils.ts`) should already exist. The half-hipped strategy adds only the hip truncation logic on top.

5. **hipFraction configurability**: Currently hardcoded at 0.3. Could be made configurable via `RoofParams` if OSM/Overture data provides a half-hip ratio. For now, YAGNI -- hardcode it.

# Gabled Roof Implementation Plan

## 1. Architecture & Algorithms

### 1.1 What is a Gabled Roof

A gabled roof has two sloping planes meeting at a central ridge line that runs along the building's longest axis. The ridge ends at the building perimeter with vertical triangular gable walls (no hip faces). Water drains off the two long sides perpendicular to the ridge.

### 1.2 Algorithm Selection

The specification mandates the **Straight Skeleton** algorithm as the primary approach for ridge-based roofs including gabled. The straight skeleton computes the medial axis of the building footprint, which naturally produces:

- The ridge line (where opposite building edges collapse toward each other)
- Ridge endpoints (where skeleton segments terminate)
- Correct geometry for any footprint shape (L-shaped, T-shaped, irregular)

**Why Straight Skeleton over the current OBB approach:**

The current implementation uses a simple projection-based height formula that is fundamentally flawed for non-rectangular buildings because:

1. It treats the roof as a single infinite V-shaped trough, producing incorrect geometry for L-shaped or irregular footprints
2. It does not compute actual gable walls (vertical triangular end pieces)
3. It does not identify ridge endpoints on the building perimeter
4. The ridge is implicitly at the centroid rather than correctly derived from skeleton topology

### 1.3 Two-Tier Strategy

1. **Fast path (OBB)**: For buildings where the footprint is approximately rectangular (all vertices within a small tolerance of the OBB), use the OBB-based approach with explicit gable wall generation
2. **Full path (Straight Skeleton)**: For irregular/complex footprints, compute the straight skeleton and derive ridge, slopes, and gable walls from skeleton topology

### 1.4 Geometry Components

A gabled roof produces three types of geometry:

| Component | Description | Triangulation |
|-----------|-------------|---------------|
| **Slope faces** (2) | Inclined planes from ridge to eave edges | CDT (poly2tri) for robustness with holes |
| **Gable walls** (2) | Vertical triangular walls at ridge endpoints | Simple triangle fan |
| **Side walls** | Vertical walls connecting eave to wall top | Quad strips (2 triangles per edge) |

## 2. Input Parameters

### From RoofParams (existing interface)

| Parameter | Source | Purpose |
|-----------|--------|---------|
| `outerRing` | Building polygon outer ring | Footprint vertices in local meter coords |
| `innerRings` | Building polygon inner rings | Courtyards/holes to preserve |
| `roofHeight` | `roof_height` tag or default | Vertical distance from eave to ridge |
| `ridgeAngle` | Resolved from `roof_direction` / `roof_orientation` / OBB | Ridge direction in local radians |
| `roofShape` | `roof_shape` tag | Must be `"gabled"` |

## 3. Geometry Pipeline

### Step 1: Normalize Input

```
Input: outerRing, innerRings, roofHeight, ridgeAngle
1. normalizeRing(outerRing) → { count, isCCW }
2. Ensure CCW winding for consistent normals
3. Validate count >= 3
```

### Step 2: Classify Footprint Complexity

```
1. computeOBB(outerRing) → { center, halfLength, halfWidth, angle }
2. Compute max deviation of vertices from OBB edges
3. If max deviation < threshold (e.g., 0.5m) → RECTANGULAR path
4. Else → COMPLEX path (straight skeleton)
```

### Step 3a: Rectangular Path (OBB-based)

```
1. Compute ridge line at OBB center, running along-ridge axis
2. Ridge endpoints at center ± halfLength * along-ridge direction
3. Partition outer ring vertices into two slope groups by across-ridge projection
4. Build slope face polygons for each side
5. Build gable wall triangles at ridge endpoints
6. Triangulate slope faces
```

### Step 3b: Complex Path (Straight Skeleton)

```
1. Compute straight skeleton of outerRing (with innerRings as holes)
2. Extract ridge topology from skeleton
3. For gabled roof, modify skeleton to remove hip faces
4. Extend ridge segments to the boundary perimeter (convert hips to gables)
5. Assign each footprint edge to its nearest ridge segment
6. Build slope face polygons from skeleton face assignments
7. Build gable walls at ridge termination points
8. Triangulate all faces using CDT
```

### Step 4: Assemble BufferGeometry

```
1. Allocate positions array
2. Write slope triangles with computed heights
3. Write gable wall triangles (vertices at Y=0 and Y=roofHeight)
4. Write side wall quads
5. computeVertexNormals()
6. Return non-indexed BufferGeometry
```

## 4. Data Structures

```typescript
/** Ridge line segment in local coordinates */
interface RidgeLine {
  start: [number, number];
  end: [number, number];
  height: number;
}

/** A slope face polygon before triangulation */
interface SlopeFace {
  boundary: [number, number][];
  heights: number[];
  side: number;
}

/** A gable wall triangle */
interface GableWall {
  vertices: [[number, number], [number, number], [number, number]];
  heights: [number, number, number];
}
```

## 5. Implementation Steps (Ordered)

### Phase 1: Add Dependencies

1. **Add `straight-skeleton` npm package** -- For medial axis computation on complex footprints
2. **Add `poly2tri` npm package** -- For CDT triangulation of slope faces with holes

### Phase 2: Implement Core Geometry Utilities

**File: `src/features/building/roofStrategies/roofGeometryUtils.ts`** -- Add new utility functions:

1. `classifyFootprintComplexity(ring, obb): 'rectangular' | 'complex'`
2. `computeRidgeLine(obb, ridgeAngle, ring): RidgeLine`
3. `partitionVerticesBySide(ring, count, ridgeAngle, obbCenter): { left: number[], right: number[] }`
4. `buildGableWallTriangles(ridgePoint, eaveLeft, eaveRight, roofHeight): Float32Array`

### Phase 3: Implement GabledRoofStrategy

**File: `src/features/building/roofStrategies/GabledRoofStrategy.ts`** -- Complete rewrite:

1. **`create(params: RoofParams): BufferGeometry`** -- Main entry
2. **`createRectangular(params, obb): BufferGeometry`** (private) -- OBB fast path
3. **`createComplex(params): BufferGeometry`** (private) -- Straight skeleton path

## 6. Edge Case Handling

| Edge Case | Handling |
|-----------|----------|
| Less than 3 vertices | Return empty `BufferGeometry` |
| Degenerate (collinear vertices) | Fallback to flat plane at roofHeight=0 |
| Square footprint | Ridge along one axis; two gable walls become isoceles triangles |
| L-shaped footprint | Complex path: skeleton produces multiple ridge segments |
| T-shaped footprint | Complex path: skeleton handles naturally |
| Courtyard (inner ring) | Slope faces have holes; CDT preserves hole |
| CW winding | Detected by `normalizeRing()`; triangle winding flipped |
| Closed ring (last==first) | Detected by `normalizeRing()`; count adjusted |
| roofHeight = 0 | Produces flat triangulation at Y=0 |
| Straight skeleton failure | Fallback to OBB-based approach with logged warning |

## 7. File Structure

| File | Action | Purpose |
|------|--------|---------|
| `src/features/building/roofStrategies/GabledRoofStrategy.ts` | **Rewrite** | New implementation with skeleton + OBB fast path |
| `src/features/building/roofStrategies/GabledRoofStrategy.test.ts` | **Create** | Comprehensive unit tests |
| `src/features/building/roofStrategies/roofGeometryUtils.ts` | **Extend** | Add ridge computation and footprint classification utilities |
| `src/features/building/roofStrategies/types.ts` | **No change** | Existing interfaces sufficient |
| `src/features/building/RoofGeometryFactory.ts` | **No change** | Already wired |
| `src/features/building/RoofGeometryFactory.test.ts` | **Extend** | Update gabled test expectations |
| `package.json` | **Modify** | Add dependencies |

## 8. Testing Strategy

### Unit Tests

**Basic geometry tests:**
- Rectangle (20x10): produces non-indexed geometry with correct vertex count
- Ridge vertices at Y=roofHeight, eave vertices at Y=0
- All vertex Y values in [0, roofHeight]
- Has upward-facing slope normals
- Has two gable wall faces (vertical, perpendicular to ridge)
- CCW and CW winding both produce correct outward normals

**Ridge direction tests:**
- `ridgeAngle=0`: ridge along X axis
- `ridgeAngle=PI/2`: ridge along Y axis
- `ridgeAngle=PI/4`: diagonal ridge

**Footprint shape tests:**
- Square: short ridge, two isoceles gable triangles
- Elongated rectangle: long ridge, narrow gable triangles
- L-shaped polygon: multiple ridge segments (complex path)
- Triangle: degenerate case, should not crash

**Courtyard tests:**
- Rectangle with rectangular hole: slopes have void
- Vertex count accounts for hole vertices

**Edge case tests:**
- roofHeight=0: all vertices at Y=0
- 3-vertex polygon (triangle): valid geometry
- Nearly-collinear vertices: does not crash

### Performance Targets

| Metric | Target |
|--------|--------|
| Simple rectangle | < 1ms |
| Complex polygon (20 vertices) | < 5ms |
| Complex with courtyard | < 10ms |
| Typical tile (50 gabled buildings) | < 100ms |

## 9. Dependencies

| Package | Justification |
|---------|---------------|
| `straight-skeleton` | Medial axis computation for complex footprints. Specified in ROOF_RENDERING.md |
| `poly2tri` | CDT triangulation for slope faces with holes. Specified in ROOF_RENDERING.md |

These dependencies will also be needed by other skeleton-based roof types (hipped, half-hipped, mansard, gambrel, saltbox).

## 10. Open Questions

1. **`straight-skeleton` npm package API**: **RESOLVED** — See `roof/library-apis.md` for confirmed API, input/output format, WASM async init strategy, and winding conversion helpers.

2. **`poly2tri` vs Three.js ShapeUtils**: **RESOLVED** — See `roof/library-apis.md`. Use `ShapeUtils.triangulateShape` (earcut) for all top-face triangulation. `poly2tri` is deferred until interior constrained edges are needed (YAGNI).

3. **Gable wall ownership**: The gable walls are vertical surfaces with a triangle from two eave-level vertices up to the ridge point, which is NOT on the footprint boundary. A new assembly approach is needed beyond `buildOutlineRoofGeometry`.

4. **Shared skeleton infrastructure**: Should a shared `SkeletonRoofBase` be created now, or extract common patterns when the second strategy is reimplemented? KISS/YAGNI answer: implement for gabled first, extract later.

5. **Fallback behavior for skeleton failures**: The straight skeleton can fail on degenerate polygons. The threshold for "rectangular enough" needs tuning with real-world data.

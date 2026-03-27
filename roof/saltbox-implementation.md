# Saltbox Roof Implementation Plan

## 1. Architecture & Algorithms

### 1.1 What is a Saltbox Roof?

A saltbox roof is an asymmetrical gabled roof where the ridge line is offset from the building centerline toward one side. This produces:
- A **short, steep slope** on one side
- A **long, gentle slope** on the opposite side
- **Gable ends** (vertical scalene-triangular walls) at both ends of the ridge

### 1.2 Algorithm Selection

The spec mandates the **Straight Skeleton** algorithm as the primary approach for ridge-based roofs including saltbox. The straight skeleton computes the medial axis of the building footprint, which naturally produces ridge lines, endpoints, and correct topology for any footprint shape.

**Why Straight Skeleton over OBB-only:**

The OBB approach cannot handle L-shaped, T-shaped, or irregular footprints. It also does not compute actual gable walls or identify ridge endpoints on the building perimeter. The skeleton provides correct topology for all shapes.

**Saltbox-specific adaptation:** The straight skeleton produces a *symmetric* medial axis (equidistant from all edges). The saltbox asymmetry is introduced by offsetting the ridge perpendicular to its direction after skeleton extraction. This uses the skeleton for topology (ridge direction, endpoints, face assignment) while applying the saltbox-specific offset as a post-processing step.

### 1.3 Two-Tier Strategy

1. **Fast path (OBB)**: For buildings where the footprint is approximately rectangular (all vertices within a small tolerance of the OBB), compute the ridge directly from the OBB with an asymmetric tent height function
2. **Full path (Straight Skeleton)**: For irregular/complex footprints, compute the skeleton, extract the ridge, offset it, and derive slopes and gable walls from skeleton topology

### 1.4 Geometry Components

A saltbox roof produces three types of geometry:

| Component | Description | Triangulation |
|-----------|-------------|---------------|
| **Slope faces** (2) | Asymmetric inclined planes from offset ridge to eave edges | CDT (poly2tri) for robustness with holes |
| **Gable walls** (2) | Vertical scalene-triangular walls at ridge endpoints | Simple triangle fan |
| **Side walls** | Vertical walls connecting eave to wall top | Quad strips (2 triangles per edge) |

### 1.5 Key Differences from Gabled

| Aspect | Gabled | Saltbox |
|--------|--------|---------|
| Ridge position | Centered (equidistant from both eaves) | Offset toward one side |
| Slope lengths | Equal on both sides | Short+steep on one side, long+gentle on other |
| Height function | Symmetric tent | Asymmetric tent with different half-widths per side |
| Gable walls | Isoceles triangles | Scalene triangles (ridge apex not at center) |
| Skeleton usage | Ridge = medial axis directly | Ridge = medial axis + offset |

## 2. Input Parameters

### From RoofParams (existing interface)

| Parameter | Source | Purpose |
|-----------|--------|---------|
| `outerRing` | Building polygon outer ring | Footprint vertices in local meter coords |
| `innerRings` | Building polygon inner rings | Courtyards/holes to preserve |
| `roofHeight` | `roof_height` tag or default | Vertical distance from eave to ridge |
| `ridgeAngle` | Resolved from `roof_direction` / `roof_orientation` / OBB | Ridge direction in local radians |
| `roofShape` | `roof_shape` tag | Must be `"saltbox"` |

### Saltbox-Specific Constants

| Constant | Default | Purpose |
|----------|---------|---------|
| `RIDGE_OFFSET_FRACTION` | 0.30 | Fraction of halfWidth to offset ridge from center |
| `MAX_OFFSET_FRACTION` | 0.45 | Maximum offset to prevent near-skillion degeneration |

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
1. Compute ridge offset: ridgeOffset = halfWidth * RIDGE_OFFSET_FRACTION
2. Clamp ridgeOffset to halfWidth * MAX_OFFSET_FRACTION
3. Define two half-widths:
   - halfWidthShort = halfWidth - ridgeOffset (steep side)
   - halfWidthLong = halfWidth + ridgeOffset (gentle side)
4. Project each vertex onto across-ridge axis
5. Compute asymmetric tent height:
   - If proj >= ridgeOffset: h * max(0, 1 - (proj - ridgeOffset) / halfWidthShort)
   - If proj < ridgeOffset: h * max(0, 1 - (ridgeOffset - proj) / halfWidthLong)
6. Identify ridge endpoints at OBB center ± halfLength * along-ridge direction
7. Build scalene gable wall triangles at ridge endpoints
8. Triangulate slope faces
```

### Step 3b: Complex Path (Straight Skeleton)

```
1. Compute straight skeleton of outerRing (with innerRings as holes)
2. Extract dominant ridge line from skeleton topology
3. Offset the ridge perpendicular to its direction by ridgeOffset
4. For each footprint vertex, compute perpendicular distance to offset ridge
5. Apply asymmetric height function based on which side of the ridge
6. Build gable walls at ridge termination points on the perimeter
7. Triangulate all faces using CDT
8. On skeleton failure: fall back to OBB-based approach with logged warning
```

### Step 4: Assemble BufferGeometry

```
1. Allocate positions array
2. Write slope face triangles with computed heights
3. Write gable wall triangles (scalene: vertices at Y=0 and Y=roofHeight)
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
  side: 'short' | 'long';
}

/** A gable wall triangle (scalene for saltbox) */
interface GableWall {
  vertices: [[number, number], [number, number], [number, number]];
  heights: [number, number, number];
}
```

## 5. Implementation Steps (Ordered)

### Phase 1: Add Dependencies

1. **Add `straight-skeleton` npm package** -- For medial axis computation on complex footprints
2. **Add `poly2tri` npm package** -- For CDT triangulation of slope faces with holes

These dependencies are shared with gabled, hipped, half-hipped, mansard, and gambrel strategies.

### Phase 2: Implement Core Geometry Utilities

**File: `src/features/building/roofStrategies/roofGeometryUtils.ts`** -- Add new utility functions (if not already added by gabled implementation):

1. `classifyFootprintComplexity(ring, obb): 'rectangular' | 'complex'`
2. `computeRidgeLine(obb, ridgeAngle, ring): RidgeLine`
3. `buildGableWallTriangles(ridgePoint, eaveLeft, eaveRight, roofHeight): Float32Array`

Add saltbox-specific utility:
4. `offsetRidgeLine(ridge: RidgeLine, offsetDistance: number, acrossDirection: [number, number]): RidgeLine`

### Phase 3: Implement SaltboxRoofStrategy

**File: `src/features/building/roofStrategies/SaltboxRoofStrategy.ts`** -- Complete rewrite:

1. **`create(params: RoofParams): BufferGeometry`** -- Main entry, dispatches to rectangular or complex
2. **`createRectangular(params, obb): BufferGeometry`** (private) -- OBB fast path with asymmetric tent
3. **`createComplex(params): BufferGeometry`** (private) -- Straight skeleton + ridge offset path

## 6. Edge Case Handling

| Edge Case | Handling |
|-----------|----------|
| Less than 3 vertices | Return empty `BufferGeometry` |
| Degenerate (collinear vertices) | Fallback to flat plane at roofHeight=0 |
| Square footprint | Ridge offset still applies; shorter ridge |
| L-shaped footprint | Complex path: skeleton + offset ridge |
| T-shaped footprint | Complex path: skeleton handles naturally |
| Courtyard (inner ring) | Slope faces have holes; CDT preserves hole |
| CW winding | Detected by `normalizeRing()`; triangle winding flipped |
| Closed ring (last==first) | Detected by `normalizeRing()`; count adjusted |
| roofHeight = 0 | Produces flat triangulation at Y=0 |
| Straight skeleton failure | Fallback to OBB-based approach with logged warning |
| Near-degenerate halfWidth | Heights return 0 (flat) |
| ridgeOffset > halfWidth | Clamped by MAX_OFFSET_FRACTION (0.45) |

## 7. File Structure

| File | Action | Purpose |
|------|--------|---------|
| `src/features/building/roofStrategies/SaltboxRoofStrategy.ts` | **Rewrite** | New implementation with skeleton + OBB fast path |
| `src/features/building/roofStrategies/SaltboxRoofStrategy.test.ts` | **Rewrite** | Comprehensive unit tests |
| `src/features/building/roofStrategies/roofGeometryUtils.ts` | **Extend** | Add footprint classification, gable wall building, ridge offset utilities |
| `src/features/building/roofStrategies/types.ts` | **No change** | Existing interfaces sufficient |
| `src/features/building/RoofGeometryFactory.ts` | **No change** | Already wired |
| `src/features/building/RoofGeometryFactory.test.ts` | **Extend** | Update saltbox test expectations |
| `package.json` | **Modify** | Add dependencies (if not already present) |

## 8. Testing Strategy

### Unit Tests

**Basic geometry tests:**
- Rectangle (20x10): produces non-indexed geometry with correct vertex count
- Ridge vertices at Y=roofHeight, eave vertices at Y=0
- All vertex Y values in [0, roofHeight]
- Has upward-facing slope normals
- Has two gable wall faces (vertical, perpendicular to ridge)
- CCW and CW winding both produce correct outward normals

**Saltbox-specific asymmetry tests:**
- Ridge is offset from center (not at midpoint of across-ridge span)
- Short side slope is steeper than long side slope
- At equal horizontal distance from the ridge, short-side height < long-side height
- Gable walls are scalene triangles (ridge apex not at center of gable base)
- Vertices on the steep side reach Y=0 before vertices at the same distance on the gentle side

**Ridge direction tests:**
- `ridgeAngle=0`: ridge along X axis, asymmetry along Y
- `ridgeAngle=PI/2`: ridge along Y axis, asymmetry along X
- `ridgeAngle=PI/4`: diagonal ridge with diagonal asymmetry

**Footprint shape tests:**
- Square: ridge offset still applied, shorter ridge segment
- Elongated rectangle: long ridge, narrow scalene gable triangles
- L-shaped polygon: complex path exercised, produces valid geometry
- Triangle: degenerate case, does not crash

**Courtyard tests:**
- Rectangle with rectangular hole: slopes have void
- Vertex count accounts for hole vertices

**Edge case tests:**
- roofHeight=0: all vertices at Y=0
- 3-vertex polygon (triangle): valid geometry
- Nearly-collinear vertices: does not crash
- Straight skeleton failure: falls back to OBB

### Performance Targets

| Metric | Target |
|--------|--------|
| Simple rectangle | < 1ms |
| Complex polygon (20 vertices) | < 5ms |
| Complex with courtyard | < 10ms |
| Typical tile (50 saltbox buildings) | < 100ms |

## 9. Dependencies

| Package | Justification |
|---------|---------------|
| `straight-skeleton` | Medial axis computation for complex footprints. Specified in ROOF_RENDERING.md |
| `poly2tri` | CDT triangulation for slope faces with holes. Specified in ROOF_RENDERING.md |

These dependencies will also be needed by other skeleton-based roof types (gabled, hipped, half-hipped, mansard, gambrel).

## 10. Open Questions

1. **`straight-skeleton` npm package API**: **RESOLVED** — See `roof/library-apis.md` for confirmed API, input/output format, WASM async init strategy, and winding conversion helpers. Ridge segments are extracted from `result.polygons` face topology.

2. **Asymmetry direction**: Which side of the ridge is steep vs. gentle? Without explicit OSM data, the direction is arbitrary. Could potentially use `roof_direction` to indicate the direction the long slope faces (water drainage direction), consistent with skillion semantics.

3. **Shared skeleton infrastructure with gabled**: If gabled is implemented first, many utilities (footprint classification, skeleton extraction, CDT wiring, gable wall generation) can be reused directly. Saltbox adds only the ridge offset logic.

4. **Ridge offset fraction tuning**: 0.3 produces a reasonable visual asymmetry. Real saltbox buildings vary. The `MAX_OFFSET_FRACTION` of 0.45 prevents the ridge from being too close to one edge (which would produce a near-skillion result).

5. **`poly2tri` vs `ShapeUtils.triangulateShape`**: **RESOLVED** — Use `ShapeUtils.triangulateShape` (earcut) for all top-face triangulation. `poly2tri` deferred until interior constrained edges are needed (YAGNI). See `roof/library-apis.md`.

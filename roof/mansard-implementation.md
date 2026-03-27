# Mansard Roof Implementation Plan

## 1. Architecture & Algorithms

### 1.1 What is a Mansard Roof

A mansard roof has slopes on **all four sides**, each with **two pitches**: a steep lower slope and a shallow upper slope. The transition between pitches is called the **slope break** (or break line). Above the break line, the shallow upper slopes converge to a ridge line or near-flat plateau. It is the four-sided analog of the gambrel roof. Common on Haussmann-era Parisian buildings.

### 1.2 Algorithm Selection

The spec mandates three algorithms working together:

1. **Straight Skeleton** (`straight-skeleton`) -- computes the medial axis of the footprint, producing ridge lines and roof face topology
2. **Polygon Offset** (`@countertype/clipper2-ts`) -- computes the break line polygon by insetting the footprint by a fixed distance
3. **CDT** (`poly2tri`) -- triangulates each roof face with constrained edges for break lines and holes

**Why Straight Skeleton (not OBB-only):**

The OBB-based approach has fundamental limitations:
- Cannot produce distinct slope faces with sharp break lines (only smooth gradients)
- Cannot produce correct geometry for L-shaped, T-shaped, or irregular footprints
- Does not identify ridge topology or face assignments
- Break lines are implicit in the height function rather than explicit geometry edges

The straight skeleton naturally computes:
- **Ridge lines** where opposing edges collapse toward each other
- **Hip edges** where corners collapse toward the ridge
- **Roof face polygons** bounded by skeleton edges, ridge, and eave segments
- Correct topology for any footprint shape

### 1.3 Two-Tier Strategy

1. **Fast path (OBB)**: For buildings where the footprint is approximately rectangular (all vertices within a small tolerance of the OBB), skip skeleton and derive ridge from OBB geometry directly
2. **Full path (Straight Skeleton)**: For irregular/complex footprints, compute the skeleton and derive ridge, faces, and topology from skeleton graph

Both paths share the same polygon offset (break line) and CDT triangulation steps.

### 1.4 Geometric Decomposition

A mansard roof produces five types of geometry:

| Component | Description | Triangulation |
|-----------|-------------|---------------|
| **Lower slope faces** (N) | Steep surfaces from eave to break line | CDT per face |
| **Upper slope faces** (N) | Shallow surfaces from break line to ridge/plateau | CDT per face |
| **Break line edges** | Horizontal ring where pitch changes | Shared edges between lower and upper faces |
| **Plateau face** (optional) | Flat top when upper slopes don't fully converge | CDT |
| **Side walls** | Vertical walls connecting eave to wall top | Quad strips (2 triangles per edge) |

### 1.5 Geometry Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `BREAK_INSET_FRACTION` | 0.35 | Fraction of halfWidth used as inset distance for break line polygon |
| `BREAK_HEIGHT_FRACTION` | 0.60 | Fraction of roofHeight at which break line sits |

## 2. Input Parameters

### From RoofParams (existing interface)

| Parameter | Source | Purpose |
|-----------|--------|---------|
| `outerRing` | Building polygon outer ring | Footprint vertices in local meter coords |
| `innerRings` | Building polygon inner rings | Courtyards/holes to preserve |
| `roofHeight` | `roof_height` tag or default | Vertical distance from eave to ridge |
| `ridgeAngle` | Resolved from `roof_direction` / `roof_orientation` / OBB | Ridge direction in local radians |
| `roofShape` | `roof_shape` tag | Must be `"mansard"` |

## 3. Algorithm Pipeline

```
create(params: RoofParams): BufferGeometry
  │
  ├── 1. normalizeRing(outerRing) → { count, isCCW }
  ├── 2. computeOBB(outerRing) → obb
  ├── 3. Classify footprint complexity (rectangular vs complex)
  │
  ├── 4a. RECTANGULAR PATH:
  │     └── Compute ridge from OBB center along ridgeAngle
  │
  ├── 4b. COMPLEX PATH:
  │     ├── Compute straight skeleton of outerRing (+ innerRings)
  │     ├── Extract faces + assign heights → skeleton faces at roofHeight
  │     └── Derive ridge topology from skeleton graph
  │
  ├── 5. insetPolygon(outerRing, breakInset) → break polygon (@countertype/clipper2-ts)
  │
  ├── 6. Split skeleton/OBB faces at break line:
  │     ├── Lower faces: eave → break line, heights 0 → breakHeight
  │     └── Upper faces: break line → ridge, heights breakHeight → roofHeight
  │
  ├── 7. Build plateau face (if upper slopes don't fully converge)
  │
  ├── 8. Triangulate each face with CDT (poly2tri)
  │
  └── 9. Assemble into non-indexed BufferGeometry + computeVertexNormals()
```

## 4. Implementation Steps

### Step 1: Install Dependencies

```bash
bun add straight-skeleton @countertype/clipper2-ts poly2tri
```

These packages are shared with gabled, hipped, half-hipped, gambrel, and saltbox strategies.

### Step 2: Create/Extend Shared Utilities

These utilities may already exist from earlier roof implementations. Create only if not yet present.

**File**: `src/features/building/roofStrategies/straightSkeletonUtils.ts`

Functions (shared with hipped/gabled):
- `computeRoofSkeleton(outerRing, innerRings?, roofHeight): SkeletonResult`
- `extractFacesFromSkeleton(skeletonGraph): RoofFace[]`
- `assignHeights(faces, roofHeight, maxShrinkDistance): void`

**File**: `src/features/building/roofStrategies/polygonOffsetUtils.ts`

Functions (shared with gambrel):
- `insetPolygon(ring: [number, number][], distance: number): [number, number][][]`
- Wraps `@countertype/clipper2-ts` for polygon insetting
- Native float coordinates — no coordinate scaling needed
- Returns array of polygons (inset may split into multiple polygons for complex shapes)

**File**: `src/features/building/roofStrategies/cdtUtils.ts`

Functions (shared with hipped/gabled):
- `triangulateFace(vertices: [number, number][], holes?: [number, number][][]): number[][]`
- Wraps `poly2tri` for CDT triangulation

### Step 3: Implement MansardRoofStrategy

**File**: `src/features/building/roofStrategies/MansardRoofStrategy.ts` -- Complete rewrite.

```typescript
export class MansardRoofStrategy implements IRoofGeometryStrategy {
  private readonly BREAK_INSET_FRACTION = 0.35;
  private readonly BREAK_HEIGHT_FRACTION = 0.60;

  create(params: RoofParams): BufferGeometry {
    // 1. Normalize ring, guard count < 3
    // 2. Compute OBB, classify complexity
    // 3. Compute breakInset = halfWidth * BREAK_INSET_FRACTION
    // 4. Compute breakHeight = roofHeight * BREAK_HEIGHT_FRACTION
    // 5. Route to createRectangular or createComplex
    // 6. computeVertexNormals(), return
  }

  private createRectangular(params, obb): BufferGeometry { ... }
  private createComplex(params): BufferGeometry { ... }
}
```

#### 3a. Rectangular Fast Path (`createRectangular`)

For buildings where all vertices lie within a small tolerance of the OBB:

1. Compute ridge line at OBB center, endpoints at `center ± halfLength * along-ridge`
2. Compute break polygon via `insetPolygon(outerRing, breakInset)`
3. If break polygon is empty or collapsed, fall back to `PyramidalRoofStrategy`
4. Build **lower slope faces**: annular region between eave ring and break ring
   - Each face is a quad strip segment connecting eave edge to corresponding break edge
   - Eave vertices at Y=0, break vertices at Y=breakHeight
5. Build **upper slope faces**: region from break ring toward ridge
   - Each face connects break edge to the ridge line (or plateau edge)
   - Break vertices at Y=breakHeight, ridge/plateau vertices at Y=roofHeight
6. Build **plateau face** (if present): flat polygon at Y=roofHeight
   - Compute plateau polygon by further insetting break polygon
   - If plateau collapses, upper slopes converge to ridge line directly
7. Build **side walls**: quad strips along eave ring at Y=0

#### 3b. Complex Path (`createComplex`)

For irregular/complex footprints:

1. Compute straight skeleton of `outerRing` (with `innerRings` as holes)
2. Extract skeleton faces, assign heights scaled to `roofHeight`
3. Compute break polygon via `insetPolygon(outerRing, breakInset)`
4. **Split each skeleton face at the break line**:
   - Intersect each skeleton face polygon with the break polygon boundary
   - Portions outside break polygon → lower slope faces (heights: 0 → breakHeight)
   - Portions inside break polygon → upper slope faces (heights: breakHeight → roofHeight)
5. For each resulting face:
   - Recompute vertex heights based on zone (lower or upper) and proportional position
   - Lower face: height = breakHeight × (distance from eave / breakInset)
   - Upper face: height = breakHeight + (roofHeight - breakHeight) × (distance from break / remaining)
6. Triangulate each face via CDT
7. Build side walls along outer ring
8. On skeleton failure: fall back to rectangular path with logged warning

## 5. Data Structures

```typescript
/** Break line polygon result */
interface BreakPolygon {
  ring: [number, number][];
  height: number;
}

/** A roof face after splitting at break line */
interface MansardFace {
  vertices: [number, number][];
  heights: number[];
  zone: 'lower' | 'upper' | 'plateau';
}
```

## 6. File Structure

| File | Action | Purpose |
|------|--------|---------|
| `src/features/building/roofStrategies/MansardRoofStrategy.ts` | **Replace** | Skeleton + polygon offset implementation |
| `src/features/building/roofStrategies/MansardRoofStrategy.test.ts` | **Replace** | Comprehensive tests |
| `src/features/building/roofStrategies/straightSkeletonUtils.ts` | **Create** (if not exists) | Skeleton wrapper + face extraction |
| `src/features/building/roofStrategies/polygonOffsetUtils.ts` | **Create** (if not exists) | clipper2-ts wrapper for polygon insetting |
| `src/features/building/roofStrategies/cdtUtils.ts` | **Create** (if not exists) | poly2tri CDT wrapper |
| `src/features/building/roofStrategies/types.ts` | **No change** | Existing interfaces sufficient |
| `src/features/building/RoofGeometryFactory.ts` | **No change** | Already registered |
| `package.json` | **Modify** | Add `straight-skeleton`, `@countertype/clipper2-ts`, `poly2tri` (if not present) |

## 7. Testing Strategy

### Polygon Offset Utility Tests (if not covered by gambrel)

- Rectangle inset by small distance produces smaller rectangle
- Rectangle inset by half-width collapses to line/empty
- L-shaped polygon inset produces valid result
- Very large inset returns empty array

### MansardRoofStrategy Tests

**Geometry validity:**
- Creates geometry without error for standard rectangle
- Non-indexed geometry (`geom.index === null`)
- Has position attribute with non-zero vertex count
- All Y values in [0, roofHeight]

**Height zones:**
- Has vertices at Y=0 (eave level)
- Has vertices near Y=breakHeight (break line level)
- Has vertices at or near Y=roofHeight (ridge/plateau level)
- Break height vertices exist between eave and ridge heights

**Normal direction:**
- All face normals have non-negative Y component
- Lower slope normals are more horizontal (larger XZ component) than upper slope normals

**Shape correctness:**
- Square footprint produces 4-way symmetric geometry
- Rectangle produces elongated ridge with 4 lower slope faces + 4 upper slope faces
- Ridge angle variation rotates the geometry but preserves vertex count
- Break polygon is strictly inside the eave ring

**Complex footprints (skeleton path):**
- L-shaped footprint produces valid geometry
- Pentagon footprint produces valid geometry
- Triangle footprint (3 vertices) produces valid geometry or falls back to pyramidal

**Edge cases:**
- Narrow building falls back to pyramidal (breakInset >= min dimension)
- CW winding produces correct outward-facing normals
- roofHeight = 0 produces flat geometry
- Courtyard (inner ring) preserved as void in all zones
- Skeleton failure falls back to rectangular path

### Performance Targets

| Metric | Target |
|--------|--------|
| Rectangular path (OBB fast path) | < 2ms per roof |
| Complex path (skeleton + offset + CDT) | < 10ms per roof |
| Polygon offset computation | < 1ms |
| CDT per face | < 2ms per face |

## 8. Dependencies

| Package | Purpose |
|---------|---------|
| `straight-skeleton` | Medial axis computation for ridge/face topology on complex footprints |
| `@countertype/clipper2-ts` | Polygon offset/inset for break line polygon computation |
| `poly2tri` | CDT triangulation for face meshing with constrained edges |

All three are shared with other skeleton-based roof types.

## 9. Edge Cases

| Case | Handling |
|------|----------|
| < 3 vertices | Return empty BufferGeometry |
| Very narrow building | breakInset >= min(halfLength, halfWidth) → delegate to PyramidalRoofStrategy |
| Square building | Valid 4-sided mansard with short ridge or apex |
| Break polygon collapses | Delegate to PyramidalRoofStrategy |
| Break polygon splits into multiple | Use largest polygon as break line |
| Courtyard overlaps break polygon | Exclude courtyard area from upper zones |
| Skeleton computation fails | Fall back to rectangular path with logged warning |
| roofHeight = 0 | Flat geometry at Y=0 |
| CW winding | Detected by normalizeRing(); triangle winding adjusted |

## 10. Open Questions

1. **`straight-skeleton` API**: **RESOLVED** — See `roof/library-apis.md` for confirmed API, input/output format, WASM async init strategy, and winding conversion helpers. TypeScript types are bundled.
2. **Break inset fraction (0.35)**: Should this be configurable or derived from slope angles? Current default produces visually correct mansard profiles.
3. **Plateau vs ridge convergence**: For elongated buildings the upper slopes converge to a ridge line; for square buildings they converge to an apex. The skeleton determines this automatically.
4. **Shared utility availability**: `straightSkeletonUtils.ts`, `polygonOffsetUtils.ts`, and `cdtUtils.ts` may already exist from other roof implementations. Implementation should reuse, not duplicate.
5. **Face splitting complexity**: Intersecting skeleton faces with the break polygon boundary is the most complex step. Consider using `@countertype/clipper2-ts` boolean intersection to split faces precisely.

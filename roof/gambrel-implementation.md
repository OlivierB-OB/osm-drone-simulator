# Gambrel Roof Implementation Plan

## 1. Architecture & Algorithms

### 1.1 What is a Gambrel Roof

A gambrel roof is a barn-style roof with **two different slope pitches on each side** of a central ridge line. The lower slopes are steep (~60-70 degrees) and the upper slopes are shallow (~20-30 degrees). Unlike a mansard (slope breaks on all four sides), the gambrel has slope breaks **only on the two sides perpendicular to the ridge** -- the ridge ends are vertical gable walls.

### 1.2 Geometric Decomposition

A gambrel roof consists of five distinct geometric components:

| Component | Count | Description |
|-----------|-------|-------------|
| **Ridge line** | 1 | Horizontal line at the roof's peak, running along the building's long axis |
| **Upper slopes** | 2 | Shallow-pitched surfaces from ridge down to break lines |
| **Lower slopes** | 2 | Steep-pitched surfaces from break lines down to eaves |
| **Break lines** | 2 | Horizontal lines where pitch changes, parallel to ridge |
| **Gable walls** | 2 | Vertical pentagonal end walls at ridge endpoints |

### 1.3 Algorithm Selection

The spec mandates three algorithms working together:

1. **Straight Skeleton** (`straight-skeleton`) -- computes the medial axis of the footprint, producing ridge lines and correct topology for any footprint shape
2. **Polygon Offset** (`@countertype/clipper2-ts`) -- computes the break line polygon by insetting the footprint by a fixed distance
3. **CDT** (`poly2tri`) -- triangulates each face zone while preserving constraint edges and handling inner holes

**Why Straight Skeleton (not OBB-only):**

The OBB approach cannot handle L-shaped, T-shaped, or irregular footprints. The skeleton provides correct ridge topology for all shapes.

### 1.4 Two-Tier Strategy

1. **Fast path (OBB)**: For buildings where the footprint is approximately rectangular (all vertices within a small tolerance of the OBB), compute the ridge directly from OBB geometry
2. **Full path (Straight Skeleton)**: For irregular/complex footprints, compute the skeleton and extract ridge segments

Both paths share the same polygon offset (break line) and CDT triangulation steps.

### 1.5 Gambrel vs Mansard vs Gabled

| Aspect | Gabled | Gambrel | Mansard |
|--------|--------|---------|---------|
| Ridge | Yes | Yes | Yes (or plateau) |
| Break lines | No | 2 (perpendicular to ridge only) | 4 (all sides) |
| Ridge ends | Vertical gable walls | Vertical gable walls | Slope breaks |
| Hip faces | No | No | No |

### 1.6 Geometry Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `BREAK_INSET_FRACTION` | 0.35 | Fraction of halfWidth from eave to break line |
| `BREAK_HEIGHT_FRACTION` | 0.55 | Fraction of roofHeight at break line elevation |

## 2. Input Parameters

### From RoofParams (existing interface)

| Parameter | Source | Purpose |
|-----------|--------|---------|
| `outerRing` | Building polygon outer ring | Footprint vertices in local meter coords |
| `innerRings` | Building polygon inner rings | Courtyards/holes to preserve |
| `roofHeight` | `roof_height` tag or default | Vertical distance from eave to ridge |
| `ridgeAngle` | Resolved from `roof_direction` / `roof_orientation` / OBB | Ridge direction in local radians |
| `roofShape` | `roof_shape` tag | Must be `"gambrel"` |

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
  │     ├── Extract dominant ridge segment(s) aligned with ridgeAngle
  │     └── Extend ridge to footprint boundary (gabled ends)
  │
  ├── 5. insetPolygon(outerRing, breakInset) → break polygon (@countertype/clipper2-ts)
  │
  ├── 6. Classify footprint vertices into zones:
  │     ├── Ridge-end vertices (beyond ridge endpoints along ridge axis)
  │     └── Side vertices (between ridge endpoints, perpendicular to ridge)
  │
  ├── 7. Build face polygons:
  │     ├── Lower slope faces (2): eave edge → break line, Y: 0 → breakHeight
  │     ├── Upper slope faces (2): break line → ridge, Y: breakHeight → roofHeight
  │     └── Gable end walls (2): pentagonal vertical faces at ridge endpoints
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

These packages are shared with gabled, hipped, half-hipped, mansard, and saltbox implementations.

### Step 2: Create/Extend Shared Utilities

**File**: `src/features/building/roofStrategies/polygonOffsetUtils.ts` (shared with mansard)

```typescript
/**
 * Insets a polygon ring inward by `distance` meters.
 * Wraps @countertype/clipper2-ts. Native float coordinates, no scaling needed.
 * Returns inset polygon(s), or empty array if the inset collapses.
 */
function insetPolygon(ring: [number, number][], distance: number): [number, number][][];
```

**File**: `src/features/building/roofStrategies/straightSkeletonUtils.ts` (shared with hipped/gabled)

Functions (if not already created):
- `computeRoofSkeleton(outerRing, innerRings?): SkeletonResult`
- `extractFacesFromSkeleton(skeletonGraph): RoofFace[]`
- `isRectangularFootprint(ring, obb, tolerance): boolean`

**File**: `src/features/building/roofStrategies/cdtUtils.ts` (shared with hipped/gabled)

Functions (if not already created):
- `triangulateFace(vertices, holes?): number[][]`

### Step 3: Implement GambrelRoofStrategy

**File**: `src/features/building/roofStrategies/GambrelRoofStrategy.ts` -- Complete rewrite.

```typescript
export class GambrelRoofStrategy implements IRoofGeometryStrategy {
  private readonly BREAK_INSET_FRACTION = 0.35;
  private readonly BREAK_HEIGHT_FRACTION = 0.55;

  create(params: RoofParams): BufferGeometry {
    // 1. Normalize ring, guard count < 3
    // 2. Compute OBB, classify complexity
    // 3. Determine ridge (OBB fast path or skeleton)
    // 4. Compute break line polygon via clipper2-ts inset
    // 5. Build face zones (lower slopes, upper slopes, gable walls)
    // 6. Triangulate each face with CDT
    // 7. Assemble BufferGeometry
  }

  private computeRidge(params, obb): RidgeLine { ... }
  private buildLowerSlopes(outerRing, breakPolygon, ridgeLine, breakHeight): FaceZone[] { ... }
  private buildUpperSlopes(breakPolygon, ridgeLine, breakHeight, roofHeight): FaceZone[] { ... }
  private buildGableWalls(outerRing, breakPolygon, ridgeLine, breakHeight, roofHeight): FaceZone[] { ... }
}
```

**Face construction details:**

**Lower slopes** (2 faces):
- Bounded by eave edge segment (Y=0), two vertical connections, and break line segment (Y=breakHeight)
- Only the two sides perpendicular to the ridge (not the gable ends)

**Upper slopes** (2 faces):
- Bounded by break line segment (Y=breakHeight), two connections to ridge, and ridge segment (Y=roofHeight)

**Gable end walls** (2 faces):
- Pentagonal vertical faces at each ridge endpoint
- Five vertices per gable: two eave corners (Y=0), two break points (Y=breakHeight), one ridge endpoint (Y=roofHeight)
- Can be triangulated as 3 triangles (fan from ridge point)

## 5. Data Structures

```typescript
/** Ridge line segment in local coordinates */
interface RidgeLine {
  start: [number, number];
  end: [number, number];
  height: number;
}

/** Break line polygon computed by polygon offset */
interface BreakPolygon {
  ring: [number, number][];
  height: number;
}

/** A face zone ready for triangulation */
interface FaceZone {
  boundary: [number, number][];
  heights: number[];
  holes?: [number, number][][];
}
```

## 6. File Structure

| File | Action | Purpose |
|------|--------|---------|
| `src/features/building/roofStrategies/GambrelRoofStrategy.ts` | **Rewrite** | Main strategy with skeleton + polygon offset + CDT |
| `src/features/building/roofStrategies/GambrelRoofStrategy.test.ts` | **Rewrite** | Comprehensive unit tests |
| `src/features/building/roofStrategies/polygonOffsetUtils.ts` | **Create** (if not exists) | clipper2-ts wrapper for polygon insetting |
| `src/features/building/roofStrategies/polygonOffsetUtils.test.ts` | **Create** (if not exists) | Polygon offset utility tests |
| `src/features/building/roofStrategies/straightSkeletonUtils.ts` | **Create** (if not exists) | Shared skeleton utilities |
| `src/features/building/roofStrategies/cdtUtils.ts` | **Create** (if not exists) | CDT triangulation wrapper |
| `src/features/building/roofStrategies/roofGeometryUtils.ts` | **Extend** | Add `isRectangularFootprint()` if not already present |
| `src/features/building/roofStrategies/types.ts` | **No change** | Existing interfaces sufficient |
| `src/features/building/RoofGeometryFactory.ts` | **No change** | Already registered |
| `package.json` | **Modify** | Add `straight-skeleton`, `@countertype/clipper2-ts`, `poly2tri` |

## 7. Testing Strategy

### Polygon Offset Utility Tests

- Rectangle inset produces smaller rectangle with correct dimensions
- Large inset (exceeding half-width) returns empty array
- Non-convex L-shape produces valid inset polygon(s)
- Zero inset returns original polygon
- Tiny polygon with large inset returns empty array

### GambrelRoofStrategy Tests

**Geometry validity:**
- Creates non-indexed geometry for a standard rectangle
- Has `position` attribute
- All vertex Y values in `[0, roofHeight]`
- Has vertices at Y=0 (eave), Y ≈ breakHeight (break), Y=roofHeight (ridge)

**Gambrel-specific shape:**
- Break line vertices exist at correct height (BREAK_HEIGHT_FRACTION × roofHeight)
- Two distinct slope pitches visible: lower slope steeper than upper slope
- Gable end walls are vertical (face normals have zero Y component)
- Gable end walls are pentagonal (5 vertices per gable: 2 eave, 2 break, 1 ridge)
- Break lines are parallel to ridge

**Normal directions:**
- Has upward-facing faces (slope normals with positive Y)
- Has vertical faces (gable wall normals with zero Y)
- Lower slope normals are more horizontal than upper slope normals

**Ridge direction:**
- `ridgeAngle=0`: ridge along X axis, break lines parallel to X
- `ridgeAngle=PI/2`: ridge along Y axis, break lines parallel to Y
- Different ridgeAngle values produce consistent vertex counts

**Footprint variations:**
- Square footprint: valid geometry with short ridge
- Elongated rectangle: long ridge, narrow gable walls
- Closed ring and open ring produce identical geometry
- L-shaped footprint: handled by skeleton path

**Courtyard tests:**
- Rectangle with rectangular hole: slopes have void
- Courtyard vertices accounted for in geometry

**Edge cases:**
- roofHeight=0: all vertices at Y=0
- 3-vertex polygon (triangle): valid geometry or empty
- CW winding produces correct outward normals
- Very narrow building: falls back to gabled

### Performance Targets

| Metric | Target |
|--------|--------|
| Simple rectangle (OBB path) | < 2ms |
| Complex polygon (skeleton path) | < 5ms |
| Polygon offset | < 1ms |
| CDT triangulation | < 1ms |
| Typical tile (50 gambrel buildings) | < 100ms |

## 8. Dependencies

| Package | Purpose | Shared With |
|---------|---------|-------------|
| `straight-skeleton` | Medial axis / ridge computation for complex footprints | Gabled, Hipped, Half-Hipped, Mansard, Saltbox |
| `@countertype/clipper2-ts` | Polygon offset / inset for break line computation | Mansard |
| `poly2tri` | CDT triangulation for face zones with holes | All roof types with complex geometry |

## 9. Edge Cases

| Case | Handling |
|------|----------|
| `breakInset >= halfWidth` | Fall back to `GabledRoofStrategy` (no room for break) |
| Empty polygon offset result | Fall back to `GabledRoofStrategy` (footprint too narrow) |
| `roofHeight <= 0` | Return flat triangulation at Y=0 |
| Less than 3 vertices | Return empty `BufferGeometry` |
| Square footprint | Valid gambrel with short ridge; gable walls are isoceles pentagons |
| Straight skeleton failure | Fall back to OBB-based ridge with logged warning |
| Nearly-collinear vertices | Skeleton may degenerate; OBB fallback handles this |
| Courtyard overlaps break polygon | Clip courtyard to each face zone before triangulation |
| CW winding | Detected by `normalizeRing()`; triangle winding adjusted |
| Closed ring (last == first) | Detected by `normalizeRing()`; count adjusted |

## 10. Open Questions

1. **Shared skeleton infrastructure**: If gabled is implemented first, `straightSkeletonUtils.ts` may already exist. Reuse it directly.

2. **`clipper-lib` vs `@countertype/clipper2-ts`**: **RESOLVED** — Use `@countertype/clipper2-ts`. `clipper-lib` is legacy Clipper1 (integer coordinates, no TypeScript types). `@countertype/clipper2-ts` is the modern successor: native float, full TypeScript, actively maintained. See `roof/library-apis.md`.

3. **Break line parameters**: The 35% inset and 55% height fractions produce visually plausible gambrel geometry. Not user-configurable (YAGNI).

4. **Gable wall as pentagon vs two triangles**: The pentagonal gable wall can be triangulated as 3 triangles (fan from ridge point). Simpler than CDT for a guaranteed-convex polygon.

5. **Inner ring clipping to face zones**: When a courtyard intersects a face zone, it must be clipped to that zone's boundary before CDT. May require polygon boolean operations (also available in `@countertype/clipper2-ts`). Defer courtyard-in-gambrel handling if rare enough (YAGNI).

6. **`poly2tri` edge cases**: **CONFIRMED** — `poly2tri` throws (not returns null) on duplicate points and collinear boundary edges. Input deduplication and collinear removal required before CDT. See `roof/library-apis.md`.

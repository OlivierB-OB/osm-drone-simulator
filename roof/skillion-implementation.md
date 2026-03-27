# Skillion Roof Implementation Plan

## 1. Architecture & Algorithms

### Overview

The skillion roof is the simplest pitched roof type: a single planar slope with no ridge, apex, or breaks. Every vertex of the footprint polygon sits on the same inclined plane, with elevation determined solely by its projected distance along the slope axis.

### Algorithm: Linear Height Interpolation via Projection

The algorithm is straightforward and does not require any computational geometry library beyond earcut (already available):

1. Determine the **across-slope axis** from `roof_direction` (the downhill compass bearing)
2. Project all footprint vertices onto that axis
3. Linearly interpolate height from 0 (low eave, facing `roof_direction`) to `roof_height` (high eave, opposite side)
4. Triangulate the polygon using earcut (no holes) or ShapeUtils.triangulateShape (with holes)
5. Generate side walls connecting the inclined roof to the wall top (Y=0)

No straight skeleton, polygon offset, or CDT is needed. The spec explicitly states: "Skillion: Single plane construction, Earcut."

### Key Semantic: `roof_direction` for Skillion

Per the spec and OSM wiki, `roof_direction` for a skillion roof is the **downhill** direction -- "the direction the slope faces, i.e., the downhill direction where water drains off." The low eave faces `roof_direction`; the high eave is opposite.

**Critical detail in `BuildingMeshFactory.ts`** (line 227-229): When `roofShape === 'skillion'` and `roofDirection` is defined, the factory adds `Math.PI / 2` to the resolved ridge angle. This transforms the angle from "ridge-parallel" semantics (used by gabled etc.) to "across-slope" semantics appropriate for skillion. The strategy itself then uses `ridgeAngle` as the across-slope axis direction.

### Coordinate System

All geometry is built in local meter-space relative to the polygon centroid:
- X = local east offset (meters)
- Y = height above wall top (0 at eave level, `roofHeight` at peak)
- Z = -local north offset (Three.js convention: Z = -mercatorY)

The `buildOutlineRoofGeometry` utility handles the coordinate transform from `[mercX, mercY]` ring vertices to Three.js `[x, y, z]` positions.

## 2. Implementation Steps

### Step 1: Define the Height Computation

For each vertex `v[i]` in the outer ring:

```
acrossX = -sin(ridgeAngle)
acrossY = cos(ridgeAngle)
proj[i] = v[i].x * acrossX + v[i].y * acrossY
```

Find `minProj` and `maxProj` across all outer ring vertices.

```
projRange = maxProj - minProj
height[i] = roofHeight * (proj[i] - minProj) / projRange
```

This produces:
- Height = 0 at vertices with minimum projection (low eave, facing `roof_direction`)
- Height = `roofHeight` at vertices with maximum projection (high eave, opposite side)

### Step 2: Handle Inner Rings (Courtyards)

Inner ring vertices use the **same** projection formula with the **same** `minProj`/`maxProj` from the outer ring. This ensures the slope plane is continuous across the entire footprint, with courtyard edges sitting at the correct elevation on the inclined plane.

### Step 3: Triangulate and Build Geometry

Delegate to `buildOutlineRoofGeometry()` which:
1. Triangulates the top face (including holes) via `ShapeUtils.triangulateShape`
2. Generates side wall quads (two triangles per edge) for outer and inner rings
3. Sets vertex positions with the computed heights
4. Computes vertex normals

### Step 4: Edge Case Handling

| Case | Handling |
|------|----------|
| `roofHeight = 0` | All heights = 0, produces flat surface |
| `projRange ≈ 0` (degenerate thin polygon) | All heights = 0, avoids division by zero |
| Closed ring (last == first) | `normalizeRing()` detects and adjusts count |
| CW vs CCW winding | `normalizeRing()` detects; `buildOutlineRoofGeometry()` adjusts wall normals |
| Very small polygon | Linear interpolation still works; no special handling needed |
| No `roof_direction` provided | `BuildingMeshFactory` falls back to OBB-based orientation (longest edge = along, across becomes slope direction) |
| Inner rings | Projected using outer ring's min/max bounds for plane continuity |

## 3. File Structure

### Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/features/building/roofStrategies/SkillionRoofStrategy.ts` | **Rewrite** | Core strategy implementation |
| `src/features/building/roofStrategies/SkillionRoofStrategy.test.ts` | **Rewrite** | Comprehensive test suite |

### Files That Remain Unchanged

| File | Reason |
|------|--------|
| `src/features/building/roofStrategies/types.ts` | `IRoofGeometryStrategy` and `RoofParams` interfaces are sufficient |
| `src/features/building/roofStrategies/roofGeometryUtils.ts` | `normalizeRing()` and `buildOutlineRoofGeometry()` provide all needed utilities |
| `src/features/building/RoofGeometryFactory.ts` | Already registers `'skillion'` key with `SkillionRoofStrategy` |
| `src/features/building/BuildingMeshFactory.ts` | Already handles skillion-specific `ridgeAngle` adjustment (line 227-229) |

## 4. Detailed Implementation: `SkillionRoofStrategy.ts`

### Class Structure

```typescript
import type { BufferGeometry } from 'three';
import type { IRoofGeometryStrategy, RoofParams } from './types';
import { normalizeRing, buildOutlineRoofGeometry } from './roofGeometryUtils';

export class SkillionRoofStrategy implements IRoofGeometryStrategy {
  create(params: RoofParams): BufferGeometry {
    // 1. Normalize outer ring
    // 2. Compute across-slope axis from ridgeAngle
    // 3. Project outer vertices, find min/max
    // 4. Compute outer heights via linear interpolation
    // 5. Compute inner ring heights (same plane)
    // 6. Delegate to buildOutlineRoofGeometry
  }
}
```

### Algorithm Detail

**Across-slope axis derivation:**
- `ridgeAngle` in the `RoofParams` represents the along-ridge direction in local mercator radians
- For skillion, `BuildingMeshFactory` already adds `PI/2` when `roofDirection` is provided, so `ridgeAngle` effectively points along the "across-slope" (high-to-low) axis
- The across-slope unit vector: `acrossX = -sin(ridgeAngle)`, `acrossY = cos(ridgeAngle)`
- Vertices with **higher** projection values are at the **high eave** (height = `roofHeight`)
- Vertices with **lower** projection values are at the **low eave** (height = 0)

**Height formula:**
```
height[i] = projRange > 0 ? roofHeight * (proj[i] - minProj) / projRange : 0
```

This is a single linear interpolation -- no piecewise functions, no special cases beyond the degenerate `projRange ≈ 0`.

## 5. Testing Strategy

### Unit Tests: `SkillionRoofStrategy.test.ts`

**Test Categories:**

#### A. Basic Geometry (Rectangle)

1. **Correct vertex count** -- For a 4-vertex rectangle: 2 top triangles + 8 side wall triangles = 10 triangles x 3 vertices = 30 floats x 3 components = 90 floats total
2. **Height range [0, roofHeight]** -- Scan all Y values, verify min=0, max=roofHeight
3. **Linear height distribution** -- For `ridgeAngle=0`, verify each top-face vertex's Y matches `roofHeight * (mercY - minMercY) / range`
4. **Low eave at correct side** -- For known ridgeAngle, verify which vertices are at Y=0

#### B. Direction Control

5. **ridgeAngle=0** -- Slope varies along mercator Y axis (across = Y direction)
6. **ridgeAngle=PI/2** -- Slope varies along mercator X axis (across = -X direction, high side = -X/West)
7. **ridgeAngle=PI/4** -- Slope varies along 45-degree diagonal
8. **ridgeAngle=PI** -- Slope varies along -Y direction (inverted from ridgeAngle=0)

#### C. Winding & Ring Variants

9. **CCW vs CW winding** -- Both produce same vertex count and valid geometry
10. **Closed ring (last==first)** -- Same output as open ring
11. **Triangle footprint (3 vertices)** -- Valid geometry, correct height interpolation

#### D. Edge Cases

12. **roofHeight=0** -- All Y values = 0
13. **Degenerate thin polygon** -- Does not throw, produces valid geometry
14. **Very small polygon** -- Works correctly
15. **Square footprint** -- All four vertices get distinct heights (not degenerate like pyramidal)

#### E. Inner Rings (Courtyards)

16. **Rectangle with courtyard** -- Inner ring vertices get heights on the same slope plane as outer ring
17. **Courtyard vertex count** -- Correct triangle count accounting for holes
18. **Courtyard height continuity** -- Inner ring heights consistent with outer ring's slope plane

#### F. Normals

19. **Top face has upward-facing normals** -- At least one face normal has positive Y component
20. **CW ring still produces outward normals** -- Winding-independent correctness

### Integration Tests (via `RoofGeometryFactory.test.ts`)

Already covered:
- Factory returns non-null geometry for `roofShape: 'skillion'`
- Vertices span [0, roofHeight]
- High-side vertices match expected direction for given `ridgeAngle`
- Upward-facing faces exist
- Non-indexed geometry
- CW ring handling

### Performance Targets

- **Per-roof computation time**: < 0.5ms for typical buildings (4-20 vertices)
- **Memory**: No intermediate allocations beyond `Float64Array` for projections/heights
- **No external libraries**: Pure arithmetic + existing `buildOutlineRoofGeometry`

### Visual Validation

- Navigate to a location with known skillion-roofed buildings (e.g., industrial/shed areas)
- Verify slope direction matches `roof_direction` compass bearing
- Verify slope appears as a single flat plane (no ridges or breaks)
- Verify wall heights are correct (taller wall on uphill side)

## 6. Dependencies

**No new npm packages required.**

The skillion strategy uses only:
- `three` (BufferGeometry, Float32BufferAttribute) -- already in project
- `roofGeometryUtils.ts` utilities (normalizeRing, buildOutlineRoofGeometry) -- already in project

The spec confirms: "Skillion: Single plane construction, Earcut." The earcut functionality is provided by Three.js's `ShapeUtils.triangulateShape`, already used in `buildOutlineRoofGeometry`.

## 7. Documentation Updates

### `roof/ROOF_RENDERING.md`

No updates needed -- the spec already correctly describes skillion geometry.

### Inline Code Documentation

The strategy class should include a JSDoc comment explaining:
- The single-plane slope model
- How `ridgeAngle` maps to slope direction (noting the `PI/2` adjustment in `BuildingMeshFactory`)
- The linear interpolation formula
- How inner rings maintain slope plane continuity

## 8. Open Questions

1. **`roof_direction` semantics verification**: The spec says `roof_direction` is the **downhill** direction. The `BuildingMeshFactory` adds `PI/2` to the resolved ridge angle for skillion when `roofDirection` is defined (line 227-229). This effectively rotates from "slope-faces direction" to "across-slope axis." Need to verify this produces the correct orientation: low eave facing `roof_direction`, high eave opposite. The existing test at line 326-343 of `RoofGeometryFactory.test.ts` tests `ridgeAngle=PI/2` and expects high side at negative X (West), which is consistent with the "+across = high side" convention.

2. **Default direction when no `roof_direction` or `roof_orientation`**: When neither tag is specified, `resolveRidgeAngle` returns the OBB angle (along longest edge). For skillion without the `PI/2` adjustment (since `roofDirection` is undefined), the across-slope axis becomes perpendicular to the longest edge. This means the slope descends across the building's narrow dimension by default -- architecturally reasonable for a lean-to/shed roof.

3. **Inner ring projection bounds**: The current design uses `minProj`/`maxProj` from the outer ring only. If an inner ring vertex were to project outside the outer ring's bounds (geometrically impossible for a valid courtyard), heights would still be well-defined but could exceed [0, roofHeight]. This is not a practical concern for valid building footprints.

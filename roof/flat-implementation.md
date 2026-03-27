# Flat Roof Implementation Plan

## 1. Architecture & Algorithms

### Overview

The flat roof is the simplest roof type: a horizontal plane at wall-top elevation. Per the specification, it is a "direct triangulation of the roof footprint polygon at wall top elevation" with courtyard holes preserved as interior voids.

### Current Behavior

Currently, `flat` is **not** a pitched shape (`PITCHED_SHAPES` set in `BuildingMeshFactory.ts` line 30-46). This means:
- `roofHeight = 0`
- No call to `RoofGeometryFactory.create()`
- The flat top surface comes implicitly from Three.js `ExtrudeGeometry`'s cap face
- `RoofGeometryFactory` returns `null` for flat (no strategy registered)

This approach works but is inconsistent with the strategy pattern used by all other roof types. The spec mandates a proper `FlatRoofStrategy` that produces explicit geometry.

### Algorithm Selection

**Primary: Three.js `ShapeUtils.triangulateShape`** (wraps earcut internally)

Rationale:
- Already used by every other roof strategy in the codebase via `buildOutlineRoofGeometry` in `roofGeometryUtils.ts`
- Handles polygons with holes (courtyards) out of the box
- No new npm dependency needed
- The spec recommends earcut for simple cases and CDT for holes. Three.js `ShapeUtils.triangulateShape` uses earcut and already supports holes, making a separate `poly2tri` dependency unnecessary for this roof type

**No CDT (poly2tri) needed** because:
- Flat roof has no constrained interior edges (no ridges, no break lines)
- All vertices are coplanar at the same height
- `ShapeUtils.triangulateShape` handles holes correctly for this case

### Design Decision: Standalone Triangulation

The existing utility function `buildOutlineRoofGeometry` in `roofGeometryUtils.ts` generates both a triangulated top face and side walls. For a flat roof with `roofHeight = 0`, the side walls would have zero height and produce degenerate triangles. Therefore, the flat roof strategy produces only the triangulated top face directly, without side walls.

## 2. Implementation Steps

### Step 1: Create `FlatRoofStrategy.ts`

**File**: `src/features/building/roofStrategies/FlatRoofStrategy.ts`

The strategy implements `IRoofGeometryStrategy` and produces a `BufferGeometry` consisting of:
- A single horizontal face at Y=0 (roof base, which sits at wall-top when positioned by `BuildingMeshFactory`)
- No side walls (flat roof has no height above wall top)
- Courtyard holes preserved in triangulation

Algorithm:
1. Receive `RoofParams` (outerRing, innerRings, roofHeight=0, roofShape='flat')
2. Call `normalizeRing(outerRing)` to get vertex count and winding direction
3. Build Vector2 arrays for contour and holes
4. Call `ShapeUtils.triangulateShape(contour, holes)` to get triangle indices
5. Build a flat `BufferGeometry` with all vertices at Y=0
6. Position conversion: X = ring[i][0], Y = 0, Z = -ring[i][1] (Mercator Y to Three.js Z)
7. Call `computeVertexNormals()` (all normals will be (0, 1, 0) for a flat horizontal surface)

### Step 2: Register in `RoofGeometryFactory.ts`

Add flat to the strategies map:
```typescript
['flat', new FlatRoofStrategy()],
```

### Step 3: Integration Decision

The `BuildingMeshFactory` should continue using the existing `ExtrudeGeometry` cap path for flat roofs. The `FlatRoofStrategy` exists for architectural completeness and is available for any caller who needs flat roof geometry explicitly, but the main rendering path doesn't change behavior for flat roofs.

### Step 4: Update `RoofGeometryFactory.test.ts`

Change the existing test from "returns null for flat shape" to verify that flat now returns valid geometry.

## 3. File Structure

| File | Action | Purpose |
|------|--------|---------|
| `src/features/building/roofStrategies/FlatRoofStrategy.ts` | **Create** | Flat roof strategy implementation |
| `src/features/building/roofStrategies/FlatRoofStrategy.test.ts` | **Create** | Unit tests for flat roof |
| `src/features/building/RoofGeometryFactory.ts` | **Modify** | Register FlatRoofStrategy in strategy map |
| `src/features/building/RoofGeometryFactory.test.ts` | **Modify** | Update flat roof test expectation |
| `src/features/building/roofStrategies/types.ts` | **No change** | Existing `IRoofGeometryStrategy` and `RoofParams` suffice |
| `src/features/building/roofStrategies/roofGeometryUtils.ts` | **No change** | Reuse `normalizeRing` |
| `src/features/building/BuildingMeshFactory.ts` | **No change** | Flat roofs continue using ExtrudeGeometry cap |

## 4. Detailed Implementation

### Class Structure

```typescript
import { BufferGeometry, Float32BufferAttribute, ShapeUtils } from 'three';
import type { IRoofGeometryStrategy, RoofParams } from './types';
import { normalizeRing } from './roofGeometryUtils';

export class FlatRoofStrategy implements IRoofGeometryStrategy {
  create(params: RoofParams): BufferGeometry {
    const { outerRing, innerRings } = params;
    const { count, isCCW } = normalizeRing(outerRing);

    // Build contour and holes for triangulation
    // Build combined vertex list (outer + inner rings)
    // Triangulate: all vertices at Y=0 (flat roof sits at wall top)
    // Ensure correct winding for upward-facing normal
    // Create BufferGeometry with position attribute
    // computeVertexNormals()
    // Return geometry
  }
}
```

### Key Design Decisions

1. **Y=0 for all vertices**: The flat roof has no height. When positioned by the caller at `wallTop`, this creates the horizontal plane at the correct elevation.
2. **Winding direction handling**: `normalizeRing` detects CCW/CW. If CW, reverse triangle vertex order so normals point upward (+Y).
3. **No side walls**: Only the top face is produced. No slope walls because there is no height difference between vertices.
4. **Hole preservation**: `ShapeUtils.triangulateShape` automatically handles interior courtyard holes.

### Edge Cases

| Case | Handling |
|------|----------|
| Degenerate polygon (< 3 vertices) | Return minimal/empty geometry |
| Self-intersecting polygon | earcut handles with best-effort triangulation |
| Very thin polygon | earcut may produce zero triangles; return empty geometry |
| roofHeight parameter | Ignored -- geometry is always at Y=0 |
| Inner rings (courtyards) | Preserved as voids in triangulation |

## 5. Testing Strategy

### Unit Tests: `FlatRoofStrategy.test.ts`

1. **Basic geometry creation** - Returns non-null `BufferGeometry` for rectangle
2. **Vertex count for rectangle** - 4 vertices closed ring = 2 triangles = 6 vertices (non-indexed)
3. **Vertex count for triangle** - 3 vertices = 1 triangle = 3 vertices
4. **All Y coordinates are 0** - Every vertex has Y=0 (flat plane)
5. **Non-indexed geometry** - `geom.index` is null (flat shading)
6. **All normals point upward** - After `computeVertexNormals()`, all normals approximately (0, 1, 0)
7. **L-shaped polygon** - 6 vertices = 4 triangles = 12 vertices; all Y=0
8. **Courtyard (hole) handling** - Outer ring with inner ring produces correct triangulation with void
9. **CW winding** - Reversed vertex order still produces upward-facing normals
10. **Pentagon** - 5 vertices = 3 triangles = 9 vertices
11. **Degenerate input** - 2 vertices produces empty/minimal geometry (no crash)
12. **Open ring (no closing vertex)** - Works the same as closed ring
13. **roofHeight parameter is ignored** - Geometry is always at Y=0 regardless of roofHeight value
14. **Multiple holes** - Two courtyards both preserved as voids

### Performance Targets

- **Simple polygon** (4-8 vertices): < 0.1ms per roof
- **Complex polygon** (20-50 vertices): < 0.5ms per roof
- **Polygon with holes** (outer + 2-3 inner rings): < 1ms per roof

## 6. Dependencies

**No new npm packages required.**

All functionality is provided by:
- `three` (already installed) - `ShapeUtils.triangulateShape`, `BufferGeometry`, `Float32BufferAttribute`
- Existing utility functions in `roofGeometryUtils.ts` - `normalizeRing`

## 7. Documentation Updates

No separate documentation file needed. The flat roof is the simplest strategy and is self-documenting from the code and tests. The spec (`roof/ROOF_RENDERING.md`) already fully describes it.

## 8. Open Questions

1. **Should `BuildingMeshFactory` use the `FlatRoofStrategy` explicitly, or continue using `ExtrudeGeometry` caps for flat roofs?**
   - Recommendation: Continue using `ExtrudeGeometry` caps. The strategy exists for API completeness and direct consumers of `RoofGeometryFactory`.

2. **Should unknown/unrecognized `roof_shape` values map to `FlatRoofStrategy`?**
   - The spec says: "Any roof_shape value not in the list above falls back to flat roof rendering."
   - Currently, unknown shapes return `null` from `RoofGeometryFactory` and render as flat via `ExtrudeGeometry` cap. This is the correct fallback behavior.

3. **Winding direction**: Need to verify the convention used by `ShapeUtils.triangulateShape` for consistent winding regardless of input.

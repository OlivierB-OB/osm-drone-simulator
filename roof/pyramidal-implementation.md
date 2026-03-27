# Pyramidal Roof Implementation Plan

## 1. Architecture and Algorithms

### 1.1 Roof Type Summary

A **pyramidal** roof is a single-apex roof where all footprint edges slope upward to a central peak. Every edge of the building footprint produces one triangular slope face connecting two adjacent footprint vertices to the apex.

### 1.2 Algorithm Selection

**Centroid + Fan Triangulation** -- No external libraries required.

- **Apex position**: Arithmetic mean (centroid) of outer ring vertices
- **Apex height**: `roofHeight`
- **Slope faces**: One triangle per footprint edge
- **Inner rings**: Ignored (remain open/unroofed per spec)

**Why NOT straight skeleton**: For a pure pyramidal roof, the skeleton would converge all edges to a single apex anyway for convex shapes. The centroid-based fan approach is the correct KISS implementation.

### 1.3 Coordinate System

- Input: `[mercX, mercY]` in local meters (centroid-relative)
- Output: `X = mercX, Y = height, Z = -mercY`

### 1.4 Geometry Pipeline

```
1. Normalize ring (detect closed ring, compute winding)
2. Compute centroid → apex XY position
3. Set apex height = roofHeight
4. For each edge (i, i+1): generate triangle [vertex_i(Y=0), vertex_{i+1}(Y=0), apex(Y=roofHeight)]
5. Build non-indexed BufferGeometry
6. computeVertexNormals()
```

## 2. Implementation Steps

### Step 1: Define PyramidalRoofStrategy class

**File**: `src/features/building/roofStrategies/PyramidalRoofStrategy.ts`

1. Extract `outerRing` and `roofHeight`
2. `normalizeRing(ring)` → `count`, `isCCW`
3. Guard: count < 3 → empty BufferGeometry
4. Compute centroid: `cx = sum(x) / count`, `cy = sum(y) / count`
5. Apex: `(cx, roofHeight, -cy)`
6. Allocate `Float32Array(count * 9)` (3 vertices × 3 floats × count triangles)
7. For each edge: emit triangle with correct winding
8. Create BufferGeometry, computeVertexNormals()

### Step 2: Registration

Already registered at key `'pyramidal'` in `RoofGeometryFactory.ts`.

### Step 3: HippedRoofStrategy fallback

The hipped strategy delegates to PyramidalRoofStrategy for near-square buildings -- this cross-reference is architecturally valid and preserved.

## 3. File Structure

| File | Action | Purpose |
|------|--------|---------|
| `src/features/building/roofStrategies/PyramidalRoofStrategy.ts` | **Rewrite** | Centroid + fan triangulation |
| `src/features/building/roofStrategies/PyramidalRoofStrategy.test.ts` | **Rewrite** | Comprehensive tests |
| `src/features/building/RoofGeometryFactory.ts` | No change | Already registered |
| `src/features/building/roofStrategies/types.ts` | No change | Sufficient |
| `src/features/building/roofStrategies/roofGeometryUtils.ts` | No change | `normalizeRing` available |

## 4. Testing Strategy

### Geometric Correctness

- Rectangle (4 edges): 4 triangles = 12 vertices
- Square: 4 triangles, apex at centroid
- Pentagon (5 edges): 5 triangles = 15 vertices
- Triangle (3 edges): 3 triangles = 9 vertices
- L-shape (6 edges): 6 triangles, apex at centroid

### Edge Cases

- `roofHeight = 0`: all vertices at Y=0
- Closed ring (last==first): same count as open ring
- CW winding: normals face outward
- < 3 vertices: empty BufferGeometry
- Very small footprint: no numerical issues
- Centroid not at origin: apex at correct centroid
- Courtyard: inner ring ignored, only outer ring produces faces

### Normal Direction

- All face normals point outward (dot product check)

### Performance Targets

- Simple rectangle: < 0.1ms
- 100-vertex polygon: < 1ms

## 5. Dependencies

**No new npm packages required.**

## 6. Known Limitations

1. **Concave footprints**: Centroid may fall outside polygon, producing self-intersecting triangles
2. **Courtyards**: Inner rings ignored -- pyramid spans full outer footprint
3. **Non-convex polygons**: Some fan triangles may overlap

## 7. Open Questions

1. **Area-weighted vs arithmetic centroid**: Arithmetic mean is simpler and sufficient for most cases.
2. **Centroid outside polygon**: Should we use pole of inaccessibility for concave footprints?
3. **Side walls**: Not needed -- wall extrusion in BuildingMeshFactory handles vertical walls.

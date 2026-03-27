# Round Roof Implementation Plan

## 1. Architecture & Algorithms

### 1.1 What is a Round Roof?

A round (barrel vault) roof is a **cylindrical arch** spanning across the building's shorter axis. The cross-section perpendicular to the ridge is a semi-ellipse. The ridge runs along the longer axis.

### 1.2 Algorithm: Subdivided Cylindrical Grid

The current outline-based approach is fundamentally wrong -- a 4-vertex building produces a flat quad with no visible curvature. The correct approach requires **intermediate arc vertices**.

### 1.3 Recommended Approach: Enriched Ring + buildOutlineRoofGeometry

1. Enrich the polygon with subdivision vertices along each edge at arc parameter positions
2. Use `buildOutlineRoofGeometry()` with the enriched ring (more vertices = better curvature)
3. Apply semi-ellipse height function: `h * sqrt(1 - (acrossProj/halfWidth)²)`

This reuses existing utilities while producing visible barrel curvature.

**Upgrade path**: If visual artifacts appear, upgrade to full CDT with constraint edges along subdivision lines.

### 1.4 Detailed Algorithm

1. Compute OBB, resolve ridge angle, across-ridge axis
2. If `halfWidth > halfLength`, swap axes so barrel spans shorter dimension
3. Define `N_ARC_SEGMENTS = 8` subdivision parameters from t=-1 to t=+1
4. For each footprint edge, find intersections with subdivision lines; insert new vertices
5. Apply same enrichment to inner rings
6. Compute height for every vertex: `h * sqrt(1 - (acrossProj/halfWidth)²)`
7. Call `buildOutlineRoofGeometry` with enriched ring and computed heights
8. Return BufferGeometry

## 2. Implementation Steps

### Step 1: Edge Subdivision Helpers

Add to `roofGeometryUtils.ts`:
- `intersectEdgeWithAcrossLine(p1, p2, acrossAxis, acrossValue): [number, number] | null`
- `enrichRingWithSubdivisions(ring, count, ridgeAngle, halfWidth, segments): { ring: [number, number][], count: number }`

### Step 2: Implement RoundRoofStrategy

**File**: `RoundRoofStrategy.ts` -- Replace entirely.

```
1. Compute OBB, swap axes if needed
2. Enrich outer ring with subdivision points
3. Enrich inner rings
4. Compute heights via semi-ellipse formula
5. Call buildOutlineRoofGeometry with enriched ring + heights
6. Return geometry
```

## 3. File Structure

| File | Action | Purpose |
|------|--------|---------|
| `src/features/building/roofStrategies/RoundRoofStrategy.ts` | **Replace** | Cylindrical grid implementation |
| `src/features/building/roofStrategies/RoundRoofStrategy.test.ts` | **Replace** | Curvature validation tests |
| `src/features/building/roofStrategies/roofGeometryUtils.ts` | **Extend** | Edge-subdivision helpers |
| `src/features/building/roofStrategies/types.ts` | No change | |
| `src/features/building/RoofGeometryFactory.ts` | No change | Already registered |

## 4. Testing Strategy

**Geometry correctness:**
- Rectangle (20x10): more vertices than outline-only (enrichment adds points)
- All vertex Y in [0, roofHeight]
- Max Y = roofHeight (at ridge center, t=0)
- Min Y = 0 (at eaves)
- Vertices at ridge centerline have height = roofHeight
- Vertices at eave edges have height = 0

**Curvature validation:**
- Intermediate vertices exist between eave and ridge
- Heights at intermediate t follow semi-ellipse within tolerance
- Height at t=0.5 ≈ 0.866 × roofHeight

**Axis handling:**
- Wide rectangle (halfWidth > halfLength): axes swap
- Non-zero ridgeAngle: heights still in range
- ridgeAngle=PI/4: 45-degree rotated barrel correct

**Irregular footprints:**
- L-shaped, triangle, pentagon: produce valid geometry

**Courtyard handling:**
- Rectangle with hole: inner ring enriched with subdivision, preserved as hole

**Edge cases:**
- Very small building: works without error
- Very elongated building: barrel spans short axis
- Near-zero roofHeight: all heights near zero

**Normals:**
- Top surface faces have upward-pointing normals
- Non-indexed geometry

### Performance Targets

- < 5ms per roof (10-20 vertices, 8 arc segments)
- < 10ms for complex buildings with courtyards
- ~2-3x more vertices than outline approach due to enrichment

## 5. Dependencies

**No new npm packages required.** Uses existing Three.js `ShapeUtils.triangulateShape` via `buildOutlineRoofGeometry`.

Future upgrade to full CDT would need `poly2tri`.

## 6. Open Questions

1. **Arc segment count**: 8 is hardcoded. Increase later only if visual quality insufficient (YAGNI).
2. **Gable end treatment**: Flat vertical ends -- architecturally acceptable for barrel vaults.
3. **Smooth vs flat normals**: `computeVertexNormals()` produces smooth normals by averaging -- good for barrel curvature.

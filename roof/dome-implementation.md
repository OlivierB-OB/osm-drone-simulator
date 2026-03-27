# Dome Roof Implementation Plan

## 1. Architecture and Algorithms

### Overview

The dome roof is a hemispherical (or semi-ellipsoidal) surface placed over a building footprint. Per the specification:

- **Footprint**: Circular -- the smallest circle that completely contains the building's outer ring. Inner holes are ignored.
- **Apex**: Located at the circle's center, at height = wall top + `roof_height`.
- **Geometry**: Radial grid approach -- a UV sphere upper hemisphere, with vertices displaced to fit the circular footprint.
- **Triangulation**: The sphere geometry itself provides the triangle mesh.

### Algorithm: Radial Grid on Circular Footprint

**Step 1 -- Compute Minimum Bounding Circle (MBC)**
The smallest enclosing circle of the outer ring, using Welzl's algorithm (O(n) expected time, ~40 lines of code).

**Step 2 -- Generate Upper Hemisphere Grid**
Parametric grid with `lonSegments = 32`, `latSegments = 16`:
- Latitude bands (`phi`): from 0 (equator) to PI/2 (pole)
- Longitude slices (`theta`): from 0 to 2*PI

**Step 3 -- Map to Building Space**
- `x = center.x + radius * cos(phi) * cos(theta)`
- `y = roofHeight * sin(phi)`
- `z = -(center.y + radius * cos(phi) * sin(theta))`

### Why Not the Current Implementation

The current `DomeRoofStrategy` uses `polygonExtentAtAngle()` to fit sphere vertices to the actual polygon boundary per-angle. The spec says dome uses a **circular footprint** (smallest enclosing circle), not the polygon boundary.

## 2. Implementation Steps

### Step 1: Add Minimum Bounding Circle Utility

Add `computeMinBoundingCircle(ring): { center: [number, number]; radius: number }` to `roofGeometryUtils.ts`.

Implementation: Welzl's randomized algorithm (~40 lines, no npm dependency needed).

### Step 2: Implement DomeRoofStrategy

Replace `DomeRoofStrategy.ts` with MBC-based radial grid:

1. Compute MBC from `params.outerRing` (ignore `innerRings`)
2. Generate upper hemisphere vertex grid (32 lon × 16 lat)
3. Map each vertex to building space using MBC center and radius
4. Standard sphere strip triangulation
5. Build BufferGeometry, computeVertexNormals()

### Step 3: Coordinate Transform

MBC center `(cx, cy)` in local mercator → Three.js `(cx, 0, -cy)`.

## 3. File Structure

| File | Action | Purpose |
|------|--------|---------|
| `src/features/building/roofStrategies/roofGeometryUtils.ts` | **Modify** | Add `computeMinBoundingCircle()` |
| `src/features/building/roofStrategies/DomeRoofStrategy.ts` | **Replace** | MBC + radial grid implementation |
| `src/features/building/roofStrategies/DomeRoofStrategy.test.ts` | **Replace** | Spec-compliant tests |
| `src/features/building/roofStrategies/types.ts` | No change | |
| `src/features/building/RoofGeometryFactory.ts` | No change | Already registered |

## 4. Edge Case Handling

| Case | Behavior |
|------|----------|
| roofHeight = 0 | Flat disc at Y=0 |
| Very small building | Works normally; proportional scaling |
| Highly elongated building | MBC produces large circle encompassing long axis |
| Concave/irregular polygon | MBC handles any point set |
| Courtyards | Inner rings ignored per spec |
| Single point polygon | MBC returns zero radius |
| Collinear points | MBC produces circle with diameter = span |

## 5. Testing Strategy

### MBC Utility Tests

- Square ring: center at (0,0), radius = half-diagonal
- Circular ring (n-gon): center near (0,0), radius ≈ input radius
- Offset rectangle: center at rectangle center
- Single/two points: degenerate cases
- Triangle: circumscribed circle

### DomeRoofStrategy Tests

| Test | Assertion |
|------|-----------|
| Apex at roofHeight | Max Y equals roofHeight |
| Base at Y=0 | Min Y equals 0 |
| Base vertices on MBC circle | Distance from center ≈ radius |
| No NaN in output | All values finite |
| roofHeight=0 → flat disc | All Y = 0 |
| Square footprint | Base ring radius = half-diagonal |
| Elongated rectangle | MBC radius = half diagonal |
| Inner rings ignored | Same output with/without innerRings |
| Normals outward-facing | Spot-check normals |

### Performance Targets

- Dome generation: < 1ms per roof (32×16 grid = ~528 vertices)
- MBC computation: < 0.1ms

## 6. Dependencies

**No new npm packages required.** Welzl's algorithm is simple enough to implement inline.

## 7. Open Questions

1. **Wall-dome junction**: MBC circle may extend beyond rectangular wall footprint, creating a visual gap. Accept for now -- architecturally common (domes on circular drums).
2. **MBC vs centroid offset**: MBC center may differ from polygon centroid. Compute dome vertices relative to centroid, apply MBC offset within vertex positions.
3. **Segment count**: Hardcode 32×16 per YAGNI.

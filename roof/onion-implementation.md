# Onion Roof Implementation Plan

## 1. Architecture & Algorithms

### Overview

An onion roof is a bulbous dome that swells outward beyond the base footprint radius at mid-height before tapering to a pointed apex. The spec classifies it alongside dome as a **circular footprint** roof using a **radial grid** approach.

### Algorithm: Parametric Surface of Revolution

The onion shape is defined by modulating a hemisphere with a bulge profile:

```
onionRadius = sinPhi * (1 + BULGE_FACTOR * sin(y * PI)) * (1 - y * 0.2)
```

Where:
- `sinPhi` provides the hemisphere envelope (0 at pole, 1 at equator)
- `BULGE_FACTOR` (0.35) controls the outward bulge at mid-height
- `sin(y * PI)` creates the bulge peaking around y ≈ 0.5
- `(1 - y * 0.2)` provides slight overall narrowing toward top

### Constants

```typescript
const ONION_AZIMUTH_SEGMENTS = 32;    // horizontal subdivisions
const ONION_ELEVATION_SEGMENTS = 24;   // vertical (more than dome for bulge resolution)
const ONION_BULGE_FACTOR = 0.35;       // maximum radial overshoot
```

### Footprint Handling

Per spec, the roof uses the building's outer ring with `polygonExtentAtAngle()` for per-direction extent fitting (consistent with dome pattern for non-circular footprints). Inner rings are **ignored**.

## 2. Implementation Steps

### Step 1: Generate Base Sphere Geometry

Use Three.js `SphereGeometry(1, 32, 24, 0, 2*PI, 0, PI/2)` for upper hemisphere.

### Step 2: Apply Onion Profile Displacement

For each vertex:
1. Read unit-sphere position `(x, y, z)` where y ∈ [0, 1]
2. Compute `sinPhi = sqrt(x² + z²)`
3. Handle pole (sinPhi < epsilon): place at `(0, roofHeight, 0)`
4. Compute azimuthal angle: `theta = atan2(z, x)`
5. Get polygon extent: `extent = polygonExtentAtAngle(ring, theta)`
6. Compute profile: `finalR = extent * sinPhi * (1 + 0.35 * sin(y * PI)) * (1 - y * 0.2)`
7. Set vertex to `(cos(theta) * finalR, y * roofHeight, sin(theta) * finalR)`

### Step 3: Finalize

Mark position buffer as needing update, compute vertex normals, return geometry.

## 3. File Structure

| File | Action | Purpose |
|------|--------|---------|
| `src/features/building/roofStrategies/OnionRoofStrategy.ts` | **Rewrite** | Onion profile algorithm |
| `src/features/building/roofStrategies/OnionRoofStrategy.test.ts` | **Rewrite** | Comprehensive tests |
| `src/features/building/RoofGeometryFactory.ts` | No change | Already registered |
| `src/features/building/roofStrategies/roofGeometryUtils.ts` | No change | `polygonExtentAtAngle` available |

## 4. Edge Cases

| Case | Handling |
|------|----------|
| roofHeight = 0 | Flat disc at Y=0 |
| Degenerate footprint | `polygonExtentAtAngle` returns OBB fallback |
| Very small footprint | Works; proportional scaling maintained |
| Inner rings | Ignored per spec |
| Pole vertex (sinPhi=0) | Guarded; placed at apex |
| Non-convex footprint | `polygonExtentAtAngle` handles via ray-casting |
| Rectangular footprint | Produces ellipsoidal onion stretching to cover building |

## 5. Testing Strategy

| Test | Assertion |
|------|-----------|
| Apex height | Max Y = roofHeight |
| Base at Y=0 | Min Y = 0 |
| **Bulge exists** | Max XZ distance at mid-height > base radius |
| Bulge bounded | Max XZ distance < r × (1 + BULGE_FACTOR + 0.1) |
| Single-peak profile | Per-direction radius increases then decreases with height |
| roofHeight=0 | All Y = 0 |
| No NaN values | All positions finite |
| Square footprint | Apex at roofHeight, base within bounds |
| Rectangular footprint | Wider bulge along longer axis |
| Vertex count | Expected from segment parameters |

### Performance Targets

- < 2ms per roof (simpler than skeleton-based roofs)
- ~825 vertices for 32×24 segments

## 6. Dependencies

**No new dependencies required.**

## 7. Open Questions

1. **Bulge factor (0.35)**: Produces recognizable onion. Could be tuned via visual inspection.
2. **Taper factor (0.2)**: Subtle effect. May need stronger value (0.3) for more pronounced shape.
3. **Segment count (24 elevation)**: ~50% more vertices than dome. LOD deferred per YAGNI.
4. **Cusp at apex**: Real onion domes have decorative finials. Smooth taper sufficient for initial implementation.

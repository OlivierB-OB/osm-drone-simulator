# Buildings

## Visual Characteristics

Buildings appear as 3D extruded structures with vertical walls and roofs. They range from simple flat-top boxes to complex pitched-roof shapes with varied ridges and orientations. Walls and roofs have distinct colors based on material properties.

**Examples:**
- Residential house: beige walls (#d4c8b8) with pitched roof (#906050)
- Modern commercial: gray walls (#c8c0b8) with flat roof (#a0a090)
- Church: stone walls (#b8b0a0) with dark slate roof (#708090)

## Data Sources

Buildings are identified by Overture fields:
- `building=*` (type: house, residential, commercial, office, etc.)
- `height` or `building:levels` (determines wall height)
- `roof:shape` (flat, gabled, hipped, half-hipped, pyramidal, gambrel, mansard, dome, onion, cone, skillion, butterfly, crosspitched, round, saltbox, sawtooth)
- `roof:direction` or `roof:orientation` (angles for pitched roofs)
- `roof:height` (proportion of roof above walls, defaults to 30% of building width)
- `building:min_level` (height offset for buildings on slopes)
- `building:material` (brick, concrete, glass, stone, wood, etc.) — overrides type-based color
- `roof:material` (tiles, slate, metal, copper, grass, thatch, etc.) — overrides default roof color
- `roof:colour` (explicit RGB override)

## Rendering Strategy

1. **Geometry Creation**: Three.js `ExtrudeGeometry` extrudes a 2D polygon outline vertically to create walls
   - Outer ring defines building footprint
   - Inner rings define courtyard holes (cutouts)
2. **Local Coordinate Space**: Geometry built relative to polygon centroid to preserve precision at large Mercator coordinates
3. **Wall Height**: Resolved from height tag, levels × 3m, or type-specific defaults
4. **Roof Handling**:
   - **Flat roofs**: Top cap of wall extrusion uses roof color
   - **Pitched roofs**: Separate `RoofGeometryFactory` generates ridge geometry based on shape and orientation; meshes grouped together
     - **Gabled / Hipped**: Per-vertex height assigned via projection onto OBB axes; actual polygon ring triangulated with `ShapeUtils.triangulateShape` (preserves L-shapes, T-shapes, etc.); side walls fill the gap between flat wall top and sloped surface. Hipped additionally tapers height toward each hip end via a second along-axis projection.
     - **Pyramidal**: One triangular face per building edge converging at apex; used directly for pyramidal shape and as fallback for near-square hipped/gabled footprints.
     - **Skillion**: Single sloped plane; per-vertex height gradient from low eave to high eave across the ridge direction.
     - **Butterfly**: V-shaped valley roof; eaves are the highest points and the central valley runs at wall-top level. Height formula is the arithmetic complement of gabled: `h × |acrossProj| / maxAbsAcross`.
     - **Dome**: Unit upper hemisphere (`SphereGeometry`, 32×16 segments) with per-vertex angular fitting via `polygonExtentAtAngle` — each latitude ring scales to the polygon's extent in that compass direction, so the base conforms to the actual footprint. `ridgeAngle` is not used.
     - **Onion**: Unit upper hemisphere (`SphereGeometry`, 32×16 segments) with per-vertex angular fitting via `polygonExtentAtAngle` — identical approach to dome but with an onion bulge profile applied before footprint fitting: `finalR = extent × taper × bulge × sinPhi` where `bulge = 1 + 0.35×sin(t×π)` and `taper = 1 − 0.2×t` (widest at ~50% height, narrower toward apex). `ridgeAngle` is not used.
     - **Cone**: Two-case algorithm — circular footprints (eccentricity < 1.2) use `ConeGeometry` (64 segments) with per-vertex angular fitting via `polygonExtentAtAngle`, linearly tapering each base vertex toward the apex; elongated footprints (eccentricity ≥ 1.2) delegate to `PyramidalRoofStrategy`.
     - **Crosspitched**: Upper envelope of two perpendicular gabled profiles (`max(h1, h2)`); per-vertex height automatically produces valley lines at the intersection of the two sloping planes; equal-pitch variant uses `min(halfLength, halfWidth)` as the shared eave half-width for both ridges.
     - **Gambrel**: Barn-style two-zone slope per side of the ridge; steep lower section rises from the eave to a break line at 50% of roof height and 60% of OBB half-width, then a shallower upper section continues to the ridge. OBB-based: 4 base corners, 4 knee points at the break line, 2 ridge endpoints → 14 triangles, non-indexed.
     - **Half-hipped (Jerkinhead)**: Gabled roof with the top portion of each gable end clipped by a small hip triangle. Ridge runs the full building length (same as gabled). Each gable end has a vertical rectangular section from the base to `hipH = 0.3 × roofHeight`, then a sloped hip triangle from `hipH` up to the ridge endpoint. OBB-based: 4 base corners + 2 ridge endpoints + 4 hip points → 10 vertices, 14 triangles, indexed geometry.
     - **Mansard**: Four-sided roof with two slopes per side — steep lower section rising from the base to a break line, then a shallow upper section continuing to a flat top platform. The four-sided analog of gambrel. Three OBB rings at progressive heights (base → break → top): 12 vertices, 18 triangles, indexed geometry. `breakHeight = 60%` of roof height; `breakInset = 40%` of OBB halfWidth; `topInset = 15%` of halfWidth. Falls back to PyramidalRoofStrategy if the break inset collapses the ring (very narrow buildings).
     - **Round**: Barrel-vault semi-cylinder extruded along the ridge axis. Cross-section is a semi-ellipse: `across(φ) = halfWidth·cos(φ)`, `height(φ) = roofHeight·sin(φ)`, φ ∈ [0, π], N=24 arc segments. The OBB long axis becomes the extrusion axis (ridge direction); if the footprint is wider than long, axes are swapped by rotating `ridgeAngle` by π/2. Geometry: N curved strip quads + 2 semicircular end-cap fans = 4N triangles, non-indexed.
     - **Saltbox**: Asymmetric gabled roof with the ridge displaced toward one eave by `ridgeOffset = halfWidth × 0.3` (clamped to 90% of halfWidth). Each vertex is projected onto the across-ridge axis; vertices on the short steep side use `h × max(0, 1 − (proj − ridgeOffset) / halfWidthShort)` and vertices on the long gentle side use `h × max(0, 1 − (ridgeOffset − proj) / halfWidthLong)`. Per-vertex approach with `ShapeUtils.triangulateShape` handles arbitrary footprints; side walls fill the gap as in gabled.
     - **Sawtooth**: N parallel skillion bays repeated across the building width. Each bay rises from a low eave (Y=0) to a high eave (Y=roofHeight) across the ridge direction, then drops abruptly via a vertical face back to Y=0 for the next bay. N = clamp(floor(2×halfWidth / 5m), 2, 20); bay count scales automatically with building width. All slopes face the same direction (controlled by `roof:direction`). OBB-based: 4 slope corners + 2 vertical-face base corners per bay → 6 triangles per bay, 6N triangles total, non-indexed.

## Geometry Details

**Flat-Roof Building:**
- Single `Mesh` with `ExtrudeGeometry`
- 3 material groups: walls (sides), ceiling (top cap), base (bottom)
- Positioned at terrain elevation + min_height

**Pitched-Roof Building:**
- `Group` containing 2 meshes:
  1. **Wall mesh**: `ExtrudeGeometry` with wall color
  2. **Roof mesh**: Parametric shape (gabled polygon, cone, hemisphere, etc.) with roof color
- Roof mesh positioned above walls at height `wallHeight`

**Material Colors:**
- Wall: `building:material` override → `building` type default → fallback #d0ccbc
- Roof: `roof:colour` override → `roof:material` override → roof shape default

## Configuration

| Parameter | Value | Source |
|-----------|-------|--------|
| Default wall height (fallback) | 6m | `buildingHeightDefaults['other']` |
| Residential house height | 6m | config.ts |
| Apartment height | 12m per default; 3m per level | config.ts |
| Cathedral height | 20m | config.ts |
| Default roof height | 30% of minor OBB axis, clamped [1–8m] | BuildingMeshFactory.defaultRoofHeight() |
| Flat roof color | #a0a090 | roofColorDefaults.flat |
| Pitched roof color | #906050 | roofColorDefaults.pitched |
| Wall color (residential) | #d4c8b8 | colorPalette.buildings.residential |

## Elevation Handling

- **Terrain sampling**: Elevation sampled at polygon centroid via `ElevationSampler.sampleAt()`
- **Base positioning**: World Y = sampled elevation + min_height
- **Slope alignment**: Buildings rest on terrain surface; roofs remain level (no tilting)
- **Precision**: Local coordinate geometry prevents float32 precision loss when building is far from origin

## See Also

- **[Vegetation](vegetation.md)** — Trees and forests
- **[Structures](structures.md)** — Towers and cranes
- **[Systems](systems.md#spatial-organization)** — Coordinate system and spatial layout
- **[Data Pipeline](../../data-pipeline.md)** — Feature extraction process

# Buildings

## Visual Characteristics

Buildings appear as 3D extruded structures with vertical walls and roofs. They range from simple flat-top boxes to complex pitched-roof shapes with varied ridges and orientations. Walls and roofs have distinct colors based on material properties.

**Examples:**
- Residential house: beige walls (#d4c8b8) with pitched roof (#906050)
- Modern commercial: gray walls (#c8c0b8) with flat roof (#a0a090)
- Church: stone walls (#b8b0a0) with dark slate roof (#708090)

## Data Sources

Buildings are identified by Overture Maps fields (flat underscore naming):
- `class` (building type: house, residential, commercial, office, etc.)
- `height` (meters) or `num_floors` (determines wall height; 1 floor ≈ 3m)
- `min_height` (height offset above terrain for building parts on slopes)
- `roof_shape` (flat, gabled, hipped, half_hipped, pyramidal, gambrel, mansard, dome, onion, round, skillion, saltbox)
- `roof_direction` (compass bearing in degrees, 0°=North, clockwise) — slope/ridge orientation
- `roof_orientation` (`along` or `across` — ridge parallel or perpendicular to longest wall)
- `roof_height` (vertical rise of the roof above wall top, in meters)
- `facade_color` (explicit wall color override, hex)
- `facade_material` (brick, concrete, glass, stone, wood, etc.) — overrides type-based color
- `roof_material` (tiles, slate, metal, copper, grass, thatch, etc.) — overrides default roof color
- `roof_color` (explicit roof color override, hex)
- `has_parts` (boolean — building contains child `building_part` features)

> OSM-style colon tags (`roof:shape`, `building:levels`, `roof:direction`, etc.) are also supported via a secondary parser used for OSM-sourced data.

## Rendering Strategy

1. **Geometry Creation**: Three.js `ExtrudeGeometry` extrudes a 2D polygon outline vertically to create walls
   - Outer ring defines building footprint
   - Inner rings define courtyard holes (cutouts)
2. **Local Coordinate Space**: Geometry built relative to polygon centroid to preserve precision at large coordinates
3. **Wall Height**: Resolved from `height` tag → `num_floors × 3m + 1m` → type-specific defaults → 6m fallback
4. **Roof Handling**:
   - **Flat roofs**: Top cap of wall extrusion uses roof color; triangulated with earcut (no holes) or CDT (holes)
   - **Pitched roofs**: `RoofGeometryFactory` delegates to one of 11 `IRoofGeometryStrategy` implementations; the resulting mesh is grouped with the wall mesh

### Core Algorithms

Three computational geometry algorithms underpin the roof strategies:

- **Straight Skeleton** (`straight-skeleton` npm package): Shrinks the building footprint inward at constant speed, tracking where edges converge. Produces ridge lines and hip endpoints automatically. Primary algorithm for `gabled`, `hipped`, `half_hipped`, `saltbox`, `gambrel`, `mansard`.
- **Polygon Offset** (`@countertype/clipper2-ts`): Insets a polygon by a fixed distance while preserving parallel edges. Used by `gambrel` (break line at ~35% of half-width) and `mansard` (break ring + top plateau ring).
- **CDT — Constrained Delaunay Triangulation** (`poly2tri`): Triangulates polygons while preserving specified edges and holes. Used for any footprint with inner rings (courtyards); `earcut` (via Three.js `ShapeUtils`) is used for simple cases.
- **OBB (Oriented Bounding Box)**: Lightweight fallback for simple rectangular footprints — computes ridge direction and proportions from the longest edge without skeleton computation.

### Roof Type Implementations

| Shape | Primary Algorithm | Key Detail |
|-------|------------------|------------|
| **flat** | earcut / CDT | Horizontal cap; CDT when courtyard holes present |
| **gabled** | OBB fast path OR skeleton | Two slopes meeting at ridge; skeleton handles L/T-shaped footprints; vertical gable walls at each end |
| **hipped** | Skeleton (primary) / OBB gradient | Slopes on all sides; skeleton corner-collapse naturally produces hip faces; OBB gradient used if skeleton not ready |
| **half_hipped** | Skeleton (hip detection + height clip) / OBB short ridge | Top 30% of each gable end is hipped; bottom 70% is a vertical gable wall; both `half-hipped` and `half_hipped` spellings accepted |
| **pyramidal** | Fan triangulation to apex | One triangle per footprint edge, all converging at centroid apex at roofHeight |
| **gambrel** | Polygon inset (break line) + skeleton/OBB (ridge) | Steep lower slope / shallower upper slope per side; 3-ring stitch (outer eave → break line → ridge) |
| **mansard** | Polygon inset ×2 + ring stitch | Two slopes on all 4 sides; break ring at 60% of roofHeight; flat plateau top; 3-ring stitch |
| **saltbox** | OBB offset ridge / skeleton | Ridge displaced from centerline (≈30% of half-width) creating one steep and one shallow slope |
| **skillion** | Per-vertex gradient | Single sloped plane; `roof_direction` defines downhill direction (low eave); no ridge |
| **dome** | SphereGeometry + minimum bounding circle | Upper hemisphere scaled to enclose footprint; MBC (Welzl algorithm) determines radius |
| **onion** | SphereGeometry + MBC + bulge transform | Like dome but with bulge profile: `bulge = 1 + 0.35×sin(t×π)`, `taper = 1 − 0.2×t` — widest at ~50% height |
| **round** | Per-vertex ellipse formula + ring subdivision | Barrel vault; semi-ellipse cross-section; shorter OBB axis becomes the barrel direction; ring vertices subdivided for smooth curvature |

Any unrecognized `roof_shape` value falls back to **flat** rendering.

## Geometry Details

**Flat-Roof Building:**
- Single `Mesh` with `ExtrudeGeometry`
- 3 material groups: walls (sides), ceiling (top cap), base (bottom)
- Positioned at terrain elevation + min_height

**Pitched-Roof Building:**
- `Group` containing 2 meshes:
  1. **Wall mesh**: `ExtrudeGeometry` with wall color
  2. **Roof mesh**: Geometry from the matching `IRoofGeometryStrategy` (one of 11 strategies) with roof color
- Roof mesh positioned above walls at height `wallHeight`

**Material Colors:**
- Wall: `facade_color` override → `facade_material` lookup → `class` type default → fallback #d0ccbc
- Roof: `roof_color` override → `roof_material` lookup → roof shape default

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

# Roof Rendering

This document describes the roof rendering system for building features.

All field names use the **Overture Maps** convention (`roof_shape`, `roof_direction`, `roof_height`, `roof_orientation`).

## Roof Footprint Computation

The roof footprint defines the horizontal projection of the roof onto the ground plane. Two distinct approaches are used depending on the roof type's geometry:

### Circular Roof Footprint

Applied to radially-symmetric roofs with dome-like shapes:

- **Roof types**: Dome, Onion
- **Computation method**: The roof footprint is the smallest circle that completely contains the building's outer ring
- **Inner holes**: Ignored—only the outer boundary is considered
- **Result**: Always a perfect circle, regardless of the actual building footprint shape
- **Purpose**: Ensures radial symmetry required for dome geometries

### Complex Roof Footprint

Applied to all other roof types that follow the building's detailed geometry:

- **Roof types**: Gabled, Hipped, Half-Hipped, Flat, Mansard, Gambrel, Saltbox, Round, Skillion, Pyramidal
- **Computation method**: The roof footprint is identical to the building footprint
- **Inner holes**: Preserved exactly—courtyards and interior voids are maintained as holes in the roof polygon
- **Result**: Matches the building's polygon shape precisely, including all geometric details
- **Purpose**: Maintains architectural fidelity and correct volumetric representation

## Roof Geometry Production

Roof geometry production converts roof specifications into 3D mesh geometry. The process uses the roof footprint as the base and generates the 3D structure (peaks, ridges, slopes, breaks) according to the roof shape type and provided parameters. This section describes the high-level geometric elements and how they are computed.

### Flat Roof Geometry

The simplest roof type — a horizontal plane at wall top elevation:

- No ridge, apex, or slopes; the roof surface is flat
- Roof geometry is a direct triangulation of the roof footprint polygon at wall top elevation
- **Holes (courtyards)**: Preserved as interior voids in the triangulation
- **Algorithm**: earcut for polygons without holes; CDT (`poly2tri`) when holes are present

### Skillion Geometry

A single planar slope with no ridge or apex:

- `roof_direction` (compass bearing, degrees, 0°=North, clockwise) defines the direction the slope **faces** — i.e., the downhill direction where water drains off
- `roof_height` defines the vertical rise of the slope from the low eave to the high eave
- The **low eave** is the building edge facing `roof_direction` (at wall top elevation)
- The **high eave** is the opposite edge (at wall top + `roof_height`)
- All roof polygon vertices are assigned elevation by linearly interpolating between low eave and high eave based on their projected distance along the across-slope axis
- Result: a single planar polygon triangulated with earcut

### Ridge Line Computation

Roofs with linear ridge lines (gabled, hipped, half_hipped, mansard, gambrel, saltbox) use a **medial axis** approach to determine ridge position, direction, and endpoints. The medial axis represents the "skeleton" of the building footprint—a set of lines equidistant from the building's edges.

- **Straight Skeleton Algorithm** (`straight-skeleton` npm package) - The recommended algorithmic foundation for ridge computation:
  - Computes the medial axis by virtually shrinking the building footprint inward at constant speed while tracking where edges converge
  - Automatically produces ridge lines where opposing edges meet and hip endpoints where corners collapse
  - Naturally handles irregular, non-rectangular, and complex building footprints
  - Supports courtyards (inner holes) by computing separate medial axes for inner rings
  - Produces architecturally correct ridge geometry that matches how water would flow on a real roof

- **Ridge Direction Resolution** - Once the medial axis is established, the dominant ridge direction is determined via priority:
  1. Explicit `roof_direction` field (compass bearing, 0°=North, clockwise)
  2. `roof_orientation` field combined with building geometry:
     - `along` → ridge parallel to longest building edge
     - `across` → ridge perpendicular to longest edge
  3. Default (no field) → automatically select dominant ridge direction from skeleton

- **Ridge Position & Topology** - The straight skeleton naturally determines:
  - **Symmetric roofs** (gabled, hipped, gambrel, mansard) → medial axis points toward building centerline (symmetric ridge)
  - **Asymmetric roofs** (saltbox) → medial axis offset from centerline (asymmetric ridge)
  - **Ridge endpoints** automatically computed where skeleton segments terminate at building perimeter
  - **Hip faces** automatically identified where skeleton branches converge at external corners

- **Simplified Fallback** - For simple rectangular buildings, an **Oriented Bounding Box (OBB)** approach provides a lightweight alternative:
  - Computes ridge position and direction based on longest edge and building dimensions
  - Sufficient for axis-aligned or near-rectangular footprints
  - Does not require skeleton computation for straightforward cases

### Apex Computation

Roofs with a single highest point (pyramidal, dome, onion, round) use an apex instead of a ridge:

- **Apex Position** - The apex is located at the geometric center of the building footprint:
  - For simple polygons, compute the centroid (weighted average of polygon vertices)
  - For polygons with holes, use the outer ring's centroid (inner holes are ignored)
  - For circular footprints, the apex is at the circle's center

- **Apex Height** - The apex elevation above the wall top is determined by `roof_height`:
  - Apex is positioned directly above the footprint center at height = wall top elevation + `roof_height`
  - For dome/onion/round roofs, this is typically the highest point of the curve

### Slope Surface Generation

Slopes are the inclined roof surfaces that form the primary geometry of pitched roofs:

- **Slope Orientation** - Slopes are defined relative to the ridge (or apex):
  - Each slope surface connects the ridge (or apex) to one or more eave edges
  - **Simple slopes** (gabled) → two slopes on opposite sides of the ridge
  - **Multiple slopes** (hipped, pyramidal) → slopes on all sides, meeting at ridge line or apex

- **Slope Connectivity** - How slopes connect to the building footprint:
  - Slopes extend from the ridge/apex down to the building's outer perimeter (the eave level)
  - The eave is implicitly at the top of the facade walls, following the building's footprint boundary
  - Each slope surface is a polygon connecting the ridge/apex to the eave edge vertices

- **Handling Inner Holes** - For buildings with courtyards or interior voids:
  - Inner holes (inner rings) do not receive roof slopes—they remain open above
  - Only the outer perimeter receives slope surfaces
  - This preserves the architectural intent (courtyards remain unroofed)

- **Triangulation** - **Constrained Delaunay Triangulation (CDT)** is recommended for roof face triangulation as it correctly preserves building footprint edges and interior holes (see Computational Geometry Algorithms section). This ensures robust mesh generation for buildings with complex geometries or courtyards.

### Ridge End Treatment

The ridge ends of pitched roofs require different treatments depending on the roof type:

- **Gabled Roofs** - Vertical gable walls at ridge ends:
  - The ridge ends at the building perimeter on the two short sides
  - Vertical wall surfaces fill the triangular gable area (from eave to ridge endpoint)
  - No sloped surface at the ridge ends

- **Hipped Roofs** - Triangular hip faces at ridge ends:
  - The ridge does not extend to the building corners
  - Instead, short ridge segments connect the main ridge to each external corner
  - Hip faces are sloped triangular surfaces connecting ridge to corner eaves
  - Hip surfaces slope at the same angle as the main roof slopes

- **Half-Hipped Roofs** - Partial gable + partial hip:
  - Ridge ends terminate partway along the short building sides
  - Upper portion (at ridge) is hipped with triangular hip faces
  - Lower portion (below the hip) is a vertical gable wall

### Slope Break Geometry

Multi-pitch roofs (mansard, gambrel) have slope transitions where the pitch changes:

- **Break Line Position** - A slope break is a horizontal line where pitch changes:
  - The break is parallel to the ridge, running across the along-ridge direction
  - Break position is determined by a **break inset**: horizontal distance from the eave to the break line
  - Typically the break inset is a fraction of the distance from eave to ridge (e.g., 30-40% for mansard)

- **Break Height Computation** - The elevation of the break line above the wall top:
  - Computed from the lower slope pitch and the break inset distance
  - Lower slope (steeper) extends from eave to break line at a steep angle (e.g., ~70°)
  - Upper slope (shallower) extends from break line to ridge at a shallow angle (e.g., ~30°)
  - Break height = break inset × tan(lower slope angle)

- **Slope Plane Continuity** - Upper and lower slope planes meet at the break line:
  - Both planes are coplanar along the break line itself
  - Vertices along the break line connect the lower slope edges to the upper slope edges
  - The break creates a continuous roof surface despite the pitch change

- **Algorithmic Approach** - **Polygon Offset** algorithms (see Computational Geometry Algorithms section) can compute the break line polygon automatically by insetting the building footprint inward by the break inset distance. This is more robust than manual distance calculations, especially for irregular building shapes.

## Computational Geometry Algorithms & Libraries

Roof mesh generation can leverage several computational geometry algorithms to improve robustness, reduce manual calculation complexity, and handle edge cases like buildings with courtyards or irregular footprints. This section describes the key algorithms and their applicability to roof types.

### Straight Skeleton

**What it is:** A polygon medial axis algorithm that shrinks a polygon inward at constant speed while tracking where edges converge. The result is a skeletal structure representing the polygon's "core" geometry.

**npm package:** `straight-skeleton`

**Key properties:**
- Computes ridge lines where opposite building edges collapse toward each other
- Automatically identifies hip endpoints where corners meet the ridge
- Naturally handles irregular, non-convex, and complex building footprints
- Supports courtyards (inner holes) with separate medial axes for each ring
- Produces a set of line segments and junctions that directly correspond to roof topology

**Why it's architecturally correct:**
- The skeleton represents the actual **watershed** of a pitched roof—water flows perpendicular to skeleton edges
- Hip geometry is implicit in the skeleton structure (corners collapse to ridge endpoints)
- Works correctly for any footprint shape, regardless of symmetry or complexity

**Applicability:**
- ⭐⭐⭐ **Primary algorithm for ridge-based roofs**: Hipped, Gabled, Half-Hipped, Mansard, Gambrel, Saltbox, Pyramidal
- ⭐⭐ **Complex building footprints**: L-shaped, T-shaped, irregular polygons with no obvious ridge direction
- ⭐⭐ **Courtyard handling**: Inner rings naturally produce secondary ridge geometry
- ⭐ **Fallback for OBB**: When OBB approach is insufficient

**Performance:** O(n log n) for building-sized polygons; typically <5ms per roof

**Note:** Straight skeleton is the **recommended foundation** for ridge line computation. Simpler OBB approaches work for axis-aligned rectangular buildings but lack robustness for real-world architectural complexity.

### Constrained Delaunay Triangulation (CDT)

**What it is:** Delaunay triangulation that guarantees specific edges (constraints) appear in the result. Unlike standard Delaunay triangulation, CDT preserves building footprint boundaries and holes as edges in the triangulated mesh.

**npm package:** `poly2tri`

**Key advantages:**
- Preserves building footprint edges and maintains hole topology
- Constrains ridge lines, break lines, and eave edges during triangulation
- Produces high-quality triangles (maximizes minimum angles)
- Robust and production-tested for architectural geometries

**Applicability:**
- ⭐⭐⭐ **ALL roof types** benefit from CDT for roof face triangulation
- Especially valuable for buildings with courtyards or complex footprints
- Essential for any roof where multiple slope faces must mesh correctly at edges

**Performance:** O(n log n) for building-sized polygons (10-100 vertices); typically <10ms per roof

**References in document:** Slope Surface Generation section, Slope Break Geometry section

### Polygon Offset / Inset

**What it is:** Algorithm that shrinks or expands polygons inward/outward by a fixed distance while maintaining parallel edges. Inward offset (negative distance) is useful for computing break lines, ridge positions, and offset footprints.

**npm package:** `@countertype/clipper2-ts` (TypeScript port of Clipper2, native float coordinates)

**Key advantages:**
- Computes break line polygons automatically for mansard/gambrel roofs
- Determines hipped ridge endpoints by finding where inset edges intersect
- Supports configurable join types (miter, round, square) for different corner treatments
- Handles complex footprints and irregular building shapes robustly
- O(n log n) performance—very fast even for large buildings

**Applicability:**
- ⭐⭐⭐ **Mansard & Gambrel roofs** – Automatically compute break line polygons by insetting by `break_inset` distance
- ⭐⭐ **Hipped roofs** – Find ridge endpoints where inset edges meet corners
- ⭐⭐ **Multi-level roofs** – Create stepped geometry via successive insets
- ⭐ **Eave overhangs** – Expand footprint outward beyond wall top

**Performance:** O(n log n); very efficient for typical building footprints

**References in document:** Slope Break Geometry section, Ridge Line Computation section

### Ear Clipping Triangulation

**What it is:** Simple polygon triangulation algorithm that iteratively removes "ear" triangles (triangles with no interior vertices) from the polygon boundary. Mapbox's `earcut` library implements an optimized O(n log n) variant.

**npm package:** `earcut` (Mapbox)

**Key advantages:**
- Ultra-lightweight (~2KB minified)
- Excellent performance for simple polygons without holes
- Well-tested in production systems (Mapbox)
- Good fallback when CDT is unnecessary

**Applicability:**
- Flat roofs without interior holes
- Skillion roofs (single planar polygon)
- Simple roof faces without interior holes (e.g., basic gabled triangular ends)
- Performance optimization when building footprint has no holes

**Limitations:**
- Cannot handle polygons with holes (courtyards) – use CDT instead
- Not suitable for constrained edge requirements (ridge/break line preservation)

**Performance:** O(n log n) optimized implementation

**Comparison:** Use CDT for robustness with holes; use earcut for simple cases requiring speed

### Algorithm Applicability by Roof Type

| Roof Type | Primary Use | Secondary Use | Notes |
|-----------|------------|---------------|-------|
| **Flat** | Direct triangulation | Earcut (no holes) / CDT (holes) | Horizontal plane at wall top; simplest case |
| **Skillion** | Single plane construction | Earcut | Slope from `roof_direction` and `roof_height`; no ridge |
| **Gabled** | **Straight Skeleton (ridge)** | CDT for faces | Skeleton finds ridge automatically; CDT ensures hole handling |
| **Hipped** | **Straight Skeleton (ridge + hips)** | CDT for faces | Skeleton computes hip endpoints naturally from corner collapse |
| **Half-Hipped** | **Straight Skeleton (ridge + hips)** | CDT for faces | Skeleton determines where gable transitions to hip |
| **Mansard** | **Straight Skeleton (ridge) + Polygon Offset (break lines)** | CDT for faces | Skeleton for ridge; clipper2-ts for break line polygon |
| **Gambrel** | **Straight Skeleton (ridge) + Polygon Offset (break lines)** | CDT for faces | Skeleton for ridge; clipper2-ts for break line polygon |
| **Saltbox** | **Straight Skeleton (asymmetric ridge)** | CDT for faces | Skeleton naturally computes offset ridge for asymmetry |
| **Pyramidal** | **Straight Skeleton (apex + hips)** | CDT for hip faces | Skeleton identifies hip topology; works for irregular footprints |
| **Dome** | Radial grid | CDT or Earcut | Triangulate radial divisions from apex |
| **Onion** | Radial grid | CDT or Earcut | Similar to dome with bulbous curve profile |
| **Round** | Cylindrical grid | CDT or Earcut | Extrusion-based approach from apex |

## Roof Geometry Vocabulary

### Essential Terms

These terms describe the key geometric elements used to specify and understand roof shapes.

**Apex (Peak)** - The highest single point of a roof, used for pyramidal and dome shapes instead of a linear ridge.

**Eave** - The lower edge of a roof that overhangs the wall, where water drains off.

**Gable** - The triangular wall section formed at the end of a building with a gabled roof, between the eave level and ridge.

**Hip** - A sloped roof edge that runs from the ridge down to an eave at an external corner, forming a triangular end face instead of a vertical gable.

**Orientation** - Whether the ridge runs along (parallel to) or across (perpendicular to) the building's longest axis. Specified via `roof_orientation` field (`along` or `across`).

**Ridge** - The horizontal line where two sloping roof planes meet at the top. The highest edge of a pitched roof running along its length.

**Ridge Direction** - The compass bearing along which the ridge runs (0°=North, clockwise). Controls the orientation of pitched roofs. Specified via `roof_direction` field.

**Roof Height** - The vertical distance from the wall top to the roof's highest point (ridge or apex). Specified via `roof_height` field.

**Slope (Pitch)** - The angle of a roof surface from horizontal, determining how steeply it rises. Measured as rise-over-run or in degrees.

**Slope Break** - A transition line where the roof pitch changes from one angle to another, creating multi-slope roofs like gambrel or mansard. Also called a break line.

### Advanced Implementation Terms

For developers implementing or debugging roof geometry:

**Across-ridge Axis** - The direction perpendicular to the ridge; determines where eaves and gables are positioned. One of two primary axes in the OBB coordinate system.

**Along-ridge Axis** - The direction parallel to the ridge; one of two primary axes in the OBB coordinate system.

**Break Height** - The elevation at which a slope break occurs (e.g., transition from steep to shallow in gambrel/mansard roofs).

**Inset** - Horizontal distance from the building edge to a slope break or platform edge. Used in mansard roofs to define the plateau width.

**OBB (Oriented Bounding Box)** - Minimal rectangle aligned with the building's longest edge, used to determine ridge direction and roof proportions automatically when no explicit direction is specified.

**Ridge Offset** - Horizontal displacement of the ridge from the building centerline. Used in saltbox roofs to create asymmetry with different-length slopes on each side.

## Supported Roof Types

The following `roof_shape` values are supported (using Overture enum values):

1. **gabled** - Classic pitched roof with two sloping planes meeting at a ridge
2. **hipped** - Pitched roof with sloping planes on all four sides
3. **half_hipped** - Hybrid between gabled and hipped with partial hip ends
4. **flat** - Simple flat or nearly flat roof plane
5. **mansard** - Roof with double slopes on all sides, steeper lower slope
6. **gambrel** - Barn-style roof with two different pitches on each side
7. **saltbox** - Asymmetrical pitched roof with different ridge heights
8. **round** - Cylindrical arched roof
9. **skillion** - Single sloping plane roof
10. **pyramidal** - Pyramid-shaped roof with four triangular faces
11. **dome** - Hemispherical or spherical roof shape
12. **onion** - Bulbous dome with curved profile

Any `roof_shape` value not in the list above (including `spherical`, `tent`, or any unrecognized value) falls back to **flat** roof rendering.

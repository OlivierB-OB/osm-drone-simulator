# Simple 3D Buildings - OpenStreetMap

Complete guide to 3D building tagging conventions in OpenStreetMap, including practical examples and community discussion.

## Overview

This specification describes tagging conventions for basic 3D attributes of buildings in OpenStreetMap. The schema represents "a unified subset of tags" supported across multiple 3D mapping applications.

## Core Concepts

### Building Structure Hierarchy

Buildings are modeled using two primary area types:

1. **Building outlines** (`building=*`): The complete footprint encompassing all parts
2. **Building parts** (`building:part=*`): Sections with distinct physical characteristics like height or color

The outline provides backward compatibility for 2D renderers. When building parts exist, the outline is excluded from 3D rendering.

## Tagging Framework

### Universal Tags (Facades & Roof)

| Tag | Purpose |
|-----|---------|
| `height=*` | Distance from ground to roof top (excluding antennas) |
| `min_height=*` | Height below the building structure |

### Façade-Only Tags

| Tag | Purpose |
|-----|---------|
| `building:levels=*` | Number of above-ground floors |
| `building:min_level=*` | Skipped levels analogue |
| `building:material=*` | Exterior material |
| `building:colour=*` | Façade color |

### Roof-Specific Tags

**Roof Shapes Available:**
- Flat, skillion, gabled, half-hipped, hipped, pyramidal
- Gambrel, mansard, dome, onion, round, saltbox

**Related Properties:**
- `roof:shape=*`: Type classification
- `roof:height=*`: Vertical rise measurement
- `roof:orientation=*`: Along or across longest building side
- `roof:angle=*`: Inclination in degrees
- `roof:colour=*` and `roof:material=*`: Surface properties

## Mapping Guidelines

### Building Relations

A `type=building` relation grouping outlines with all parts is optional but recommended for:
- Buildings with overhanging sections
- Complex structures with numerous parts
- Underground extensions

Members require role assignments: "outline" for the perimeter, "part" for sections.

### Underground Extensions

Tag underground areas beyond the visible footprint as `building:part=*` with `layer=-1`, matching above-ground parts tagged with `layer=1`.

## Software Ecosystem

### Supported Applications

**Web Platforms:** F4 Map, OSMBuildings, Mapbox GL JS, OpenScienceMap, Streets GL

**Desktop Tools:** OSM2World, Kendzi3D (JOSM plugin), Urban Eye 3D

**Mobile:** Organic Maps (Android), Carto Mobile SDK (iOS/Android)

**Design Software:** Blender-OSM, Mapbox Studio, Maputnik

## Community Discussion & Technical Details

### Complex Buildings

Discussion about importing 3D models from external databases (Blender, Google SketchUp, etc.) and linking them to OSM. The consensus suggests outsourcing complex models to [OpenBuildingModels](http://wiki.openstreetmap.org/wiki/OpenBuildingModels) or [Open3DMap](http://wiki.openstreetmap.org/wiki/Open3DMap).

### Roof Shapes and Orientation

#### Key Concerns
- Asymmetric roofs (sawtooth, skillion) require additional directional information beyond "along/across"
- Direction vectors should indicate where the roof "faces" toward the front
- Consensus suggests using `roof:direction` for consistent orientation tagging across all roof types

#### Roof Types Discussed
- Pitched/monopitched roofs
- Gabled and hipped roofs
- Mansard roofs
- Barrel/arched roofs
- Pyramidal and dome variations
- Saltbox roofs

The page notes that "roof direction faces toward building front, with optional snapping to best matching wall."

### Technical Implementation Issues

#### Roof Direction Conflicts
Different renderers interpret `roof:direction` and `roof:slope:direction` values inconsistently:
- Kendzi3D uses "snap to edge" magic
- F4Map interprets values as angles (degrees clockwise from north)
- Creating seamless roof edges requires consistent interpretation across tools

#### Building Parts and Multipolygons
Key challenges include:
- Properly tagging L-shaped and T-shaped buildings
- Handling farm buildings mapped as multipolygons
- Correctly representing buildings split across multiple addresses
- Distinguishing between building outline rendering and building:part rendering

### Material and Color Documentation

#### Current Approach
The convention states: "blend a grayscale texture with the tagged color" by multiplying color values with desaturated textures.

Issues noted:
- Not all materials have grayscale texture variants available
- Dual-color materials (like timber framing) lack proper rendering support
- Default render styles require expansion for various material types

### Building Height and Elevation

#### Height Definition Conventions
For buildings on slopes, use the "biggest heights" measurement: "measure heights from lowest ground elevation within the building area."

This approach ensures:
- Consistent height tagging across adjacent buildings
- Better terrain model compatibility
- Reduced errors when elevation data changes

### Façade and Material Complexity

#### Unsolved Problems
- Different colors on each wall without building:part subdivision
- Horizontal AND vertical color divisions on the same wall
- Multiple materials per façade section

Proposed solution using conditional tags remains experimental: `building:colour:conditional=[color @ level:range]`

### Limitations Documentation

#### Roofs
- Complex roofs with multiple directions
- Outstanding/protruding roofs
- Split roofs
- Tall roofs requiring separate levels

#### Façades
- Color/material variations on single walls
- Non-solid materials requiring texture complexity

#### General Features
- Balconies and pillars
- Passages through buildings
- Freeform buildings (suggested for OpenBuildingModels instead)
- Buildings with atriums (multipolygon solutions exist)
- Church structures with spires/domes

### Buildings on Slopes

Discussion centers on representing height differences when buildings are adjacent on sloped terrain. Consensus recommends:
- All building parts use same reference ground level
- Renderers apply elevation data separately
- Avoid ground-penetration in flat-terrain visualizations

### Unresolved Technical Challenges

#### Roof Direction Interpretation
Multiple community members report that kendzi3d and F4Map render identical tags differently, suggesting:
- Need for standardized direction conventions
- Possible implementation of degree-based angles for precision
- Alternative approaches using begin/end node roles in multipolygons

#### Building Part Outside Outline
Some mapped buildings have `building:part` elements extending beyond the main building outline, creating rendering inconsistencies.

#### Naming Ambiguities
- "Round" vs. "arched" vs. "barrel" for curved roofs
- "Pyramidal" vs. "tented" vs. "square_pyramidal" definitions remain debated

### Community Contributions

#### Demo Areas
Referenced examples include Karlsruhe and Heidelberg, though quality and consistency vary.

#### Tool Development
- JOSM plugins (kendzi3d) for visualization
- OSM2World for 3D model generation
- F4 Map web-based renderer

#### Data Quality Issues
Many buildings in demo areas lack necessary tags like `height`, `building:levels`, or `roof:height`, limiting rendering accuracy.

### Special Cases

#### Roof-Only Structures
Alternatives proposed for structures like train station canopies:
- `building=roof`
- `man_made=canopy`
- `wall=no`

#### Things on Buildings
Discussion about tagging antennas, street lamps, and base stations on rooftops using `level=*`, `min_height=*`, or `location=roof`.

#### Tunnels Through Buildings
Proposed tagging: `tunnel=building_passage` or `tunnel=passage` for footways through buildings.

### Standards and Future Work

#### Outstanding Tasks
- Create wiki page for `roof:direction` tag
- Develop standardized role syntax for multipolygon direction markers
- Establish grayscale texture library for colorable materials
- Document building outline rendering with examples

#### Proposal Status
Many features remain proposals rather than formally accepted standards, including roof direction conventions and additional roof shape values.

## Limitations & Extensions

This schema handles standard building geometry only. Complex architectural features are addressed through the F3DB proposal ("Full 3D Building" framework).

---

**Sources:**
- [Simple 3D Buildings - OSM Wiki](https://wiki.openstreetmap.org/wiki/Simple_3D_Buildings)
- [Talk: Simple 3D Buildings - OSM Wiki](https://wiki.openstreetmap.org/wiki/Talk:Simple_3D_Buildings)
- Last updated: February 2026

# 3D Object Visualization

## Overview

The simulator visualizes five categories of real-world objects extracted from Overture Maps data. Each type is rendered as 3D geometry in the Three.js scene using specialized mesh factories that transform geographic data into spatial meshes.

**Object Categories:**

1. **Buildings**: Extrusion-based 3D structures with parametric roofs (gabled, hipped, domed, etc.)
2. **Vegetation**: Distributed trees, forests, shrubs, orchards, and vineyards using instanced mesh for efficiency
3. **Structures**: Man-made objects like towers, chimneys, water towers, and cranes built from parametric shapes
4. **Barriers**: Linear features like walls, hedges, and fences extruded along their paths
5. **Bridges**: Elevated deck segments for roads and railways with layer-based height control

## Object Types

| File | Description |
|------|-------------|
| [buildings.md](buildings.md) | Walls, roofs (gabled, hipped, domed, pyramidal, etc.), material colors, height defaults |
| [vegetation.md](vegetation.md) | Trees, forests, scrub, orchards, vineyards; instanced mesh optimization; per-tree sampling |
| [structures.md](structures.md) | Towers, chimneys, cranes, water towers; parametric shapes; structure-specific materials |
| [barriers.md](barriers.md) | Walls, hedges, fences; linear extrusion; segment-based elevation sampling |
| [bridges.md](bridges.md) | Elevated decks; layer-based height control; road/rail deck width |

## Systems & Architecture

| File | Description |
|------|-------------|
| [systems.md](systems.md) | Rendering pipeline, spatial organization, tile ring system, performance optimization |

## See Also

- **[Data Pipeline](../../data-pipeline.md)** — Overview of feature extraction and mesh generation
- **[Elevation Sampling & Interpolation](../data/elevation-sampler.md)** — Bilinear interpolation for terrain heights
- **[Coordinate System & Rendering](../coordinate-system.md)** — Geographic to Three.js transformation
- **[Glossary](../glossary.md)** — Technical terminology

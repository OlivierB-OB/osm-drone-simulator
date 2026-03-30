# Structures

## Visual Characteristics

Structures appear as distinctive man-made objects: towers rise as cylinders or tapered pillars, water towers have bulbous tanks, cranes have angular frames. Each structure type has a characteristic shape and color.

**Examples:**
- Cellular tower: gray cylinder 20m tall (#a0a098)
- Chimney: tapered cylinder 40m tall, darker gray (#888880)
- Water tower: cylinder with spherical tank on top (#a8a8b0)
- Crane: complex frame geometry in yellow (#f0b800)

## Data Sources

Structures identified by Overture fields:
- `man_made=tower`, `chimney`, `mast`, `water_tower`, `silo`, `storage_tank`, `lighthouse`, `crane`
- `power=tower`, `pole`, `generator` (with subtypes)
- `aerialway=pylon`
- `height` tag (in meters)
- `diameter` tag (converted to radius)
- `colour` tag (explicit color override)

## Rendering Strategy

**Strategy Pattern**: Each structure type implements `IStructureStrategy` with a `create()` method that generates geometry from parametric inputs (radius, height, color).

**Shapes:**
- **Cylinder**: Straight-sided pillars (towers, silos, poles, storage tanks)
- **Tapered Cylinder**: Narrower at top (chimneys, masts, lighthouses)
- **Box**: Angular frames (power towers, pylon structures)
- **Water Tower**: Cylinder base with sphere cap
- **Crane**: Complex multi-part frame with jib and counterweight

## Geometry Details

**Cylinder (Tower, Silo):**
- `CylinderGeometry(radius, radius, height, 8)` — 8-sided for efficiency
- Position: X/Z at structure centroid, Y at terrain elevation + height/2 (center of object)

**Tapered Cylinder (Chimney, Mast):**
- `CylinderGeometry(radiusTop, radiusBottom, height, 8)` — top narrower than bottom
- Gradual taper creates realistic taper effect

**Box (Power Tower):**
- `BoxGeometry(width, height, depth)` — cubic or rectangular
- Stiff angular appearance suitable for lattice structures

**Water Tower:**
- Composite: cylinder base + sphere tank cap
- Sphere scaled and positioned above cylinder

**Crane:**
- Multi-geometry assembly: vertical mast, horizontal jib, counterweight, hook
- Rotated by structure `rotation_angle` if present

All structures use Lambert material with spec colors for realistic outdoor lighting.

## Configuration

| Structure Type | Shape | Default Height | Default Radius | Color |
|---|---|---|---|---|
| tower | cylinder | 20m | 3m | #a0a098 |
| communications_tower | cylinder | 50m | 4m | #a0a098 |
| chimney | tapered_cylinder | 40m | 2m | #888880 |
| mast | tapered_cylinder | 30m | 1m | #b0b0b0 |
| silo | cylinder | 15m | 4m | #d0c8b0 |
| storage_tank | cylinder | 10m | 8m | #c0c0c0 |
| water_tower | water_tower | 20m | 5m | #a8a8b0 |
| lighthouse | tapered_cylinder | 25m | 3m | #f0f0e8 |
| crane | crane | 40m | 1m | #f0b800 |
| power_tower | box | 25m | 1.5m | #c0c0c8 |
| power_pole | cylinder | 10m | 0.2m | #a08060 |
| aerialway_pylon | box | 12m | 1m | #b0b0b8 |

## Elevation Handling

- **Position selection**: Point geometries use coordinates directly; polygon geometries use centroid
- **Terrain sampling**: `ElevationSampler.sampleAt()` called at structure position
- **Vertical positioning**: Structure centered at terrain elevation + height/2 (so base touches ground)
- **No rotation**: Structures remain level regardless of terrain slope

## See Also

- **[Buildings](buildings.md)** — 3D structures with roofs
- **[Barriers](barriers.md)** — Linear features
- **[Systems](systems.md#spatial-organization)** — Coordinate system and spatial layout
- **[Data Pipeline](../../data-pipeline.md)** — Feature extraction process

# Key: `building:part` — Building Part

> Source: https://wiki.openstreetmap.org/wiki/Key:building:part

## Description

The `building:part=*` tag divides a building into distinct sections (parts) that differ in physical attributes such as height, shape, material, or colour. Each part is mapped as a separate area polygon overlapping the main `building=*` footprint.

When building parts exist, 3D renderers use them instead of the outline for geometry. The outer `building=*` polygon is kept for backward compatibility with 2D renderers but is excluded from 3D rendering if parts are present.

## Element Types

- **Areas / multipolygon relations**: use this tag
- **Nodes / ways**: do not use

## Values

### `building:part=yes`

- **Element types**: area
- **Description**: A generic building part with differing attributes from adjacent parts. Used when no more specific part type applies.
- **Common sub-tags**: `height=*`, `min_height=*`, `building:levels=*`, `building:min_level=*`, `building:colour=*`, `building:material=*`, `roof:shape=*`, `roof:colour=*`, `roof:material=*`
- **Status**: de facto

### `building:part=porch`

- **Element types**: area
- **Description**: A roof structure covering an entrance to a building, typically a small projecting canopy or vestibule.
- **Common sub-tags**: `height=*`, `min_height=*`
- **Status**: de facto

### `building:part=balcony`

- **Element types**: area
- **Description**: An overhanging platform attached to the exterior of a building, enclosed by a railing or balustrade.
- **Common sub-tags**: `height=*`, `min_height=*`
- **Status**: de facto

### `building:part=column`

- **Element types**: area
- **Description**: A vertical structural support element, typically cylindrical or rectangular, that supports elevated parts of a building.
- **Common sub-tags**: `height=*`
- **Status**: de facto

### `building:part=corridor`

- **Element types**: area
- **Description**: An enclosed connection between two separate building masses, either at ground level or elevated above ground.
- **Common sub-tags**: `height=*`, `min_height=*`
- **Status**: de facto

### `building:part=roof`

- **Element types**: area
- **Description**: A part of a building consisting solely of a roof structure with no vertical walls below it, such as a canopy, awning, or visor.
- **Common sub-tags**: `roof:shape=*`, `height=*`, `min_height=*`
- **Status**: de facto

### `building:part=steps`

- **Element types**: area
- **Description**: An exterior step-shaped building section, such as a stepped podium or terraced base of a building.
- **Common sub-tags**: `height=*`, `min_height=*`
- **Status**: de facto

### `building:part=staircase`

- **Element types**: area
- **Description**: An interior staircase component of a building, used when the staircase tower has distinct physical characteristics from the main body.
- **Common sub-tags**: `height=*`
- **Status**: de facto

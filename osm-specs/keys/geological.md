# Key: `geological` — Geological Features

> Source: https://wiki.openstreetmap.org/wiki/Key:geological

## Description

Used to describe geological sites and features. The key supplements `natural=*` for features best described in geological terms. It applies to nodes, ways, and areas (including multipolygon relations). Status: in use.

## Values

### `geological=moraine`

- **Element types**: node / way / area
- **Description**: Any accumulation of unconsolidated rock debris previously carried by a glacier.
- **Status**: in use

### `geological=outcrop`

- **Element types**: node / way / area
- **Description**: A place where the bedrock or superficial deposits previously covered under the soil have become locally exposed.
- **Status**: in use

### `geological=palaeontological_site`

- **Element types**: node / area
- **Description**: A place with fossils where remains of ancient living forms are preserved. Represents sites of scientific importance for the study of prehistoric life.
- **Status**: approved

### `geological=volcanic_caldera_rim`

- **Element types**: way / area
- **Description**: The rim of a caldera — a large cauldron-like hollow that forms shortly after the emptying of a magma chamber in a volcanic eruption.
- **Status**: in use

### `geological=volcanic_lava_field`

- **Element types**: node / area
- **Description**: An area with volcanic lava on the ground. Refers to a lava field, also known as a lava plain or lava bed — a large expanse of nearly flat-lying lava flows. Often combined with `natural=bare_rock` if not overgrown.
- **Common sub-tags**: `natural=bare_rock`, `name=*`
- **Status**: in use

### `geological=volcanic_lava_flow`

- **Element types**: node / area
- **Description**: A flowing or recently solidified stream of lava from a volcanic eruption. Distinct from `geological=volcanic_lava_field` which describes settled lava fields rather than a discrete flow.
- **Status**: in use

### `geological=volcanic_vent`

- **Element types**: node / area
- **Description**: A hole through which lava erupts. A volcano can often have multiple vents, near the centre of a crater or on the sides of the volcano.
- **Status**: in use

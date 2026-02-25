# Key: `building:colour` / `building:material` — Facade Appearance

> Source: https://wiki.openstreetmap.org/wiki/Key:building:colour, https://wiki.openstreetmap.org/wiki/Key:building:material

## Description

These tags describe the visual appearance of a building's exterior walls (façade) for 3D rendering. Both require `building=*` or `building:part=*` on the same element. Renderers typically blend the material texture with the tagged colour.

---

## `building:colour=*`

- **Element types**: area / multipolygon relation
- **Description**: The dominant colour of the building façade. Used by 3D renderers to tint or paint the wall surface. Colour names may be interpreted differently across renderers; prefer hex codes for precision.
- **Common sub-tags**: `building:material=*`, `roof:colour=*`
- **Status**: de facto

### Accepted formats

| Format | Example |
|--------|---------|
| Hex colour code | `building:colour=#F5DEB3` |
| CSS colour name | `building:colour=white` |
| Descriptive name | `building:colour=beige` |

---

## `building:material=*`

- **Element types**: area / multipolygon relation
- **Description**: The outer surface material of the building walls. Some 3D renderers select a texture based on this tag, optionally tinted by `building:colour=*`.
- **Common sub-tags**: `building:colour=*`, `roof:material=*`
- **Status**: de facto

### Values

#### Masonry

| Value | Description |
|-------|-------------|
| `brick` | Fired clay bricks |
| `cement_block` | Concrete masonry units / breeze blocks |
| `concrete` | Cast-in-place or precast concrete |
| `stone` | Natural stone (general) |
| `limestone` | Limestone blocks |
| `sandstone` | Sandstone blocks |
| `masonry` | Unspecified masonry |
| `marble` | Polished marble cladding |
| `pebbledash` | Concrete or plaster with embedded small stones |

#### Rendered / coated

| Value | Description |
|-------|-------------|
| `plaster` | Plaster or stucco render |
| `tiles` | Ceramic tile cladding |

#### Wood / natural

| Value | Description |
|-------|-------------|
| `wood` | Timber boarding or cladding |
| `timber_framing` | Half-timbered / exposed wooden frame |
| `reed` | Reed walls |
| `bamboo` | Bamboo construction |
| `mud` | Dried mud (general) |
| `adobe` | Adobe or cob |
| `rammed_earth` | Compacted earth walls |
| `loam` | Loam walls |
| `clay` | Clay walls |

#### Metal / glass

| Value | Description |
|-------|-------------|
| `glass` | Full-height glass façade |
| `mirror` | Mirrored glass cladding |
| `metal` | Decorative metal cladding |
| `steel` | Industrial steel (non-decorative) |
| `copper` | Copper cladding |
| `tin` | Tin sheeting |
| `metal_plates` | Metal plate panels |
| `vinyl` | Plastic vinyl strips |
| `plastic` | Plastic cladding |

#### Other

| Value | Description |
|-------|-------------|
| `slate` | Slate cladding |
| `solar_panels` | Building-integrated photovoltaic panels |

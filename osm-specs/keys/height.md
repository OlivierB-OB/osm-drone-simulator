# Key: `height` / `min_height` — Height

> Source: https://wiki.openstreetmap.org/wiki/Key:height, https://wiki.openstreetmap.org/wiki/Key:min_height

## Description

`height=*` records the vertical extent of a feature measured in metres from the lowest adjacent ground point to the highest structural point (excluding antennas). `min_height=*` records the height above ground where a feature begins — used for elevated building parts, arches, or overhanging sections.

These two tags are used together: `min_height` sets the base, `height` sets the top.

**Not to be confused with:**
- `ele=*` — elevation above mean sea level
- `maxheight=*` — clearance limit for vehicles

## `height=*`

- **Element types**: node / way / area / relation
- **Description**: The total height of the feature from the lowest ground point beneath it to its topmost structural point. For buildings this includes the roof but excludes antennas and flagpoles.
- **Unit**: metres (default). Append unit for others: `height=7'4"` (feet/inches), `height=4 m`.
- **Common sub-tags**: `min_height=*`, `building:levels=*`
- **Status**: de facto

### Common values

| Context | Example |
|---------|---------|
| Single-storey building | `height=4` |
| Multi-storey building | `height=30` |
| Tower | `height=120` |
| Chimneys, masts | `height=80` |

### Format rules

- Use period as decimal separator: `height=3.5` ✓ — `height=3,5` ✗
- Include space before unit: `height=4 m` ✓ — `height=4m` ✗
- Do not use ranges: use `min_height=3` + `height=5`, not `height=3-5`

---

## `min_height=*`

- **Element types**: node / way / area / relation
- **Description**: The height above ground at which the bottom of a feature starts. Used for elevated building parts (e.g. a bridge deck, an arch, or a floating floor). The effective visible height of the part is `height − min_height`.
- **Unit**: metres
- **Common sub-tags**: `height=*`, `building:levels=*`, `building:min_level=*`
- **Status**: in use

### Typical uses

| Use case | Tags |
|----------|------|
| Arch passage through building | `min_height=4`, `height=8` |
| Elevated corridor between buildings | `min_height=6`, `height=10` |
| Overhanging upper floor | `min_height=3`, `height=15` |

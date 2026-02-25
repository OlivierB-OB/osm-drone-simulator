# Key: `building:levels` / `building:min_level` — Building Levels

> Source: https://wiki.openstreetmap.org/wiki/Key:building:levels

## Description

`building:levels=*` counts the number of above-ground floors of a building or building part. `building:min_level=*` indicates the lowest level present in a building part when that part does not start at ground level.

These tags are used alongside `height=*` for 3D rendering. When `height=*` is absent, renderers typically estimate height as `building:levels × 3 m`.

Both tags require `building=*` or `building:part=*` on the same element.

## `building:levels=*`

- **Element types**: area / multipolygon relation (node allowed; way not recommended)
- **Description**: The number of above-ground non-roof levels (floors) of the building or part. Ground floor = 1. Roof levels are counted separately with `roof:levels=*`. Underground levels use `building:levels:underground=*`.
- **Values**: Positive integers only. Fractional values are not valid — use `height=*` for unusual floor heights.
- **Common sub-tags**: `height=*`, `building:min_level=*`, `roof:levels=*`, `building:levels:underground=*`
- **Status**: de facto

### Level counting convention

| Situation | Value |
|-----------|-------|
| Ground floor only | `building:levels=1` |
| Ground + 4 upper floors | `building:levels=5` |
| Fully underground structure | `building:levels=0` + `building:levels:underground=1` |

---

## `building:min_level=*`

- **Element types**: area / multipolygon relation
- **Description**: The number of levels skipped below a building part — i.e. the level index at which the part starts. Used when a building part does not start at ground floor (level 0). Must be strictly less than `building:levels=*` on the same element.
- **Values**: Non-negative integers.
- **Common sub-tags**: `building:levels=*`, `min_height=*`
- **Status**: de facto

### Typical uses

| Use case | Tags |
|----------|------|
| Upper section starting at floor 3 | `building:min_level=3`, `building:levels=8` |
| Floating bridge between towers | `building:min_level=5`, `building:levels=6` |

---

## Related tags

| Tag | Purpose |
|-----|---------|
| `roof:levels=*` | Number of levels within the roof space |
| `building:levels:underground=*` | Number of below-ground levels |
| `height=*` | Total height in metres (overrides level estimation) |
| `min_height=*` | Bottom height in metres for elevated parts |

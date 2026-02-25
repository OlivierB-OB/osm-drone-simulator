# Key: `bridge` / `tunnel` — Way Modifiers

> Source: https://wiki.openstreetmap.org/wiki/Key:bridge, https://wiki.openstreetmap.org/wiki/Key:tunnel

## Description

`bridge=*` and `tunnel=*` are modifier tags added to an existing way (road, path, railway, waterway…) to indicate that the way passes over or under another feature. They do not create a separate object — the geometry stays on the original way, and `layer=*` provides the vertical ordering.

Both are physically significant for drone simulation: bridges are visible elevated structures; tunnels disappear underground.

---

## `bridge=*`

- **Element types**: way / area (multipolygon relation)
- **Common sub-tags**: `layer=1` (or higher), `name=*`
- **Status**: approved

### Values

| Value | Description |
|-------|-------------|
| `yes` | Non-specific bridge — the standard value for most crossings |
| `viaduct` | Series of spans carrying a road or railway across a valley or other obstacle |
| `aqueduct` | Bridge carrying a canal or water channel |
| `boardwalk` | Plank walkway elevated over wet or marshy terrain |
| `covered` | Bridge enclosed by a roof and walls |
| `movable` | Drawbridge or swing bridge that can open for vessel passage |
| `trestle` | Bridge supported by a series of rigid frames (bents) |
| `cantilever` | Bridge with spans supported at one end only |
| `low_water_crossing` | Low bridge engineered to be passable at normal flow and survivable when submerged |

### Usage

```
highway=secondary
bridge=yes
layer=1
name=Old Bridge
```

For large bridge structures the deck area can be mapped separately as `man_made=bridge`.

---

## `tunnel=*`

- **Element types**: way / relation
- **Common sub-tags**: `layer=-1` (or lower)
- **Status**: de facto

### Values

| Value | Description |
|-------|-------------|
| `yes` | Standard underground tunnel for roads, railways, or canals |
| `building_passage` | A passage running through or under a building at ground level |
| `culvert` | A small pipe or channel carrying a waterway under a road or embankment |
| `flooded` | An underground section permanently filled with water |
| `avalanche_protector` | A covered section of mountain road protecting against avalanche |

### Usage

```
highway=primary
tunnel=yes
layer=-1
```

Split the way at the tunnel entrance and exit. The tunnel section carries the `tunnel=*` and `layer=*` tags; the surface sections do not.

### Notes

- `tunnel=building_passage` typically does not need `layer=*` unless multiple passages stack vertically.
- Implies `covered=yes`.

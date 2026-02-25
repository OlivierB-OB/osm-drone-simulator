# Landcover

Source: https://wiki.openstreetmap.org/wiki/Landcover

Landcover describes the **physical material at Earth's surface** (grass, asphalt, trees, bare ground, water). Differs from `landuse=*`, which describes human use of land.

## Primary Tags

| Tag | Usage |
|-----|-------|
| `natural=*` | Natural surface types |
| `landuse=*` | Land use (often implies landcover) |
| `surface=*` | Surface material (roads, paths, parking) |
| `landcover=*` | Explicit landcover (proposed, rarely used) |

> Note: `landuse=*` implies certain landcover types but not always surface material (e.g. `landuse=military` doesn't specify ground composition).

---

## Natural & Semi-Natural

### Vegetation

| Landcover | Tags |
|-----------|------|
| Wood / Forest | `natural=wood` or `landuse=forest` + `leaf_cycle=deciduous/evergreen/mixed` |
| Scrub | `natural=scrub` |
| Heath | `natural=heath` |
| Grassland | `natural=grassland`, `landuse=grass`, or `landuse=meadow` |
| Tundra / Fell | `natural=tundra` or `natural=fell` |

### Water Features

| Landcover | Tags |
|-----------|------|
| Wetland | `natural=wetland` + `wetland=bog/marsh/swamp/mangrove/reedbed/saltmarsh` |
| Water | `natural=water`, `waterway=riverbank`, or `landuse=reservoir` |
| Mud | `natural=mud` or `natural=wetland` + `wetland=mud` |
| Beach / Shoal | `natural=beach` or `natural=shoal` + `surface=*` |
| Glacier | `natural=glacier` |

### Bare / Rocky

| Landcover | Tags |
|-----------|------|
| Bare Rock | `natural=bare_rock` |
| Scree / Shingle | `natural=scree` or `natural=shingle` |
| Sand | `natural=sand` |
| Reef | `natural=reef` + `reef=*` |

---

## Agricultural

| Landcover | Tags |
|-----------|------|
| Farmland (crops) | `landuse=farmland` |
| Meadow / Pasture | `landuse=meadow` |
| Orchard / Plantation | `landuse=orchard` |
| Vineyard | `landuse=vineyard` |
| Allotments | `landuse=allotments` |
| Greenhouse | `landuse=greenhouse_horticulture` |

---

## Developed / Built

| Landcover | Tags |
|-----------|------|
| Residential | `landuse=residential` |
| Commercial | `landuse=commercial` |
| Industrial | `landuse=industrial` |
| Retail | `landuse=retail` |
| Parking | `amenity=parking` + `surface=*` |
| Railway yard | `landuse=railway` |

---

## Extraction / Waste

| Landcover | Tags |
|-----------|------|
| Quarry / Mine | `landuse=quarry` |
| Landfill | `landuse=landfill` |
| Brownfield | `landuse=brownfield` |
| Construction | `landuse=construction` |

---

## Artificial Water

| Landcover | Tags |
|-----------|------|
| Basin (water control) | `landuse=basin` |
| Salt pond | `landuse=salt_pond` |
| Reservoir | `landuse=reservoir` |

---

## Classification Systems

### NLCD (National Land Cover Database)

| Code | Class |
|------|-------|
| 11 | Open water |
| 12 | Perennial ice/snow |
| 21–24 | Developed (open space → high intensity) |
| 31 | Barren land (rock/sand/clay) |
| 41 | Deciduous forest |
| 42 | Evergreen forest |
| 43 | Mixed forest |
| 51 | Dwarf scrub |
| 52 | Shrub/scrub |
| 71 | Grassland/herbaceous |
| 72–74 | Sedge, lichens, moss |
| 81 | Pasture/hay |
| 82 | Cultivated crops |
| 90 | Woody wetlands |
| 95 | Herbaceous wetlands |

### LCCS (Land Cover Classification System)

Multi-level diagnostic attributes organized into types:

| Code | Type |
|------|------|
| A11 | Cultivated and managed terrestrial areas |
| A12 | Natural and semi-natural vegetation |
| B15 | Artificial surfaces |
| B16 | Bare areas |
| B27 | Artificial waterbodies, snow, ice |
| B28 | Natural waterbodies, snow, ice |

Supports up to 3 stratification layers for vegetation classification.

---

## Notes

- Landcover tagging is often **implied** by other tags rather than explicitly documented.
- Forest/woodland mapping is **controversial**: mappers use `natural=wood` vs `landuse=forest` differently for natural vs. managed areas.
- Permanent ice caps and glaciers are mapped; snowfields generally are not.
- The `landcover=*` key was proposed but remains **uncommonly used** — prefer `natural=*` and `landuse=*`.

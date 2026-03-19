# Overture Maps — Buildings Theme

The buildings theme contains building footprints and 3D building part geometry. Buildings are derived from OpenStreetMap, Microsoft Building Footprints, Google Open Buildings, and other sources, deduplicated and assigned stable GERS IDs.

**Theme name:** `buildings`

---

## Feature Types

- [building](#building) — whole building footprint
- [building_part](#building_part) — sub-part of a building with distinct 3D geometry

---

## building

A building footprint representing a single structure. May reference one or more `building_part` features for 3D detail.

**Geometry types:** `Polygon`, `MultiPolygon`

### Properties

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | GERS identifier |
| `bbox` | object | Yes | Bounding box |
| `theme` | string | Yes | `"buildings"` |
| `type` | string | Yes | `"building"` |
| `version` | integer | Yes | Feature version |
| `sources` | array | Yes | Source provenance records |
| `subtype` | string | No | Broad building category (see BuildingSubtype) |
| `class` | string | No | Specific building class (see BuildingClass) |
| `names` | object | No | Localized names |
| `level` | integer | No | Ground-relative vertical level |
| `height` | number | No | Total building height in meters (> 0) |
| `min_height` | number | No | Height of base above ground in meters (≥ 0) |
| `num_floors` | integer | No | Number of above-ground floors (> 0) |
| `min_floor` | integer | No | Lowest floor number (0 = ground) |
| `facade_color` | string | No | Facade color as CSS hex string (e.g. `#A3B4C5`) |
| `facade_material` | string | No | Facade surface material (see FacadeMaterial) |
| `roof_color` | string | No | Roof color as CSS hex string |
| `roof_material` | string | No | Roof surface material (see RoofMaterial) |
| `roof_shape` | string | No | Roof geometry shape (see RoofShape) |
| `roof_direction` | number | No | Roof ridge direction in degrees [0, 360) |
| `roof_orientation` | string | No | Ridge orientation relative to footprint (see RoofOrientation) |
| `roof_height` | number | No | Height of roof section in meters (> 0) |
| `has_parts` | boolean | No | `true` if associated `building_part` features exist |
| `is_underground` | boolean | No | `true` if the building is below ground level |
| `source_tags` | object | No | Raw upstream tags |
| `wikidata` | string | No | Wikidata QID |
| `cartography` | object | No | Rendering hints |

### has_parts Relationship

When `has_parts` is `true`, the building has one or more `building_part` features that each reference this building via `building_id`. The parts together describe the full 3D shape; the building footprint itself provides the ground-level outline.

---

## building_part

A sub-section of a building with distinct geometry or physical properties — used for detailed 3D building models (LoD2). Each part belongs to exactly one parent building.

**Geometry types:** `Polygon`, `MultiPolygon`

### Properties

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | GERS identifier |
| `bbox` | object | Yes | Bounding box |
| `theme` | string | Yes | `"buildings"` |
| `type` | string | Yes | `"building_part"` |
| `version` | integer | Yes | Feature version |
| `sources` | array | Yes | Source provenance records |
| `building_id` | string | No | GERS ID of the parent `building` feature |
| `names` | object | No | Localized names |
| `level` | integer | No | Vertical level |
| `height` | number | No | Part height in meters (> 0) |
| `min_height` | number | No | Base height above ground in meters (≥ 0) |
| `num_floors` | integer | No | Number of floors in this part (> 0) |
| `min_floor` | integer | No | Lowest floor number |
| `facade_color` | string | No | Facade color as CSS hex string |
| `facade_material` | string | No | Facade surface material (see FacadeMaterial) |
| `roof_color` | string | No | Roof color as CSS hex string |
| `roof_material` | string | No | Roof surface material (see RoofMaterial) |
| `roof_shape` | string | No | Roof geometry shape (see RoofShape) |
| `roof_direction` | number | No | Roof ridge direction in degrees [0, 360) |
| `roof_orientation` | string | No | Ridge orientation relative to footprint (see RoofOrientation) |
| `roof_height` | number | No | Height of roof section in meters (> 0) |
| `source_tags` | object | No | Raw upstream tags |
| `cartography` | object | No | Rendering hints |

---

## Enumeration Reference

### BuildingSubtype (13 values)

| Value | Description |
|-------|-------------|
| `agricultural` | Barns, silos, farm structures |
| `civic` | Government and public administration |
| `commercial` | Retail, offices, business |
| `education` | Schools, universities |
| `entertainment` | Cinemas, theatres, arenas |
| `industrial` | Factories, warehouses |
| `medical` | Hospitals, clinics |
| `military` | Military installations |
| `outbuilding` | Sheds, garages, annexes |
| `religious` | Churches, mosques, temples |
| `residential` | Houses, apartments |
| `service` | Utility and service buildings |
| `transportation` | Train stations, airports, garages |

### BuildingClass (95 values — selected)

`abandoned`, `airport_terminal`, `allotment_house`, `amphitheatre`, `apartments`, `barn`, `barrack`, `basilica`, `boathouse`, `brewery`, `bridge`, `bungalow`, `bunker`, `cabin`, `carport`, `cathedral`, `chapel`, `church`, `cinema`, `civic`, `clinic`, `college`, `commercial`, `community_centre`, `conservatory`, `construction`, `container`, `convent`, `courthouse`, `cowshed`, `dam`, `dentist`, `detached`, `dormitory`, `farm`, `farm_auxiliary`, `fire_station`, `fortress`, `garage`, `garages`, `gatehouse`, `ger`, `government`, `grandstand`, `greenhouse`, `hangar`, `hospital`, `hotel`, `house`, `houseboat`, `hut`, `industrial`, `kindergarten`, `kiosk`, `library`, `lighthouse`, `manufacture`, `mixed_use`, `monastery`, `mortuary`, `mosque`, `museum`, `office`, `outbuilding`, `parking`, `pavilion`, `plant`, `police`, `post_office`, `power`, `prison`, `pub`, `public`, `religious`, `residential`, `retail`, `ruins`, `school`, `semidetached_house`, `service`, `shed`, `shrine`, `silo`, `skyscraper`, `slurry_tank`, `sports_centre`, `stable`, `stadium`, `static_caravan`, `storage_tank`, `substation`, `supermarket`, `synagogue`, `temple`, `tent`, `terrace`, `toilets`, `tower`, `train_station`, `transformer_tower`, `transportation`, `university`, `warehouse`, `wayside_shrine`

### FacadeMaterial (11 values)

| Value | Description |
|-------|-------------|
| `brick` | Brick masonry |
| `cement_block` | Concrete block |
| `clay` | Clay or terracotta |
| `concrete` | Poured or precast concrete |
| `glass` | Glass curtain wall |
| `metal` | Metal cladding |
| `plaster` | Plaster or stucco |
| `plastic` | Plastic or synthetic panel |
| `stone` | Natural stone |
| `timber_framing` | Exposed timber frame |
| `wood` | Wood cladding or siding |

### RoofMaterial (14 values)

| Value | Description |
|-------|-------------|
| `asphalt` | Asphalt shingles |
| `clay` | Clay roof tiles |
| `concrete` | Concrete tiles or slab |
| `copper` | Copper sheeting |
| `eternit` | Fibre cement (Eternit) |
| `glass` | Glass panels |
| `grass` | Green/grass roof |
| `gravel` | Gravel ballast |
| `metal` | Metal sheeting or standing seam |
| `plastic` | Plastic or PVC membrane |
| `roof_tiles` | Generic ceramic roof tiles |
| `slate` | Slate tiles |
| `stone` | Stone slabs |
| `thatch` | Thatched roof |
| `wood` | Wooden shingles or planks |

> Note: 14 values are listed above (includes `wood` in addition to the canonical 14).

### RoofShape (14 values)

| Value | Description |
|-------|-------------|
| `dome` | Hemispherical dome |
| `flat` | Flat or nearly flat roof |
| `gabled` | Two-slope gabled roof |
| `gambrel` | Barn-style double-slope per side |
| `half_hipped` | Hipped ends on a gabled roof |
| `hipped` | Four-slope hipped roof |
| `mansard` | Two-slope mansard profile |
| `onion` | Onion-shaped dome |
| `pyramidal` | Four equal triangular faces |
| `round` | Cylindrical or barrel vault |
| `saltbox` | Asymmetric long rear slope |
| `skillion` | Single sloping plane |
| `spherical` | Fully spherical |
| `tent` | Pointed tent shape |

### RoofOrientation (2 values)

| Value | Description |
|-------|-------------|
| `along` | Ridge runs along the long axis of the footprint |
| `across` | Ridge runs across the short axis of the footprint |

---

## See Also

- [README.md](README.md) — theme overview and common fields
- [base.md](base.md) — physical geography features
- [transportation.md](transportation.md) — road and rail network

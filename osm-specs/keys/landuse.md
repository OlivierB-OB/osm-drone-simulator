# Key: `landuse` — Land Use

> Source: https://wiki.openstreetmap.org/wiki/Key:landuse

## Description

Describes the primary use or purpose of an area of land. The key is used to indicate how land is used by humans, whether for residential, agricultural, commercial, or other purposes. It is one of the most widely used keys in OpenStreetMap and typically applies to areas rather than individual points or lines.

## Values

### Developed Land

### `landuse=commercial`

- **Element types**: node / area
- **Description**: Predominantly commercial businesses and their offices. Used for areas where the primary use is commercial activity such as office parks, business districts, and mixed commercial zones.
- **Status**: de facto

### `landuse=construction`

- **Element types**: node / area
- **Description**: An active development site where construction is underway. Used for land that is currently being built on or developed.
- **Status**: de facto

### `landuse=education`

- **Element types**: node / area
- **Description**: An area predominantly used for educational purposes or facilities, such as school campuses, university grounds, or college estates.
- **Status**: de facto

### `landuse=fairground`

- **Element types**: node / area
- **Description**: A venue used for fairs, exhibitions, or similar large public events. Covers the full extent of the fairground site including ancillary areas.
- **Status**: de facto

### `landuse=industrial`

- **Element types**: node / area
- **Description**: Predominantly industrial landuses such as workshops, factories, or warehouses. Used for areas where the primary activity is manufacturing, processing, or storage.
- **Status**: de facto

### `landuse=institutional`

- **Element types**: node / area
- **Description**: Land used for institutional purposes such as hospitals, government buildings, or other large public institutions that do not fit neatly into other categories.
- **Status**: de facto

### `landuse=military`

- **Element types**: node / area
- **Description**: Land owned or used by the military, including bases, training grounds, firing ranges, and other defence-related facilities.
- **Status**: de facto

### `landuse=port`

- **Element types**: node / area
- **Description**: A coastal or riverside industrial area where commercial traffic is handled, including docks, container terminals, and associated infrastructure.
- **Status**: de facto

### `landuse=railway`

- **Element types**: node / area
- **Description**: An area used predominantly for railway infrastructure, including rail yards, maintenance depots, and land along railway corridors.
- **Status**: de facto

### `landuse=religious`

- **Element types**: node / area
- **Description**: An area used for religious purposes, such as the grounds of a church, mosque, temple, or other place of worship including associated buildings and gardens.
- **Status**: de facto

### `landuse=residential`

- **Element types**: node / area
- **Description**: Land where people reside; predominantly residential detached or attached dwellings. Used for housing areas such as suburbs, housing estates, and residential neighbourhoods.
- **Status**: de facto

### `landuse=retail`

- **Element types**: node / area
- **Description**: Predominantly retail businesses such as shops. Used for shopping centres, high streets, and other areas primarily dedicated to selling goods to consumers.
- **Status**: de facto

---

### Rural and Agricultural Land

### `landuse=allotments`

- **Element types**: node / area
- **Description**: An area of land used by local residents to grow vegetables, fruit, or flowers, typically divided into individual plots for personal use.
- **Status**: de facto

### `landuse=animal_keeping`

- **Element types**: node / area
- **Description**: An area used for keeping livestock or horses, distinct from arable farmland. Includes grazing land managed specifically for animal husbandry.
- **Status**: de facto

### `landuse=farmland`

- **Element types**: node / area
- **Description**: An area of farmland used for tillage, including cereals, vegetables, oil plants, and flowers. The primary use is arable cultivation.
- **Status**: de facto

### `landuse=farmyard`

- **Element types**: area
- **Description**: Farm buildings and the surrounding space used as a working area, including barns, storage sheds, and the yard between them.
- **Status**: de facto

### `landuse=flowerbed`

- **Element types**: area
- **Description**: A designated area managed specifically for growing flowers, typically in an urban or garden setting.
- **Status**: de facto

### `landuse=forest`

- **Element types**: node / area
- **Description**: A managed forest or woodland plantation. Distinct from natural woodland; this tag implies active forestry management for timber or other products.
- **Status**: de facto

### `landuse=greenhouse_horticulture`

- **Element types**: area
- **Description**: An area used for plant production inside greenhouses, including nurseries and horticultural holdings using glass or polytunnel structures.
- **Status**: de facto

### `landuse=logging`

- **Element types**: area
- **Description**: An area where trees have been recently and uniformly cut down, typically as part of commercial timber operations.
- **Status**: de facto

### `landuse=meadow`

- **Element types**: node / area
- **Description**: Land primarily vegetated by grass, used for hay production or animal grazing. Distinct from managed lawns or ornamental grass.
- **Status**: de facto

### `landuse=orchard`

- **Element types**: node / area
- **Description**: Intentional planting of trees or shrubs maintained for food production, such as apple orchards, olive groves, or nut plantations.
- **Common sub-tags**: `trees=*`, `produce=*`
- **Status**: de facto

### `landuse=plant_nursery`

- **Element types**: area
- **Description**: An area used for the production and sale of plants, including seedlings, shrubs, and young trees grown for replanting elsewhere.
- **Status**: de facto

### `landuse=vineyard`

- **Element types**: node / area
- **Description**: An area of land planted with grapevines for the purpose of producing grapes, typically for wine production.
- **Common sub-tags**: `produce=*`, `grape_variety=*`
- **Status**: de facto

---

### Waterbody

### `landuse=basin`

- **Element types**: node / area
- **Description**: An area artificially graded to hold water, such as a retention basin, flood basin, or drainage basin. Distinct from natural lakes or reservoirs.
- **Common sub-tags**: `basin=*`
- **Status**: de facto

### `landuse=reservoir`

- **Element types**: node / area
- **Description**: A large artificial lake or water storage facility created by a dam or other means, used for storing water for drinking, irrigation, or hydroelectric power.
- **Status**: de facto

### `landuse=salt_pond`

- **Element types**: area
- **Description**: A shallow body of water used for the evaporation of seawater to produce salt, typically found in coastal areas.
- **Status**: de facto

---

### Other

### `landuse=brownfield`

- **Element types**: node / area
- **Description**: Previously developed land that has been cleared and is awaiting redevelopment. Often contaminated or requiring remediation before reuse.
- **Status**: de facto

### `landuse=cemetery`

- **Element types**: node / area
- **Description**: An area used for burial of the dead, including churchyards, municipal cemeteries, and memorial gardens.
- **Common sub-tags**: `religion=*`, `denomination=*`
- **Status**: de facto

### `landuse=depot`

- **Element types**: area
- **Description**: An area used for the storage and maintenance of vehicles such as buses, trams, or trucks when not in service.
- **Status**: de facto

### `landuse=garages`

- **Element types**: area
- **Description**: An area containing a block or cooperative arrangement of individual car garages, typically used for residential car storage.
- **Status**: de facto

### `landuse=greenfield`

- **Element types**: node / area
- **Description**: Undeveloped land that has been scheduled or planned for development but has not yet been built on. Typically agricultural or natural land awaiting construction.
- **Status**: de facto

### `landuse=landfill`

- **Element types**: node / area
- **Description**: An area used for the disposal of waste by burial or tipping, including active landfill sites and closed former tips.
- **Status**: de facto

### `landuse=quarry`

- **Element types**: node / area
- **Description**: An area of surface mineral extraction where materials such as stone, gravel, sand, or minerals are removed from the ground.
- **Status**: de facto

### `landuse=recreation_ground`

- **Element types**: node / area
- **Description**: An open green space provided for general outdoor recreation, typically managed by a local authority. Less formal than a park and may include sports fields.
- **Status**: de facto

### `landuse=village_green`

- **Element types**: node / area
- **Description**: A historic English village green — an area of common land in an urban area, traditionally used for community gatherings and recreation.
- **Status**: de facto

### `landuse=winter_sports`

- **Element types**: node / area
- **Description**: An area used for winter sports activities such as skiing, snowboarding, or other snow-based recreational activities, including ski resort areas.
- **Status**: de facto

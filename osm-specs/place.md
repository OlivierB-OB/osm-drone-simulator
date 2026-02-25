# Key: `place` — Place

> Source: https://wiki.openstreetmap.org/wiki/Key:place

## Description

The `place` key is used to identify named geographic locations and settlements. It should exist for every significant human settlement (city, town, suburb, etc.) regardless of administrative status, and also for notable unpopulated named places. The key requires a `name=*` tag. Nodes are the most common element type; areas or relations are used when boundaries are well-defined.

## Values

### Administratively Declared

### `place=country`

- **Element types**: node
- **Description**: A nation state or other high-level national political or administrative area. The node should be positioned on neutral territory within the country's borders.

### `place=state`

- **Element types**: node / area
- **Description**: A large sub-national political or administrative area, such as a US state, Australian state, Mexican state, or Canadian province.
- **Status**: in use

### `place=region`

- **Element types**: node / area / relation
- **Description**: A broad geographic or historical area, or a distinct administrative area in some countries. This tag is from the earliest days of OSM, has never been clearly defined, and is rarely used by data consumers. Boundary relations with `boundary=administrative` are preferred for administrative regions.

### `place=province`

- **Element types**: node
- **Description**: A subdivision of a country similar to a state. When province boundaries are known, boundary relations with `boundary=administrative` and `admin_level=*` are preferred.

### `place=district`

- **Element types**: node
- **Description**: A type of administrative division that, in some countries, is managed by local government. Typically mapped as boundary relations with `boundary=administrative` and appropriate `admin_level=*` values.

### `place=county`

- **Element types**: node
- **Description**: A geographical region of a country used for administrative or other purposes. When tagged on a node, placement is conventionally at the centroid of the boundary.

### `place=municipality`

- **Element types**: node / relation
- **Description**: A single urban administrative division having corporate status. Placement is often arbitrary, typically at the boundary centroid.

---

### Populated Settlements

### `place=city`

- **Element types**: node / area / relation
- **Description**: The largest urban settlement or settlements within a territory. A node is typically placed at the city's centre such as a central square or administrative building.

### `place=borough`

- **Element types**: node / area / relation
- **Description**: A part of a larger city grouped into an administrative unit. Used to distinguish administrative subdivisions within cities, particularly where districts exist at state or county levels.

### `place=suburb`

- **Element types**: node / area / relation
- **Description**: A part of a town or city with a well-known name and often a distinct identity. Boundaries may be uncertain or overlapping; nodes are preferred when boundaries are ambiguous.

### `place=quarter`

- **Element types**: node / area / relation
- **Description**: A named, geographically localised place within a suburb of a larger city or within a town, which is bigger than a neighbourhood. Does not need to be an administrative entity.

### `place=neighbourhood`

- **Element types**: node / area / relation
- **Description**: A smaller named, geographically localised place within a suburb of a larger city or within a town or village. May encompass various land uses (residential, commercial, industrial).

### `place=city_block`

- **Element types**: node / area
- **Description**: A named city block, usually surrounded by streets. Equivalent to "manzanas" in Spanish, "ilots" in French, or "kvarter" in Swedish. Typically combined with `name=*` or `ref=*`.

### `place=plot`

- **Element types**: node / area / relation
- **Description**: A tract or parcel of land owned or meant to be owned by an individual. Represents the lowest level in the urban place hierarchy, below neighbourhoods and city blocks.

### `place=town`

- **Element types**: node / area / relation
- **Description**: An important urban centre, between a village and a city in size. Towns are larger than villages with good shops and facilities used by nearby residents.

### `place=village`

- **Element types**: node / area / relation
- **Description**: A smaller distinct settlement, smaller than a town with few facilities available, with people travelling to nearby towns to access services. Population may vary by country.

### `place=hamlet`

- **Element types**: node / area
- **Description**: A smaller rural community, typically with fewer than 100–200 inhabitants and little infrastructure.

### `place=isolated_dwelling`

- **Element types**: node / area / relation
- **Description**: The smallest kind of settlement (1–2 households) that exists outside other settlements and forms its own distinct community.

### `place=farm`

- **Element types**: node / area
- **Description**: An individually named farm, typically featuring central buildings around a farmyard with surrounding farmland or meadows.

### `place=allotments`

- **Element types**: node / area
- **Description**: A separate settlement located outside an officially inhabited locality with its own addressing. Encompasses dachas, cottage settlements, and gardening communities, particularly in former Soviet Union regions, used as seasonal or year-round secondary homes.

---

### Other

### `place=continent`

- **Element types**: node
- **Description**: One of the seven continents: Africa, Antarctica, Asia, Europe, North America, Oceania, or South America. Classification is subjective as competing methods exist for dividing landmasses.

### `place=archipelago`

- **Element types**: relation
- **Description**: A named group or chain of closely related islands and islets. Mapped almost exclusively as multipolygon or cluster/group relations.

### `place=island`

- **Element types**: node / area
- **Description**: Any piece of land that is completely surrounded by water and isolated from other significant landmasses (bigger than 1 km²). Commonly paired with `natural=coastline`.

### `place=islet`

- **Element types**: node / area
- **Description**: A very small island, smaller than 1 km² at Mean High Water Spring tide, generally too small to support continuous habitation without external resources.

### `place=square`

- **Element types**: node / area
- **Description**: A typically paved open space, generally of architectural significance, surrounded by buildings in a built-up area such as a city, town, or village. Used for public gathering spaces suitable for markets, concerts, and rallies.

### `place=locality`

- **Element types**: node / area / relation
- **Description**: A named place that has no permanent population. Used for geographical references such as historical settlements, traditional countryside names, or geographical divisions that retain cultural or practical significance.

### `place=polder`

- **Element types**: node / area
- **Description**: A land area that forms an artificial hydrological entity enclosed by embankments, usually below sea level. Predominantly found in the Netherlands and China's Yangtze River Basin; requires drainage systems and pumping stations.
- **Status**: in use

### `place=sea`

- **Element types**: node / area
- **Description**: A large body of salt water that is part of, or connected to, an ocean. Includes seas, gulfs (e.g., Gulf of Mexico), large bays (e.g., Bay of Biscay), and marginal seas (e.g., Black Sea). Historically mapped as nodes; some have been converted to multipolygon relations.

### `place=ocean`

- **Element types**: node
- **Description**: One of the world's five major oceanic divisions: Arctic, Atlantic, Indian, Pacific, or Southern Ocean. Dividing Earth's water into oceans is considered highly subjective. Language-specific name tags are recommended; the generic `name=*` tag should be left empty as oceans belong to no single nation.

### `place=bay`

- **Element types**: node / area
- **Description**: A named bay: a body of water partially enclosed by land with an opening to a larger water body. Distinct from `natural=bay`, which tags the physical landform; `place=bay` names the body of water itself.

### `place=peninsula`

- **Element types**: node / area
- **Description**: A named peninsula: a piece of land projecting into water from a larger land mass, nearly surrounded by water. Note: the physical landform is now preferably tagged with `natural=peninsula`; `place=peninsula` is used for the named place.

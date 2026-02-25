# Key: `building` — Building

> Source: https://wiki.openstreetmap.org/wiki/Key:building

## Description

The `building=*` key is used to mark the footprint of a building or structure with a roof. It is applied to closed ways (areas) or multipolygon relations representing the outer perimeter of a building at ground level. The value identifies the primary use or type of the building. Use `building:levels=*` for storeys and `roof:shape=*` for roof geometry.

## Values

### Accommodation

#### `building=apartments`

- **Element types**: area
- **Description**: A building arranged into individual dwellings, often on separate floors. Typically multi-storey residential with multiple independent units.
- **Common sub-tags**: `building:levels=*`, `addr:*=*`
- **Status**: approved

#### `building=barracks`

- **Element types**: area
- **Description**: Buildings built to house military personnel or laborers, typically in a regimented compound.
- **Common sub-tags**: `military=barracks`
- **Status**: approved

#### `building=bungalow`

- **Element types**: area
- **Description**: A single-storey detached small house (Dacha). Low-profile residential building with all rooms on one level.
- **Status**: approved

#### `building=cabin`

- **Element types**: area
- **Description**: A small, roughly built house usually with a wood exterior. Typically found in rural or wilderness settings.
- **Status**: approved

#### `building=detached`

- **Element types**: area
- **Description**: A free-standing residential building not sharing walls with any other building, usually housing a single family.
- **Status**: approved

#### `building=annexe`

- **Element types**: area
- **Description**: A small self-contained apartment or residential building on the same property as a main dwelling.
- **Status**: in use

#### `building=dormitory`

- **Element types**: area
- **Description**: A shared building intended for college or university students, providing communal sleeping, bathroom, and common areas.
- **Status**: approved

#### `building=farm`

- **Element types**: area
- **Description**: The residential building on a farm (farmhouse). Use `building=farm_auxiliary` for non-residential agricultural buildings on the same property.
- **Status**: approved

#### `building=ger`

- **Element types**: area
- **Description**: A permanent or seasonal round yurt or ger, a traditional portable round dwelling of nomadic peoples in Central Asia.
- **Status**: approved

#### `building=hotel`

- **Element types**: area
- **Description**: A building with separate rooms available for short-term overnight accommodation, typically with reception and services.
- **Common sub-tags**: `tourism=hotel`, `stars=*`
- **Status**: approved

#### `building=house`

- **Element types**: area
- **Description**: A dwelling unit inhabited by a single household. Use for houses that do not clearly fit a more specific type.
- **Status**: approved

#### `building=houseboat`

- **Element types**: area
- **Description**: A boat used primarily as a home, permanently or semi-permanently moored in one location.
- **Status**: approved

#### `building=residential`

- **Element types**: area
- **Description**: A general tag for a building used primarily for residential purposes where a more specific type is not known.
- **Status**: approved

#### `building=semidetached_house`

- **Element types**: area
- **Description**: A residential house sharing a common wall with exactly one other house on one side. A pair of mirror-image houses built as a unit.
- **Status**: approved

#### `building=static_caravan`

- **Element types**: area
- **Description**: A mobile home or caravan that is semi-permanently or permanently left on a single site and used as a residence.
- **Status**: approved

#### `building=stilt_house`

- **Element types**: area
- **Description**: A building raised on piles (stilts) over soil or a body of water, allowing air circulation underneath and protection from flooding.
- **Status**: approved

#### `building=terrace`

- **Element types**: area
- **Description**: A linear row of residential dwellings that share side walls with neighbours and form a continuous terrace or row house block.
- **Status**: approved

#### `building=tree_house`

- **Element types**: area
- **Description**: Accommodation built on tree posts or constructed around a natural living tree.
- **Status**: in use

#### `building=trullo`

- **Element types**: area
- **Description**: A traditional Apulian dry stone hut with a conical roof, found primarily in the Itria Valley of southern Italy.
- **Status**: approved

---

### Commercial

#### `building=commercial`

- **Element types**: area
- **Description**: A building used for non-specific commercial activities. Use a more specific value if the use is known.
- **Status**: approved

#### `building=industrial`

- **Element types**: area
- **Description**: A building used for industrial purposes such as manufacturing or processing. Use `building=warehouse` if the primary use is storage.
- **Common sub-tags**: `industrial=*`
- **Status**: approved

#### `building=kiosk`

- **Element types**: area
- **Description**: A small, typically one-room retail building, often a standalone structure selling newspapers, food, or tickets.
- **Status**: approved

#### `building=office`

- **Element types**: area
- **Description**: A building used primarily as office space. Use `office=*` to specify the type of business.
- **Common sub-tags**: `office=*`
- **Status**: approved

#### `building=retail`

- **Element types**: area
- **Description**: A building primarily used for selling goods to the public. Use `shop=*` on the building or an interior node for more detail.
- **Common sub-tags**: `shop=*`
- **Status**: approved

#### `building=supermarket`

- **Element types**: area
- **Description**: A building constructed to house a self-service large-area store selling food and household goods.
- **Common sub-tags**: `shop=supermarket`, `name=*`
- **Status**: approved

#### `building=warehouse`

- **Element types**: area
- **Description**: A building primarily intended for storage or distribution of goods, often large-span with loading bays.
- **Common sub-tags**: `industrial=warehouse`
- **Status**: approved

---

### Religious

#### `building=religious`

- **Element types**: area
- **Description**: An unspecific building related to religion. Use a more specific value where possible.
- **Status**: approved

#### `building=cathedral`

- **Element types**: area
- **Description**: A building built as a cathedral (principal church of a diocese containing the bishop's throne). Pair with `amenity=place_of_worship`.
- **Common sub-tags**: `amenity=place_of_worship`, `religion=*`, `denomination=*`
- **Status**: approved

#### `building=chapel`

- **Element types**: area
- **Description**: A building built as a chapel; a smaller place of worship subordinate to a main church or attached to an institution.
- **Common sub-tags**: `amenity=place_of_worship`, `religion=*`
- **Status**: approved

#### `building=church`

- **Element types**: area
- **Description**: A building built as a Christian church for public worship.
- **Common sub-tags**: `amenity=place_of_worship`, `religion=christian`, `denomination=*`
- **Status**: approved

#### `building=kingdom_hall`

- **Element types**: area
- **Description**: A building built as a Kingdom Hall, a place of worship used by Jehovah's Witnesses.
- **Common sub-tags**: `amenity=place_of_worship`, `religion=christian`, `denomination=jehovah_witness`
- **Status**: approved

#### `building=monastery`

- **Element types**: area
- **Description**: A building or complex of buildings constructed as a monastery or convent for a religious community.
- **Common sub-tags**: `amenity=monastery`, `religion=*`
- **Status**: approved

#### `building=mosque`

- **Element types**: area
- **Description**: A building erected as a mosque for Islamic worship.
- **Common sub-tags**: `amenity=place_of_worship`, `religion=muslim`
- **Status**: approved

#### `building=presbytery`

- **Element types**: area
- **Description**: A building where Catholic priests live and work, attached to or near a church.
- **Status**: approved

#### `building=shrine`

- **Element types**: area
- **Description**: A building built as a shrine; a sacred or holy place dedicated to a specific deity, ancestor, or saint.
- **Common sub-tags**: `amenity=place_of_worship`, `religion=*`
- **Status**: approved

#### `building=synagogue`

- **Element types**: area
- **Description**: A building built as a synagogue for Jewish worship and assembly.
- **Common sub-tags**: `amenity=place_of_worship`, `religion=jewish`
- **Status**: approved

#### `building=temple`

- **Element types**: area
- **Description**: A building built as a temple for non-Christian/non-Jewish/non-Islamic religious worship.
- **Common sub-tags**: `amenity=place_of_worship`, `religion=*`
- **Status**: approved

---

### Civic / Amenity

#### `building=bakehouse`

- **Element types**: area
- **Description**: A building built for communal baking of bread. A historic or rural building used by a community rather than a commercial bakery.
- **Status**: approved

#### `building=bridge`

- **Element types**: area
- **Description**: A building used as a bridge or skyway (habitable structure spanning a road or water). Do not use this tag merely for mapping ordinary bridges.
- **Status**: approved

#### `building=civic`

- **Element types**: area
- **Description**: A generic tag for a building housing a civic amenity such as a town hall, community centre, or civic offices.
- **Common sub-tags**: `amenity=*`
- **Status**: approved

#### `building=clock_tower`

- **Element types**: area
- **Description**: A very tall tower housing a turret clock with clock faces visible from a distance, often a civic landmark.
- **Status**: in use

#### `building=college`

- **Element types**: area
- **Description**: A college building. Use `amenity=college` for the grounds or institution as a whole.
- **Common sub-tags**: `amenity=college`, `name=*`
- **Status**: approved

#### `building=fire_station`

- **Element types**: area
- **Description**: A building constructed as a fire station housing fire engines and crew.
- **Common sub-tags**: `amenity=fire_station`
- **Status**: approved

#### `building=government`

- **Element types**: area
- **Description**: A building used by government: municipal offices, parliament buildings, court houses, and similar official structures.
- **Common sub-tags**: `government=*`
- **Status**: approved

#### `building=gatehouse`

- **Element types**: area
- **Description**: An entry control point building spanning a highway entrance to an estate, castle, or compound.
- **Status**: approved

#### `building=hospital`

- **Element types**: area
- **Description**: A building erected for use as a hospital. Use `amenity=hospital` for the hospital grounds as a whole.
- **Common sub-tags**: `amenity=hospital`, `name=*`
- **Status**: approved

#### `building=kindergarten`

- **Element types**: area
- **Description**: A generic building used as a kindergarten or nursery school for young children.
- **Common sub-tags**: `amenity=kindergarten`
- **Status**: approved

#### `building=museum`

- **Element types**: area
- **Description**: A building designed and built as a museum for the display and preservation of objects of cultural or scientific importance.
- **Common sub-tags**: `tourism=museum`, `name=*`
- **Status**: approved

#### `building=public`

- **Element types**: area
- **Description**: A building accessible to the general public for civic purposes: town hall, police station, library, post office, etc.
- **Common sub-tags**: `amenity=*`
- **Status**: approved

#### `building=school`

- **Element types**: area
- **Description**: A building erected as a school. Use `amenity=school` for the school grounds as a whole.
- **Common sub-tags**: `amenity=school`, `name=*`
- **Status**: approved

#### `building=toilets`

- **Element types**: area
- **Description**: A standalone toilet block providing public or semi-public bathroom facilities.
- **Common sub-tags**: `amenity=toilets`, `access=*`
- **Status**: approved

#### `building=train_station`

- **Element types**: area
- **Description**: A building constructed as a train station, containing waiting areas, ticketing, and platform access.
- **Common sub-tags**: `railway=station`, `name=*`
- **Status**: approved

#### `building=transportation`

- **Element types**: area
- **Description**: A building related to public transport infrastructure: bus stations, ferry terminals, transport interchanges.
- **Common sub-tags**: `amenity=bus_station`
- **Status**: approved

#### `building=university`

- **Element types**: area
- **Description**: A university building. Use `amenity=university` for the university campus or institution.
- **Common sub-tags**: `amenity=university`, `name=*`
- **Status**: approved

#### `building=stadium`

- **Element types**: area
- **Description**: A building constructed as a sports stadium with spectator seating surrounding a playing field.
- **Common sub-tags**: `leisure=stadium`, `sport=*`
- **Status**: approved

---

### Agricultural / Plant Production

#### `building=barn`

- **Element types**: area
- **Description**: An agricultural building used for storage of crops, equipment, or animals, and as a covered workplace.
- **Status**: approved

#### `building=conservatory`

- **Element types**: area
- **Description**: A building with a glass or transparent tarpaulin roof and walls used as an indoor garden or sun room.
- **Status**: approved

#### `building=cowshed`

- **Element types**: area
- **Description**: A building for housing cows, usually found on dairy farms.
- **Status**: approved

#### `building=farm_auxiliary`

- **Element types**: area
- **Description**: Any building on a farm that is not a dwelling, such as equipment sheds, barns, and storage buildings.
- **Status**: approved

#### `building=greenhouse`

- **Element types**: area
- **Description**: A glass or plastic-covered building used for growing plants in a controlled environment.
- **Status**: approved

#### `building=livestock`

- **Element types**: area
- **Description**: A building for housing livestock other than cattle or pigs where no more specific type applies.
- **Status**: approved

#### `building=slurry_tank`

- **Element types**: area
- **Description**: A circular building or tank holding a liquid mixture of animal excreta (slurry) for agricultural use.
- **Status**: in use

#### `building=stable`

- **Element types**: area
- **Description**: A building constructed as a stable for keeping horses.
- **Status**: approved

#### `building=sty`

- **Element types**: area
- **Description**: A building for raising domestic pigs, usually found on farms (also known as a pigsty).
- **Status**: approved

---

### Sports

#### `building=grandstand`

- **Element types**: area
- **Description**: The main roofed stand commanding the best view at a sports ground, providing covered spectator seating.
- **Status**: approved

#### `building=pavilion`

- **Element types**: area
- **Description**: A sports pavilion with changing rooms, storage areas, and sometimes spectator facilities at a sports ground.
- **Status**: approved

#### `building=riding_hall`

- **Element types**: area
- **Description**: A building built as an indoor riding hall (manege) for equestrian activities.
- **Status**: approved

#### `building=sports_hall`

- **Element types**: area
- **Description**: A building built as an indoor sports hall for team sports, gymnastics, or other indoor athletics.
- **Status**: approved

#### `building=sports_centre`

- **Element types**: area
- **Description**: A building built as a sports centre combining multiple sports facilities under one roof.
- **Status**: approved

---

### Storage

#### `building=allotment_house`

- **Element types**: area
- **Description**: A small outbuilding in an allotment garden used for short visits to store tools and gardening equipment.
- **Status**: approved

#### `building=boathouse`

- **Element types**: area
- **Description**: A building used for storage of boats, typically at a waterside location.
- **Status**: approved

#### `building=hangar`

- **Element types**: area
- **Description**: A large building for storage of airplanes or helicopters, typically at an airport or airfield.
- **Common sub-tags**: `aeroway=hangar`
- **Status**: approved

#### `building=hut`

- **Element types**: area
- **Description**: A small and crude shelter. Used as a synonym of shed or for low-quality residences. Also used for mountain huts.
- **Status**: approved

#### `building=shed`

- **Element types**: area
- **Description**: A simple, typically single-storey structure used for storage, a workshop, or shelter.
- **Status**: approved

---

### Cars / Vehicles

#### `building=carport`

- **Element types**: area
- **Description**: A covered structure offering limited weather protection to vehicles, open on at least one or more sides.
- **Status**: approved

#### `building=garage`

- **Element types**: area
- **Description**: A building suitable for the storage of one or more motor vehicles, attached to or detached from a house.
- **Status**: approved

#### `building=garages`

- **Element types**: area
- **Description**: A building containing discrete lockable storage spaces for different owners, typically a row of individual garage units.
- **Status**: approved

#### `building=parking`

- **Element types**: area
- **Description**: A structure purpose-built for parking cars, such as a multi-storey car park or parking garage.
- **Common sub-tags**: `amenity=parking`
- **Status**: approved

---

### Power / Technical

#### `building=digester`

- **Element types**: area
- **Description**: A bioreactor building used for the production of biogas from biomass through anaerobic digestion.
- **Status**: approved

#### `building=service`

- **Element types**: area
- **Description**: A small unmanned building containing machinery such as pumps, transformers, or telecommunications equipment.
- **Status**: approved

#### `building=tech_cab`

- **Element types**: area
- **Description**: A small prefabricated cabin providing air-conditioned housing for sensitive technology equipment.
- **Status**: in use

#### `building=transformer_tower`

- **Element types**: area
- **Description**: A tall building comprising a distribution transformer, typically in areas without underground cabling.
- **Status**: approved

#### `building=water_tower`

- **Element types**: area
- **Description**: A water tower structure providing water pressure to a distribution system through elevation.
- **Common sub-tags**: `man_made=water_tower`
- **Status**: approved

#### `building=storage_tank`

- **Element types**: area
- **Description**: A large container or tank building holding liquids such as water, oil, or chemicals.
- **Status**: approved

#### `building=silo`

- **Element types**: area
- **Description**: A building for storing bulk materials such as grain, cement, or wood chips.
- **Status**: approved

---

### Other / Special

#### `building=beach_hut`

- **Element types**: area
- **Description**: A small wooden cabin on bathing beaches, used for changing and storing beach equipment.
- **Status**: approved

#### `building=bunker`

- **Element types**: area
- **Description**: A hardened military building designed to protect personnel or equipment from attack. Pair with `military=bunker`.
- **Common sub-tags**: `military=bunker`
- **Status**: approved

#### `building=castle`

- **Element types**: area
- **Description**: A building constructed as a castle. Pair with `historic=castle` for heritage sites.
- **Common sub-tags**: `historic=castle`
- **Status**: approved

#### `building=construction`

- **Element types**: area
- **Description**: A building currently under construction. Use `construction=*` to indicate the intended building type when complete.
- **Common sub-tags**: `construction=*`
- **Status**: approved

#### `building=container`

- **Element types**: area
- **Description**: A shipping container used as a permanent building (not a temporary structure). Often converted for office, retail, or residential use.
- **Status**: approved

#### `building=guardhouse`

- **Element types**: area
- **Description**: A small guard post building where security personnel are stationed to monitor access to a site.
- **Status**: approved

#### `building=military`

- **Element types**: area
- **Description**: A military building not otherwise classified. Pair with `military=*` for more detail.
- **Common sub-tags**: `military=*`
- **Status**: approved

#### `building=outbuilding`

- **Element types**: area
- **Description**: A less important secondary building near a larger main building, such as a workshop or storage annex.
- **Status**: approved

#### `building=pagoda`

- **Element types**: area
- **Description**: A building constructed as a pagoda; a tiered tower with multiple eaves found in Asia, often of religious significance.
- **Status**: approved

#### `building=quonset_hut`

- **Element types**: area
- **Description**: A lightweight prefabricated semicircular structure made of corrugated steel, originally developed for military use.
- **Status**: in use

#### `building=roof`

- **Element types**: area
- **Description**: A structure consisting of a roof with open or partially open sides, such as a rain shelter, petrol station canopy, or covered walkway.
- **Status**: approved

#### `building=ruins`

- **Element types**: area
- **Description**: An abandoned building in poor repair, partially collapsed or derelict.
- **Common sub-tags**: `ruins=*`, `historic=ruins`
- **Status**: approved

#### `building=ship`

- **Element types**: area
- **Description**: A decommissioned ship or submarine that stays permanently in one place and is used as a building (e.g. a museum ship or restaurant).
- **Status**: in use

#### `building=tent`

- **Element types**: area
- **Description**: A permanently placed tent structure (not a temporary camping tent), such as a circus tent or permanent glamping structure.
- **Status**: in use

#### `building=tower`

- **Element types**: area
- **Description**: A tower-form building. Pair with `tower:type=*` to specify the purpose (observation, telecommunications, etc.).
- **Common sub-tags**: `tower:type=*`
- **Status**: approved

#### `building=triumphal_arch`

- **Element types**: area
- **Description**: A free-standing monumental archway structure erected to commemorate a significant person or event.
- **Status**: approved

#### `building=windmill`

- **Element types**: area
- **Description**: A building constructed as a traditional windmill. Use `man_made=windmill` for non-building windmill structures.
- **Common sub-tags**: `man_made=windmill`
- **Status**: approved

#### `building=yes`

- **Element types**: area
- **Description**: A building of unspecified type, used when the specific use cannot be determined. Should be refined with a specific value when possible.
- **Status**: approved

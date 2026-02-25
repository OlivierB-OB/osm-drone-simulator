# OSM Map Features Reference

> Source: https://wiki.openstreetmap.org/wiki/Map_features
> Generated: 2026-02-25

This reference documents all OpenStreetMap map feature tags organized by category.

## Categories

| Category | Key | Description | File |
|----------|-----|-------------|------|
| Aerialway | `aerialway` | Different forms of transportation for people or goods using aerial wires, including cable-cars, chair-lifts, and drag-lifts. | [aerialway.md](aerialway.md) |
| Aeroway | `aeroway` | Features related to aerodromes, airfields, and ground facilities supporting airplane and helicopter operations. | [aeroway.md](aeroway.md) |
| Amenity | `amenity` | Facilities for visitors and residents including toilets, banks, pharmacies, cafes, parking, and schools. | [amenity.md](amenity.md) |
| Barrier | `barrier` | Linear barriers and access control features on highways, including fences, walls, gates, and bollards. | [barrier.md](barrier.md) |
| Boundary | `boundary` | Administrative and political divisions including national borders, municipalities, and protected areas. | [boundary.md](boundary.md) |
| Building | `building` | Structures categorized by function: accommodation, commercial, religious, civic, agricultural, sports, storage, and technical. | [building.md](building.md) |
| Craft | `craft` | Artisan and craft-related businesses such as bakeries, blacksmiths, breweries, and workshops. | [craft.md](craft.md) |
| Emergency | `emergency` | Emergency services and facilities including medical rescue, firefighters, lifeguards, and assembly points. | [emergency.md](emergency.md) |
| Geological | `geological` | Geological features and formations such as outcrops, volcanoes, and glacial features. | [geological.md](geological.md) |
| Healthcare | `healthcare` | Medical facilities and healthcare services including hospitals, clinics, pharmacies, and laboratories. | [healthcare.md](healthcare.md) |
| Highway | `highway` | Road classification and path types for vehicles and pedestrians, including roads, paths, and cycleways. | [highway.md](highway.md) |
| Historic | `historic` | Historical sites, monuments, ruins, and heritage features such as castles, churches, and battlefields. | [historic.md](historic.md) |
| Landuse | `landuse` | Land classification including developed, rural/agricultural, traffic/transportation, and waterbody areas. | [landuse.md](landuse.md) |
| Leisure | `leisure` | Recreation and leisure facilities including parks, sports pitches, playgrounds, and swimming pools. | [leisure.md](leisure.md) |
| Man Made | `man_made` | Human-constructed features and structures not covered by other keys, such as towers, bridges, and pipelines. | [man_made.md](man_made.md) |
| Military | `military` | Military installations and related areas including bases, ranges, and bunkers. | [military.md](military.md) |
| Natural | `natural` | Natural features including vegetation, water bodies, and geological formations. | [natural.md](natural.md) |
| Office | `office` | Office and business establishments such as government offices, law firms, and NGOs. | [office.md](office.md) |
| Place | `place` | Named geographic locations and settlements including countries, cities, towns, and villages. | [place.md](place.md) |
| Power | `power` | Electrical power infrastructure including power lines, substations, generators, and transformers. | [power.md](power.md) |
| Public Transport | `public_transport` | Public transportation infrastructure including stops, stations, platforms, and route relations. | [public_transport.md](public_transport.md) |
| Railway | `railway` | Rail infrastructure including tracks, stations, trams, subways, and level crossings. | [railway.md](railway.md) |
| Route | `route` | Designated routes for navigation and travel including hiking, cycling, bus, and ferry routes. | [route.md](route.md) |
| Shop | `shop` | Commercial retail establishments including food, clothing, electronics, and specialty stores. | [shop.md](shop.md) |
| Telecom | `telecom` | Telecommunications infrastructure including exchanges, cabinets, and data centers. | [telecom.md](telecom.md) |
| Tourism | `tourism` | Tourist attractions and hospitality facilities including hotels, viewpoints, museums, and campsites. | [tourism.md](tourism.md) |
| Water | `water` | Water body features including rivers, lakes, reservoirs, and ponds. | [water.md](water.md) |
| Waterway | `waterway` | Natural and constructed waterways including rivers, canals, streams, and dams. | [waterway.md](waterway.md) |

## Quick Tag Reference

### Aerialway
- `aerialway=cable_car` — Enclosed cabin suspended from a fixed-grip cable
- `aerialway=gondola` — Enclosed cabin on a circulating cable
- `aerialway=mixed_lift` — Combination of gondola and chair-lift on the same line
- `aerialway=chair_lift` — Open or enclosed chairs suspended from a cable
- `aerialway=drag_lift` — Generic drag lift (surface lift)
- `aerialway=t-bar` — T-shaped bar tow lift for two skiers
- `aerialway=j-bar` — J-shaped bar tow lift for a single skier
- `aerialway=platter` — Platter/disk tow system attached between the legs
- `aerialway=magic_carpet` — Moving conveyor belt/carpet lift for beginners
- `aerialway=rope_tow` — Simple rope tow system
- `aerialway=zip_line` — Cable-based descent system for recreation
- `aerialway=goods` — Freight/cargo aerial transport only
- `aerialway=pylon` — Support pylon/tower for an aerial cable
- `aerialway=station` — Terminal or boarding station for an aerial lift

### Aeroway
- `aeroway=aerodrome` — Airport or airfield (the main area)
- `aeroway=airstrip` — Simple field where light aircraft can land and take off
- `aeroway=apron` — Area where planes are parked, loaded, refuelled, or boarded
- `aeroway=control_center` — Facility controlling aircraft in airspace en route
- `aeroway=fuel` — Fuelling station for aircraft
- `aeroway=gate` — Passenger gate at an airport terminal
- `aeroway=hangar` — Structure to hold aircraft or spacecraft
- `aeroway=helipad` — Landing area or platform for helicopters
- `aeroway=heliport` — Main area dedicated to helicopter operations
- `aeroway=highway_strip` — Landing strip that doubles as a road
- `aeroway=holding_position` — Point where aircraft hold clear of crossing ways
- `aeroway=jet_bridge` — Passenger boarding bridge connecting terminal to aircraft
- `aeroway=model_runway` — Runway for model aircraft
- `aeroway=navigationaid` — Aid supporting visual navigation for aircraft
- `aeroway=parking_position` — Location where an aircraft parks
- `aeroway=runway` — Prepared surface for aircraft landing and takeoff
- `aeroway=spaceport` — Site for launching or receiving spacecraft
- `aeroway=stopway` — Surface beyond runway end used during aborted takeoff
- `aeroway=taxilane` — Path in airport parking area or apron
- `aeroway=taxiway` — Path connecting runways with ramps, hangars, and terminals
- `aeroway=terminal` — Building where passengers transfer between ground and air transport
- `aeroway=tower` — Air traffic control tower
- `aeroway=windsock` — Device indicating wind direction and relative speed

### Amenity — Sustenance
- `amenity=bar` — Commercial establishment selling alcoholic drinks for on-premises consumption
- `amenity=biergarten` — Open-air area serving beverages and food
- `amenity=cafe` — Informal place offering casual meals, typically focused on coffee or tea
- `amenity=fast_food` — Quick-service restaurant
- `amenity=food_court` — Multiple food counters with a shared eating area
- `amenity=ice_cream` — Shop selling ice cream and frozen desserts
- `amenity=pub` — Establishment selling beer and alcoholic drinks, often with food
- `amenity=restaurant` — Full-service dining establishment

### Amenity — Education
- `amenity=college` — Further education campus
- `amenity=dancing_school` — Dance studio or instruction facility
- `amenity=driving_school` — Motor vehicle driving instruction
- `amenity=first_aid_school` — First aid training courses
- `amenity=kindergarten` — Pre-school education facility
- `amenity=language_school` — Foreign language instruction
- `amenity=library` — Public lending library
- `amenity=music_school` — Music education institution
- `amenity=research_institute` — Research facility
- `amenity=school` — Primary through secondary education
- `amenity=surf_school` — Surfing instruction
- `amenity=toy_library` — Toy and game lending facility
- `amenity=traffic_park` — Juvenile traffic instruction area
- `amenity=training` — Public training facility
- `amenity=university` — Higher education institution

### Amenity — Transportation
- `amenity=bicycle_parking` — Bike storage facility
- `amenity=bicycle_rental` — Bicycle rental service
- `amenity=bicycle_repair_station` — Self-service bike repair tools
- `amenity=bicycle_wash` — Bicycle cleaning facility
- `amenity=boat_rental` — Boat rental service
- `amenity=boat_sharing` — Shared boat access
- `amenity=boat_storage` — Boat storage facility
- `amenity=bus_station` — Public transit hub for buses
- `amenity=car_rental` — Vehicle rental service
- `amenity=car_sharing` — Shared vehicle access
- `amenity=car_wash` — Vehicle cleaning service
- `amenity=charging_station` — Electric vehicle charging point
- `amenity=compressed_air` — Tire inflation device
- `amenity=driver_training` — Closed-course driving instruction
- `amenity=ferry_terminal` — Ferry boarding location
- `amenity=fuel` — Petrol/gas station
- `amenity=grit_bin` — Salt/grit storage container for icy conditions
- `amenity=motorcycle_parking` — Motorcycle storage area
- `amenity=parking` — Vehicle parking area
- `amenity=parking_entrance` — Entrance to underground or multi-level parking
- `amenity=parking_space` — Individual parking spot
- `amenity=taxi` — Taxi waiting station
- `amenity=vehicle_inspection` — Government vehicle inspection station
- `amenity=weighbridge` — Vehicle or goods weighing facility

### Amenity — Financial
- `amenity=atm` — Automated teller machine
- `amenity=bank` — Financial institution for deposits and withdrawals
- `amenity=bureau_de_change` — Currency exchange service
- `amenity=money_transfer` — Cash transfer service
- `amenity=payment_centre` — Non-bank bill payment facility
- `amenity=payment_terminal` — Self-service payment kiosk

### Amenity — Healthcare
- `amenity=baby_hatch` — Safe baby drop-off location
- `amenity=clinic` — Medium-sized medical facility
- `amenity=dentist` — Dental practice
- `amenity=doctors` — Medical practice
- `amenity=hospital` — In-patient medical facility
- `amenity=nursing_home` — Care facility for disabled or elderly residents
- `amenity=pharmacy` — Medication retail location
- `amenity=social_facility` — Social services provider
- `amenity=veterinary` — Animal medical practice

### Amenity — Entertainment, Arts & Culture
- `amenity=arts_centre` — Multi-arts performance venue
- `amenity=brothel` — Prostitution establishment
- `amenity=casino` — Gambling venue with table games
- `amenity=cinema` — Film screening theater
- `amenity=community_centre` — Local events and group activities space
- `amenity=conference_centre` — Convention and conference facility
- `amenity=events_venue` — General event hosting building
- `amenity=exhibition_centre` — Exhibition and trade show space
- `amenity=fountain` — Decorative water feature
- `amenity=gambling` — Non-casino gambling facility
- `amenity=love_hotel` — Short-stay intimate accommodation
- `amenity=music_venue` — Live contemporary music venue
- `amenity=nightclub` — Drinking and dancing establishment
- `amenity=planetarium` — Astronomy and space science facility
- `amenity=public_bookcase` — Street-level book sharing unit
- `amenity=social_centre` — Non-profit community activity space
- `amenity=stage` — Performance platform or stage
- `amenity=stripclub` — Striptease or lap dancing venue
- `amenity=studio` — Recording or broadcast facility
- `amenity=swingerclub` — Group sexual activity venue
- `amenity=theatre` — Live performance venue

### Amenity — Public Service
- `amenity=courthouse` — Legal justice facility
- `amenity=fire_station` — Fire brigade base
- `amenity=police` — Police station
- `amenity=post_box` — Mail reception container
- `amenity=post_depot` — Postal sorting and distribution facility
- `amenity=post_office` — Postal service building
- `amenity=prison` — Incarceration facility
- `amenity=ranger_station` — National park visitor and ranger facility
- `amenity=townhall` — Municipal administration and public meeting place

### Amenity — Facilities
- `amenity=bbq` — Permanent public barbecue grill
- `amenity=bench` — Public seating
- `amenity=check_in` — Passenger check-in and boarding pass counter
- `amenity=dog_toilet` — Designated pet relief area
- `amenity=dressing_room` — Clothing change area
- `amenity=drinking_water` — Potable water access point
- `amenity=give_box` — Free item sharing facility
- `amenity=lounge` — Comfortable waiting area
- `amenity=mailroom` — Package and letter reception area
- `amenity=parcel_locker` — Automated parcel pickup locker
- `amenity=shelter` — Weather protection structure
- `amenity=shower` — Public bathing facility
- `amenity=telephone` — Public phone access
- `amenity=toilets` — Public restroom facilities
- `amenity=water_point` — Large-volume drinking water supply
- `amenity=watering_place` — Animal drinking water trough or point

### Amenity — Waste Management
- `amenity=recycling` — Recycling collection facility
- `amenity=sanitary_dump_station` — RV/caravan waste disposal
- `amenity=waste_basket` — Small public garbage container
- `amenity=waste_disposal` — Medium or large waste bin
- `amenity=waste_transfer_station` — Bulk waste consolidation facility

### Amenity — Others
- `amenity=animal_boarding` — Pet care and boarding facility
- `amenity=animal_breeding` — Animal breeding operation
- `amenity=animal_shelter` — Animal rescue and adoption facility
- `amenity=animal_training` — Animal instruction and training facility
- `amenity=baking_oven` — Communal bread baking oven
- `amenity=clock` — Public visible timepiece
- `amenity=crematorium` — Human cremation facility
- `amenity=dive_centre` — Scuba diving base location
- `amenity=funeral_hall` — Funeral service facility

### Barrier
- `barrier=fence` — Linear barrier made of various materials
- `barrier=wall` — Solid barrier of stone, brick, or concrete
- `barrier=hedge` — Line of closely spaced shrubs
- `barrier=gate` — Openable section in a fence or wall
- `barrier=bollard` — Short post to control vehicle access
- `barrier=kerb` — Edge between road and pavement
- `barrier=lift_gate` — Horizontal bar barrier across a road
- `barrier=cycle_barrier` — Barrier to slow or stop cyclists
- `barrier=block` — Immovable block to prevent vehicle entry
- `barrier=chain` — Chain across a path or road

### Boundary
- `boundary=administrative` — Administrative division boundary
- `boundary=national_park` — National park boundary
- `boundary=protected_area` — Legally protected area boundary
- `boundary=postal_code` — Postal code area boundary
- `boundary=political` — Political boundary

### Building
- `building=yes` — Generic building
- `building=house` — Detached residential building
- `building=apartments` — Multi-unit residential building
- `building=commercial` — Commercial use building
- `building=retail` — Retail use building
- `building=industrial` — Industrial use building
- `building=warehouse` — Storage warehouse
- `building=school` — School building
- `building=church` — Christian church
- `building=mosque` — Islamic mosque
- `building=hospital` — Hospital building
- `building=hotel` — Hotel building
- `building=garage` — Private vehicle garage

### Craft
- `craft=bakery` — Bread and pastry production
- `craft=blacksmith` — Metal working by forge
- `craft=brewery` — Beer production facility
- `craft=carpenter` — Wood working and furniture
- `craft=electrician` — Electrical services
- `craft=plumber` — Plumbing services
- `craft=tailor` — Garment making and alterations
- `craft=pottery` — Ceramic pottery production

### Emergency
- `emergency=ambulance_station` — Base for ambulance operations
- `emergency=fire_hydrant` — Water supply point for firefighters
- `emergency=phone` — Emergency telephone
- `emergency=defibrillator` — Automated external defibrillator
- `emergency=assembly_point` — Designated gathering point in emergencies

### Geological
- `geological=outcrop` — Exposed rock formation at surface
- `geological=volcanic_lava_field` — Area covered by lava flows
- `geological=moraine` — Glacial deposit landform

### Healthcare
- `healthcare=hospital` — Hospital facility
- `healthcare=clinic` — Outpatient medical clinic
- `healthcare=pharmacy` — Pharmacy
- `healthcare=dentist` — Dental practice
- `healthcare=laboratory` — Medical laboratory

### Highway
- `highway=motorway` — High-capacity motorway or freeway
- `highway=trunk` — Important road, not motorway standard
- `highway=primary` — Primary road linking major settlements
- `highway=secondary` — Secondary road linking towns
- `highway=tertiary` — Tertiary road linking villages
- `highway=residential` — Road in a residential area
- `highway=service` — Road for access to buildings or facilities
- `highway=footway` — Designated path for pedestrians
- `highway=cycleway` — Designated path for cyclists
- `highway=path` — Generic path for non-motorized travel
- `highway=track` — Agricultural or forestry track
- `highway=bus_stop` — Public transport bus stop
- `highway=crossing` — Pedestrian road crossing
- `highway=traffic_signals` — Traffic light signals

### Historic
- `historic=castle` — Castle or fortification
- `historic=ruins` — Remains of a former structure
- `historic=monument` — Memorial monument
- `historic=memorial` — Memorial to an event or person
- `historic=archaeological_site` — Site of archaeological significance
- `historic=church` — Historic church building
- `historic=battlefield` — Site of a historical battle
- `historic=manor` — Historic manor house

### Landuse
- `landuse=residential` — Residential area
- `landuse=commercial` — Commercial and business area
- `landuse=industrial` — Industrial area
- `landuse=retail` — Retail commercial area
- `landuse=farmland` — Agricultural cropland
- `landuse=forest` — Managed forest or woodland
- `landuse=grass` — Grassed area
- `landuse=meadow` — Meadow or field
- `landuse=cemetery` — Burial ground
- `landuse=construction` — Area under construction
- `landuse=quarry` — Mineral extraction site
- `landuse=recreation_ground` — Open space for informal recreation

### Leisure
- `leisure=park` — Public park or green space
- `leisure=garden` — Ornamental garden
- `leisure=playground` — Children's play area
- `leisure=pitch` — Sports playing field or court
- `leisure=sports_centre` — Indoor or outdoor sports facility
- `leisure=swimming_pool` — Swimming pool
- `leisure=track` — Dedicated sports track
- `leisure=golf_course` — Golf course
- `leisure=marina` — Boat mooring and services
- `leisure=nature_reserve` — Protected natural area
- `leisure=dog_park` — Enclosed area for dogs to run freely

### Man Made
- `man_made=tower` — Free-standing tower structure
- `man_made=water_tower` — Elevated water storage structure
- `man_made=chimney` — Industrial chimney or smokestack
- `man_made=pipeline` — Pipe for transporting liquids or gases
- `man_made=bridge` — Bridge structure
- `man_made=pier` — Structure extending into water
- `man_made=storage_tank` — Tank for storing liquids
- `man_made=windmill` — Wind-powered mill structure
- `man_made=lighthouse` — Tower with light to guide ships

### Military
- `military=airfield` — Military airfield or air base
- `military=base` — General military base or installation
- `military=barracks` — Building where soldiers live
- `military=bunker` — Hardened military shelter
- `military=range` — Area used for weapons training
- `military=naval_base` — Base for naval operations

### Natural
- `natural=wood` — Wooded area, trees
- `natural=tree` — Individual tree
- `natural=grassland` — Natural grassland area
- `natural=heath` — Area of heathland
- `natural=water` — Body of water
- `natural=wetland` — Wetland area
- `natural=beach` — Sandy or shingle beach
- `natural=cliff` — Vertical or near-vertical rock face
- `natural=peak` — Mountain or hill summit
- `natural=volcano` — Volcanic mountain
- `natural=glacier` — Glacier or ice field
- `natural=cave_entrance` — Cave entrance

### Office
- `office=government` — Government office
- `office=company` — Private company office
- `office=ngo` — Non-governmental organization
- `office=lawyer` — Legal services office
- `office=architect` — Architecture firm
- `office=financial` — Financial services office
- `office=telecommunication` — Telecommunications company office
- `office=educational_institution` — Educational administration office

### Place
- `place=country` — Sovereign nation
- `place=state` — State or province
- `place=region` — Administrative region
- `place=county` — County or district
- `place=city` — Large urban settlement
- `place=town` — Medium-sized settlement
- `place=village` — Small settlement
- `place=hamlet` — Very small settlement
- `place=suburb` — Suburb or neighbourhood
- `place=island` — Island
- `place=islet` — Small island

### Power
- `power=line` — High-voltage power transmission line
- `power=minor_line` — Low-voltage distribution power line
- `power=cable` — Underground or submarine power cable
- `power=tower` — Pylon supporting a high-voltage line
- `power=pole` — Pole supporting a power line
- `power=substation` — Electrical substation
- `power=generator` — Electricity generation facility
- `power=transformer` — Electrical transformer
- `power=plant` — Power station or plant

### Public Transport
- `public_transport=stop_position` — Exact position where a vehicle stops
- `public_transport=platform` — Waiting area for passengers
- `public_transport=station` — Major transit station
- `public_transport=stop_area` — Group of related stops and platforms

### Railway
- `railway=rail` — Standard gauge railway track
- `railway=narrow_gauge` — Narrow gauge railway track
- `railway=tram` — Tram or streetcar track
- `railway=subway` — Underground metro/subway track
- `railway=light_rail` — Light rail track
- `railway=station` — Railway station
- `railway=halt` — Small stopping point, fewer facilities than a station
- `railway=tram_stop` — Tram stop
- `railway=level_crossing` — Railway and road level crossing
- `railway=signal` — Railway signal

### Route
- `route=hiking` — Designated hiking trail
- `route=bicycle` — Designated cycling route
- `route=bus` — Bus route
- `route=ferry` — Ferry route
- `route=train` — Train route
- `route=tram` — Tram route
- `route=road` — Named road route
- `route=ski` — Ski piste or route

### Shop
- `shop=supermarket` — Large food retail store
- `shop=convenience` — Small general food store
- `shop=bakery` — Bread and pastry retail
- `shop=butcher` — Meat retail
- `shop=clothes` — Clothing store
- `shop=shoes` — Footwear store
- `shop=electronics` — Consumer electronics store
- `shop=hardware` — Hardware and tools store
- `shop=florist` — Flower and plant store
- `shop=pharmacy` — Pharmacy retail
- `shop=hairdresser` — Hair styling salon
- `shop=books` — Book store
- `shop=bicycle` — Bicycle sales and service
- `shop=car` — Automobile dealership
- `shop=furniture` — Furniture store

### Telecom
- `telecom=exchange` — Telephone exchange building
- `telecom=cabinet` — Street-side telecom distribution cabinet
- `telecom=data_center` — Data center facility
- `telecom=connection_point` — Telecom connection or junction point

### Tourism
- `tourism=hotel` — Hotel accommodation
- `tourism=hostel` — Budget shared accommodation
- `tourism=camp_site` — Camping area
- `tourism=caravan_site` — Caravan/RV park
- `tourism=viewpoint` — Designated viewpoint or scenic overlook
- `tourism=museum` — Museum
- `tourism=gallery` — Art gallery
- `tourism=attraction` — General tourist attraction
- `tourism=information` — Tourist information point
- `tourism=theme_park` — Amusement or theme park
- `tourism=zoo` — Zoological garden

### Water
- `water=lake` — Natural lake
- `water=reservoir` — Artificial water reservoir
- `water=pond` — Small body of still water
- `water=river` — River (as area)
- `water=canal` — Artificial canal (as area)
- `water=lagoon` — Coastal lagoon

### Waterway
- `waterway=river` — Large natural flowing watercourse
- `waterway=stream` — Small natural flowing watercourse
- `waterway=canal` — Artificial navigable waterway
- `waterway=drain` — Artificial drainage channel
- `waterway=ditch` — Small drainage ditch
- `waterway=dam` — Dam structure across a watercourse
- `waterway=weir` — Low dam or barrier in a river
- `waterway=waterfall` — Waterfall
- `waterway=lock_gate` — Gate in a canal lock
- `waterway=dock` — Enclosed area of water for ships

# Key: `amenity` — Amenity

> Source: https://wiki.openstreetmap.org/wiki/Key:amenity

## Description

The `amenity` key is used to map useful and important facilities for visitors and residents. It is one of the most widely used keys in OpenStreetMap and covers an extremely broad range of features including eating and drinking establishments, education facilities, transportation hubs, financial services, healthcare, entertainment venues, public services, and general facilities. Most amenity features are tagged as nodes placed at the centre of the feature or as closed ways (areas) representing the building or site footprint.

## Values

---

## Sustenance

### `amenity=bar`

- **Element types**: node, area
- **Description**: A commercial establishment selling alcoholic drinks for on-premises consumption. Bars primarily focus on drinks rather than food and typically have a bar counter. May also offer limited food.
- **Common sub-tags**: `name=*`, `opening_hours=*`, `outdoor_seating=*`, `cuisine=*`
- **Status**: approved

### `amenity=biergarten`

- **Element types**: node, area
- **Description**: An open-air area, usually attached to a pub or restaurant, serving beverages (especially beer) and food. Traditional German in origin. Customers typically sit at communal tables outdoors.
- **Common sub-tags**: `name=*`, `opening_hours=*`, `outdoor_seating=yes`
- **Status**: approved

### `amenity=cafe`

- **Element types**: node, area
- **Description**: An informal establishment offering casual meals and snacks, typically centred on coffee, tea, and light refreshments. Less formal than a restaurant, often with counter service.
- **Common sub-tags**: `name=*`, `opening_hours=*`, `cuisine=*`, `outdoor_seating=*`, `internet_access=*`
- **Status**: approved

### `amenity=fast_food`

- **Element types**: node, area
- **Description**: A quick-service restaurant where food is ordered at a counter and prepared rapidly. Includes drive-through facilities, burger chains, pizza delivery, and similar formats.
- **Common sub-tags**: `name=*`, `opening_hours=*`, `cuisine=*`, `drive_through=*`
- **Status**: approved

### `amenity=food_court`

- **Element types**: node, area
- **Description**: A shared eating area surrounded by multiple food counters, typically found in shopping malls and large buildings. Customers order from different vendors and share a common seating area.
- **Common sub-tags**: `name=*`, `opening_hours=*`
- **Status**: in use

### `amenity=ice_cream`

- **Element types**: node, area
- **Description**: A shop or stand primarily selling ice cream, gelato, sorbet, and frozen yogurt. May be a standalone parlour or a counter within another establishment.
- **Common sub-tags**: `name=*`, `opening_hours=*`
- **Status**: in use

### `amenity=pub`

- **Element types**: node, area
- **Description**: A public house — an establishment that sells beer, ale, and other alcoholic beverages for consumption on the premises. Often provides food and may have a social or community focus. Typically more food-oriented than a bar.
- **Common sub-tags**: `name=*`, `opening_hours=*`, `outdoor_seating=*`, `real_ale=*`
- **Status**: approved

### `amenity=restaurant`

- **Element types**: node, area
- **Description**: A full-service dining establishment where customers sit at tables and are served food from a menu. Covers all types of cuisine and price ranges, from casual to fine dining.
- **Common sub-tags**: `name=*`, `opening_hours=*`, `cuisine=*`, `outdoor_seating=*`, `capacity=*`
- **Status**: approved

---

## Education

### `amenity=college`

- **Element types**: node, area
- **Description**: A further education campus or set of buildings providing post-secondary education below university level. Includes community colleges, vocational colleges, and sixth-form colleges.
- **Common sub-tags**: `name=*`, `operator=*`, `website=*`
- **Status**: approved

### `amenity=dancing_school`

- **Element types**: node, area
- **Description**: A dance studio or facility providing dance instruction. May offer classes in a variety of dance styles such as ballet, ballroom, contemporary, or hip-hop.
- **Common sub-tags**: `name=*`, `opening_hours=*`
- **Status**: in use

### `amenity=driving_school`

- **Element types**: node, area
- **Description**: An establishment providing motor vehicle driving instruction to prepare students for a driving licence. Usually has an office for theory instruction and access to vehicles.
- **Common sub-tags**: `name=*`, `opening_hours=*`
- **Status**: in use

### `amenity=first_aid_school`

- **Element types**: node, area
- **Description**: A facility offering first aid and emergency response training courses, such as CPR, AED use, and basic life support.
- **Common sub-tags**: `name=*`, `opening_hours=*`
- **Status**: in use

### `amenity=kindergarten`

- **Element types**: node, area
- **Description**: A pre-school education facility for young children, typically from ages 3 to 6, before they enter primary school. May also be called a nursery or preschool.
- **Common sub-tags**: `name=*`, `operator=*`, `capacity=*`, `opening_hours=*`
- **Status**: approved

### `amenity=language_school`

- **Element types**: node, area
- **Description**: A school providing instruction in foreign languages. May offer classes for adults or children in a variety of languages.
- **Common sub-tags**: `name=*`, `opening_hours=*`, `language=*`
- **Status**: in use

### `amenity=library`

- **Element types**: node, area
- **Description**: A public or institutional lending library providing access to books, periodicals, digital resources, and other media. May also provide computer access and community programs.
- **Common sub-tags**: `name=*`, `opening_hours=*`, `operator=*`, `internet_access=*`
- **Status**: approved

### `amenity=music_school`

- **Element types**: node, area
- **Description**: A school or academy providing music education, including instrument tuition, theory, and performance. May be private or publicly funded.
- **Common sub-tags**: `name=*`, `opening_hours=*`
- **Status**: in use

### `amenity=research_institute`

- **Element types**: node, area
- **Description**: An establishment dedicated to research in a specific field, which may be affiliated with a university, government body, or private organization.
- **Common sub-tags**: `name=*`, `operator=*`, `website=*`
- **Status**: in use

### `amenity=school`

- **Element types**: node, area
- **Description**: A primary or secondary educational institution providing compulsory education for children. Covers all types of schools from elementary through high school.
- **Common sub-tags**: `name=*`, `operator=*`, `capacity=*`, `isced:level=*`
- **Status**: approved

### `amenity=surf_school`

- **Element types**: node, area
- **Description**: A facility or beach-based operation providing surfing instruction and equipment rental.
- **Common sub-tags**: `name=*`, `opening_hours=*`
- **Status**: in use

### `amenity=toy_library`

- **Element types**: node, area
- **Description**: A facility that lends toys and games to children and families, similar to a book library but for play equipment.
- **Common sub-tags**: `name=*`, `opening_hours=*`
- **Status**: in use

### `amenity=traffic_park`

- **Element types**: node, area
- **Description**: A miniature road network designed to teach children about traffic rules and road safety, typically operated by local authorities or police.
- **Common sub-tags**: `name=*`
- **Status**: in use

### `amenity=training`

- **Element types**: node, area
- **Description**: A general training facility or centre providing professional or vocational training for adults. Used when more specific tags (e.g., driving_school) do not apply.
- **Common sub-tags**: `name=*`, `opening_hours=*`, `subject=*`
- **Status**: in use

### `amenity=university`

- **Element types**: node, area
- **Description**: A higher education institution that awards undergraduate and postgraduate degrees. Typically a large campus covering many buildings and facilities.
- **Common sub-tags**: `name=*`, `operator=*`, `website=*`, `isced:level=*`
- **Status**: approved

---

## Transportation

### `amenity=bicycle_parking`

- **Element types**: node, area
- **Description**: A facility for storing bicycles, from simple racks to enclosed shelters and lockable bike cages.
- **Common sub-tags**: `capacity=*`, `bicycle_parking=*` (stands/wall_loops/shed/lockers), `covered=*`, `access=*`
- **Status**: approved

### `amenity=bicycle_rental`

- **Element types**: node, area
- **Description**: A bicycle rental service, including both staffed shops and automated self-service docking stations for bike-share schemes.
- **Common sub-tags**: `name=*`, `capacity=*`, `operator=*`, `network=*`
- **Status**: approved

### `amenity=bicycle_repair_station`

- **Element types**: node, area
- **Description**: A publicly accessible self-service station providing tools (pumps, spanners, tyre levers) for basic bicycle repairs and maintenance.
- **Common sub-tags**: `pump=*`, `tools=*`
- **Status**: in use

### `amenity=bicycle_wash`

- **Element types**: node, area
- **Description**: A facility for cleaning bicycles, typically providing a water source and brushes.
- **Common sub-tags**: `fee=*`
- **Status**: in use

### `amenity=boat_rental`

- **Element types**: node, area
- **Description**: A service providing boats for hire, from rowing boats and canoes to motorboats and sailboats.
- **Common sub-tags**: `name=*`, `operator=*`, `opening_hours=*`
- **Status**: in use

### `amenity=boat_sharing`

- **Element types**: node, area
- **Description**: A shared-access boat service, analogous to car sharing, where members can book and use boats from a shared fleet.
- **Common sub-tags**: `name=*`, `operator=*`, `network=*`
- **Status**: in use

### `amenity=boat_storage`

- **Element types**: node, area
- **Description**: A facility for storing privately-owned boats out of water, such as a boat yard or dry storage.
- **Common sub-tags**: `name=*`, `operator=*`
- **Status**: in use

### `amenity=bus_station`

- **Element types**: node, area
- **Description**: A public transport hub where multiple bus routes start, terminate, or call, typically with shelters, waiting areas, and ticketing facilities. Larger than a simple bus stop.
- **Common sub-tags**: `name=*`, `operator=*`, `covered=*`
- **Status**: approved

### `amenity=car_rental`

- **Element types**: node, area
- **Description**: A vehicle rental service where customers can hire cars for short periods. May be a staffed office or an automated location.
- **Common sub-tags**: `name=*`, `operator=*`, `opening_hours=*`
- **Status**: approved

### `amenity=car_sharing`

- **Element types**: node, area
- **Description**: A shared vehicle service where members can book and use cars from a shared fleet by the hour or minute. Includes both fixed-station and free-floating schemes.
- **Common sub-tags**: `name=*`, `operator=*`, `network=*`, `capacity=*`
- **Status**: approved

### `amenity=car_wash`

- **Element types**: node, area
- **Description**: A facility for cleaning vehicles, either as an automated drive-through or a self-service hand-wash bay.
- **Common sub-tags**: `name=*`, `opening_hours=*`, `automated=*`, `self_service=*`
- **Status**: approved

### `amenity=charging_station`

- **Element types**: node
- **Description**: An electric vehicle charging point or station where electric cars, motorcycles, or other EVs can recharge their batteries.
- **Common sub-tags**: `operator=*`, `capacity=*`, `socket:type2=*`, `socket:chademo=*`, `socket:ccs=*`, `voltage=*`, `output=*`
- **Status**: in use

### `amenity=compressed_air`

- **Element types**: node, area
- **Description**: A public compressed air device used to inflate tyres on bicycles and vehicles.
- **Common sub-tags**: `fee=*`
- **Status**: in use

### `amenity=driver_training`

- **Element types**: node, area
- **Description**: A closed-course driving facility used for advanced driver training, skid control, or emergency driving instruction. Distinct from a driving school (which operates on public roads).
- **Common sub-tags**: `name=*`, `operator=*`
- **Status**: in use

### `amenity=ferry_terminal`

- **Element types**: node, area
- **Description**: A facility where passengers and/or vehicles board and disembark from ferries. Includes ticket offices, waiting areas, and boarding infrastructure.
- **Common sub-tags**: `name=*`, `operator=*`, `opening_hours=*`
- **Status**: approved

### `amenity=fuel`

- **Element types**: node, area
- **Description**: A petrol or gas station where vehicles can be refuelled with liquid fuels (petrol, diesel, LPG, hydrogen) or charged with electricity.
- **Common sub-tags**: `name=*`, `operator=*`, `brand=*`, `opening_hours=*`, `fuel:diesel=*`, `fuel:octane_95=*`, `self_service=*`
- **Status**: approved

### `amenity=grit_bin`

- **Element types**: node
- **Description**: A bin or container filled with salt, grit, or sand placed on roadsides and pavements for use during icy conditions to improve traction.
- **Common sub-tags**: `operator=*`
- **Status**: in use

### `amenity=motorcycle_parking`

- **Element types**: node, area
- **Description**: A dedicated parking area or facility for motorcycles and scooters.
- **Common sub-tags**: `capacity=*`, `covered=*`, `fee=*`
- **Status**: in use

### `amenity=parking`

- **Element types**: node, area
- **Description**: A vehicle parking area or car park, whether open-air, multi-storey, or underground. One of the most commonly mapped amenities.
- **Common sub-tags**: `parking=*` (surface/multi-storey/underground), `capacity=*`, `fee=*`, `access=*`, `maxstay=*`, `opening_hours=*`
- **Status**: approved

### `amenity=parking_entrance`

- **Element types**: node
- **Description**: The entrance (and/or exit) point to an underground or multi-storey car park, where vehicles enter from the street.
- **Common sub-tags**: `access=*`, `ref=*`
- **Status**: in use

### `amenity=parking_space`

- **Element types**: node, area
- **Description**: An individual parking space or bay within a larger parking area. Used when mapping individual spaces rather than the whole car park.
- **Common sub-tags**: `access=*`, `parking:orientation=*`, `disabled=*`
- **Status**: in use

### `amenity=taxi`

- **Element types**: node, area
- **Description**: A designated taxi rank or waiting station where taxis queue for passengers.
- **Common sub-tags**: `name=*`, `operator=*`, `capacity=*`
- **Status**: approved

### `amenity=vehicle_inspection`

- **Element types**: node, area
- **Description**: A government-mandated vehicle inspection or roadworthiness testing station (e.g., MOT centre in the UK, TÜV in Germany).
- **Common sub-tags**: `name=*`, `operator=*`, `opening_hours=*`
- **Status**: in use

### `amenity=weighbridge`

- **Element types**: node, area
- **Description**: A large platform scale used to weigh road vehicles and their cargo, typically at industrial sites, ports, and weigh stations.
- **Common sub-tags**: `operator=*`, `maxweight=*`
- **Status**: in use

---

## Financial

### `amenity=atm`

- **Element types**: node
- **Description**: An automated teller machine (cash machine) where bank customers can withdraw money and perform basic banking transactions without a human teller.
- **Common sub-tags**: `operator=*`, `network=*`, `currency=*`, `opening_hours=*`, `drive_through=*`
- **Status**: approved

### `amenity=bank`

- **Element types**: node, area
- **Description**: A financial institution providing services such as deposits, withdrawals, loans, and account management. Includes full-service retail banks and branches.
- **Common sub-tags**: `name=*`, `operator=*`, `opening_hours=*`, `atm=*`
- **Status**: approved

### `amenity=bureau_de_change`

- **Element types**: node, area
- **Description**: A currency exchange service where foreign currencies can be exchanged. Found at airports, tourist areas, and financial centres.
- **Common sub-tags**: `name=*`, `operator=*`, `opening_hours=*`, `currency=*`
- **Status**: in use

### `amenity=money_transfer`

- **Element types**: node, area
- **Description**: A service facilitating the transfer of cash domestically or internationally, such as Western Union or MoneyGram agents.
- **Common sub-tags**: `name=*`, `operator=*`, `opening_hours=*`
- **Status**: in use

### `amenity=payment_centre`

- **Element types**: node, area
- **Description**: A non-bank facility where bills and payments can be made in person, common in regions with limited banking infrastructure.
- **Common sub-tags**: `name=*`, `operator=*`, `opening_hours=*`
- **Status**: in use

### `amenity=payment_terminal`

- **Element types**: node
- **Description**: A self-service kiosk or terminal for making payments, such as utility bill payment machines or ticket vending machines.
- **Common sub-tags**: `operator=*`
- **Status**: in use

---

## Healthcare

### `amenity=baby_hatch`

- **Element types**: node, area
- **Description**: A safe and anonymous drop-off location where a newborn baby can be left without legal consequence, provided by hospitals or charities to prevent abandonment in unsafe locations.
- **Common sub-tags**: `operator=*`
- **Status**: in use

### `amenity=clinic`

- **Element types**: node, area
- **Description**: A medium-sized medical facility providing outpatient care without full hospital facilities. May specialise in particular medical areas.
- **Common sub-tags**: `name=*`, `operator=*`, `opening_hours=*`, `healthcare:speciality=*`
- **Status**: approved

### `amenity=dentist`

- **Element types**: node, area
- **Description**: A dental practice providing preventive, restorative, and cosmetic dental care.
- **Common sub-tags**: `name=*`, `operator=*`, `opening_hours=*`
- **Status**: approved

### `amenity=doctors`

- **Element types**: node, area
- **Description**: A medical practice (general practitioner or specialist) providing outpatient consultation and primary healthcare.
- **Common sub-tags**: `name=*`, `operator=*`, `opening_hours=*`, `healthcare:speciality=*`
- **Status**: approved

### `amenity=hospital`

- **Element types**: node, area
- **Description**: A large medical facility providing in-patient care, emergency services, surgery, and specialist treatment. Typically the largest healthcare facility in a region.
- **Common sub-tags**: `name=*`, `operator=*`, `emergency=*`, `beds=*`
- **Status**: approved

### `amenity=nursing_home`

- **Element types**: node, area
- **Description**: A residential care facility providing accommodation and medical/personal care for elderly or disabled people who cannot live independently.
- **Common sub-tags**: `name=*`, `operator=*`, `capacity=*`
- **Status**: approved

### `amenity=pharmacy`

- **Element types**: node, area
- **Description**: A retail location where prescription and over-the-counter medications are dispensed and sold.
- **Common sub-tags**: `name=*`, `operator=*`, `opening_hours=*`, `dispensing=*`
- **Status**: approved

### `amenity=social_facility`

- **Element types**: node, area
- **Description**: A facility providing social services support including day centres, assisted living, shelters, and support groups for vulnerable populations.
- **Common sub-tags**: `name=*`, `operator=*`, `social_facility=*` (group_home/shelter/assisted_living)
- **Status**: in use

### `amenity=veterinary`

- **Element types**: node, area
- **Description**: A veterinary practice providing medical care for animals.
- **Common sub-tags**: `name=*`, `operator=*`, `opening_hours=*`
- **Status**: approved

---

## Entertainment, Arts & Culture

### `amenity=arts_centre`

- **Element types**: node, area
- **Description**: A venue hosting a variety of arts and performance activities, typically including theatre, music, visual arts, and community events under one roof.
- **Common sub-tags**: `name=*`, `opening_hours=*`, `operator=*`
- **Status**: approved

### `amenity=brothel`

- **Element types**: node, area
- **Description**: An establishment where sexual services are offered for payment.
- **Common sub-tags**: `name=*`, `opening_hours=*`
- **Status**: in use

### `amenity=casino`

- **Element types**: node, area
- **Description**: A gambling establishment offering table games such as roulette, blackjack, and poker, as well as slot machines.
- **Common sub-tags**: `name=*`, `opening_hours=*`, `operator=*`
- **Status**: in use

### `amenity=cinema`

- **Element types**: node, area
- **Description**: A movie theatre or cinema where films are screened for a paying audience.
- **Common sub-tags**: `name=*`, `opening_hours=*`, `operator=*`, `screen=*`, `capacity=*`
- **Status**: approved

### `amenity=community_centre`

- **Element types**: node, area
- **Description**: A multi-use facility serving as a gathering place for local residents, hosting events, classes, meetings, and social activities.
- **Common sub-tags**: `name=*`, `opening_hours=*`, `operator=*`
- **Status**: approved

### `amenity=conference_centre`

- **Element types**: node, area
- **Description**: A large facility designed to host conferences, conventions, trade shows, and meetings, with suitable audiovisual equipment and catering facilities.
- **Common sub-tags**: `name=*`, `operator=*`, `capacity=*`
- **Status**: in use

### `amenity=events_venue`

- **Element types**: node, area
- **Description**: A general-purpose venue for hosting events such as weddings, parties, and corporate functions where a more specific tag does not apply.
- **Common sub-tags**: `name=*`, `operator=*`, `capacity=*`
- **Status**: in use

### `amenity=exhibition_centre`

- **Element types**: node, area
- **Description**: A large facility dedicated to hosting exhibitions, trade fairs, and expos, typically with large open floor space.
- **Common sub-tags**: `name=*`, `operator=*`, `capacity=*`
- **Status**: in use

### `amenity=fountain`

- **Element types**: node, area
- **Description**: A decorative or functional water feature in a public space, from small drinking fountains to large ornamental installations.
- **Common sub-tags**: `name=*`, `lit=*`, `drinking_water=*`
- **Status**: approved

### `amenity=gambling`

- **Element types**: node, area
- **Description**: A gambling facility that is not a full casino, such as a betting shop, amusement arcade, or bingo hall.
- **Common sub-tags**: `name=*`, `opening_hours=*`, `gambling=*` (betting/lottery/bingo)
- **Status**: in use

### `amenity=love_hotel`

- **Element types**: node, area
- **Description**: A hotel designed for short stays (often by the hour) for couples seeking privacy. Particularly common in Japan and other parts of Asia.
- **Common sub-tags**: `name=*`, `opening_hours=*`
- **Status**: in use

### `amenity=music_venue`

- **Element types**: node, area
- **Description**: A venue hosting live contemporary music performances, from small club stages to large concert halls.
- **Common sub-tags**: `name=*`, `opening_hours=*`, `operator=*`, `capacity=*`, `genre=*`
- **Status**: in use

### `amenity=nightclub`

- **Element types**: node, area
- **Description**: An entertainment venue open late at night, primarily for dancing and drinking, typically with DJs or live music.
- **Common sub-tags**: `name=*`, `opening_hours=*`, `operator=*`, `capacity=*`
- **Status**: approved

### `amenity=planetarium`

- **Element types**: node, area
- **Description**: A theatre or dome equipped with a star projector or digital projection system for presenting astronomy shows.
- **Common sub-tags**: `name=*`, `operator=*`, `opening_hours=*`
- **Status**: in use

### `amenity=public_bookcase`

- **Element types**: node, area
- **Description**: A small outdoor or indoor bookcase where people can take and leave books for free, operating on a take-a-book, leave-a-book principle. Also called a little free library.
- **Common sub-tags**: `opening_hours=*`
- **Status**: in use

### `amenity=social_centre`

- **Element types**: node, area
- **Description**: A non-profit community space providing activities, events, and support, often run collectively or by volunteers.
- **Common sub-tags**: `name=*`, `opening_hours=*`, `operator=*`
- **Status**: in use

### `amenity=stage`

- **Element types**: node, area
- **Description**: A performance platform or stage, typically outdoor, used for concerts, speeches, and public performances.
- **Common sub-tags**: `name=*`, `covered=*`
- **Status**: in use

### `amenity=stripclub`

- **Element types**: node
- **Description**: A venue offering striptease or lap dancing performances.
- **Common sub-tags**: `name=*`, `opening_hours=*`
- **Status**: in use

### `amenity=studio`

- **Element types**: node, area
- **Description**: A professional recording studio, broadcast studio, or production facility for audio, video, film, or photography.
- **Common sub-tags**: `name=*`, `studio=*` (audio/video/film/photography)
- **Status**: in use

### `amenity=swingerclub`

- **Element types**: node, area
- **Description**: A private club where members engage in group sexual activities.
- **Common sub-tags**: `name=*`, `opening_hours=*`
- **Status**: in use

### `amenity=theatre`

- **Element types**: node, area
- **Description**: A venue for live theatrical performances including plays, musicals, opera, and ballet.
- **Common sub-tags**: `name=*`, `opening_hours=*`, `operator=*`, `capacity=*`, `theatre:type=*`
- **Status**: approved

---

## Public Service

### `amenity=courthouse`

- **Element types**: node, area
- **Description**: A building in which a court of law holds its proceedings and administers justice.
- **Common sub-tags**: `name=*`, `operator=*`
- **Status**: approved

### `amenity=fire_station`

- **Element types**: node, area
- **Description**: A base for fire brigade operations, housing fire engines and other emergency vehicles along with personnel.
- **Common sub-tags**: `name=*`, `operator=*`
- **Status**: approved

### `amenity=police`

- **Element types**: node, area
- **Description**: A police station — the base of operations for a police force or unit, where officers work and where the public can report crimes.
- **Common sub-tags**: `name=*`, `operator=*`
- **Status**: approved

### `amenity=post_box`

- **Element types**: node
- **Description**: A publicly accessible mail collection box (pillar box, letter box) where outgoing mail can be deposited for collection by postal services.
- **Common sub-tags**: `operator=*`, `collection_times=*`, `ref=*`
- **Status**: approved

### `amenity=post_depot`

- **Element types**: node, area
- **Description**: A postal sorting office, mail depot, or distribution centre where mail and parcels are sorted for onward delivery.
- **Common sub-tags**: `name=*`, `operator=*`
- **Status**: in use

### `amenity=post_office`

- **Element types**: node, area
- **Description**: A building or counter where postal services are provided to the public, including sending and receiving mail, parcels, and often additional financial and government services.
- **Common sub-tags**: `name=*`, `operator=*`, `opening_hours=*`
- **Status**: approved

### `amenity=prison`

- **Element types**: node, area
- **Description**: A correctional facility where persons are incarcerated as a punishment for crimes, awaiting trial, or for detention purposes.
- **Common sub-tags**: `name=*`, `operator=*`, `capacity=*`
- **Status**: approved

### `amenity=ranger_station`

- **Element types**: node, area
- **Description**: A facility serving as a base for park rangers, providing visitor information, emergency services, and park administration in national parks and protected areas.
- **Common sub-tags**: `name=*`, `operator=*`, `opening_hours=*`
- **Status**: in use

### `amenity=townhall`

- **Element types**: node, area
- **Description**: A building used for the administration of local government and as a public meeting place. Also called a city hall, civic centre, or municipal hall.
- **Common sub-tags**: `name=*`, `operator=*`
- **Status**: approved

---

## Facilities

### `amenity=bbq`

- **Element types**: node
- **Description**: A permanent public barbecue grill or fireplace provided for public use, typically in parks and recreation areas.
- **Common sub-tags**: `fuel=*` (charcoal/wood/gas), `covered=*`, `fee=*`
- **Status**: in use

### `amenity=bench`

- **Element types**: node, way
- **Description**: A public seating bench, typically outdoors in a park, along a street, or at a viewpoint.
- **Common sub-tags**: `backrest=*`, `material=*`, `seats=*`, `covered=*`
- **Status**: approved

### `amenity=check_in`

- **Element types**: node, way, area
- **Description**: A passenger check-in and boarding pass issuance counter, typically at an airport, ferry terminal, or other transport hub.
- **Common sub-tags**: `operator=*`, `ref=*`
- **Status**: in use

### `amenity=dog_toilet`

- **Element types**: node, area
- **Description**: A designated area for dogs to relieve themselves, often provided with waste bag dispensers.
- **Common sub-tags**: `waste_basket=*`
- **Status**: in use

### `amenity=dressing_room`

- **Element types**: node, area
- **Description**: A room or area for changing clothes, found at beaches, sports facilities, and shops.
- **Common sub-tags**: `sex=*` (male/female/unisex)
- **Status**: in use

### `amenity=drinking_water`

- **Element types**: node
- **Description**: A public potable water access point such as a drinking fountain, tap, or standpipe.
- **Common sub-tags**: `drinking_water=yes`, `bottle=*`, `wheelchair=*`
- **Status**: approved

### `amenity=give_box`

- **Element types**: node, area
- **Description**: A facility where people can leave unwanted items for others to take for free, promoting reuse and reducing waste.
- **Common sub-tags**: `category=*`
- **Status**: in use

### `amenity=lounge`

- **Element types**: node, area
- **Description**: A comfortable waiting area providing seating and facilities for passengers or visitors, such as an airport lounge or hotel lobby.
- **Common sub-tags**: `name=*`, `access=*`, `operator=*`
- **Status**: in use

### `amenity=mailroom`

- **Element types**: node, area
- **Description**: A room or facility within a building where incoming and outgoing mail and packages are received and processed.
- **Common sub-tags**: `operator=*`
- **Status**: in use

### `amenity=parcel_locker`

- **Element types**: node, area
- **Description**: An automated self-service locker unit used for collecting and sending parcels, operated by postal or logistics companies.
- **Common sub-tags**: `operator=*`, `brand=*`, `opening_hours=*`
- **Status**: in use

### `amenity=shelter`

- **Element types**: node, area
- **Description**: A structure providing weather protection for people, such as a bus shelter, picnic shelter, or mountain refuge hut.
- **Common sub-tags**: `shelter_type=*`, `covered=yes`, `bench=*`, `lit=*`
- **Status**: approved

### `amenity=shower`

- **Element types**: node, area
- **Description**: A public shower facility, found at beaches, campsites, sports facilities, and outdoor recreation areas.
- **Common sub-tags**: `fee=*`, `hot_water=*`, `access=*`, `sex=*`
- **Status**: in use

### `amenity=telephone`

- **Element types**: node
- **Description**: A public telephone or phone box providing access to telephony services.
- **Common sub-tags**: `operator=*`, `booth=*`, `covered=*`
- **Status**: approved

### `amenity=toilets`

- **Element types**: node, area
- **Description**: Publicly accessible toilet or restroom facilities.
- **Common sub-tags**: `access=*`, `fee=*`, `male=*`, `female=*`, `unisex=*`, `wheelchair=*`, `changing_table=*`
- **Status**: approved

### `amenity=water_point`

- **Element types**: node
- **Description**: A facility providing large volumes of drinking water, typically used by caravans, motorhomes, and boats to fill their water tanks.
- **Common sub-tags**: `drinking_water=yes`, `operator=*`
- **Status**: in use

### `amenity=watering_place`

- **Element types**: node
- **Description**: A trough or water source where animals can drink, typically found in rural areas, on farmland, or along horse-riding trails.
- **Common sub-tags**: `drinking_water=yes`
- **Status**: in use

---

## Waste Management

### `amenity=recycling`

- **Element types**: node, area
- **Description**: A facility for depositing recyclable materials such as glass, paper, plastic, metal, and textiles. Includes both individual collection points and larger recycling centres.
- **Common sub-tags**: `recycling_type=*` (container/centre), `recycling:glass=*`, `recycling:paper=*`, `recycling:plastic=*`, `recycling:metal=*`
- **Status**: approved

### `amenity=sanitary_dump_station`

- **Element types**: node, area
- **Description**: A facility where motorhomes, caravans, and boats can dispose of black and grey water waste from their tanks.
- **Common sub-tags**: `fee=*`, `water_point=*`, `operator=*`
- **Status**: in use

### `amenity=waste_basket`

- **Element types**: node
- **Description**: A small public litter bin or waste bin, typically mounted on a post or fixed to a wall in streets and public spaces.
- **Common sub-tags**: `waste=*`
- **Status**: approved

### `amenity=waste_disposal`

- **Element types**: node
- **Description**: A medium to large waste container or bin for general household or commercial waste disposal. Larger than a waste_basket.
- **Common sub-tags**: `waste=*`, `access=*`
- **Status**: in use

### `amenity=waste_transfer_station`

- **Element types**: node, area
- **Description**: A facility where municipal solid waste is transferred from smaller collection vehicles to larger transportation for delivery to landfill or processing.
- **Common sub-tags**: `name=*`, `operator=*`
- **Status**: in use

---

## Others

### `amenity=animal_boarding`

- **Element types**: node, area
- **Description**: A facility providing temporary accommodation and care for pets while their owners are away, such as a kennels or cattery.
- **Common sub-tags**: `name=*`, `operator=*`, `opening_hours=*`, `animal=*`
- **Status**: in use

### `amenity=animal_breeding`

- **Element types**: node, area, relation
- **Description**: A facility where animals are bred, such as a dog breeder or livestock breeding operation.
- **Common sub-tags**: `name=*`, `operator=*`, `animal=*`
- **Status**: in use

### `amenity=animal_shelter`

- **Element types**: node, area
- **Description**: An animal rescue and adoption centre where stray, abandoned, or surrendered animals are housed and rehomed.
- **Common sub-tags**: `name=*`, `operator=*`, `animal=*`
- **Status**: in use

### `amenity=animal_training`

- **Element types**: node, area
- **Description**: A facility providing training and behavioural instruction for animals, such as a dog training school.
- **Common sub-tags**: `name=*`, `operator=*`, `animal=*`
- **Status**: in use

### `amenity=baking_oven`

- **Element types**: node
- **Description**: A communal outdoor or indoor oven used for baking bread and other foods, often a traditional wood-fired community oven.
- **Common sub-tags**: `fuel=*`, `operator=*`
- **Status**: in use

### `amenity=clock`

- **Element types**: node
- **Description**: A publicly visible clock, such as a town clock, clock tower, or street clock, providing time to passers-by.
- **Common sub-tags**: `support=*`, `display=*`, `faces=*`
- **Status**: in use

### `amenity=crematorium`

- **Element types**: node, area
- **Description**: A facility where human bodies are cremated, typically also providing funeral services and chapel facilities for memorial services.
- **Common sub-tags**: `name=*`, `operator=*`, `religion=*`
- **Status**: in use

### `amenity=dive_centre`

- **Element types**: node, area
- **Description**: A base for scuba diving activities providing equipment rental, instruction, dive planning, and boat access to dive sites.
- **Common sub-tags**: `name=*`, `operator=*`, `opening_hours=*`
- **Status**: in use

### `amenity=funeral_hall`

- **Element types**: node, area
- **Description**: A hall or building used for funeral services and memorial ceremonies, which may be part of a crematorium or cemetery complex or a standalone facility.
- **Common sub-tags**: `name=*`, `operator=*`, `religion=*`
- **Status**: in use

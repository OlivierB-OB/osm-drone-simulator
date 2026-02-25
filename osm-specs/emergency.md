# Key: `emergency` — Emergency Facilities and Amenities

> Source: https://wiki.openstreetmap.org/wiki/Key:emergency

## Description

Describes various emergency services, facilities, amenities, or the possibility of access for emergency services. It may also be used as a vehicle use-class access key (e.g. `emergency=yes` on highways) to indicate routes accessible to emergency vehicles. Status: de facto.

## Values

### `emergency=ambulance_station`

- **Element types**: node / area
- **Description**: A structure or other area set aside for storage of ambulance vehicles, medical equipment, personal protective equipment, and other medical supplies.
- **Common sub-tags**: `name=*`, `operator=*`
- **Status**: in use

### `emergency=assembly_point`

- **Element types**: node / area
- **Description**: A designated safe place where people can gather or must report to during an emergency or a fire drill.
- **Common sub-tags**: `name=*`, `ref=*`, `operator=*`, `check_date=*`
- **Status**: de facto

### `emergency=coast_guard`

- **Element types**: node / way / area
- **Description**: A coast guard station. See also `amenity=coast_guard` and `seamark:type=coastguard_station`.
- **Status**: in use

### `emergency=defibrillator`

- **Element types**: node
- **Description**: An automated external defibrillator (AED), a portable electronic device that diagnoses and can automatically correct arrhythmia of the heart.
- **Common sub-tags**: `opening_hours=*`, `access=*`, `phone=*`, `defibrillator:location=*`, `locked=*`, `indoor=*`, `level=*`, `defibrillator:cabinet=*`
- **Status**: in use

### `emergency=disaster_response`

- **Element types**: node / area
- **Description**: A station where equipment and volunteers or paid members are based to work in an area affected by a natural or anthropogenic disaster.
- **Common sub-tags**: `name=*`, `operator=*`
- **Status**: approved

### `emergency=drinking_water`

- **Element types**: node
- **Description**: A facility that provides drinking water in emergency situations when regular water distribution systems fail, such as during crises or power outages.
- **Common sub-tags**: `man_made=water_well`, `man_made=water_tap`, `man_made=pump`, `pump=manual`, `ref=*`, `operator=*`
- **Status**: in use

### `emergency=emergency_ward_entrance`

- **Element types**: node
- **Description**: The entrance to an emergency ward of a hospital or medical facility specialising in acute care for patients requiring immediate medical attention.
- **Common sub-tags**: `entrance=*`, `emergency_ward_entrance=walk-in/rescue_service/all`
- **Status**: approved

### `emergency=fire_extinguisher`

- **Element types**: node
- **Description**: An active fire protection device used to extinguish or control small fires, often in emergency situations.
- **Status**: de facto

### `emergency=fire_flap`

- **Element types**: node
- **Description**: A fire flap (also known as a fire damper) is a device used to prevent the spread of fire through ductwork in buildings. Note: the dedicated tag page returns 404; documented in community usage.
- **Status**: in use

### `emergency=fire_hose`

- **Element types**: node
- **Description**: A high-pressure hose used to carry water or other fire retardant such as foam to a fire to extinguish it.
- **Common sub-tags**: `ref=*`, `operator=*`
- **Status**: in use

### `emergency=fire_hydrant`

- **Element types**: node
- **Description**: An active fire protection measure and a source of water provided in urban, suburban, and rural areas with municipal water service to enable firefighters to tap into the water supply.
- **Common sub-tags**: `fire_hydrant:type=pipe/pillar/wall/underground`, `fire_hydrant:pressure=*`, `fire_hydrant:position=sidewalk/lane/green/parking_lot`, `fire_hydrant:diameter=*`, `couplings=*`, `couplings:type=*`, `water_source=*`
- **Status**: in use

### `emergency=fire_lookout`

- **Element types**: node / area
- **Description**: A location used for fire spotting. Personnel watch for wildfire signs during fire season from wilderness areas and report sightings so firefighters can be dispatched.
- **Common sub-tags**: `building=fire_lookout`, `man_made=tower`, `operator=*`
- **Status**: approved

### `emergency=fire_lookout_tower`

- **Element types**: node / area
- **Description**: A tower structure specifically built for fire observation and spotting, typically in forested or wildland areas. Related to `emergency=fire_lookout` but specifically denotes the tower structure.
- **Common sub-tags**: `man_made=tower`, `operator=*`, `name=*`
- **Status**: in use

### `emergency=fire_station`

- **Element types**: (none — deprecated)
- **Description**: A fire station location. This tag is deprecated; use `amenity=fire_station` instead.
- **Status**: deprecated

### `emergency=fire_water_pond`

- **Element types**: node / area
- **Description**: A man-made or natural pond with water available for a fire department, allowing firefighters to quickly access water for extinguishing fires.
- **Common sub-tags**: `natural=water`, `water=pond`
- **Status**: in use

### `emergency=first_aid_kit`

- **Element types**: node
- **Description**: A collection of supplies and equipment used to give medical treatment in emergencies.
- **Common sub-tags**: `ref=*`, `access=*`, `indoor=*`
- **Status**: in use

### `emergency=landing_site`

- **Element types**: node / area
- **Description**: A preselected flat area for a helicopter to land in an emergency situation. Distinct from permanent helipads (`aeroway=helipad`); these are pre-planned emergency locations, often in fields or open terrain.
- **Status**: in use

### `emergency=life_ring`

- **Element types**: node
- **Description**: A floating ring to throw out to someone who is struggling in water, typically found near water courses, reservoirs, beaches, and lakes.
- **Common sub-tags**: `ref=*`, `operator=*`, `colour=*`, `support=pole/pillar/wall_mounted/fence`
- **Status**: in use

### `emergency=lifeguard`

- **Element types**: node / area
- **Description**: A place where a lifeguard is on duty — specifically a permanent or semi-permanent location such as a tower or building where lifeguards are stationed.
- **Common sub-tags**: `lifeguard=tower/base`, `name=*`, `operator=*`, `opening_hours=*`
- **Status**: approved

### `emergency=phone`

- **Element types**: node
- **Description**: An emergency telephone that anyone can use to contact an emergency service.
- **Common sub-tags**: `operator=*`, `ref=*`, `indoor=*`, `colour=*`, `manufacturer=*`
- **Status**: de facto

### `emergency=ses_station`

- **Element types**: (none — deprecated)
- **Description**: Refers to the State Emergency Service (SES), an Australian volunteer organisation that provides emergency help during and after declared disasters. Deprecated because it uses a country-specific acronym not understood elsewhere.
- **Status**: deprecated (use `emergency=disaster_response`)

### `emergency=siren`

- **Element types**: node
- **Description**: A loud noise maker such as an air raid siren or tornado siren. These outdoor warning devices deliver emergency alerts to the public for weather events, tsunami warnings, chemical spills, and other hazards.
- **Common sub-tags**: `siren:purpose=tornado/storm/air_raid/civil_defense`, `siren:type=pneumatic/electronic/electromechanical`, `siren:range=*`, `operator=*`, `support=pole/roof`
- **Status**: de facto

### `emergency=suction_point`

- **Element types**: node
- **Description**: A preferred point to pump water off a river or other body of water for a fire department. Marks the parking location for fire engines to access water.
- **Common sub-tags**: `emergency=fire_hydrant`, `emergency=fire_service_inlet`, `emergency=water_tank`, `emergency=fire_water_pond`
- **Status**: in use

### `emergency=water_rescue`

- **Element types**: node / area
- **Description**: A water search and rescue station, with rescues carried out by boats or other means. Applies to facilities dedicated to rescuing vessels and sailors in distress in open or coastal waters.
- **Common sub-tags**: `name=*`, `operator=*`, `operator:wikidata=*`, `opening_hours=*`, `phone=*`, `seamark:type=rescue_station`
- **Status**: approved

### `emergency=water_tank`

- **Element types**: node / area
- **Description**: A large water basin or tank for a fire department to take water. Provides rapid access to water for firefighting when water pipes are inadequate or natural water sources are unavailable.
- **Common sub-tags**: `man_made=reservoir_covered`, `natural=water`, `man_made=storage_tank`, `content=water`, `water_tank:volume=*`, `operator=*`, `access=*`
- **Status**: de facto

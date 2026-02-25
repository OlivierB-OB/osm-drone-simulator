# Key: `aeroway` — Aeroway

> Source: https://wiki.openstreetmap.org/wiki/Key:aeroway

## Description

The `aeroway` key is used to map features related to aerodromes, airfields, and the ground facilities that support airplane and helicopter operations. This includes the physical infrastructure of airports such as runways, taxiways, and aprons, as well as associated structures like terminals, hangars, and control towers. All values carry de facto status as they are widely used in the community.

## Values

### `aeroway=aerodrome`

- **Element types**: node, area
- **Description**: An aerodrome, airport, or airfield — the main area used to map the overall extent of an aviation facility. Used for any facility where fixed-wing or rotary-wing aircraft take off and land, from large international airports to small general aviation fields.
- **Common sub-tags**: `name=*`, `iata=*`, `icao=*`, `aerodrome:type=*` (international/regional/general_aviation), `operator=*`, `ele=*`
- **Status**: de facto

### `aeroway=airstrip`

- **Element types**: node, area
- **Description**: A simple field or unprepared surface where light aircraft can land and take off, typically without permanent infrastructure. Often found in remote areas, on farms, or in developing regions. Less formal than a full aerodrome.
- **Common sub-tags**: `name=*`, `surface=*`, `ele=*`
- **Status**: de facto

### `aeroway=apron`

- **Element types**: area
- **Description**: The paved area of an airport where aircraft are parked, unloaded or loaded, refuelled, or boarded by passengers. Also called a ramp. The apron connects taxiways to gates and stands.
- **Common sub-tags**: `ref=*`, `surface=*`
- **Status**: de facto

### `aeroway=control_center`

- **Element types**: node, area
- **Description**: An area control center or en-route facility that controls aircraft flying through a defined airspace region, as opposed to approach or tower control at a specific airport. These facilities manage aircraft en route between airports.
- **Common sub-tags**: `name=*`, `operator=*`, `icao=*`
- **Status**: de facto

### `aeroway=hangar`

- **Element types**: node, area
- **Description**: A large enclosed structure used to hold, shelter, maintain, or repair aircraft or spacecraft. Hangars protect aircraft from weather and provide workspace for maintenance operations.
- **Common sub-tags**: `name=*`, `operator=*`, `building=hangar`
- **Status**: de facto

### `aeroway=helipad`

- **Element types**: node, area
- **Description**: A prepared landing area or platform designed specifically for helicopters. May be found at hospitals, offshore oil platforms, rooftops, airports, or standalone facilities. Smaller and simpler than a full heliport.
- **Common sub-tags**: `name=*`, `ele=*`, `surface=*`, `operator=*`
- **Status**: de facto

### `aeroway=heliport`

- **Element types**: node, area
- **Description**: The main area of a facility dedicated primarily or entirely to helicopter operations, analogous to an aerodrome for fixed-wing aircraft. Includes supporting infrastructure beyond a single helipad.
- **Common sub-tags**: `name=*`, `iata=*`, `icao=*`, `operator=*`, `ele=*`
- **Status**: de facto

### `aeroway=highway_strip`

- **Element types**: node, way, area
- **Description**: A section of public highway that is designated and maintained as an emergency or alternative landing strip for aircraft. The road surface meets aircraft landing requirements and can be closed to traffic for aviation use.
- **Common sub-tags**: `name=*`, `surface=*`, `length=*`
- **Status**: de facto

### `aeroway=jet_bridge`

- **Element types**: way
- **Description**: An enclosed, movable connector (passenger boarding bridge or jetway) that extends from an airport terminal gate to the door of an aircraft, allowing passengers to board and disembark without going outside.
- **Common sub-tags**: `ref=*`
- **Status**: de facto

### `aeroway=model_runway`

- **Element types**: way
- **Description**: A take-off and landing runway designated for model aircraft (remote-controlled planes and drones). Found at model aviation clubs and dedicated flying sites.
- **Common sub-tags**: `name=*`, `surface=*`, `length=*`
- **Status**: de facto

### `aeroway=navigationaid`

- **Element types**: node
- **Description**: A ground-based navigation aid that supports visual or instrument navigation for aircraft. Includes facilities such as VOR (VHF Omnidirectional Range), NDB (Non-Directional Beacon), ILS (Instrument Landing System), and DME (Distance Measuring Equipment).
- **Common sub-tags**: `navigationaid=*` (vor/ndb/ils/dme/vortac), `ref=*`, `name=*`, `frequency=*`
- **Status**: de facto

### `aeroway=runway`

- **Element types**: way
- **Description**: The rectangular paved or prepared surface at an aerodrome that is used for the landing and takeoff of aircraft. The way is drawn along the centreline of the runway. Runways are identified by their magnetic heading in tens of degrees.
- **Common sub-tags**: `ref=*` (e.g., "09/27"), `surface=*`, `length=*`, `width=*`, `lit=*`
- **Status**: de facto

### `aeroway=spaceport`

- **Element types**: way, area
- **Description**: A site used for launching or receiving spacecraft. Includes orbital launch facilities, suborbital spaceports, and landing sites for reusable spacecraft.
- **Common sub-tags**: `name=*`, `operator=*`
- **Status**: de facto

### `aeroway=stopway`

- **Element types**: way
- **Description**: A rectangular surface beyond the end of a runway, prepared so that an aircraft can be stopped in the event of an abandoned (aborted) takeoff. Not intended for normal use; provides extra stopping distance.
- **Common sub-tags**: `ref=*`, `surface=*`
- **Status**: de facto

### `aeroway=taxilane`

- **Element types**: way
- **Description**: A taxiway path within an airport's parking area or apron, providing access between aircraft stands and the main taxiway network. More restricted than a full taxiway and typically narrower.
- **Common sub-tags**: `ref=*`, `surface=*`, `width=*`
- **Status**: de facto

### `aeroway=taxiway`

- **Element types**: way
- **Description**: A defined path on an airport connecting runways with ramps, hangars, terminals, and other facilities. Aircraft use taxiways to move between takeoff/landing areas and parking positions under ATC instruction.
- **Common sub-tags**: `ref=*`, `surface=*`, `width=*`, `lit=*`, `oneway=*`
- **Status**: de facto

### `aeroway=terminal`

- **Element types**: node, area
- **Description**: A terminal building at an airport where passengers transfer between ground transportation and aircraft. Includes check-in, security, gates, and arrivals facilities.
- **Common sub-tags**: `name=*`, `ref=*`, `operator=*`, `building=terminal`
- **Status**: de facto

### `aeroway=tower`

- **Element types**: node, area
- **Description**: An air traffic control tower structure from which controllers oversee and direct aircraft and vehicle movements on and around the airport.
- **Common sub-tags**: `name=*`, `height=*`, `operator=*`
- **Status**: de facto


# Key: `public_transport` — Public Transport Infrastructure

> Source: https://wiki.openstreetmap.org/wiki/Key:public_transport

## Description

The `public_transport` key denotes stop positions and platforms of public transport. Stop positions are placed as nodes on the street where the vehicle physically stops; platforms are placed next to the street where passengers wait. The key is part of the Public Transport v2 schema (approved April 2011) and covers all modes of public transit.

## Values

### `public_transport=stop_position`

- **Element types**: node
- **Description**: The exact position on the road or track where the front of a public transport vehicle stops. Placed on the way representing the road or rail, not beside it. One stop_position node per vehicle door alignment is not required; one per stopping location is sufficient.
- **Common sub-tags**: `bus=yes`, `tram=yes`, `train=yes`, `subway=yes`, `ferry=yes`, `name=*`, `ref=*`, `operator=*`, `network=*`
- **Status**: approved

### `public_transport=platform`

- **Element types**: node, way, area
- **Description**: The location where passengers wait for a public transport vehicle. A node is used for a simple point, a way for a linear platform, and an area for a platform with defined width. Replaces the older `highway=bus_stop` node (which should still be added for compatibility).
- **Common sub-tags**: `highway=bus_stop`, `name=*`, `ref=*`, `operator=*`, `network=*`, `shelter=yes/no`, `bench=yes/no`, `covered=yes/no`
- **Status**: approved

### `public_transport=station`

- **Element types**: node, area
- **Description**: An area designed to access public transport, covering railway stations, bus stations, and other major public transport hubs intended for passenger service. Node use is acceptable for simple point representation; area is preferred when the station footprint is known.
- **Common sub-tags**: `name=*`, `operator=*`, `network=*`, `area=*`, `building=*`, `covered=yes/no`
- **Status**: approved

### `public_transport=stop_area`

- **Element types**: relation
- **Description**: A relation grouping all stop positions (role: `stop`) and platforms (role: `platform`) that belong to the same named stop. The relation represents the logical grouping of all physical elements that a traveller associates with a single named stop.
- **Common sub-tags**: `type=public_transport`, `name=*`, `network=*`, `operator=*`, `ref=*`
- **Status**: approved

### `public_transport=stop_area_group`

- **Element types**: relation
- **Description**: A relation containing multiple `public_transport=stop_area` relations that together form a public transport interchange — for example, a multi-modal hub combining buses, metros, and trains. Definition and necessity is noted as unclear in the wiki; use with caution.
- **Common sub-tags**: `type=public_transport`, `name=*`, `operator=*`, `network=*`, `ref=*`, `description=*`
- **Status**: de facto

### `public_transport=stop`

- **Element types**: node
- **Description**: Legacy value from the older Public Transport v1 schema, used to mark the position of a public transport stop. Superseded by `public_transport=stop_position` (for the vehicle position) and `public_transport=platform` (for the passenger waiting area) in the v2 schema.
- **Status**: deprecated

## Common Associated Tags

The following tags are commonly added alongside `public_transport=*` values to describe the service at a stop or platform:

- `network=*` — The name of the transit network (e.g., `network=TfL`)
- `operator=*` — The company or authority operating the service (e.g., `operator=National Rail`)
- `ref=*` — An official reference code or stop number
- `name=*` — The human-readable name of the stop or station
- `route=*` — Route identifier (used on route relations, not typically on stops directly)
- `bus=yes` / `tram=yes` / `train=yes` / `subway=yes` / `ferry=yes` — Mode of transport served
- `wheelchair=yes/no/limited` — Accessibility information
- `shelter=yes/no` — Whether a shelter is present at a platform

# Key: `telecom` — Telecom

> Source: https://wiki.openstreetmap.org/wiki/Key:telecom

## Description

The `telecom=*` key is the main key for telecommunication systems and networks mapping. It is used to tag infrastructure related to telecommunications, including buildings, cabinets, cables, and equipment. The key has 12 documented values and is approved for use on nodes, ways, areas, and multipolygon relations.

## Values

### `telecom=exchange`

- **Element types**: node / area
- **Description**: A place to connect landline subscribers to telecommunication service equipment. Physically a building or a cabinet containing several telecom service equipment including switches, transmission and amplification equipment, main and/or secondary distribution frames. Dedicated buildings should be mapped as areas; newer exchanges in street cabinets or part of larger buildings can be mapped as nodes.
- **Common sub-tags**: `operator=*`, `building=service`
- **Status**: approved

### `telecom=service_device`

- **Element types**: node / area
- **Description**: Active equipment which delivers service to connected customers. Examples include a DSLAM, a telephone switch, or an OLT (Optical Line Terminal) for optical networks. Excludes amplifiers or repeaters along communication lines.
- **Common sub-tags**: `operator=*`
- **Status**: approved

### `telecom=connection_point`

- **Element types**: node / area
- **Description**: The last point of telecom local loops allowing direct connections towards a few households and subscribers. Enables telecom operators to manage wiring resources and reduce cable amounts needed to reach telephone exchanges. Typically located in street cabinets or building basements, often includes patch panels for connecting and disconnecting subscribers.
- **Common sub-tags**: `operator=*`
- **Status**: approved

### `telecom=distribution_point`

- **Element types**: node
- **Description**: Equipment, often small boxes, allowing direct connection of up to 15 individuals or households to a single upstream local loop cable towards telecom exchanges. These are the last connection points on public networks toward subscribers, typically smaller than connection points and often installed in streets, basements, or on poles.
- **Common sub-tags**: `operator=*`
- **Status**: approved

### `telecom=data_center`

- **Element types**: node / area
- **Description**: A building used to house computers and network equipment. Applies to data centres ranging from small server rooms to large multi-building campuses housing thousands of servers.
- **Common sub-tags**: `operator=*`, `building=*`
- **Status**: in use

### `telecom=central_office`

- **Element types**: node / area
- **Description**: Deprecated. Use `telecom=exchange` instead.
- **Status**: deprecated

### `telecom=line`

- **Element types**: way
- **Description**: A telecommunication line.
- **Common sub-tags**: `operator=*`, `cables=*`
- **Status**: in use

### `telecom=cable_distribution_cabinet`

- **Element types**: node
- **Description**: A street-level cabinet used to distribute telecom or cable television signals to nearby subscribers, typically containing splitters, amplifiers, or patch panels.
- **Common sub-tags**: `operator=*`
- **Status**: in use

# Key: `aerialway` — Aerialway

> Source: https://wiki.openstreetmap.org/wiki/Key:aerialway

## Description

The `aerialway` key is used to map different forms of transportation for people or goods using aerial wires, including cable-cars, chair-lifts, and drag-lifts. These are typically found at ski resorts and in mountainous terrain where conventional roads are impractical. The way is drawn in the direction of travel (uphill) and should have associated `aerialway=station` nodes at each end.

## Values

### `aerialway=cable_car`

- **Element types**: way, node
- **Description**: A cable car where the cabin is suspended from a fixed-grip cable. Typically carries a larger number of passengers between two fixed stations, often used in mountainous areas. The way represents the cable line itself.
- **Common sub-tags**: `aerialway:occupancy=*`, `aerialway:capacity=*`, `aerialway:duration=*`, `aerialway:bubble=*`, `aerialway:heating=*`, `oneway=yes`
- **Status**: de facto

### `aerialway=gondola`

- **Element types**: way, node
- **Description**: A gondola lift where enclosed cabins circulate continuously on a cable. Unlike cable cars, gondolas typically have detachable grips allowing cabins to slow at stations for boarding and alighting.
- **Common sub-tags**: `aerialway:occupancy=*`, `aerialway:capacity=*`, `aerialway:duration=*`, `aerialway:detachable=yes`, `aerialway:bubble=*`, `aerialway:heating=*`
- **Status**: de facto

### `aerialway=mixed_lift`

- **Element types**: way, node
- **Description**: A combination lift that uses both gondola cabins and chair-lift chairs on the same cable line. Allows both skiers who prefer open chairs and those who prefer enclosed cabins.
- **Common sub-tags**: `aerialway:occupancy=*`, `aerialway:capacity=*`, `aerialway:detachable=*`
- **Status**: de facto

### `aerialway=chair_lift`

- **Element types**: way, node
- **Description**: A lift where passengers ride in open or bubble-enclosed chairs suspended from a cable. One of the most common lift types at ski resorts. Fixed-grip versions move at a constant speed; detachable versions slow at stations.
- **Common sub-tags**: `aerialway:occupancy=*`, `aerialway:capacity=*`, `aerialway:duration=*`, `aerialway:detachable=*`, `aerialway:bubble=*`, `aerialway:heating=*`, `aerialway:bicycle=*`
- **Status**: de facto

### `aerialway=drag_lift`

- **Element types**: way, node
- **Description**: A generic drag lift (also called a surface lift) where skiers are dragged up the slope while remaining in contact with the snow. Used as a general tag when the specific type of drag lift is not known.
- **Common sub-tags**: `aerialway:capacity=*`, `aerialway:duration=*`
- **Status**: de facto

### `aerialway=t-bar`

- **Element types**: way, node
- **Description**: A surface drag lift with a T-shaped bar that can carry two skiers side by side. The bar is attached to the tow cable via a retractable arm, and skiers place the bar behind their thighs to be pulled uphill.
- **Common sub-tags**: `aerialway:capacity=*`, `aerialway:duration=*`
- **Status**: de facto

### `aerialway=j-bar`

- **Element types**: way, node
- **Description**: A surface drag lift with a J-shaped bar designed for a single skier. The J-hook sits between the legs or behind the thighs to drag the skier uphill.
- **Common sub-tags**: `aerialway:capacity=*`, `aerialway:duration=*`
- **Status**: de facto

### `aerialway=platter`

- **Element types**: way, node
- **Description**: A surface drag lift (also called a button lift or poma lift) with a small disk or platter attached to a retractable pole. The platter is placed between the legs and the tow cable pulls the skier uphill.
- **Common sub-tags**: `aerialway:capacity=*`, `aerialway:duration=*`
- **Status**: de facto

### `aerialway=rope_tow`

- **Element types**: way, node
- **Description**: The simplest form of ski lift: a continuously moving rope that skiers grip with their hands or a hook to be towed uphill. Common at small ski areas and golf courses in winter.
- **Common sub-tags**: `aerialway:capacity=*`, `aerialway:duration=*`
- **Status**: de facto

### `aerialway=zip_line`

- **Element types**: way, node
- **Description**: A cable-based descent or traversal system for recreation, where a rider is suspended from a pulley and slides downhill under gravity along a tensioned cable. Common at adventure parks and tourist attractions.
- **Common sub-tags**: `fee=*`, `operator=*`
- **Status**: de facto

### `aerialway=goods`

- **Element types**: way, node
- **Description**: An aerial ropeway used exclusively for transporting freight or cargo, not passengers. Used in mining, construction, agriculture, and remote supply operations.
- **Common sub-tags**: `aerialway:capacity=*`, `operator=*`
- **Status**: de facto

### `aerialway=pylon`

- **Element types**: node
- **Description**: A support pylon or tower for an aerial cable system. Mapped as individual nodes along the way representing the cable line. Used to document the physical infrastructure supporting the cable.
- **Common sub-tags**: `height=*`, `material=*`
- **Status**: de facto

### `aerialway=station`

- **Element types**: node, area
- **Description**: A terminal or boarding/alighting station for an aerial lift system. Should be mapped at both ends of a cable way and at any intermediate stations. May include the building footprint as an area.
- **Common sub-tags**: `name=*`, `ele=*`, `operator=*`, `opening_hours=*`
- **Status**: de facto

# Key: `waterway` — Waterway

> Source: https://wiki.openstreetmap.org/wiki/Key:waterway

## Description

The `waterway=*` key is used to describe natural or artificial water flows such as rivers, streams, and canals, as well as elements which control the water flow such as dams and weirs. It applies to linear features (ways), point features (nodes), and some areal features (areas). The key has de facto status, indicating widespread community use.

## Values

---

### Linear — Natural Watercourses

### `waterway=river`

- **Element types**: way
- **Description**: A wide, natural watercourse that flows from a source to an ocean, sea, lake, or another river. Used for the centreline of a river; for the water area use `natural=water` + `water=river`.
- **Common sub-tags**: `name=*`, `intermittent=yes`, `tidal=yes`, `width=*`
- **Status**: de facto

### `waterway=stream`

- **Element types**: way
- **Description**: A naturally-formed waterway that is too narrow to be classed as a river. Typically a small watercourse flowing through natural or rural terrain.
- **Common sub-tags**: `name=*`, `intermittent=yes`, `tunnel=culvert`, `seasonal=*`, `width=*`
- **Status**: de facto

### `waterway=tidal_channel`

- **Element types**: way
- **Description**: A natural tidal waterway within the coastal marine environment, subject to regular flooding and drainage with the tides.
- **Common sub-tags**: `name=*`, `tidal=yes`, `width=*`
- **Status**: de facto

### `waterway=flowline`

- **Element types**: way
- **Description**: Represents slow-moving water flow through shallow or marshy water bodies where a distinct channel is not clearly defined.
- **Common sub-tags**: `name=*`, `intermittent=yes`
- **Status**: in use

---

### Linear — Artificial Waterways

### `waterway=canal`

- **Element types**: way
- **Description**: An artificial open flow waterway used to carry water for transportation, waterpower, or irrigation. Canals are typically straight and engineered with consistent depth.
- **Common sub-tags**: `name=*`, `intermittent=yes`, `tidal=yes`, `width=*`, `tunnel=culvert`, `bridge=aqueduct`
- **Status**: de facto

### `waterway=drain`

- **Element types**: way
- **Description**: An artificial free-flow waterway used for carrying superfluous water away from land, roads, or urban areas. Typically open-topped and larger than a ditch.
- **Common sub-tags**: `name=*`, `intermittent=yes`, `tunnel=culvert`, `width=*`
- **Status**: de facto

### `waterway=pressurised`

- **Element types**: way
- **Description**: Water flowing in a fully enclosed, pressurized conduit such as a pipe, where the water is under positive pressure. Distinct from gravity-fed open channels.
- **Common sub-tags**: `name=*`, `operator=*`
- **Status**: in use

### `waterway=fairway`

- **Element types**: way
- **Description**: A navigable route in a lake or sea marked by buoys or other markers to guide vessels safely through shallow, narrow, or hazardous waters.
- **Common sub-tags**: `name=*`
- **Status**: in use

### `waterway=fish_pass`

- **Element types**: way
- **Description**: A structure on or around artificial barriers such as dams and weirs to facilitate fish migration by providing a navigable route past the obstruction.
- **Common sub-tags**: `name=*`
- **Status**: in use

### `waterway=canoe_pass`

- **Element types**: way
- **Description**: A structure enabling whitewater canoeists or kayakers to pass safely through or around barriers such as weirs and dams.
- **Common sub-tags**: `name=*`
- **Status**: in use

### `waterway=link`

- **Element types**: way
- **Description**: A navigable connection over the surface of a body of water, used to indicate a route between two water bodies or sections.
- **Common sub-tags**: `name=*`
- **Status**: in use

---

### Areal — Water Areas

### `waterway=riverbank`

- **Element types**: way / area
- **Description**: The outline of the banks of a river, used to map the full area covered by a river's water surface. Largely superseded by using `natural=water` + `water=river` for area mapping.
- **Common sub-tags**: `name=*`
- **Status**: de facto

### `waterway=dock`

- **Element types**: way / area
- **Description**: An enclosed area of water where the height of the water can be managed, used for loading, unloading, building, or repairing ships. Can be tagged as an area or a node for the facility.
- **Common sub-tags**: `name=*`, `operator=*`, `mooring=yes`
- **Status**: de facto

---

### Barriers & Control Structures

### `waterway=dam`

- **Element types**: way / area
- **Description**: A wall or embankment built across a river or stream to impound the water and form a reservoir, or to control water flow.
- **Common sub-tags**: `name=*`, `operator=*`, `height=*`
- **Status**: de facto

### `waterway=weir`

- **Element types**: way / area
- **Description**: A barrier built across a river to control the speed and depth of water flow, typically overtopped by flowing water. Used for flow regulation and to raise upstream water levels.
- **Common sub-tags**: `name=*`, `height=*`
- **Status**: de facto

### `waterway=waterfall`

- **Element types**: node / way
- **Description**: A natural drop or series of drops in the course of a river or stream where water falls vertically. Often combined with `natural=cliff` for the associated cliff face.
- **Common sub-tags**: `name=*`, `height=*`, `ele=*`
- **Status**: de facto

### `waterway=rapids`

- **Element types**: node / way / area
- **Description**: A natural barrier formed by a fast-flowing, often turbulent section of a river where the gradient increases and rocks may be exposed at the surface.
- **Common sub-tags**: `name=*`
- **Status**: de facto

### `waterway=lock_gate`

- **Element types**: node / way
- **Description**: Marks the position of gates at each end of a canal or river lock, used to retain water within the lock chamber while it is raised or lowered.
- **Common sub-tags**: `name=*`
- **Status**: de facto

### `waterway=sluice_gate`

- **Element types**: node / way / area
- **Description**: A movable gate used to control the flow of water through a channel, dam, or drainage system. Can be opened or closed to regulate water levels.
- **Common sub-tags**: `name=*`, `operator=*`
- **Status**: in use

### `waterway=floodgate`

- **Element types**: node / way / area
- **Description**: A barrier gate used to regulate water flow from bodies of water, primarily to prevent flooding during high tides or storm surges.
- **Common sub-tags**: `name=*`, `operator=*`
- **Status**: in use

### `waterway=debris_screen`

- **Element types**: node / way
- **Description**: A screen or barrier placed across a watercourse to prevent water-borne debris from entering water intakes, turbines, or other infrastructure downstream.
- **Common sub-tags**: `name=*`
- **Status**: in use

### `waterway=security_lock`

- **Element types**: node / way
- **Description**: A flood barrier structure used to seal a waterway or channel against storm surge or tidal flooding events.
- **Common sub-tags**: `name=*`, `operator=*`
- **Status**: in use

### `waterway=check_dam`

- **Element types**: node / way / area
- **Description**: A small barrier built across a waterway to reduce flow velocity, control flooding, and prevent debris from passing further downstream.
- **Common sub-tags**: `name=*`
- **Status**: in use

---

### Facilities & Objects (Nodes)

### `waterway=boatyard`

- **Element types**: node / area
- **Description**: A place for constructing, repairing, and storing vessels out of the water. Typically includes slipways, cranes, and workshop facilities.
- **Common sub-tags**: `name=*`, `operator=*`, `opening_hours=*`
- **Status**: de facto

### `waterway=turning_point`

- **Element types**: node
- **Description**: A place where vessels can turn around to reverse their driving direction on a waterway. Typically a widened section of a canal or river.
- **Common sub-tags**: `name=*`
- **Status**: in use

### `waterway=water_point`

- **Element types**: node
- **Description**: A place where boats can fill fresh water holding tanks. Typically found at marinas, canal-side facilities, and harbours.
- **Common sub-tags**: `name=*`, `fee=*`, `operator=*`
- **Status**: in use

### `waterway=fuel`

- **Element types**: node
- **Description**: A place where boats can get fuel. Located at marinas, boatyards, or dedicated waterside fuel stations.
- **Common sub-tags**: `name=*`, `fuel:diesel=yes`, `fuel:petrol=yes`, `operator=*`, `opening_hours=*`
- **Status**: in use

---

### Other Features

### `waterway=small_waterfall`

- **Element types**: node
- **Description**: A small natural drop in a watercourse, less significant than a waterfall. Used where the height difference does not warrant the full `waterway=waterfall` tag.
- **Common sub-tags**: `name=*`, `height=*`
- **Status**: in use

### `waterway=soakaway`

- **Element types**: node
- **Description**: A pit or underground structure filled with rubble or gravel that allows surface water to drain slowly into the ground, preventing runoff accumulation.
- **Common sub-tags**: `name=*`
- **Status**: in use

### `waterway=wadi`

- **Element types**: way
- **Description**: A valley, ravine, or dry riverbed in arid regions that contains water only seasonally or after heavy rainfall. Common in desert and semi-arid environments.
- **Common sub-tags**: `name=*`, `intermittent=yes`, `seasonal=yes`
- **Status**: in use

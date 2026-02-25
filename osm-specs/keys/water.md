# Key: `water` — Water

> Source: https://wiki.openstreetmap.org/wiki/Key:water

## Description

The `water=*` key specifies the type of a water body and is used to classify inland water features. It must be paired with `natural=water` on the same element. The key is approved and applies exclusively to areas (and multipolygon relations); it is not used on nodes or ways.

## Values

---

### Natural Water Bodies

### `water=lake`

- **Element types**: area
- **Description**: A relatively still body of fresh or salt water of considerable size, naturally formed. Distinguished from a pond primarily by size; a lake is generally larger.
- **Common sub-tags**: `name=*`, `salt=yes/no`, `intermittent=yes`
- **Status**: approved

### `water=river`

- **Element types**: area
- **Description**: The water area covered by a river. The area polygon should typically contain a `waterway=river` centerline way within it.
- **Common sub-tags**: `name=*`, `intermittent=yes`
- **Status**: approved

### `water=stream`

- **Element types**: area
- **Description**: The water-covered area of a naturally-formed watercourse narrower than a river. Used when mapping the full area of a stream rather than just its centerline.
- **Common sub-tags**: `name=*`, `intermittent=yes`
- **Status**: approved

### `water=oxbow`

- **Element types**: area
- **Description**: A U-shaped body of water formed when a wide meander of a river is cut off, creating a free-standing body of water. Named for its resemblance to an oxbow collar.
- **Common sub-tags**: `name=*`, `intermittent=yes`
- **Status**: approved

### `water=lagoon`

- **Element types**: area
- **Description**: A shallow body of seawater or brackish water separated from the sea by a barrier such as a sandbar, reef, or atoll.
- **Common sub-tags**: `name=*`, `salt=yes`
- **Status**: approved

### `water=stream_pool`

- **Element types**: area
- **Description**: A small deep collection of fresh water along a stream, often found below waterfalls or in rocky gorges where the current slows.
- **Common sub-tags**: `name=*`
- **Status**: approved

### `water=cenote`

- **Element types**: area
- **Description**: A deep natural well or sinkhole, especially found in Central America, formed by the collapse of limestone bedrock exposing groundwater underneath.
- **Common sub-tags**: `name=*`, `access=*`
- **Status**: in use

### `water=rapids`

- **Element types**: area
- **Description**: The water-covered area of a fast-flowing, turbulent section of a watercourse with exposed rocks or significant drop in elevation.
- **Common sub-tags**: `name=*`
- **Status**: in use

---

### Artificial Water Bodies

### `water=basin`

- **Element types**: area
- **Description**: Land area artificially graded and sometimes lined to hold water, used for flood control, water management, or retention purposes.
- **Common sub-tags**: `name=*`, `basin=*`
- **Status**: approved

### `water=canal`

- **Element types**: area
- **Description**: The water area of a man-made navigable water channel. The area polygon should typically contain a `waterway=canal` centerline way.
- **Common sub-tags**: `name=*`, `intermittent=yes`
- **Status**: approved

### `water=ditch`

- **Element types**: area
- **Description**: The water-covered area of a linear waterbody serving as a barrier or drain. Should contain a `waterway=ditch` way within it.
- **Common sub-tags**: `name=*`, `intermittent=yes`
- **Status**: approved

### `water=drain`

- **Element types**: area
- **Description**: An artificial concrete-lined or engineered watercourse used to carry excess surface water. Requires a `waterway=drain` centerline within the area polygon.
- **Common sub-tags**: `name=*`, `intermittent=yes`
- **Status**: approved

### `water=fish_pass`

- **Element types**: area
- **Description**: The water area of a structure allowing fish to migrate past waterway barriers such as dams or weirs while maintaining safe passage.
- **Common sub-tags**: `name=*`
- **Status**: approved

### `water=harbour`

- **Element types**: area
- **Description**: A sheltered body of water where ships and boats can dock, be moored, or seek refuge from storms.
- **Common sub-tags**: `name=*`, `operator=*`
- **Status**: approved

### `water=lock`

- **Element types**: area
- **Description**: The enclosed chamber of a canal lock where the water level can be raised or lowered to move vessels between sections of a waterway at different elevations.
- **Common sub-tags**: `name=*`, `lock=*`
- **Status**: approved

### `water=moat`

- **Element types**: area
- **Description**: A deep, wide water-filled ditch surrounding a fortified structure such as a castle, used historically as a defensive barrier.
- **Common sub-tags**: `name=*`
- **Status**: approved

### `water=pond`

- **Element types**: area
- **Description**: A standing body of water, usually man-made and smaller than a lake. Often created for ornamental, agricultural, or wildlife purposes.
- **Common sub-tags**: `name=*`, `intermittent=yes`
- **Status**: approved

### `water=reflecting_pool`

- **Element types**: area
- **Description**: A shallow garden or park water feature with a calm, flat surface designed to produce reflections of surrounding structures or landscapes.
- **Common sub-tags**: `name=*`
- **Status**: approved

### `water=reservoir`

- **Element types**: area
- **Description**: An artificial body of water formed by constructing a dam across a natural watercourse to store water for drinking, irrigation, power generation, or flood control.
- **Common sub-tags**: `name=*`, `operator=*`
- **Status**: approved

### `water=wastewater`

- **Element types**: area
- **Description**: A clarifier or settling basin that is part of a wastewater treatment plant, used to separate solids from effluent during the treatment process.
- **Common sub-tags**: `name=*`, `operator=*`
- **Status**: approved

---

### Obsolete Values

The following values are no longer recommended:

- `water=intermittent` — use `intermittent=yes` as a sub-tag instead
- `water=tidal` — use `tidal=yes` as a sub-tag instead
- `water=cove` / `water=bay` — use `natural=bay` instead

# Key: `power` — Power Infrastructure

> Source: https://wiki.openstreetmap.org/wiki/Key:power

## Description

The `power` key identifies a wide range of facilities and features that relate to the generation and distribution of electrical power, including power lines, power generation equipment, pylons, and substations. It is applicable to nodes, ways, areas, and relations depending on the specific value used.

## Values

### `power=cable`

- **Element types**: way
- **Description**: An insulated cable carrying electrical power, such as transmission or distribution cables located underground, undersea, or overground. Distinguished from `power=line` (overhead) and `power=minor_line` (smaller poles) by its insulated and often buried nature.
- **Common sub-tags**: `voltage=*`, `location=*` (underground / indoor / underwater / overground / overhead), `cables=*`, `circuits=*`, `operator=*`, `name=*`, `ref=*`
- **Status**: de facto

### `power=catenary_mast`

- **Element types**: node
- **Description**: A pole supporting the overhead wires used to supply electricity to vehicles equipped with a pantograph, such as trams and trains.
- **Common sub-tags**: `structure=*` (lattice / frame / h-beam / trunk / spun / pipe), `material=*`, `catenary_mast:supporting=*` (cantilever / head_span / portal / lateral), `catenary_mast:attachment=*` (anchor / tensioning_only), `tensioning=*` (weights / hydraulic / spring / coil / fixed), `ref=*`, `switch=*`, `insulator=*`
- **Status**: approved

### `power=compensator`

- **Element types**: node, area
- **Description**: A static power device used to ensure power quality and electrical network resilience. These components manage reactive power and voltage quality in electrical grids.
- **Common sub-tags**: `compensator=*`, `voltage=*`, `rating=*`, `frequency=*`, `operator=*`, `location=*`, `phases=*`, `cables=*`
- **Status**: approved

### `power=converter`

- **Element types**: node, area
- **Description**: A device to convert power between alternating and direct current electrical power, often but not only over high voltage networks (HVDC links).
- **Common sub-tags**: `converter=*` (lcc / vsc / back-to-back / motor_generator), `voltage=*`, `location=*`, `operator=*`, `phases=*`, `poles=*`, `frequency=*`, `rating=*`, `name=*`, `ref=*`
- **Status**: approved

### `power=generator`

- **Element types**: node, way, area
- **Description**: A device which converts one form of energy to another, for example an electrical generator. Can be a standalone distributed-generation unit (typically under 1 MW) or part of a larger power plant tagged with `power=plant`.
- **Common sub-tags**: `generator:source=*` (wind / solar / biomass / hydro / nuclear / etc.), `generator:method=*`, `generator:type=*`, `generator:output:electricity=*`, `name=*`, `operator=*`, `frequency=*`
- **Status**: approved

### `power=heliostat`

- **Element types**: node
- **Description**: A mirror of a heliostat device that reflects sunlight toward a predetermined target. Used primarily as individual mirrors within concentrating solar thermal power plants.
- **Common sub-tags**: (used within `power=plant` areas tagged `plant:source=solar`, `plant:method=thermal`)
- **Status**: de facto

### `power=insulator`

- **Element types**: node, way
- **Description**: An electrical insulator which connects a power line to a support structure and prevents grounding. Documents devices that anchor overhead power lines to buildings, portals, bridges, or other infrastructure.
- **Common sub-tags**: `operator=*`, `line_attachment=*`, `line_management=*`, `line_arrangement=*`, `ref=*`, `height=*`
- **Status**: in use

### `power=line`

- **Element types**: way
- **Description**: High-voltage power lines used for power transmission, usually supported by towers or pylons. Lines primarily on towers are typically tagged `power=line`; those on smaller poles use `power=minor_line`.
- **Common sub-tags**: `voltage=*`, `cables=*`, `circuits=*`, `operator=*`, `wires=*` (single / double / triple), `frequency=*`
- **Status**: de facto

### `power=minor_line`

- **Element types**: way
- **Description**: Minor power lines forming the distribution grid, usually carried by poles rather than towers. Implies `location=overhead`. Used to help map renderers distinguish power line sizes.
- **Common sub-tags**: `voltage=*`, `cables=*`, `frequency=*`, `circuits=*`, `operator=*`, `wires=*`, `ref=*`
- **Status**: de facto

### `power=plant`

- **Element types**: area, relation
- **Description**: An industrial facility where power (electricity, useful heat, biogas) is produced by individual power generator units. Dispersed plants (wind farms, hydroelectric) use relations with `type=site`; enclosed plants (nuclear, coal, solar) use area boundaries.
- **Common sub-tags**: `plant:source=*` (coal / gas / solar / wind / nuclear / hydro / etc.), `plant:method=*`, `plant:output:electricity=*`, `operator=*`, `name=*`, `start_date=*`, `wikidata=*`
- **Status**: approved

### `power=pole`

- **Element types**: node
- **Description**: A single pole supporting power lines, often made of wood, steel, or concrete and designed to carry minor power lines. Implies `man_made=utility_pole` and `utility=power`.
- **Common sub-tags**: `material=*` (wood / concrete / steel), `design=*` (one-level / two-level / monopolar / flag), `line_attachment=*` (suspension / pin / anchor), `line_management=*` (termination / branch / transition), `operator=*`, `height=*`, `ref=*`
- **Status**: de facto

### `power=portal`

- **Element types**: node, way
- **Description**: A supporting structure for power lines, composed of vertical legs with cables between them attached to a horizontal crossarm. Commonly found at the entry/exit points of substations.
- **Common sub-tags**: `operator=*`, `height=*`, `structure=*` (lattice / tubular / solid), `design=*`, `material=*`, `colour=*`, `ref=*`
- **Status**: de facto

### `power=substation`

- **Element types**: node, area
- **Description**: A facility which controls the flow of electricity in a power network using transformers, switchgear, or compensators. Node use is appropriate for very small substations; area is recommended for most cases.
- **Common sub-tags**: `substation=*` (transmission / distribution / etc.), `voltage=*`, `location=*` (outdoor / indoor), `operator=*`, `name=*`, `ref=*`, `gas_insulated=*`
- **Status**: approved

### `power=switch`

- **Element types**: node
- **Description**: A device which allows electrical network operators to power up and down lines and transformers in substations or along the power grid.
- **Common sub-tags**: `switch=*` (circuit_breaker / disconnector / earthing / mechanical), `location=*` (outdoor / indoor / underground / platform / rooftop), `voltage=*`, `cables=*`, `operator=*`, `gas_insulated=yes`, `ref=*`
- **Status**: approved

### `power=switchgear`

- **Element types**: area
- **Description**: A switchgear comprising one or more busbar assemblies and a number of bays each connecting a circuit to the busbar assembly. Intended for use when detailed component mapping is not feasible.
- **Common sub-tags**: `operator=*`, `voltage=*`, `location=*` (indoor / outdoor), `gas_insulated=yes`, `building=industrial`
- **Status**: approved

### `power=terminal`

- **Element types**: node
- **Description**: A point of connection where an overhead power line ends on a building or wall, for example when connecting it to an indoor substation.
- **Common sub-tags**: `line_attachment=anchor`, `line_management=termination`, `operator=*`, `height=*`, `line_arrangement=*`, `ref=*`
- **Status**: de facto

### `power=tower`

- **Element types**: node
- **Description**: A tower or pylon carrying high voltage electricity cables. Often constructed from steel latticework, but tubular or solid pylons are also used.
- **Common sub-tags**: `material=*` (steel / wood / concrete / aluminium / composite), `structure=*` (lattice / tubular / solid), `design=*` (one-level / two-level / donau / three-level / barrel / asymmetric / triangle / flag / delta / y-frame / x-frame / h-frame / portal / bipole / monopolar / etc.), `height=*`, `ref=*`, `operator=*`, `line_attachment=*` (anchor / suspension / pin), `line_management=*` (termination / branch / split / cross / transpose / transition / straight)
- **Status**: de facto

### `power=transformer`

- **Element types**: node
- **Description**: A device for stepping up or down electric voltage. Large power transformers are typically located inside substations; pole-mounted transformers should have the pole tagged as `power=pole` with `transformer=distribution`.
- **Common sub-tags**: `transformer=*`, `operator=*`, `frequency=*`, `location=*`, `rating=*`, `windings=*`
- **Status**: approved

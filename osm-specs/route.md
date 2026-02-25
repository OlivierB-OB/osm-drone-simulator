# Key: `route` — Route Relations

> Source: https://wiki.openstreetmap.org/wiki/Key:route

## Description

The `route` key describes a customary or regular line of passage or travel, often predetermined and publicized. Routes consist of paths repeatedly used by people or vehicles, such as ferry crossings, numbered roads, bus lines, or cycling routes. The key is primarily used on relations with `type=route`; the relation members are the ways making up the route, and the `route=*` tag specifies the type.

## Values

Note: `route=*` is used almost exclusively on **relations** (`type=route`). Individual ways or nodes are not tagged with `route=*` directly.

### `route=bicycle`

- **Element types**: relation
- **Description**: A signposted or otherwise officially designated cycling route. Includes national, regional, and local cycle networks.
- **Common sub-tags**: `network=*` (icn / ncn / rcn / lcn), `ref=*`, `name=*`, `operator=*`, `distance=*`, `colour=*`
- **Status**: de facto

### `route=bus`

- **Element types**: relation
- **Description**: A bus transit route operated on a scheduled service. Members include the road ways the bus travels and stop/platform nodes.
- **Common sub-tags**: `ref=*`, `name=*`, `operator=*`, `network=*`, `from=*`, `to=*`, `via=*`, `colour=*`
- **Status**: de facto

### `route=canoe`

- **Element types**: relation
- **Description**: A paddling route for canoes or kayaks along waterways, marked or documented for recreational use.
- **Common sub-tags**: `name=*`, `ref=*`, `operator=*`, `distance=*`
- **Status**: de facto

### `route=detour`

- **Element types**: relation
- **Description**: A temporary or permanent detour route, typically signed as an alternative when a road is closed or under construction.
- **Common sub-tags**: `name=*`, `ref=*`
- **Status**: de facto

### `route=ferry`

- **Element types**: way, relation
- **Description**: A water transport route operated by a ferry, either publicly scheduled or self-operated (e.g., cable ferry). Can be a single way for simple crossings or a relation for routes with multiple stops.
- **Common sub-tags**: `operator=*`, `name=*`, `ref=*`, `from=*`, `to=*`, `duration=*`, `fee=yes/no`
- **Status**: de facto

### `route=foot`

- **Element types**: relation
- **Description**: A signposted pedestrian or walking route. Covers urban walking trails, long-distance footpaths, and named walking itineraries.
- **Common sub-tags**: `network=*` (iwn / nwn / rwn / lwn), `ref=*`, `name=*`, `operator=*`, `distance=*`, `colour=*`
- **Status**: de facto

### `route=hiking`

- **Element types**: relation
- **Description**: A marked hiking trail, typically in natural or rural settings. Overlaps with `route=foot` but specifically implies off-road or mountain hiking context.
- **Common sub-tags**: `network=*` (iwn / nwn / rwn / lwn), `ref=*`, `name=*`, `operator=*`, `distance=*`, `colour=*`, `sac_scale=*`
- **Status**: de facto

### `route=horse`

- **Element types**: relation
- **Description**: An equestrian route designated or suitable for horse riding, including bridle paths and long-distance riding trails.
- **Common sub-tags**: `name=*`, `ref=*`, `network=*`, `distance=*`, `colour=*`
- **Status**: de facto

### `route=inline_skates`

- **Element types**: relation
- **Description**: A route designated or suitable for inline skating, typically on smooth paved surfaces.
- **Common sub-tags**: `name=*`, `ref=*`, `distance=*`
- **Status**: de facto

### `route=light_rail`

- **Element types**: relation
- **Description**: A light rail service route, grouping the track ways and stops of a specific light rail line.
- **Common sub-tags**: `ref=*`, `name=*`, `operator=*`, `network=*`, `from=*`, `to=*`, `colour=*`
- **Status**: de facto

### `route=mtb`

- **Element types**: relation
- **Description**: A mountain biking route, typically off-road and signed or documented for recreational cycling.
- **Common sub-tags**: `network=*` (icn / ncn / rcn / lcn), `ref=*`, `name=*`, `distance=*`, `colour=*`, `mtb:scale=*`
- **Status**: de facto

### `route=nordic_walking`

- **Element types**: relation
- **Description**: A route designated for nordic walking (walking with poles), often sharing paths with hiking routes.
- **Common sub-tags**: `name=*`, `ref=*`, `distance=*`, `colour=*`
- **Status**: de facto

### `route=pipeline`

- **Element types**: relation
- **Description**: A pipeline infrastructure corridor (gas, oil, water, etc.). Controversial as a route value since pipelines are infrastructure rather than travel routes; some mappers prefer tagging individual pipeline ways directly.
- **Common sub-tags**: `name=*`, `operator=*`, `substance=*`
- **Status**: de facto (controversial)

### `route=power`

- **Element types**: relation
- **Description**: A power line corridor grouping the ways of a power transmission line. Controversial for the same reason as `route=pipeline`; alternative is to tag individual `power=line` ways directly.
- **Common sub-tags**: `name=*`, `operator=*`, `voltage=*`
- **Status**: de facto (controversial)

### `route=railway`

- **Element types**: relation
- **Description**: A railway infrastructure route grouping the track ways of a named or numbered rail line. Distinct from a specific train service (use `route=train` for services).
- **Common sub-tags**: `ref=*`, `name=*`, `operator=*`, `network=*`
- **Status**: de facto

### `route=road`

- **Element types**: relation
- **Description**: A numbered or named road route grouping the carriageway ways of a road. Used for national highways, motorways, and regional road numbers that span multiple way segments.
- **Common sub-tags**: `ref=*`, `name=*`, `network=*`, `operator=*`
- **Status**: de facto

### `route=running`

- **Element types**: relation
- **Description**: A running or jogging route, typically a signed circuit or trail used for recreational running.
- **Common sub-tags**: `name=*`, `ref=*`, `distance=*`, `colour=*`
- **Status**: de facto

### `route=ski`

- **Element types**: relation
- **Description**: A ski route, covering both alpine (downhill) ski pistes and cross-country ski trails.
- **Common sub-tags**: `name=*`, `ref=*`, `piste:type=*`, `piste:difficulty=*`, `colour=*`
- **Status**: de facto

### `route=subway`

- **Element types**: relation
- **Description**: A subway (metro/underground) service route, grouping track ways and stations of a specific metro line.
- **Common sub-tags**: `ref=*`, `name=*`, `operator=*`, `network=*`, `from=*`, `to=*`, `colour=*`
- **Status**: de facto

### `route=train`

- **Element types**: relation
- **Description**: A train service route representing a specific scheduled train service. Members include the track ways and station nodes served by the service.
- **Common sub-tags**: `ref=*`, `name=*`, `operator=*`, `network=*`, `from=*`, `to=*`, `interval=*`
- **Status**: de facto

### `route=tracks`

- **Element types**: relation
- **Description**: A route for off-road tracks or unpaved roads, typically used for 4WD, ATV, or similar off-road vehicle routes.
- **Common sub-tags**: `name=*`, `ref=*`, `distance=*`
- **Status**: de facto

### `route=tram`

- **Element types**: relation
- **Description**: A tram or streetcar service route, grouping the track ways and stops of a specific tram line.
- **Common sub-tags**: `ref=*`, `name=*`, `operator=*`, `network=*`, `from=*`, `to=*`, `colour=*`
- **Status**: de facto

### `route=trolleybus`

- **Element types**: relation
- **Description**: A trolleybus line route (electric bus drawing power from overhead wires), grouping road ways and stop nodes.
- **Common sub-tags**: `ref=*`, `name=*`, `operator=*`, `network=*`, `from=*`, `to=*`, `colour=*`
- **Status**: de facto

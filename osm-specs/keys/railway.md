# Key: `railway` — Railway Infrastructure

> Source: https://wiki.openstreetmap.org/wiki/Key:railway

## Description

The `railway=*` key is used to tag rails and infrastructure for many kinds of railways including light rail, mainline freight and industrial railways, metros, monorails, and trams. It is one of the most broadly applicable keys in OSM, covering both the physical track (as ways) and associated point features such as stations, signals, and crossings (as nodes).

## Values

### Rails

#### `railway=rail`

- **Element types**: way
- **Description**: Full-sized passenger or freight train tracks in the standard gauge for the country. The most common value for mainline and intercity railways.
- **Status**: in use

#### `railway=light_rail`

- **Element types**: way
- **Description**: A higher-standard tram system, normally in its own dedicated right-of-way. Bridges the gap between heavy rail and street-running trams.
- **Status**: in use

#### `railway=narrow_gauge`

- **Element types**: way
- **Description**: Narrow-gauge passenger or freight train tracks (rail spacing less than standard gauge). Common in mountain regions and some industrial railways.
- **Status**: in use

#### `railway=tram`

- **Element types**: way
- **Description**: One or two carriage rail vehicle tracks, usually sharing the road with motor vehicles. Includes streetcars and most city tram networks.
- **Status**: in use

#### `railway=monorail`

- **Element types**: way
- **Description**: A railway with only a single rail, either above or below the vehicle. Includes both straddle-beam and suspended monorail systems.
- **Status**: in use

#### `railway=miniature`

- **Element types**: way
- **Description**: Narrower than narrow gauge; typically carries passengers at reduced scale in parks or tourist attractions.
- **Status**: in use

#### `railway=funicular`

- **Element types**: way
- **Description**: Cable-driven inclined railways on a steep slope, where two cars counterbalance each other.
- **Status**: in use

#### `railway=preserved`

- **Element types**: way
- **Description**: A historic or heritage railway preserved and operated as a tourist attraction. May use `railway:preserved=yes` as an alternative to distinguish preserved sections of otherwise active lines.
- **Status**: in use

### Specific Track Conditions

#### `railway=abandoned`

- **Element types**: way
- **Description**: A former railway which has been abandoned and the track removed. The route corridor may still be visible in the landscape.
- **Status**: in use

#### `railway=construction`

- **Element types**: way
- **Description**: A railway currently under construction. Use alongside `construction=*` to specify the type of railway being built.
- **Status**: in use

#### `railway=disused`

- **Element types**: way
- **Description**: A railway no longer in regular use but where the track and infrastructure remain physically in place.
- **Status**: in use

#### `railway=proposed`

- **Element types**: way
- **Description**: A railway being formally proposed but where construction has not yet started. Use alongside `proposed=*` to specify the intended railway type.
- **Status**: in use

### Facilities

#### `railway=station`

- **Element types**: node, area
- **Description**: A railway passenger and/or cargo station. Node placement is acceptable for simple cases; an area boundary is preferred when the station footprint is known.
- **Common sub-tags**: `name=*`, `operator=*`, `network=*`, `ref=*`, `uic_ref=*`
- **Status**: in use

#### `railway=halt`

- **Element types**: node
- **Description**: A small station without switches (points), typically served by a subset of trains. Smaller and simpler than a full station.
- **Common sub-tags**: `name=*`, `operator=*`
- **Status**: in use

#### `railway=platform`

- **Element types**: way, area
- **Description**: Shows where actual platforms are located alongside tracks. Used for the physical platform structure rather than the stop position.
- **Common sub-tags**: `public_transport=platform`, `name=*`, `ref=*`
- **Status**: in use

#### `railway=subway_entrance`

- **Element types**: node
- **Description**: The entrance to a subway station, placed at street level at the top of stairs or escalators leading to the underground station.
- **Common sub-tags**: `name=*`, `ref=*`, `wheelchair=yes/no`
- **Status**: in use

### Crossings and Signals

#### `railway=crossing`

- **Element types**: node
- **Description**: A point where pedestrians may cross a railway track, typically at grade. Distinct from a level crossing where road vehicles cross.
- **Status**: in use

#### `railway=level_crossing`

- **Element types**: node
- **Description**: A point where rails and a road cross at the same level (at grade). The node is placed on both the railway way and the road way.
- **Common sub-tags**: `crossing=traffic_signals`, `barrier=*`, `supervised=yes/no`
- **Status**: in use

#### `railway=railway_crossing`

- **Element types**: node
- **Description**: A point where two railway lines cross each other with no interconnection (no switches). The tracks pass over/under each other or cross at grade without the ability to transfer between lines.
- **Status**: in use

#### `railway=stop`

- **Element types**: node
- **Description**: Marks the exact position where trains stop at a station, placed on the track. Used as a more precise alternative to tagging the station node alone.
- **Common sub-tags**: `public_transport=stop_position`, `name=*`
- **Status**: in use

#### `railway=buffer_stop`

- **Element types**: node
- **Description**: A device at the end of a terminal track that physically stops the train from going further. Also known as a bumper or buffer.
- **Status**: in use

#### `railway=derail`

- **Element types**: node
- **Description**: A device used to prevent the fouling of a rail track by causing any unauthorized or runaway vehicles to derail before reaching a protected section.
- **Status**: in use

### Other Infrastructure

#### `railway=turntable`

- **Element types**: node, area
- **Description**: Used for changing the direction that a locomotive or part of a train is pointing. Commonly found in depots and roundhouses.
- **Status**: in use

#### `railway=roundhouse`

- **Element types**: area
- **Description**: A semicircular building with many stalls for storing and servicing locomotives, typically arranged around a turntable.
- **Status**: in use

#### `railway=traverser`

- **Element types**: node, area
- **Description**: A device used for moving trains sideways between parallel tracks, as an alternative to a turntable. Also called a transfer table.
- **Status**: in use

#### `railway=wash`

- **Element types**: node, area
- **Description**: A railroad carriage or car wash facility where rolling stock is automatically cleaned.
- **Status**: in use

## Common Track Attribute Tags

These tags are added to `railway=*` ways to describe technical properties of the track:

- `electrified=*` — Power supply type: `contact_line`, `rail`, `yes`, `no`
- `voltage=*` — The voltage (in volts) with which a line is electrified (e.g., `voltage=25000`)
- `frequency=*` — The frequency (in Hz) with which a line is electrified (e.g., `frequency=50`)
- `gauge=*` — The rail gauge in millimetres (e.g., `gauge=1435` for standard gauge)
- `tracks=*` — Number of parallel tracks in close proximity (e.g., `tracks=2`)
- `service=*` — Track classification: `crossover`, `siding`, `spur`, `yard`
- `usage=*` — Traffic type: `main`, `branch`, `industrial`, `military`, `tourism`, `scientific`, `test`
- `bridge=yes` — Railway on an elevated structure
- `tunnel=yes` — Railway running below ground
- `embankment=yes` — Railway raised significantly above surrounding ground
- `cutting=yes` — Railway running significantly below ground level in an open cut

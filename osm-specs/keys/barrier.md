# Key: `barrier` — Barrier

> Source: https://wiki.openstreetmap.org/wiki/Key:barrier

## Description

The `barrier=*` key describes man-made structures that physically restrict or control movement of people, animals, or vehicles. Barriers are mapped on nodes (point obstacles crossing a way), ways (linear structures), or areas (enclosed perimeters). The tag covers everything from simple fences and walls to complex access-control infrastructure like toll booths and border crossings.

## Values

### `barrier=wall`

- **Element types**: way / area
- **Description**: A free-standing solid structure designed to restrict or prevent movement across a boundary. Distinguished from a fence by solid, opaque construction (brick, stone, concrete).
- **Common sub-tags**: `material=*`, `height=*`
- **Status**: approved

### `barrier=fence`

- **Element types**: node / way
- **Description**: A structure supported by posts driven into the ground, distinguished from a wall by the lightness of its construction. Includes chain-link, wood-panel, wire, and similar lightweight barriers.
- **Common sub-tags**: `fence_type=*`, `material=*`, `height=*`
- **Status**: approved

### `barrier=hedge`

- **Element types**: way / area
- **Description**: A line of shrubs or bushes planted closely together to form a barrier or boundary. May be trimmed or natural.
- **Common sub-tags**: `material=*`, `height=*`
- **Status**: approved

### `barrier=gate`

- **Element types**: node / way
- **Description**: An entrance that can be opened or closed to allow or deny passage through a barrier. Includes farm gates, garden gates, and security gates.
- **Common sub-tags**: `access=*`, `locked=*`, `operator=*`
- **Status**: approved

### `barrier=lift_gate`

- **Element types**: node
- **Description**: A bar or pole pivoted at one end that is raised to block vehicular access through a controlled point. Common at car parks, level crossings, and toll plazas.
- **Common sub-tags**: `access=*`, `locked=*`
- **Status**: approved

### `barrier=motorcycle_barrier`

- **Element types**: node
- **Description**: A barrier installed along paths specifically to prevent motorcycle and moped access while generally allowing cyclists and pedestrians to pass.
- **Status**: approved

### `barrier=jersey_barrier`

- **Element types**: node / way
- **Description**: Heavy prefabricated interlocking concrete blocks used to create a temporary or permanent barrier. Common at construction sites, road works, and security cordons.
- **Common sub-tags**: `material=*`
- **Status**: approved

### `barrier=cable_barrier`

- **Element types**: way
- **Description**: A roadside or median barrier made of steel wire ropes mounted on weak posts designed to absorb vehicle impacts. Common on motorway medians.
- **Status**: approved

### `barrier=city_wall`

- **Element types**: way / area
- **Description**: A fortification used to defend a city or settlement from potential aggressors. Usually of historic significance.
- **Common sub-tags**: `historic=*`, `height=*`
- **Status**: approved

### `barrier=retaining_wall`

- **Element types**: way
- **Description**: A wall built to retain the lateral pressure of soil, preventing erosion or slope collapse. Found along embankments, terraces, and cuttings.
- **Common sub-tags**: `material=*`, `height=*`
- **Status**: approved

### `barrier=guard_rail`

- **Element types**: way
- **Description**: A crash barrier (also called guard rail or safety barrier) installed along roadsides and bridges to prevent vehicles from leaving the carriageway.
- **Status**: approved

### `barrier=ditch`

- **Element types**: way
- **Description**: A trench, ditch, or ravine that is not easily crossed, especially not on foot. Functions as a barrier by virtue of its physical form rather than a constructed structure.
- **Common sub-tags**: `waterway=*`
- **Status**: approved

### `barrier=handrail`

- **Element types**: way
- **Description**: A rail designed to be grasped by the hand to provide stability or support, typically along stairs, ramps, or elevated walkways. Not primarily a traffic barrier.
- **Status**: approved

### `barrier=entrance`

- **Element types**: node
- **Description**: A gap in a linear barrier where passage is possible without any restricting structure. Implies `access=yes`.
- **Status**: approved

### `barrier=stile`

- **Element types**: node
- **Description**: A structure that allows pedestrians to cross a wall or fence but never actually opens the barrier. Usually a step or ladder arrangement.
- **Status**: approved

### `barrier=kissing_gate`

- **Element types**: node
- **Description**: A gate that allows people to cross but prevents livestock from passing. The gate swings into a small enclosed space that a person can enter but an animal cannot.
- **Status**: approved

### `barrier=swing_gate`

- **Element types**: node
- **Description**: A gate that rotates sidewards to open, intended to prevent cars from accessing a road while allowing pedestrians and cyclists.
- **Common sub-tags**: `access=*`
- **Status**: approved

### `barrier=sliding_gate`

- **Element types**: node
- **Description**: A gate that opens sideways by sliding along a track, usually automatic. Common at industrial premises and car parks.
- **Common sub-tags**: `access=*`
- **Status**: approved

### `barrier=sliding_beam`

- **Element types**: node
- **Description**: A barrier between the concept of a sliding gate and a lift gate; a horizontal beam that slides horizontally to open.
- **Status**: approved

### `barrier=turnstile`

- **Element types**: node
- **Description**: A mechanical gate that allows one person at a time to pass. Found at metro stations, stadiums, supermarkets, and other controlled-access venues.
- **Status**: approved

### `barrier=full-height_turnstile`

- **Element types**: node
- **Description**: A full-height access control turnstile that completely blocks passage until authorised, unlike waist-height turnstiles which can be vaulted.
- **Status**: approved

### `barrier=toll_booth`

- **Element types**: node / area
- **Description**: A point where a road usage toll or fee is collected. May be staffed or automated.
- **Common sub-tags**: `toll=*`, `charge=*`, `operator=*`
- **Status**: approved

### `barrier=border_control`

- **Element types**: node
- **Description**: A control point at an international border where passports or other forms of identification are checked.
- **Status**: approved

### `barrier=cattle_grid`

- **Element types**: node
- **Description**: A grid of bars set into the road surface that allows wheeled vehicles to cross but prevents hoofed animals from doing so.
- **Status**: approved

### `barrier=bump_gate`

- **Element types**: node
- **Description**: A gate that can be pushed open by a vehicle's bumper but that closes after passage, preventing return without authorisation.
- **Status**: approved

### `barrier=bus_trap`

- **Element types**: node
- **Description**: A device that prevents non-bus vehicles from entering bus-only lanes or roads while allowing buses to pass unimpeded.
- **Status**: approved

### `barrier=height_restrictor`

- **Element types**: node
- **Description**: A horizontal bar or overhead structure that prevents vehicles exceeding a maximum height from passing. Common at car parks and low bridges.
- **Common sub-tags**: `maxheight=*`
- **Status**: approved

### `barrier=spikes`

- **Element types**: node
- **Description**: Spikes on the ground (often retractable) that prevent unauthorised access by puncturing tyres of vehicles attempting to cross.
- **Status**: approved

### `barrier=wedge`

- **Element types**: node
- **Description**: A wedge-shaped barrier that rises out of the ground to block traffic, typically automated and used for high-security access control.
- **Status**: approved

### `barrier=sump_buster`

- **Element types**: node
- **Description**: A concrete slab or steel structure designed to prevent passage of two-tracked vehicles (e.g. cars) while allowing motorcycles and bicycles to pass.
- **Status**: approved

### `barrier=planter`

- **Element types**: node
- **Description**: A plant box or decorative container that has the primary purpose of preventing large vehicles from passing. Used in pedestrianised areas for anti-vehicle security.
- **Status**: approved

### `barrier=parking_lock`

- **Element types**: node
- **Description**: A foldable barrier installed in a parking spot that prevents unauthorised parking. Raised when the space is reserved; lowered by the authorised user.
- **Status**: approved

### `barrier=bar`

- **Element types**: node
- **Description**: A fixed horizontal bar that blocks motor vehicles but can usually be bypassed by pedestrians and cyclists.
- **Status**: approved

### `barrier=barrier_board`

- **Element types**: node
- **Description**: A barrier board or sign board used to restrict the passage along a way or to block off an area (e.g. road closed signs with physical boards).
- **Status**: approved

### `barrier=rope`

- **Element types**: node / way
- **Description**: A flexible barrier made of fibres twisted together, often more symbolic than physically preventing passage. Used at queues, perimeters, and ceremonial areas.
- **Status**: approved

### `barrier=log`

- **Element types**: node / way
- **Description**: A passage barred by a log (trunk of a tree), either fallen naturally or placed deliberately. Partially blocks cyclists and completely blocks vehicles.
- **Status**: approved

### `barrier=tank_trap`

- **Element types**: node / way
- **Description**: Static anti-tank obstacles designed to impede or destroy military vehicles. Includes Czech hedgehogs, dragon's teeth, and similar structures.
- **Common sub-tags**: `tank_trap=*`
- **Status**: approved

### `barrier=tyres`

- **Element types**: node / way
- **Description**: A crash barrier made from tyres stacked or wired together, absorbing impact energy. Used at race tracks and informal road barriers.
- **Status**: approved

### `barrier=delineator_kerb`

- **Element types**: way
- **Description**: A low linear barrier hindering crossing by wheeled vehicles, used to separate traffic lanes or delineate road edges.
- **Status**: approved

### `barrier=armadillo`

- **Element types**: way
- **Description**: Small, mountable rubber bumps used to separate cycle lanes from traffic or keep traffic out of restricted areas.
- **Status**: approved

### `barrier=hampshire_gate`

- **Element types**: node
- **Description**: A section of wire fence which can be removed temporarily to allow passage, then replaced. Common in agricultural settings.
- **Common sub-tags**: `access=*`
- **Status**: approved

### `barrier=horse_stile`

- **Element types**: node
- **Description**: A structure that allows pedestrians and horses to cross a fence or wall but prevents motorcycles and livestock from passing.
- **Status**: approved

### `barrier=kent_carriage_gap`

- **Element types**: node
- **Description**: A gap designed to prevent motorised vehicles while allowing most horse-drawn carriages to pass. A historic feature found on bridle paths.
- **Status**: approved

### `barrier=wicket_gate`

- **Element types**: node
- **Description**: A pedestrian door or gate built into a larger door or into a wall or fence, allowing people to pass without opening the main gate.
- **Status**: approved

### `barrier=sally_port`

- **Element types**: node
- **Description**: A covered gate with two doors allowing passage through thick or city walls while maintaining security. Historic military architecture feature.
- **Status**: approved

### `barrier=coupure`

- **Element types**: node / way
- **Description**: A cut through a flood protection feature (levee or embankment) that can be readily made flood-tight if required. Balances access with flood defence.
- **Status**: approved

### `barrier=floating_boom`

- **Element types**: node / way
- **Description**: A barrier designed to float on the surface of a body of water to contain floating material (oil spills, debris) or restrict waterway access.
- **Status**: approved

### `barrier=yes`

- **Element types**: node / way / area
- **Description**: A barrier whose specific type cannot be determined, typically used when mapping from aerial imagery alone. Should be refined with a specific value when possible.
- **Status**: approved

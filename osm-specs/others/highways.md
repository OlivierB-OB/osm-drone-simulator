# OpenStreetMap Highway Types Reference

Source: https://wiki.openstreetmap.org/wiki/Highways

## Primary Road Classifications

### Motorways
- **Tag**: `highway=motorway`
- **Definition**: Legally defined (sign posted) which usually excludes slow traffic and at grade intersections
- **Usage**: Controlled-access highways with minimal road quality requirements

### Trunk Roads
- **Tag**: `highway=trunk`
- **Definition**: Major roads of high importance within the road network
- **Usage**: Primary routes connecting regions

### Primary Roads
- **Tag**: `highway=primary`
- **Definition**: Roads of significant importance in the road network
- **Usage**: Note that quality varies drastically between regions

### Secondary Roads
- **Tag**: `highway=secondary`
- **Definition**: Roads of moderate importance
- **Usage**: Secondary routes through regions

### Tertiary Roads
- **Tag**: `highway=tertiary`
- **Definition**: Roads of lower importance than secondary
- **Usage**: Connecting smaller settlements

### Unclassified Roads
- **Tag**: `highway=unclassified`
- **Definition**: Roads not fitting higher categories but with some traffic importance
- **Usage**: General local roads; note the name is "confusing" as it means classified but unranked

### Residential Roads
- **Tag**: `highway=residential`
- **Definition**: Roads of importance not qualifying them for any groups above, with residences along its side
- **Usage**: Streets within residential areas

### Service Roads
- **Tag**: `highway=service`
- **Definition**: Roads which specifically exist to provide access for trash collection or parking
- **Usage**: Campground roads and service access routes

## Special Road Types

### Living Streets
- **Tag**: `highway=living_street`
- **Definition**: Special variant of residential roads
- **Usage**: Traffic-calmed areas prioritizing pedestrians

### Tracks
- **Tag**: `highway=track`
- **Definition**: Roads used to access roads and fields, and not falling into any of groups above
- **Usage**: Agricultural and forestry access routes

### Pedestrian Routes
- **Tag**: `highway=pedestrian`
- **Definition**: Pedestrianized roads (roads which have been converted to pedestrian walkways)
- **Usage**: Car-free zones converted to pedestrian use

## Path Types

### Footways
- **Tag**: `highway=footway`
- **Definition**: Paths designated primarily for pedestrian use
- **Usage**: Walking paths with legal access rights

### Cycleways
- **Tag**: `highway=cycleway`
- **Definition**: Paths designated for bicycle use
- **Usage**: Bicycle routes with established access rights

### Bridleways
- **Tag**: `highway=bridleway`
- **Definition**: Paths designated for horse riding
- **Usage**: Equestrian routes with legal riding rights

### Generic Paths
- **Tag**: `highway=path`
- **Definition**: A generic path used by pedestrians, small vehicles, for animal riding or livestock walking
- **Usage**: Non-specific multi-use paths

### Steps
- **Tag**: `highway=steps`
- **Definition**: Staircases for pedestrian movement
- **Usage**: Pedestrian routes with elevation changes

## Link Roads

### Highway Link Variants
- **Types**: `motorway_link`, `trunk_link`, `primary_link`, `secondary_link`, `tertiary_link`
- **Usage**: Connecting ramps between classified roads and intersections
- **Note**: No unclassified_link variant exists

## Construction & Proposed

### Under Construction
- **Tag**: `highway=construction` with `construction=*` specifying type
- **Usage**: Roads closed for development; can specify expected final classification

### Proposed Roads
- **Tag**: `highway=proposed` with `proposed=*` specifying type
- **Usage**: Planned future routes not yet built

## Additional Classifications

### Road (Temporary)
- **Tag**: `highway=road`
- **Definition**: Roads for which the classification is not known
- **Usage**: Placeholder until proper survey and classification

### Informal Paths
- **Tag**: `highway=path` with `informal=yes`
- **Definition**: Pathways created through common usage without official designation
- **Usage**: User-created routes across open areas

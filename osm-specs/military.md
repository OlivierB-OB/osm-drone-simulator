# Key: `military` — Military

> Source: https://wiki.openstreetmap.org/wiki/Key:military

## Description

The `military` key is used to tag land areas, installations, and features used or controlled by military forces. It is a de facto standard, widely used and well-established in practice though not formally adopted. The key is typically combined with `landuse=military` on the same feature.

## Values

### `military=airfield`

- **Element types**: node / area
- **Description**: A place where military planes take off and land. Distinguishes military airfields from civilian airports; they typically handle smaller passenger volumes and lack customs/immigration facilities.
- **Common sub-tags**: `landuse=military` (required), `aeroway=aerodrome`, `name=*`, `operator=*`, `icao=*`, `iata=*`
- **Status**: de facto

### `military=ammunition`

- **Element types**: node / area
- **Description**: A military ammunition storage area where various types of munitions such as small arms, artillery, tank shells, missiles, bombs, and rockets are stored in heavily guarded zones.
- **Common sub-tags**: `landuse=military` (required), `military_service=*`, `operator=*`
- **Status**: in use

### `military=barracks`

- **Element types**: node / area
- **Description**: Buildings where military personnel live and sleep, typically part of a larger military base or installation.
- **Status**: in use

### `military=bunker`

- **Element types**: node / area
- **Description**: A military installation capable of withstanding an attack, which is currently used as a bunker. Encompasses reinforced command posts, weapons emplacements, warehouses, and civilian shelters. Differs from `building=bunker`, which covers structures originally built as bunkers but since repurposed.
- **Status**: de facto

### `military=checkpoint`

- **Element types**: node
- **Description**: A place where civilian visitors and vehicles will be checked by a military authority. Applies to permanent or long-term checkpoints controlling access to restricted areas or public highways under military supervision.
- **Status**: in use

### `military=danger_area`

- **Element types**: node / area
- **Description**: A restricted area posing a threat to life or property. Encompasses zones with inherent hazards or those hosting potentially harmful activities, such as military firing ranges, bombing ranges, or contaminated areas like nuclear accident sites.
- **Status**: de facto

### `military=launchpad`

- **Element types**: node / way
- **Description**: A launchpad used for military purposes, specifically for facilities related to missile deployments.
- **Status**: in use

### `military=naval_base`

- **Element types**: node / area
- **Description**: A naval base, navy base, or military port: a military base where warships and naval ships are docked when they have no active mission at sea or need to restock.
- **Status**: deprecated — use `military=base` + `military_service=navy` instead

### `military=nuclear_explosion_site`

- **Element types**: node / area
- **Description**: A nuclear weapons test site: a location where nuclear explosions occurred. Only mappable physical traces (such as craters) should be tagged; the events themselves are not mappable.
- **Status**: in use

### `military=obstacle_course`

- **Element types**: way / area
- **Description**: A military obstacle course: a series of challenging physical obstructions an individual or team must navigate, usually while being timed.
- **Status**: in use

### `military=office`

- **Element types**: node / area
- **Description**: Military offices such as general staff offices and military recruitment offices. Applies to locations where commanding officers and other military employees perform administrative work, including recruiting stations. If occupying substantial land, add `landuse=military`; if part of a larger base, tag the installation with `landuse=military` + `military=base`.
- **Common sub-tags**: `name=*`, `office=*`, `military_service=*`, `operator=*`
- **Status**: in use

### `military=range`

- **Element types**: node / area
- **Description**: An area where military personnel practice with their weapons, including firing ranges, bombing ranges, and artillery ranges.
- **Common sub-tags**: `landuse=military` (required)
- **Status**: de facto

### `military=training_area`

- **Element types**: area
- **Description**: A military training area or proving ground used for weapons testing, military technology experimentation, or tactical exercises. The British term is "training area"; the US equivalent is "proving ground."
- **Common sub-tags**: `landuse=military` (required)
- **Status**: in use

### `military=trench`

- **Element types**: node / way
- **Description**: A military trench: an excavation in the ground that is generally deeper than it is wide, dug as a barrier for military purposes such as trench warfare.
- **Status**: in use

### `military=yes`

- **Element types**: node / area
- **Description**: A generic tag indicating a military feature where a more specific value is not known or does not apply. Discouraged as it is too generic; a more specific value should be used whenever possible.
- **Status**: in use (discouraged)

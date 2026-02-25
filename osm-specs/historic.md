# Key: `historic` — Historic

> Source: https://wiki.openstreetmap.org/wiki/Key:historic

## Description

Used for describing various historic features such as structures, objects, and sites that have historical significance. The key applies to features that were built or used in the past and retain historical value. It covers a wide range of objects from ancient archaeological sites to more recent historical artefacts such as decommissioned vehicles and machinery.

## Values

### `historic=aircraft`

- **Element types**: node / area
- **Description**: A decommissioned aircraft which generally remains in one place, often converted into a tourist attraction, museum exhibit, or gate guardian. Applies to both military and non-military aircraft.
- **Status**: de facto

### `historic=aqueduct`

- **Element types**: way / area
- **Description**: A historic structure used to convey water, typically a bridge-like construction carrying a channel or pipe across a valley. Applies to both functioning aqueducts and ruins.
- **Status**: in use

### `historic=archaeological_site`

- **Element types**: node / way / area
- **Description**: A place in which evidence of past activity is preserved, such as an excavation site, ancient settlement, or location where artefacts have been found.
- **Common sub-tags**: `site_type=*`, `archaeological_site=*`
- **Status**: de facto

### `historic=battlefield`

- **Element types**: node / area
- **Description**: The site of a battle or military skirmish in the past. This could be on land or at sea. A node is placed near the battlefield's centre or an area is drawn to mark its perimeter.
- **Common sub-tags**: `name=*`, `start_date=*`, `historic:date=*`
- **Status**: approved

### `historic=boundary_stone`

- **Element types**: node
- **Description**: A historic physical marker that identifies a boundary, typically placed at critical points between countries or administrative divisions.
- **Status**: de facto

### `historic=building`

- **Element types**: node / area
- **Description**: An unspecified historic building. This is a non-specific designation when a building's particular historic category is not defined. More specific values such as `historic=castle` or `historic=church` are preferred.
- **Status**: de facto

### `historic=bunker`

- **Element types**: node / area
- **Description**: A historic military bunker or defensive fortification structure. Used for bunkers that are no longer in active military use and have historical significance.
- **Status**: de facto

### `historic=cannon`

- **Element types**: node
- **Description**: A historic or retired cannon that has become a tourist attraction or museum exhibit, typically located on forts or battlefields and remaining stationary.
- **Common sub-tags**: `name=*`, `cannon:type=*`, `direction=*`, `start_date=*`
- **Status**: in use

### `historic=castle`

- **Element types**: node / area
- **Description**: Various kinds of castles, palaces, fortresses, manors, stately homes, kremlins, shiros, and other residential and often fortified buildings, often from medieval times. Includes fortified residences of nobility, non-fortified palaces, and heavily fortified military structures.
- **Common sub-tags**: `castle_type=*`, `name=*`, `access=*`, `start_date=*`, `ruins=yes`
- **Status**: de facto

### `historic=castle_wall`

- **Element types**: way / area
- **Description**: A fortification surrounding the bailey of a castle. Often combined with `barrier=wall` + `wall=castle_wall`.
- **Status**: in use

### `historic=charcoal_pile`

- **Element types**: node / area
- **Description**: Still visible historic sites of charcoal piles. Typically a levelled circle or oval, usually 5 to 15 metres in diameter, commonly found in forested hilly areas of northern Europe.
- **Status**: de facto

### `historic=church`

- **Element types**: node / area
- **Description**: A church with historical value. Often combined with `amenity=place_of_worship` and `building=church` for more complete information.
- **Common sub-tags**: `religion=*`, `denomination=*`
- **Status**: de facto

### `historic=city_gate`

- **Element types**: node / area
- **Description**: A gate which is or was set in a city wall. May also represent gate towers that functioned as part of city fortifications.
- **Common sub-tags**: `name=*`, `start_date=*`
- **Status**: de facto

### `historic=farm`

- **Element types**: node / area
- **Description**: A historical farm, kept in its original state. The tag marks farms of historical significance that retain their original character.
- **Common sub-tags**: `name=*`, `website=*`
- **Status**: in use

### `historic=fort`

- **Element types**: node / area
- **Description**: A stand-alone defensive structure which differs from a castle in that there is no permanent residence. Forts are generally more modern than fortresses and may have temporary housing for crew members.
- **Common sub-tags**: `name=*`, `start_date=*`, `ruins=yes`
- **Status**: de facto

### `historic=gallows`

- **Element types**: node / area
- **Description**: Remains of a gallows, a structure designed for capital punishment by hanging. Most surviving examples retain only stone or brick foundations after wooden components deteriorated.
- **Status**: in use

### `historic=highwater_mark`

- **Element types**: node
- **Description**: A marker indicating a past flood or high water. Markers typically feature dates and can take various physical forms like plaques, engravings, painted markings, poles, or stones with inscriptions.
- **Common sub-tags**: `flood_date=*`, `flood_mark=*`, `inscription=*`
- **Status**: in use

### `historic=locomotive`

- **Element types**: node / area
- **Description**: A decommissioned locomotive which generally remains in one place and has become a tourist attraction or museum exhibit.
- **Status**: in use

### `historic=manor`

- **Element types**: node / area
- **Description**: Historic manors or mansions having different use today. Representative buildings that were or are administrative centres of large agricultural estates. Distinct from castles and stately homes.
- **Common sub-tags**: `name=*`
- **Status**: de facto

### `historic=memorial`

- **Element types**: node / area
- **Description**: Small memorials, usually remembering special persons, people who lost their lives in wars, past events, or missing places. Used for memorials of any age.
- **Common sub-tags**: `memorial=*`, `name=*`, `subject=*`, `inscription=*`, `material=*`, `artist_name=*`
- **Status**: de facto

### `historic=milestone`

- **Element types**: node
- **Description**: A historic physical marker that shows the distance to the beginning or important destinations. Typically stone markers positioned along roads; can also denote milestones from abandoned railways.
- **Common sub-tags**: `inscription=*`, `height=*`, `start_date=*`
- **Status**: de facto

### `historic=mine`

- **Element types**: node / area
- **Description**: Location of historic underground mine workings for minerals such as coal or lead.
- **Common sub-tags**: `name=*`, `resource=*`
- **Status**: de facto

### `historic=monastery`

- **Element types**: node / area
- **Description**: A building or place that is a historically significant monastery with traces of its original religious use. Distinct from `amenity=monastery`, which tags active religious communities currently in operation.
- **Common sub-tags**: `building=monastery`, `name=*`, `religion=*`
- **Status**: in use

### `historic=monument`

- **Element types**: node / area
- **Description**: A memorial object that is especially large — either one can go inside, walk on or through it, or it is very tall — built to remember, show respect to a person or group of people, or to commemorate an event.
- **Status**: de facto

### `historic=optical_telegraph`

- **Element types**: node / area
- **Description**: A semaphore system — a method of conveying information through visual signals using towers equipped with pivoting shutters or blades. Examples include the Prussian system (1832–1849) using 62 stations across 550 kilometres.
- **Status**: in use

### `historic=pa`

- **Element types**: node / area
- **Description**: A New Zealand Māori Pā — a fortified settlement with palisades and defensive terraces, characteristic of indigenous Māori communities.
- **Status**: deprecated (use `fortification_type=pa` instead)

### `historic=pillory`

- **Element types**: node
- **Description**: A construction designed to immobilise and humiliate a person who was convicted in lower courts. Historical examples typically consist of a pillar with attached restraints such as wrist cuffs and neckpieces.
- **Common sub-tags**: `name=*`, `start_date=*`
- **Status**: in use

### `historic=ruins`

- **Element types**: node / way / area
- **Description**: Remains of structures that were once complete but have fallen into partial or complete disrepair. More specific tags are recommended when possible, such as combining with `ruins=castle` or using `historic=archaeological_site`.
- **Status**: in use

### `historic=rune_stone`

- **Element types**: node
- **Description**: Stones, boulders, or bedrock with historical runic inscriptions. A runestone is typically a raised stone featuring runic text.
- **Common sub-tags**: `ref=*`, `name=*`, `wikipedia=*`, `start_date=*`, `moved=yes`
- **Status**: in use

### `historic=ship`

- **Element types**: node / area
- **Description**: A decommissioned ship or submarine which generally remains in one place, often converted into a tourist attraction. Applies to both military and non-military vessels.
- **Common sub-tags**: `name=*`, `tourism=attraction`, `ship:type=*`, `wikipedia=*`
- **Status**: in use

### `historic=tomb`

- **Element types**: node / area
- **Description**: A structure where somebody has been buried. The `tomb=*` key allows further specification using values like mausoleum, pyramid, crypt, tumulus, or rock-cut.
- **Common sub-tags**: `tomb=*`, `name=*`
- **Status**: approved

### `historic=tree`

- **Element types**: node
- **Description**: A tree with historical significance, such as one associated with a notable event, person, or period of history. Distinct from ordinary trees tagged with `natural=tree`.
- **Status**: de facto

### `historic=wayside_cross`

- **Element types**: node
- **Description**: A historical cross along a way, symbol of Christian faith. Commonly found throughout Europe, particularly in Catholic and Orthodox Christian regions. Modern wayside crosses are also included.
- **Common sub-tags**: `religion=*`, `denomination=*`, `inscription=*`, `material=*`, `start_date=*`
- **Status**: de facto

### `historic=wayside_shrine`

- **Element types**: node / area
- **Description**: A shrine often showing a religious depiction. The tag is used for both historic and modern shrines placed by roads or pathways.
- **Common sub-tags**: `name=*`, `religion=*`, `description=*`, `start_date=*`
- **Status**: de facto

### `historic=wreck`

- **Element types**: node / area
- **Description**: A nautical craft that has been sunk or destroyed. Wrecks persist for centuries and serve as hazards or points of interest to shipping, fishing, and diving communities.
- **Status**: approved

### `historic=yes`

- **Element types**: node / way / area
- **Description**: Adds the historic significance to objects described by other tags. A general indicator of historical importance for mapped objects, flagging features with cultural, architectural, or heritage significance when a more specific historic value is not available.
- **Status**: de facto

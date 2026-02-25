# Key: `boundary` — Boundary

> Source: https://wiki.openstreetmap.org/wiki/Key:boundary

## Description

The `boundary=*` key is used to mark the borders of areas, typically used on closed ways or relations representing the outline of a territory, administrative division, or other defined region. Boundaries are usually represented as relations combining multiple way segments with `role=outer` or `role=inner`. The key covers administrative divisions, protected areas, maritime zones, and statistical or functional territories.

## Values

### `boundary=administrative`

- **Element types**: way / area / relation
- **Description**: An administrative boundary subdividing areas or territories recognised by governments or official bodies. The `admin_level=*` tag (1–11) specifies the hierarchical level (e.g. country, state, municipality).
- **Common sub-tags**: `admin_level=*`, `name=*`, `ISO3166-1=*`, `ISO3166-2=*`
- **Status**: approved

### `boundary=aboriginal_lands`

- **Element types**: area / relation
- **Description**: The reservation boundaries of recognised indigenous peoples. Used for First Nations reserves, Native American reservations, and equivalent designations worldwide.
- **Common sub-tags**: `admin_level=*`, `name=*`
- **Status**: in use

### `boundary=border_zone`

- **Element types**: area / relation
- **Description**: An area near an international border where special permits or authorisations are required for movement. Entry restrictions apply beyond the normal border crossing.
- **Common sub-tags**: `border_type=*`
- **Status**: in use

### `boundary=census`

- **Element types**: area / relation
- **Description**: A census-designated boundary delineating a statistical area used for population counting and demographic analysis. Not necessarily an administrative unit.
- **Common sub-tags**: `admin_level=*`, `ref=*`
- **Status**: in use

### `boundary=disputed`

- **Element types**: area / relation
- **Description**: An area or boundary line claimed by multiple parties (states, organisations, or individuals). Used when the sovereignty or ownership is contested.
- **Common sub-tags**: `claimed_by=*`, `name=*`
- **Status**: in use

### `boundary=forest`

- **Element types**: area / relation
- **Description**: Delimited wooded lands with legally or administratively defined boundaries, such as state forests or managed forestry areas.
- **Common sub-tags**: `border_type=*`, `operator=*`, `name=*`
- **Status**: in use

### `boundary=forest_compartment`

- **Element types**: area / relation
- **Description**: A numbered subdivision within a managed forest, typically with visible boundaries marked on the ground. Used for forest management and logging planning.
- **Common sub-tags**: `ref=*`, `name=*`
- **Status**: in use

### `boundary=hazard`

- **Element types**: area
- **Description**: An area containing potential sources of damage to health, life, or property. Includes danger zones around military ranges, industrial sites, or natural hazards.
- **Common sub-tags**: `hazard=*`, `name=*`
- **Status**: in use

### `boundary=health`

- **Element types**: area / relation
- **Description**: A boundary delineating a health administrative division such as a health district, hospital catchment area, or public health authority territory.
- **Common sub-tags**: `health_level=*`, `name=*`
- **Status**: in use

### `boundary=historic`

- **Element types**: area / relation
- **Description**: A historic administrative boundary that no longer has legal force but is of historical, cultural, or cartographic interest. Use judiciously with supporting historic context.
- **Common sub-tags**: `admin_level=*`, `start_date=*`, `end_date=*`, `name=*`
- **Status**: in use

### `boundary=limited_traffic_zone`

- **Element types**: area / relation
- **Description**: An area where vehicle access is restricted to authorised users only, such as residents, delivery vehicles, or permit holders. Common in historic city centres.
- **Common sub-tags**: `name=*`, `access=*`
- **Status**: in use

### `boundary=local_authority`

- **Element types**: relation
- **Description**: The territorial extent of a local authority or council. May overlap with administrative boundaries but defined specifically for local governance purposes.
- **Common sub-tags**: `name=*`, `operator=*`
- **Status**: in use

### `boundary=low_emission_zone`

- **Element types**: area / relation
- **Description**: An area where access by polluting vehicles is restricted to improve air quality. Vehicles must meet emission standards or obtain exemptions to enter.
- **Common sub-tags**: `name=*`, `operator=*`
- **Status**: in use

### `boundary=maritime`

- **Element types**: area
- **Description**: Maritime boundaries including territorial waters, contiguous zones, exclusive economic zones (EEZ), and the baseline. Governed by international maritime law (UNCLOS).
- **Common sub-tags**: `border_type=*` (e.g. `territorial_waters`, `contiguous_zone`, `exclusive_economic_zone`, `baseline`)
- **Status**: in use

### `boundary=marker`

- **Element types**: node
- **Description**: A physical boundary marker or border stone placed on the ground to indicate a boundary line. Used for nodes representing actual physical markers.
- **Status**: in use

### `boundary=national_park`

- **Element types**: area
- **Description**: An area of outstanding natural beauty or ecological significance set aside for conservation and public enjoyment under national or regional legislation.
- **Common sub-tags**: `name=*`, `operator=*`, `protect_class=*`
- **Status**: approved

### `boundary=place`

- **Element types**: way / relation
- **Description**: The boundary of a named place (city, town, village, hamlet) that does not constitute a formal administrative area. Represents the perceived or conventional extent of a place.
- **Common sub-tags**: `name=*`, `place=*`
- **Status**: in use

### `boundary=political`

- **Element types**: area
- **Description**: An electoral boundary defining a constituency, ward, district, or other political unit used for elections or political representation.
- **Common sub-tags**: `name=*`, `ref=*`
- **Status**: in use

### `boundary=postal_code`

- **Element types**: relation
- **Description**: The boundary of a postal code area as defined by the postal authority. Used to map the geographic extent of postcode zones.
- **Common sub-tags**: `postal_code=*`, `postal_code_level=*`
- **Status**: in use

### `boundary=protected_area`

- **Element types**: area
- **Description**: An area afforded legal protection for nature conservation, heritage, or wilderness preservation. Includes national parks, marine protected areas, UNESCO World Heritage Sites, and wilderness areas.
- **Common sub-tags**: `protect_class=*`, `protection_title=*`, `operator=*`, `ref=*`
- **Status**: approved

### `boundary=public_transport`

- **Element types**: area / relation
- **Description**: The operating area or fare zone of a public transport authority. Defines where a transit agency operates or where a specific fare applies.
- **Common sub-tags**: `name=*`, `operator=*`, `ref=*`
- **Status**: in use

### `boundary=religious_administration`

- **Element types**: relation
- **Description**: The boundary of a religious administrative division such as a diocese, parish, archdiocese, or equivalent ecclesiastical territory.
- **Common sub-tags**: `religion=*`, `denomination=*`, `religious_level=*`, `name=*`
- **Status**: in use

### `boundary=special_economic_zone`

- **Element types**: area
- **Description**: A government-defined geographic area where business and trade laws differ from the rest of the country, often with tax incentives or reduced regulations.
- **Common sub-tags**: `name=*`, `operator=*`
- **Status**: in use

### `boundary=statistical`

- **Element types**: area / relation
- **Description**: An official boundary recognised by government for statistical purposes only, not representing an administrative or governance unit.
- **Common sub-tags**: `admin_level=*`, `ref=*`, `name=*`
- **Status**: in use

### `boundary=timezone`

- **Element types**: relation
- **Description**: The boundary of a time zone, defining areas that observe the same standard time. Based on political agreements as well as geographic position.
- **Common sub-tags**: `timezone=*`, `name=*`
- **Status**: in use

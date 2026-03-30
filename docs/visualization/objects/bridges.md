# Bridges

## Visual Characteristics

Bridges appear as elevated flat decks spanning roads and railways. They float above terrain, supported by layer height (vertical separation). Decks are proportionally wider than the underlying road/rail to show structural overhang.

**Examples:**
- Highway overpass: wide gray deck (#b0a898) elevated 1 layer (5m) above road
- Railway bridge: thinner deck elevated 2 layers (10m) above terrain
- Pedestrian bridge: narrow deck at 1 layer height

## Data Sources

Bridges identified by Overture fields:
- `bridge=yes` on `highway=*` or `railway=*` features
- `layer=N` (integer, default 1) — vertical separation in multiples of 5m per layer
- `width` tag for road width, default rail width from `railway=*` type
- Deck margin: automatically adds 2m on each side of road/rail width

## Rendering Strategy

**Deck Extrusion**: Similar to barriers but simpler — just a flat box at elevated height:

1. For each consecutive pair of coordinates in LineString:
   - Compute midpoint and length
   - Calculate rotation angle
   - Create flat `BoxGeometry(deckWidth, DECK_THICKNESS, segmentLength)` where:
     - deckWidth = road/rail width + 4m (2m margin per side)
     - DECK_THICKNESS = 0.5m
   - Position at terrain elevation + layer × 5m

## Geometry Details

**Deck Mesh per Segment:**
- Dimensions: (width, 0.5m thickness, length)
- Width = vehicle width + 4m (represents deck overhang)
  - Motorway (25m): deck 29m
  - Railway (4m): deck 8m
  - Footway (2m): deck 6m
- Material: Tan/beige Lambert (#b0a898)
- Positioning: Centered at midpoint, terrain elevation + layer height offset

**Layer Height Calculation:**
```
verticalOffset = layer × 5m
Examples:
  layer=1: 5m above terrain
  layer=2: 10m above terrain
  layer=-1: 5m below terrain (underpass)
```

## Configuration

| Parameter | Value |
|---|---|
| Deck color | #b0a898 (tan, resembles concrete) |
| Deck thickness | 0.5m |
| Deck margin | 2m on each side (total +4m to road width) |
| Layer height multiplier | 5m per layer unit |
| Default layer | 1 (if not specified) |

## Elevation Handling

- **Base elevation**: Sampled at segment midpoint (same as road/rail below)
- **Vertical offset**: Added to base elevation based on layer tag
- **No tilt**: Deck remains horizontal even on slopes (realistic for bridge engineering)
- **Precision**: Each segment samples independently

## See Also

- **[Barriers](barriers.md)** — Linear ground-level features
- **[Systems](systems.md#spatial-organization)** — Coordinate system and spatial layout
- **[Data Pipeline](../../data-pipeline.md)** — Feature extraction process

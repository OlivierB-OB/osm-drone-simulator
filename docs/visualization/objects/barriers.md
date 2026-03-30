# Barriers

## Visual Characteristics

Barriers appear as linear features running across the landscape. Walls are thin, tall, and rigid. Hedges are wider, lower, and green. Retaining walls are squat and sturdy. City walls are massive stone structures.

**Examples:**
- Garden wall: 0.3m wide, 2m tall, beige (#c0b8b0)
- Hedge: 1m wide, 1.5m tall, dark green (#4a7030)
- City wall: 2m wide, 6m tall, stone (#c8c0b0)
- Retaining wall: 0.5m wide, 1.5m tall, gray (#a8a098)

## Data Sources

Barriers identified by Overture fields:
- `barrier=wall`, `city_wall`, `retaining_wall`, `fence`, `hedge`, `guardrail`
- `height` tag (in meters)
- `width` tag (in meters, defaults based on type)
- `material` tag (brick, concrete, stone, wood, metal) — overrides type color
- `colour` tag (explicit RGB override)

## Rendering Strategy

**Line Extrusion**: Each LineString segment is converted to a box mesh:

1. For each consecutive pair of coordinates in the LineString:
   - Compute segment midpoint and length
   - Calculate rotation angle to align with path
   - Create `BoxGeometry(width, height, segmentLength)`
   - Position at midpoint with appropriate rotation
   - Sample elevation at midpoint

2. **Rotation**: `rotation.y = -angle` where `angle = atan2(dx, dy)` aligns box along path

## Geometry Details

**Box Mesh per Segment:**
- Dimensions: (width, height, length)
  - Width: configured per type or tag (0.3m wall, 1m hedge)
  - Height: configured per type or tag (2m wall, 1.5m hedge)
  - Length: segment length in Mercator coordinates
- Material: `MeshLambertMaterial` with type or material-based color
- Positioning: Centered at segment midpoint, terrain elevation + height/2

**Example (Garden Wall, 50m segment):**
```
BoxGeometry(0.3, 2.0, 50)           // 0.3m thick, 2m tall, 50m long
Position: (midX, terrainY + 1.0, -midY)
Rotation.y: -angleToAlignWithPath
Color: #c0b8b0
```

## Configuration

| Barrier Type | Default Width | Default Height | Default Color |
|---|---|---|---|
| wall | 0.3m | 2.0m | #c0b8b0 |
| city_wall | 2.0m | 6.0m | #c8c0b0 |
| retaining_wall | 0.5m | 1.5m | #a8a098 |
| hedge | 1.0m | 1.5m | #4a7030 |

**Material Color Overrides:**
Same palette as buildings: brick (#c87060), concrete (#c8c4b8), stone (#b8b0a0), wood (#c8a878), metal (#888888), etc.

## Elevation Handling

- **Midpoint sampling**: Elevation sampled at segment midpoint
- **Vertical positioning**: Height/2 above terrain, so base touches ground
- **Slope following**: Each segment independently samples elevation, creating stepped appearance on steep terrain
- **Precision**: Segments reconnect seamlessly across segment boundaries

## See Also

- **[Bridges](bridges.md)** — Linear elevated features
- **[Structures](structures.md)** — Point-based objects
- **[Systems](systems.md#spatial-organization)** — Coordinate system and spatial layout
- **[Data Pipeline](../../data-pipeline.md)** — Feature extraction process

# Issue 006: Ring System Visualization Inconsistency

## Severity
🔵 **Low** - Cosmetic/style inconsistency, not functional

## Description
The tile ring system is documented in three places with three different ASCII visualizations. While all convey the same concept, the varying styles make documentation feel inconsistent and could confuse readers about whether they're different systems.

## Locations
1. `doc/data/elevations.md` lines 50-57
2. `doc/data/contextual.md` lines 532-547
3. `doc/visualization/objects.md` lines 542-555

## Current Visualizations

### Version 1: elevations.md (50-57)
```
Drone at center of ring:

        [ ][ ][ ]
        [ ][D][ ]    ← Ring radius = 1 means 3×3 grid (9 tiles)
        [ ][ ][ ]
```

### Version 2: contextual.md (532-547)
```
Tile Grid around drone at center tile (tx, ty):

       (tx-1,ty-1) (tx,ty-1) (tx+1,ty-1)
           ┌─────────┬─────────┬─────────┐
       (tx-1,ty)   [DRONE]            (tx+1,ty)
           ├─────────┼─────────┼─────────┤
       (tx-1,ty+1) (tx,ty+1) (tx+1,ty+1)
           └─────────┴─────────┴─────────┘

Total: 3×3 = 9 tiles
Radius = 2 → 5×5 = 25 tiles
Radius = 3 → 7×7 = 49 tiles
```

### Version 3: objects.md (542-555)
```
Mercator Y (North ↑)
      ↑
  [8] [9] [10]
  [5] [D] [6]     D = drone position
  [2] [3] [4]

Tiles numbered by fetch order; D is center tile (drone tile)
When drone crosses tile boundary, ring shifts:
- New tiles fetched and added
- Old tiles removed and disposed
- Seamless transition
```

## Issues with Inconsistency

| Aspect | Version 1 | Version 2 | Version 3 |
|--------|-----------|-----------|-----------|
| **Visual style** | Simple brackets `[ ]` | Box drawing chars `┌┐├┤└┘` | Numbered tiles `[0]` |
| **Coordinate labels** | None | Full coordinates `(tx-1,ty-1)` | Index order `[8][9]` |
| **Axis labels** | None | None | North/Y axis marked |
| **Explanations** | Basic | Detailed (3 variants) | Lifecycle explanation |
| **Audience clarity** | Beginner | Intermediate | Advanced |

## Impact
- **Reader confusion**: Are these three different ring systems or the same one?
- **Inconsistent style**: Each section uses different ASCII art conventions
- **No standardization**: Developers see mixed approaches

## Solution Options

### Option A: Single Standard Version
Pick one visualization and use everywhere. Example:

```markdown
**Ring-Based Tile Loading** (radius = 1):

        [9][10][11]
        [6][D][7]     D = drone at center
        [3][4][5]

Ring radius 1 = 3×3 grid (9 tiles)
Ring radius 2 = 5×5 grid (25 tiles)
Ring radius 3 = 7×7 grid (49 tiles)

Tiles load as drone approaches edges, unload as it leaves ring.
```

Then use this **everywhere** (elevations.md, contextual.md, ground-surface.md, objects.md)

### Option B: Progressive Disclosure
Use simple version initially, add complexity in specialized docs:

- **Initial mention** (architecture.md, overview.md): Simple `[ ][ ][ ]` version
- **Data section** (elevations.md): Add coordinate labels `(tx,ty)`
- **Detailed sections** (objects.md): Add numbered fetch order
- **Technical** (contextual.md): Add box drawing and all variants

### Option C: Create Dedicated Diagram Doc
Create `doc/tile-ring-system.md` with all variants explained, reference from others.

## Recommendation
**Option B** - Progressive disclosure with cross-references. This:
- Keeps docs consistent at each level
- Allows readers to understand concept first, then deep dive
- Reduces redundancy while maintaining clarity
- Explains why different visualizations exist

## Files to Update
1. `doc/data/elevations.md` - standardize visualization
2. `doc/data/contextual.md` - standardize visualization
3. `doc/visualization/objects.md` - standardize visualization
4. `doc/ground-surface.md` - add brief visualization (if missing)

## Files to Reference
- `doc/overview.md` - might mention ring concept
- `CLAUDE.md` - Architecture section

## Status
⏳ Pending Fix (low priority, stylistic)

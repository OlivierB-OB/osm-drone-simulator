# Issue: Ring-Based Loading Explanation Duplication

## Severity
🟠 **MODERATE** - Good explanation, but repeated 3-4 times with slight format variations

## Summary
The concept of "ring-based tile loading" is explained thoroughly in 4 separate documents. Each provides similar ASCII diagrams, explanations of why rings are used, and configuration details. This concept should be explained once with clear cross-references.

## Affected Files

### Current State (4 Files with Ring Explanations)

1. **`doc/data/elevations.md` lines 46-58**
   - Ring diagram and configuration
   - Configuration block showing `ringRadius: 1`
   - Explanation of tile loading/unloading
   - **Most detailed version**

2. **`doc/data/contextual.md` lines 62-74**
   - Nearly identical ring explanation
   - Similar configuration block
   - Same conceptual content as elevations.md

3. **`doc/visualization/ground-surface.md` lines 230-253**
   - Ring diagram (slightly different ASCII formatting)
   - Advantages of ring-based loading listed
   - Similar to elevations.md but in visualization context

4. **`doc/visualization/objects.md` lines 534-555**
   - Ring diagram repeated
   - Tile grid explanation
   - Configuration reminder

## Duplicated Content Examples

### ASCII Ring Diagram (repeated 4 times)
**Version 1** (elevations.md:50-55):
```
        [ ][ ][ ]
        [ ][D][ ]    ← Ring radius = 1 means 3×3 grid (9 tiles)
        [ ][ ][ ]
```

**Version 2** (contextual.md:65-71):
```
        [ ][ ][ ]
        [ ][D][ ]    ← Ring radius = 1 means 3×3 grid (9 tiles)
        [ ][ ][ ]
```

**Version 3** (ground-surface.md:234-246):
```
Ring 1 (3×3 grid):
  [◯◯◯]
  [◯🚁◯]
  [◯◯◯]
```

**Version 4** (objects.md:542-555):
```
       (tx-1,ty-1) (tx,ty-1) (tx+1,ty-1)
           ┌─────────┬─────────┬─────────┐
       (tx-1,ty)   [DRONE]            (tx+1,ty)
```

All convey the same concept; slightly different style/detail level.

### "Ring Radius = 1 Means 3×3 Grid" Explanation
**Appears in all 4 files:**
- elevations.md:50 "3×3 grid (9 tiles)"
- contextual.md:71 "3×3 grid (9 tiles)"
- ground-surface.md:238 "3×3 grid"
- objects.md:550 "Ring radius = 1 → 3×3 = 9 tiles"

### "Why Ring-Based Loading" (Benefits section)
**Appears in 2 files:**
- ground-surface.md:248-251 "Advantages: Predictable loading, Easy to configure, Prevents excessive memory"
- objects.md:538-541 "Benefits explanation"

Both cite same reasoning, slightly different wording.

## Problem Details

### Cognitive Overload
A reader exploring the codebase encounters:
1. Read elevations.md → learn about ring loading
2. Read contextual.md → see ring loading explained again
3. Read ground-surface.md → see ring diagram again
4. Read objects.md → see ring pattern again
- ❌ Same concept repeated 4 times
- ❌ Reader unsure if there are subtle differences
- ❌ Wasted reading time

### Diagram Format Inconsistency
The ASCII diagrams use different styles:
- Some use `[ ]` for tiles, `[D]` for drone
- Some use `[◯]` for tiles, `[🚁]` for drone
- Some use coordinate notation like `(tx, ty)`
- Reader wonders: Are these showing different concepts?

### Verification Complexity
If documentation needs an update (e.g., "ringRadius: 2 for higher detail"):
- **Must update:** All 4 files
- **Must ensure:** All diagrams match new explanation
- **Risk:** One file gets updated to "ringRadius: 2", others stay at "ringRadius: 1"

### Navigation Problem
A developer reading `objects.md` encounters ring explanation. If they want more details:
- ❌ How do they know which other doc has the best explanation?
- ❌ Did they just read a copy, or the canonical version?
- ❌ Should they also check the other 2 docs for additional detail?

## Root Cause
Ring-based loading is fundamental to understanding how the system works:
- Elevation module → needs to explain it for tile caching
- Context module → needs to explain it for OSM tile management
- Visualization modules → need to explain it for scene management

Each module author included full explanation for self-containedness.

## Impact Assessment

### Medium-Risk Scenarios

1. **Configuration Change**
   - Team decides `ringRadius: 1` → `ringRadius: 2` for better detail
   - Update elevations.md diagram
   - Forget to update contextual.md, ground-surface.md, objects.md
   - Some docs show 3×3 grid, others show 5×5 grid
   - Reader confused about actual behavior

2. **Concept Refinement**
   - Realize explanation needs clarification
   - Update one file with better wording
   - Other 3 files still show old explanation
   - Information diverges

3. **Search Results**
   - Developer searches for "ring radius"
   - Gets 4 results with slightly different explanations
   - Hard to know which is canonical

## Solution

### Proposed Action

#### Consolidate Ring Explanation into Single Location
1. **Primary Source:** `doc/data/elevations.md` (lines 46-58)
   - Most foundational system (data loading is the base)
   - Already has good explanation and diagram
   - Expand with examples if needed

2. **Secondary References:** Link from other files
   - `doc/data/contextual.md` → "See elevations.md for ring concept"
   - `doc/visualization/ground-surface.md` → "Ring system (see elevations.md)"
   - `doc/visualization/objects.md` → Link to primary source

### Implementation Pattern

**Before (4 separate explanations):**
```markdown
## Ring-Based Loading

The system maintains a **ring of tiles** around the drone:

        [ ][ ][ ]
        [ ][D][ ]    Ring radius = 1 means 3×3 grid
        [ ][ ][ ]

Tiles load as drone approaches edges, unload as it leaves.
```

**After (each doc - except primary):**
```markdown
## Tile Ring System

Tiles are loaded in a **ring around the drone's current position**.
With ring radius 1, this means a 3×3 grid of tiles (9 total).

See **[doc/data/elevations.md#ring-based-loading](../data/elevations.md#ring-based-loading)**
for the full explanation of how ring-based loading works and why it's efficient.
```

**In primary doc (elevations.md) - keep/expand:**
```markdown
## Ring-Based Loading

The system maintains a **ring of tiles** around the drone's current position:

```
Drone at center:

        [ ][ ][ ]
        [ ][D][ ]    Ring radius = 1 means 3×3 grid (9 tiles)
        [ ][ ][ ]

Ring radius = 2 would be 5×5 (25 tiles):

    [ ][ ][ ][ ][ ]
    [ ][ ][ ][ ][ ]
    [ ][ ][D][ ][ ]
    [ ][ ][ ][ ][ ]
    [ ][ ][ ][ ][ ]
```

**How It Works:**
1. As the drone moves, the system detects when it crosses tile boundaries
2. New tiles enter the ring on one side; old tiles exit on the other
3. This prevents loading the entire world while ensuring nearby tiles are always available
4. Memory usage stays constant (always ~9 or 25 tiles, depending on radius)
5. Network requests optimized (ring moves only when boundary crossed, not continuously)

**Benefits:**
- Predictable loading pattern
- Easy to configure via `ringRadius` parameter
- Prevents excessive memory use
- Network efficient (tiles load in predictable order)

**Configuration:**
- `ringRadius: 1` → 3×3 grid (default, fast)
- `ringRadius: 2` → 5×5 grid (more detail, slower)
- `ringRadius: 3` → 7×7 grid (very slow)

See `src/config.ts` for current settings.
```

## Affected Files to Update

**Primary (keep/expand):**
- `doc/data/elevations.md` lines 46-58

**Secondary (link instead):**
1. `doc/data/contextual.md` lines 62-74
   - Replace with 2-3 sentence summary + link
2. `doc/visualization/ground-surface.md` lines 230-253
   - Replace with link + context-specific note
3. `doc/visualization/objects.md` lines 534-555
   - Replace with link + context-specific note

## Verification Checklist

After implementation:
- [ ] Single canonical explanation in `doc/data/elevations.md`
- [ ] Three other files link to it instead of repeating
- [ ] Diagrams only appear in canonical location
- [ ] "Ring radius" mentions include reference to primary doc
- [ ] A developer making a ring-related change knows to update only one file
- [ ] All links are relative and working

## Related Issues
- See: `coordinate-system-duplication.md` (similar pattern)
- See: `data-pipeline-duplication.md` (related to system flow)

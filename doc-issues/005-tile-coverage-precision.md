# Issue 005: Tile Coverage Precision Measurement Inconsistency

## Severity
🟡 **Medium** - Potentially confusing different measurements as inconsistency

## Description
Multiple files claim different tile coverage sizes at zoom 15, which appears inconsistent but actually measures different things. The documentation could be clearer about what's being measured.

## Locations
1. `doc/data/elevations.md` line 146
2. `doc/data/contextual.md` line 92
3. `doc/visualization/ground-surface.md` line 222

## Current Text

### Elevations (line 146)
```
| **Horizontal resolution** | ~4.77m per pixel | At zoom 15; finer at higher zoom levels |
```

### Contextual (line 92)
```
| **zoomLevel: 15** | Balances detail vs. performance; ~2km × 2km per tile at zoom 15 |
```

### Ground Surface (line 222)
```
- Each tile covers ~2 km × ~2 km at equator (resolution varies by latitude)
```

## The Issue
- **elevations.md** measures **per-pixel** resolution within a tile: ~4.77m/pixel
- **contextual.md** & **ground-surface.md** measure **per-tile** coverage: ~2km/tile
- These are different measurements and both are correct
- **However**: Readers expect consistency; the difference isn't explained

## Why This Happens
**At zoom 15 with 256×256 pixel tiles:**
- Tile size: ~2,097 meters × ~2,097 meters at equator (varies by latitude)
- Pixel size: 2,097m ÷ 256 pixels = ~8.2m per pixel (not 4.77m)

**Wait—4.77m doesn't match 8.2m. Investigate further.**

Possible explanations:
1. Elevations uses different tile dimensions than contextual data?
2. Elevations measurement is incorrect?
3. Elevations uses a different zoom level or calculation method?

## What Needs Verification
1. **Confirm actual tile size** at zoom 15 (equator)
2. **Confirm pixel resolution** (2,097m ÷ 256 = ~8.2m, not 4.77m)
3. **Explain discrepancy** in 4.77m figure
4. **Cross-reference** both elevation and contextual data systems

## Impact
- Developers might use wrong resolution estimates for performance planning
- If documentation is wrong about one measurement, credibility of both is questioned
- No explanation of measurement units/methodology

## Solution
1. **Verify calculations** against Web Mercator math
2. **Clarify measurements**: pixel-per-tile vs. meters-per-pixel
3. **Add explanatory note** showing the relationship:
   ```
   Zoom 15 tile coverage:
   - Tile size: ~2,097m × 2,097m at equator (varies by latitude)
   - Pixel grid: 256 × 256 pixels per tile
   - Per-pixel resolution: 2,097m ÷ 256 = ~8.2m per pixel
   - Per-tile coverage: ~2km × 2km (rounded)
   ```
4. **Update elevation docs** if 4.77m is incorrect (may refer to different zoom level)

## Suggested Fix Format

### elevations.md (line 146)
```
| **Horizontal resolution** | ~8.2m per pixel | At zoom 15 at equator; 256×256 pixel tiles cover ~2km² |
```

Or if 4.77m is intentional:
```
| **Horizontal resolution** | ~4.77m per pixel | At zoom 16; zoom 15 is ~8.2m per pixel |
```

### cross-reference section
All docs should note:
```
**Tile Resolution at Zoom 15 (equator):**
- Coverage: ~2,097m × 2,097m per tile
- Grid: 256×256 pixels
- Per-pixel: ~8.2m resolution
- Per-tile: ~2km × 2km (rounded for readability)
```

## Files to Update
1. `doc/data/elevations.md` - verify 4.77m measurement
2. `doc/data/contextual.md` - add zoom 15 coverage table
3. `doc/visualization/ground-surface.md` - cross-reference other docs

## Related Reference
- Web Mercator specification (EPSG:3857)
- `src/config.ts` - actual zoom levels and tile configurations

## Status
⏳ Pending Verification & Fix

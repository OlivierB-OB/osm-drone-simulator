# Issue 008: Ellipsis Notation Inconsistency

## Severity
🔵 **Low** - Cosmetic inconsistency, no functional impact

## Description
Multiple references to tile coverage at zoom 15 use inconsistent notation for "approximately": some use `~2km`, others use `~2 km` (with space). Minor but affects documentation polish.

## Locations
1. `doc/data/contextual.md` line 92
2. `doc/visualization/ground-surface.md` line 222

## Current Text

### Version 1: contextual.md (line 92)
```
| **zoomLevel: 15** | Balances detail vs. performance; ~2km × 2km per tile at zoom 15 |
```

### Version 2: ground-surface.md (line 222)
```
- Each tile covers ~2 km × ~2 km at equator (resolution varies by latitude)
```

## Inconsistency
- **contextual.md**: `~2km` (no space between number and unit)
- **ground-surface.md**: `~2 km` (space between number and unit)

## Standards
According to most style guides:
- **SI/Metric standard**: Space between number and unit (e.g., "2 km", "5 m", "20 Hz")
- **Physics notation**: Always space: `2 km` not `2km`
- **Technical writing**: Generally follow SI style

However, in casual writing and some technical contexts (especially in compressed tables), `2km` is acceptable.

## Impact
- **Professionalism**: Inconsistent style suggests lack of polish
- **Readability**: Minor inconsistency (low cognitive cost)
- **No functional issue**: Meaning is clear either way

## Solution
Standardize across all documentation to SI style: **always use space** between number and unit.

Apply everywhere:
- ✅ `2 km` (correct)
- ✅ `4.77 m` (correct)
- ✅ `8.2 m` (correct)
- ❌ `2km` (avoid)

## Files to Update
1. `doc/data/contextual.md` line 92 - change `~2km × 2km` to `~2 km × 2 km`
2. Verify all other files for unit notation consistency

## Files to Search
- `doc/data/elevations.md` - verify all unit notation (meters, kilometers)
- `doc/visualization/ground-surface.md` - verify all unit notation
- `doc/data/contextual.md` - verify all unit notation
- `doc/visualization/objects.md` - verify all unit notation

## Status
⏳ Pending Fix (low priority, style cleanup)

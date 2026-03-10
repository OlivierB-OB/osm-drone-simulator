# Issue 007: Coordinate Transformation Documentation Duplication

## Severity
🟡 **Medium** - Maintenance burden, duplication

## Description
The Mercator-to-Three.js coordinate transformation formula is documented in multiple places with similar explanations. While redundancy can be helpful for readability, extensive duplication creates maintenance burden if the transformation changes.

## Locations
1. `doc/coordinate-system.md` lines 29-39 (primary spec)
2. `doc/visualization/ground-surface.md` lines 269-307 (detailed explanation)
3. `doc/visualization/objects.md` lines 557-581 (application examples)
4. `doc/data/elevations.md` lines 361-384 (integration context)

## Current Duplication

### Reference 1: coordinate-system.md (29-39)
```
Three.js Coordinate Mapping

Three.js uses a right-handed coordinate system. The mapping from Mercator:

Three.js X = Mercator X         (East = +X)
Three.js Y = Elevation          (Up = +Y)
Three.js Z = -Mercator Y        (North = -Z)
```

### Reference 2: ground-surface.md (278-281)
```
Mercator Coordinates         Three.js Coordinates
─────────────────────────    ─────────────────────
X (east)         → +X        (east)        ✓
Y (north)        → -Z        (north = -Z)  ✓
Elevation        → +Y        (up)          ✓
```

### Reference 3: objects.md (562-566)
```
Three.js Position from Mercator:
  x = mercator.x       (East = +X, direct)
  y = elevation_m      (Up = +Y, direct)
  z = -mercator.y      (North = -Z, negated)
```

### Reference 4: elevations.md (374-377)
```
Three.js (rendering coordinates):
  position.x = +X eastward (same as Mercator X)
  position.y = +Y upward (same as elevation)
  position.z = -Y northward! (Mercator Y negated)
```

## Issues

| Aspect | Issue |
|--------|-------|
| **Format variation** | Different layouts (table vs. code vs. text) |
| **Terminology** | "Z-negation" vs "Mercator Y negated" vs "northward!" |
| **Detail level** | Some include rationale, others just formula |
| **Maintenance** | If formula changes, 4 places must update |
| **Confusion** | Different wording for same concept |

## Impact
- **Single source of truth problem**: Changes need 4 updates
- **Inconsistent explanations**: Readers see different perspectives without understanding they're the same
- **Search difficulty**: Readers looking for "Z negation" vs "Mercator Y" might miss each other's docs
- **Potential drift**: One doc updated, others become stale

## Solution Options

### Option A: Centralize with References
Create definitive spec at `doc/coordinate-system.md` (already exists) and reference it everywhere:

```markdown
### Coordinate Transformation
Objects are positioned using the Mercator-to-Three.js transformation:
- **X**: Mercator X (east-west)
- **Y**: Elevation (vertical)
- **Z**: -Mercator Y (north-south, negated)

See [Coordinate System & Rendering Strategy](../coordinate-system.md) for detailed explanation and rationale.
```

### Option B: Extract Transformation Logic
Create `doc/coordinate-transformation.md` dedicated to the formula with:
- Mathematical specification
- Rationale explanation
- Code examples
- Verification checklist

Then reference from data/elevations.md, visualization/ground-surface.md, etc.

### Option C: Keep Current with Cross-Links
Add explicit cross-references between existing docs so readers know they're the same:

In each location add:
```markdown
**See also**: [Coordinate System](../coordinate-system.md#three-js-coordinate-mapping)
```

## Recommended Approach
**Option A + explicit section links** because:
- `doc/coordinate-system.md` already exists as primary spec
- Other docs can focus on their own domain
- Links help readers find full context without duplicating text
- Easier to maintain single authoritative source

## Files Needing Updates
1. **Primary spec** (no change needed): `doc/coordinate-system.md`
2. **Add references to**:
   - `doc/visualization/ground-surface.md` (replace section with link + formula for context)
   - `doc/visualization/objects.md` (replace section with link + formula for context)
   - `doc/data/elevations.md` (replace section with link + formula for context)

## Suggested Implementation

### ground-surface.md (replace lines 269-307)
```markdown
### Coordinate System & Z-Negation

Terrain meshes use the standard Mercator-to-Three.js transformation.
See [Coordinate System & Rendering Strategy](../coordinate-system.md)
for full specification and rationale.

**Quick Reference:**
```
position.x = mercator.x       // East = +X
position.y = elevation        // Up = +Y
position.z = -mercator.y      // North = -Z (negated)
```

**Why Z-negated?** Mercator Y increases northward (geographic); Three.js camera looks
along -Z axis (default forward). Negating Z aligns them: north becomes the camera's
forward direction.
```

This keeps local context while reducing duplication.

## Files to Update
1. `doc/coordinate-system.md` - (verify it's authoritative)
2. `doc/visualization/ground-surface.md` - replace 269-307 with link + brief
3. `doc/visualization/objects.md` - replace 557-581 with link + brief
4. `doc/data/elevations.md` - replace 361-384 with link + brief

## Status
⏳ Pending Fix (refactoring, medium priority)

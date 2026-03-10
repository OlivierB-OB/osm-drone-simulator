# Issue: Three.js Coordinate Transformation Formula Duplication

## Severity
🔴 **SEVERE** - Core formula repeated identically 4 times

## Summary
The exact Three.js position formula is repeated verbatim in 4 separate documents. This formula is critical for correct object placement in the scene; any change must be propagated to all 4 locations or the system breaks.

## Affected Files

### Current State (Identical Formula in 4 Files)
```
position.x = mercatorX         (or: tileCenter.mercatorX, droneThreeX, etc.)
position.y = elevation         (or: terrainY, droneThreeY, etc.)
position.z = -mercatorY        (or: -tileCenter.mercatorY, -droneThreeZ, etc.)
```

**Exact Locations:**

1. **`doc/coordinate-system.md` lines 33-36**
   ```
   Three.js X = Mercator X         (East = +X)
   Three.js Y = Elevation          (Up = +Y)
   Three.js Z = -Mercator Y        (North = -Z)
   ```

2. **`doc/data/elevations.md` lines 375-377**
   ```
   position.x = mercatorX
   position.y = elevation
   position.z = -mercatorY
   ```

3. **`doc/visualization/ground-surface.md` lines 284-289**
   ```
   position.x = tileCenter.mercatorX
   position.y = 0
   position.z = -tileCenter.mercatorY
   ```

4. **`doc/visualization/objects.md` lines 561-566**
   ```
   x = mercatorX       (East = +X, direct)
   y = elevation_m     (Up = +Y, direct)
   z = -mercator.y     (North = -Z, negated)
   ```

## Problem Details

### Consistency Risk
If a developer needs to update the formula (e.g., fixing a bug or changing coordinate system):
- **Current:** Must find and fix in 4 places
- **Risk:** Easy to miss one file; some code uses correct formula, other code uses old formula
- **Result:** System-wide coordinate bugs

### Example Scenario
Imagine a requirement change: "Use WebGL convention instead of Three.js default"
- Requires changing Z mapping from `-mercator.y` to `+mercator.y`
- **Must update:** All 4 files simultaneously
- **Likely outcome:** One file gets missed → terrain renders at wrong location → debug nightmare

### Verification Complexity
A code reviewer checking if the formula is correct must:
1. Find the formula in the source code
2. Compare it against 4 different doc versions
3. Verify which doc version is "canonical"
4. Hope all 4 match (they should, but do they?)

## Root Cause
Each documentation module includes the formula to be self-contained:
- Elevation system doc → includes formula for terrain positioning
- Visualization docs → include formula for object positioning
- Patterns doc → includes formula as example of pattern usage
- Coordinate system doc → includes formula as core specification

This made sense during writing, but created maintenance burden.

## Impact Assessment

### High-Risk Operations
Any change to coordinate transformation requires:
- ✗ Searching 4+ files
- ✗ Making identical edits in each
- ✗ Testing to ensure consistency
- ✗ Risk of silent failures (one file gets old formula)

### Example: Recent Change
The system implemented Z-negation correctly in all components. But if a code review finds "the formula in ground-surface.md doesn't match the formula in elevations.md", which is wrong?

## Solution

### Proposed Action
1. **Single Source of Truth:** `doc/coordinate-system.md`
   - Keep formula here with full derivation
   - This is where developers look for specs

2. **Reference from Other Docs:**
   - Don't repeat the formula in data/visualization docs
   - Link to the canonical source instead
   - Brief summary OK (context-specific variables)

### Implementation Pattern

**Before (all 4 docs repeat formula):**
```markdown
## Coordinate Positioning

The drone is positioned in Three.js space using:

position.x = mercatorX
position.y = elevation
position.z = -mercatorY

This maps Mercator north (Y+) to Three.js forward (-Z).
```

**After (one source, others reference):**
```markdown
## Coordinate Positioning

Objects are positioned using the **standard Mercator-to-Three.js transformation**
(see [doc/coordinate-system.md](../coordinate-system.md#transformation) for details):

- **X**: Mercator X directly (East = +X)
- **Y**: Elevation in meters (Up = +Y)
- **Z**: Negated Mercator Y (North = -Z)

This ensures all objects align spatially in the scene.
```

## Verification Checklist

After implementing this fix:
- [ ] Formula appears in ONE canonical location: `doc/coordinate-system.md`
- [ ] Each other doc references it: "See coordinate-system.md for formula"
- [ ] No doc copy-pastes the 3-line formula
- [ ] Readers landing in `elevations.md` know where to find the spec
- [ ] A developer making a formula change only edits one file

## Related Issues
- See: `coordinate-system-duplication.md` (parent issue; this is a subset)
- See: `ring-based-loading-duplication.md` (similar pattern)

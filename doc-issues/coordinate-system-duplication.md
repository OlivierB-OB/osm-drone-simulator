# Issue: Coordinate System Z-Negation Duplication

## Severity
🔴 **SEVERE** - Critical system concept repeated in 6 files

## Summary
The Z-negation formula and explanation (`Mercator Y → Three.js -Z`) is duplicated across multiple documentation files. This is the single most important coordinate transformation in the system; readers need ONE authoritative source.

## Affected Files

### Current State (Duplicated)
1. **`doc/coordinate-system.md`** (lines 13-49)
   - Full specification with formulas and direction vectors
   - Most detailed version

2. **`doc/architecture.md`** (lines 120-141)
   - "Key Conceptual Insights" section
   - Summary of separation of concerns and world representation

3. **`doc/patterns.md`** (lines 240-252)
   - "Three.js Integration Patterns" section
   - Technical pattern explanation with code

4. **`doc/data/elevations.md`** (lines 361-383)
   - "Coordinate Consistency: Mercator to Three.js" section
   - Context-specific explanation

5. **`doc/visualization/ground-surface.md`** (lines 269-307)
   - "Coordinate System & Z-Negation" section
   - Detailed explanation with mesh positioning

6. **`doc/visualization/objects.md`** (lines 753-782)
   - "Coordinate System Reference" section
   - Quick reference with verification test

## Duplicated Content Examples

### The Formula (repeated verbatim in 4 files)
```
Three.js X = Mercator X         (East = +X)
Three.js Y = Elevation          (Up = +Y)
Three.js Z = -Mercator Y        (North = -Z)
```

**Appears in:**
- `coordinate-system.md:33-36`
- `ground-surface.md:284-289`
- `elevations.md:375-377`
- `objects.md:561-566`

### The Explanation (repeated in all 6 files)
"Mercator Y increases northward, but Three.js camera looks along -Z. By mapping Z = -Y, north aligns with the camera's default forward direction."

**Appears in:**
- `coordinate-system.md:38-39`
- `architecture.md:138-140`
- `elevations.md:379-381`
- `ground-surface.md:273-280`
- `objects.md:568-572`
- `patterns.md:242-252`

### Direction Vectors (repeated in 3 files)
```
Forward = (sin(azimuth), 0, -cos(azimuth))
Right   = (cos(azimuth), 0,  sin(azimuth))
Behind  = (-sin(azimuth), 0, cos(azimuth))
```

**Appears in:**
- `coordinate-system.md:43-49`
- `ground-surface.md:45-49` (implied)
- `patterns.md:246-251`

## Root Cause
- Coordinate system is so critical that each data/visualization module felt compelled to include full explanation
- No explicit cross-linking between documents
- Each doc was written independently; no deduplication pass

## Impact
- **Inconsistency Risk:** If the formula changes, all 6 files must be updated simultaneously or readers see contradictory information
- **Maintenance Burden:** Changes require edits in multiple places
- **Reader Confusion:** Which version is authoritative? Can I trust this explanation in this doc?
- **Cognitive Load:** Reading multiple docs repeats the same concept unnecessarily

## Solution

### Proposed Action
1. **Expand `doc/coordinate-system.md`** as the single authoritative reference
   - Keep all formulas, derivations, examples, proofs
   - Already the most comprehensive version
   - Add verification examples (Paris, Mount Everest)

2. **Replace detailed explanations elsewhere** with cross-links
   - `doc/architecture.md:120-141` → Brief mention + link to coordinate-system.md
   - `doc/patterns.md:240-252` → Link instead of full explanation
   - `doc/data/elevations.md:361-383` → Keep 1-2 sentence summary, link to source
   - `doc/visualization/ground-surface.md:269-307` → Simplify, add "see coordinate-system.md"
   - `doc/visualization/objects.md:753-782` → Brief reference + link

### Implementation Pattern
Replace detailed sections with:
```markdown
**Coordinate System:** Mercator coordinates (X, Y in meters, Y northward)
are mapped to Three.js space as (X, elevation, -Y). The Z-negation is critical:
Mercator Y increases northward, but Three.js camera looks along -Z, so negating
Z aligns north with the camera's default forward direction.

See **[doc/coordinate-system.md](../coordinate-system.md)** for the complete
specification, including direction vectors, chase camera positioning, and
detailed proofs with real-world examples (Paris, Mount Everest).
```

## Verification
After deduplication, a reader should be able to:
1. Understand the concept (1-2 sentence summary in their current doc)
2. Find the authoritative source (cross-link to coordinate-system.md)
3. Verify the formula (coordinate-system.md shows it once, correctly)
4. See examples (coordinate-system.md provides Paris and Mount Everest coordinates)

## Related Issues
- See also: `three-js-formula-duplication.md` (subset of this issue)
- See also: `configuration-values-duplication.md` (similar pattern, less critical)

# Issue: Web Mercator Projection Overview Duplication

## Severity
🟡 **MINOR** - Explanations are context-appropriate, but basic concept repeated in 4 files

## Summary
The Web Mercator projection basics are explained in 4 separate documentation files. While these explanations are contextual (each doc uses them for different purposes), the fundamental concept of "X increases east, Y increases north" is repeated multiple times unnecessarily.

## Affected Files

### Current State (4 Files with Web Mercator Explanations)

1. **`doc/coordinate-system.md` lines 13-27**
   - "Mercator Coordinates" section
   - Full projection details
   - Conversion formula included
   - **Most detailed version**

2. **`doc/data/elevations.md` lines 172-182**
   - "Web Mercator Projection (EPSG:3857)" section
   - Same basics explained
   - Less detail than coordinate-system.md

3. **`doc/visualization/ground-surface.md` lines 215-228**
   - "Web Mercator Projection" section
   - Similar explanation
   - Context-specific notes

4. **`doc/visualization/objects.md` lines 533-539**
   - "Web Mercator Projection" section
   - Brief explanation
   - Focus on tiles

## Duplicated Content Examples

### "X Increases East, Y Increases North"
**Appears in all 4 files:**
- coordinate-system.md:16-18 "X increases **eastward**, Y increases **northward**"
- elevations.md:177-179 "X increases **eastward**, Y increases **northward**"
- ground-surface.md:217-219 "X increases eastward, Y increases northward"
- objects.md:563-564 "X increases eastward, Y increases northward"

### Tile Coordinate System (z/x/y)
**Appears in 3 files:**
- coordinate-system.md:13 "z/x/y tile coordinates"
- elevations.md:185-193 (full tile coordinate explanation)
- objects.md:539-541 (tile coordinate explanation)

Both explain that `z = zoom level, x = column, y = row`.

### Geographic Grid Visualization
**Appears in 2 files:**
- elevations.md:218-236 (ASCII diagram of tile grid)
- objects.md:542-555 (coordinate notation diagram)

Different formats but same concept.

## Problem Details

### Why This is Only MINOR Severity

Unlike coordinate system Z-negation (SEVERE) or configuration values (MODERATE), Web Mercator duplication is acceptable because:

1. **Context-Appropriate Explanations**
   - Elevation docs focus on tile loading: "tiles at zoom 15"
   - Visualization docs focus on positioning: "x/y/z mapping"
   - Object docs focus on spatial grid: "tile coordinates"
   - Each explanation serves its document's purpose ✓

2. **Not Identical Copy-Paste**
   - Explanations vary in length and focus
   - Each includes relevant context
   - Reader learning progression is natural

3. **Low Change Probability**
   - Web Mercator is a standard (won't change)
   - Unlike Z-negation formula (critical, could need fixes)
   - Unlike configuration values (frequently tuned)

### Actual Problem Areas

However, some concerns remain:

1. **Reader's First Question:** "Why is this explained again?"
   - After reading it in coordinate-system.md, seeing it in elevations.md feels redundant
   - Not wrong, just... repetitive

2. **Cognitive Load**
   - Reader skimming docs encounters same basics 4 times
   - Might miss actual differences between contexts
   - Slight brain fatigue

3. **Cross-Linking Confusion**
   - If coordinate-system.md has full Mercator explanation
   - Should other docs link to it?
   - Currently some do, some don't

## Root Cause
Standard practice in documentation: explain concepts where they're first needed.

Each doc author:
- Wanted self-contained explanations
- Assumed readers might not read other docs
- Included basics for clarity
- Didn't realize 4 independent docs would all do the same

## Impact Assessment

### Low-Risk Scenarios
The current duplication causes minimal problems:
- ✓ Not identical word-for-word
- ✓ Each has appropriate context
- ✓ Standard concept (won't change)
- ✓ Readers generally understand the concept after first encounter

### Minor Issues
1. **Wasted Reading Time**
   - Reader goes through same explanation 4 times
   - Each reads "X = east, Y = north"
   - After third time: "Yeah, I get it"

2. **Formatting Inconsistency**
   - Some docs use "EPSG:3857" notation
   - Some use "Web Mercator (EPSG:3857)"
   - Some just say "Web Mercator"
   - No confusion, but inconsistent style

## Solution

### Proposed Action
**OPTIONAL** - This is low priority. If you decide to address it:

#### Light Deduplication (Recommended for MINOR severity)
Don't eliminate explanations entirely (they're context-appropriate), but:

1. **Add Cross-Link in coordinate-system.md**
   ```markdown
   ## Mercator Coordinates

   Standard Web Mercator projection (EPSG:3857):
   - **X** increases **eastward**
   - **Y** increases **northward**
   - Origin at (0, 0) = equator and prime meridian
   - Paris (48.853°N, 2.350°E) ≈ (261,700, 6,250,000)

   This projection is used throughout the system:
   - Elevation tiles (AWS Terrarium)
   - Contextual data (OpenStreetMap via Overpass)
   - Object positioning (buildings, terrain, etc.)

   See **[Elevation Data System](data/elevations.md)** and
   **[Ground Surface Rendering](visualization/ground-surface.md)**
   for examples of how Mercator coordinates are used.
   ```

2. **In other docs, add reference to coordinate-system.md**
   ```markdown
   ## Web Mercator Projection

   The system uses **Web Mercator coordinates** (EPSG:3857):
   X increases eastward, Y increases northward.
   See [doc/coordinate-system.md](../coordinate-system.md)
   for the complete specification and conversion formulas.

   At zoom 15, each tile covers ~2.1km × 2.1km.
   ```

### Why Not Full Consolidation?
Unlike coordinate system Z-negation (consolidate completely), Web Mercator can stay partially distributed because:
- Each doc needs to explain it for its specific context
- Readers benefit from seeing it in application context
- Risk of change is minimal (standard projection)
- Brief summary + link balances clarity with non-repetition

## Verification Checklist

After implementation (if you pursue this):
- [ ] coordinate-system.md remains primary reference for projection details
- [ ] Other docs include brief explanation + link (not repeated full explanation)
- [ ] Readers of elevations.md understand the projection
- [ ] Readers of visualization docs understand the projection
- [ ] No word-for-word identical explanations across 4 files
- [ ] Links are relative and working

## Related Issues
- See: `coordinate-system-duplication.md` (similar concept, higher severity)
- See: `glossary-consolidation.md` (could explain Mercator in glossary)

## Priority
**Very Low** - This is acceptable duplication and solving it is optional.
Only pursue if you're doing a documentation cleanup pass.

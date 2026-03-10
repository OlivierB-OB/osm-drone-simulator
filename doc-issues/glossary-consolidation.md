# Issue: Multiple Glossaries Should Be Consolidated

## Severity
🟠 **MODERATE** - Four separate glossaries with overlapping terms

## Summary
The documentation includes four separate "Glossary" sections in different files, each defining overlapping technical terms. These should be consolidated into a single master glossary for easier reference and consistency.

## Affected Files

### Current Glossaries

1. **`doc/data/elevations.md` lines 468-478** (11 terms)
   - Terrarium, Web Mercator, z/x/y, Ring, Bilinear interpolation, Conformal projection, Tile size, Sub-meter precision

2. **`doc/data/contextual.md` lines 909-947** (39 terms)
   - Aeroway, Bounding Box, Feature Classification, Graceful Degradation, IndexedDB, Landuse, Mercator Projection, Natural, Overpass API, OverpassJSON, OverpassQL, Ring, Strategy Pattern, Tag, Terrarium, Tile, TTL, Way, Zoom Level

3. **`doc/visualization/ground-surface.md` lines 457-474** (18 terms)
   - Web Mercator, Tile, Terrarium Format, Ring-Based Loading, Canvas Texture, Painter's Algorithm, Z-Negation, MeshPhongMaterial, Mipmapping, Vertex Normal, OSM, Index Buffer, UV Coordinates

4. **`doc/visualization/objects.md` lines 785-803** (19 terms)
   - Azimuth, Bilinear Interpolation, Bounding Box (OBB), Centroid, Elevation Tile, ExtrudeGeometry, InstancedMesh, Mercator Projection, Ring System, Strategy Pattern, Tapered Cylinder, Terrarium Format, Tile Key, Winding Order, Zoom Level

## Overlapping Terms (Defined Multiple Times)

### High-Overlap Terms
These are defined in **2+ files**:

1. **Web Mercator** (appears in 3 glossaries)
   - elevations.md: "Web Mercator (EPSG:3857) - GPS-aligned projection; X=east, Y=north"
   - ground-surface.md: "Web Mercator - Cylindrical map projection... Distorts polar regions..."
   - objects.md: "Mercator Projection - Web mapping standard used for tile coordinates..."

2. **Ring / Ring-Based Loading** (appears in 3+ glossaries)
   - elevations.md: "Ring - Set of tiles around drone center; updates as drone moves"
   - ground-surface.md: "Ring-Based Loading - Concentric grid pattern around drone..."
   - objects.md: "Ring System - 3×3 grid of tiles loaded around drone position"
   - contextual.md: "Ring - Circular pattern of tiles loaded around drone (3×3 grid...)"

3. **Tile / Tile Coordinates** (appears in 3+ glossaries)
   - elevations.md: "Tile size - 256×256 pixels per tile (standard Web Mercator tile)"
   - contextual.md: "Tile - Rectangular region in Web Mercator grid (256×256 pixels)..."
   - ground-surface.md: "Tile (z:x:y) - Grid cell in Web Mercator..."
   - objects.md: "Tile Key - Unique identifier for a tile: `"z:x:y"`..."

4. **Terrarium / Terrarium Format** (appears in 3+ glossaries)
   - elevations.md: "Terrarium - Mapbox's PNG-based elevation tile service"
   - contextual.md: "Terrarium - AWS elevation tile service..."
   - ground-surface.md: "Terrarium Format - PNG encoding scheme: (R × 256 + G + B/256)..."
   - objects.md: "Terrarium Format - AWS elevation PNG format; RGB channels encode..."

5. **Strategy Pattern** (appears in 2+ glossaries)
   - contextual.md: "Strategy Pattern - Design pattern using separate functions..."
   - objects.md: "Strategy Pattern - Design pattern using interchangeable algorithms..."

6. **Mercator Projection / Coordinates** (appears in 2+ glossaries)
   - elevations.md: "Web Mercator (EPSG:3857)"
   - contextual.md: "Mercator Projection - Web mapping standard..."
   - objects.md: "Mercator Projection - Web standard map projection..."

7. **Zoom Level** (appears in 2+ glossaries)
   - contextual.md: "Zoom Level - Web Mercator parameter (15 ≈ 327m per tile...)"
   - objects.md: "Zoom Level - Web Mercator scale (15 = ~327m/tile)..."

### Unique Terms Per Glossary

**Only in elevations.md:**
- Bilinear interpolation
- Conformal projection
- Sub-meter precision

**Only in contextual.md:**
- Aeroway, Bounding Box, Feature Classification, Graceful Degradation, IndexedDB, Landuse, Natural, Overpass API, OverpassJSON, OverpassQL, Tag, TTL, Way

**Only in ground-surface.md:**
- Canvas Texture, Painter's Algorithm, Z-Negation, MeshPhongMaterial, Mipmapping, Vertex Normal, Index Buffer, UV Coordinates

**Only in objects.md:**
- Azimuth, Centroid, Elevation Tile, ExtrudeGeometry, InstancedMesh, Tapered Cylinder, Winding Order

## Problem Details

### Definition Inconsistency
The same term gets slightly different definitions depending on which glossary you read:

**Web Mercator:**
- elevations.md: "GPS-aligned projection; X=east, Y=north"
- ground-surface.md: "Cylindrical map projection... Distorts polar regions..."
- objects.md: "Web standard map projection (EPSG:3857)..."

All correct, but different emphasis. Reader wonders: Are these the same thing?

**Terrarium:**
- elevations.md: "Mapbox's PNG-based elevation tile service"
- contextual.md: "AWS elevation tile service..." (different attribution!)
- ground-surface.md: "PNG encoding scheme: (R × 256 + G + B/256)..."

Contextual glossary incorrectly attributes Terrarium to AWS (it's Mapbox!).

**Ring:**
- elevations.md: "Set of tiles around drone center; updates as drone moves"
- ground-surface.md: "Concentric grid pattern around drone..."
- objects.md: "3×3 grid of tiles loaded around drone position"
- contextual.md: "Circular pattern of tiles loaded around drone..."

Same concept, slightly different wording each time.

### Reader Navigation Problem
When reading across multiple docs, a reader encounters:
1. Read elevations.md → see "Terrarium - Mapbox's PNG-based elevation tile service"
2. Read contextual.md → see "Terrarium - AWS elevation tile service" (different!)
3. ❌ Reader confused: Is Terrarium Mapbox or AWS?

### Maintenance Burden
If a definition needs clarification:
- Update it in one glossary
- Forget to update the other 3
- Inconsistency spreads

Example: If Terrarium changes hands or gets better documentation:
- Would need to update 4 different glossary entries
- Easy to miss one or make them inconsistent

## Root Cause
Each module author included a glossary of terms used in that document.

This was good for document independence, but created:
- Duplication of general terms
- Potential inconsistency
- Reader confusion about which definition is canonical
- Maintenance burden

## Impact Assessment

### Medium-Risk Scenarios

1. **Definition Changes**
   - Term "Tile" needs clarification
   - Update glossary in elevations.md
   - Forget to update other 3
   - Readers of contextual.md and objects.md see old definition

2. **Terminology Error**
   - contextual.md incorrectly attributes Terrarium to AWS
   - Elevations.md correctly says Mapbox
   - Reader gets wrong information depending on which doc they read

3. **Difficult Searching**
   - Developer searches for "Tile" definition
   - Gets 4 results with slightly different wording
   - Hard to know which is most accurate

## Solution

### Proposed Action

#### Create Master Glossary
1. **Create `doc/glossary.md`** with all terms (alphabetically sorted)
   ```markdown
   # Glossary of Terms

   ## A

   ### Aeroway
   OSM feature for airport infrastructure (runways, taxiways, helipads).

   ### Azimuth
   Compass bearing in degrees (0°=North, clockwise positive).

   ### Azimuth Grid
   [Grid of all azimuths showing directions...]

   ## B

   ### Bilinear Interpolation
   Smoothing technique using 4 nearest values to interpolate between discrete sample points.
   Used in elevation sampling to smooth transitions between tile pixels.

   ### Bounding Box (BBox / OBB)
   Rectangle defined by min/max latitude and longitude. Used in Overpass queries to scope
   OSM data to tile area. Also: Oriented Bounding Box - minimal rectangle aligned with polygon.

   [... rest of glossary ...]
   ```

2. **Replace glossary sections in each doc**
   - Remove "Glossary" sections from all 4 files
   - Add at end of each document:
     ```markdown
     ## See Also

     - **[Glossary](../glossary.md)** - Definitions of all technical terms used in this document
     ```

3. **Update cross-references**
   - In doc body text, can reference glossary:
     ```markdown
     Uses the Web Mercator projection (see [glossary](../glossary.md#web-mercator))
     with ring-based loading to manage tiles.
     ```

### Benefits of Consolidation
- ✓ Single definition of each term
- ✓ Easier to search for term definitions
- ✓ Consistent terminology across all docs
- ✓ Less maintenance (update once, not 4 times)
- ✓ Readers know where to find definitions
- ✓ Catch terminology errors (Terrarium attribution)

### Consolidated Glossary Structure
```markdown
# Glossary

## A-C
- Aeroway
- Azimuth
- Bilinear Interpolation
- Bounding Box (OBB)
- Canvas Texture
- Centroid
- Conformal projection
- ... etc

## D-G
- Elevation Tile
- ExtrudeGeometry
- Feature Classification
- Graceful Degradation
- ... etc

## H-M
- IndexedDB
- Index Buffer
- InstancedMesh
- Landuse
- MeshPhongMaterial
- Mercator Projection
- Mipmapping
- ... etc

## N-S
- Natural
- Overpass API
- OverpassJSON
- OverpassQL
- ... etc

## T-Z
- Tag
- Terrarium
- Tile
- Winding Order
- Zoom Level
- Z-Negation
```

## Affected Files to Update

**Create:**
- `doc/glossary.md` - Master glossary with all terms

**Remove glossary sections from:**
1. `doc/data/elevations.md` lines 468-478
2. `doc/data/contextual.md` lines 909-947
3. `doc/visualization/ground-surface.md` lines 457-474
4. `doc/visualization/objects.md` lines 785-803

**Add reference to:**
- End of each above file: "See [Glossary](../glossary.md) for term definitions"

## Verification Checklist

After implementation:
- [ ] `doc/glossary.md` created with all terms
- [ ] Alphabetically sorted
- [ ] No duplicate definitions
- [ ] Corrected Terrarium attribution (Mapbox, not AWS)
- [ ] Consistent definition style (topic sentence + detail)
- [ ] All 4 original glossary sections removed
- [ ] Each doc has cross-link to master glossary
- [ ] No relative link issues (handles doc/ subdirectories)
- [ ] Reader of any doc can quickly find "Glossary" link at bottom

## Related Issues
- See: `coordinate-system-duplication.md` (similar consolidation pattern)
- See: `configuration-values-duplication.md` (similar centralization concept)

## Priority
**Medium** - Good cleanup that improves consistency and maintainability.
Worth doing in a documentation pass, but lower priority than coordinate system duplication.

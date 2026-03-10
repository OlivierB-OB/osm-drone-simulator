# Issue: Data Pipeline Flow Diagrams Duplication

## Severity
🟠 **MODERATE** - Pattern repeated consistently, but appropriately distributed by context

## Summary
Four documentation files include data pipeline flow diagrams showing the progression from raw data → manager → parser → factory → visualization. While the pattern is consistent and helpful, the format and content are nearly identical across files, creating visual repetition.

## Affected Files

### Current State (4 Files with Pipeline Diagrams)

1. **`doc/data/elevations.md` lines 12-26**
   - Elevation data pipeline diagram
   - AWS Terrarium → Manager → Parser → Factory → Scene

2. **`doc/data/contextual.md` lines 13-38**
   - OpenStreetMap data pipeline diagram
   - Nearly identical structure to elevations.md
   - Overpass API → Manager → Parser → Factory → Scene

3. **`doc/visualization/ground-surface.md` lines 12-50**
   - "High-Level Data Flow" diagram
   - Elevation Pipeline + Texture Pipeline
   - Shows dual-track processing (elevation vs. texture)
   - More detailed with intermediate steps

4. **`doc/visualization/objects.md` lines 16-29**
   - OSM Tile Data pipeline
   - GeoJSON → Parser → Factory → ElevationSampler → Scene
   - Simplified version showing 5 main stages

## Duplicated Content Examples

### The Pattern (repeated in all 4 files)
```
Source Data
    ↓
Manager (loads/caches tiles)
    ↓
Parser (extracts features)
    ↓
Factory (creates 3D geometry)
    ↓
Three.js Scene
```

### Elevation Pipeline (elevations.md:14-26)
```
AWS Terrarium (PNG)
       ↓
ElevationDataManager (loads/caches tiles around drone)
       ↓
ElevationDataTileParser (decodes Terrarium PNG format)
       ↓
Elevation grid [256×256] (elevation values in meters)
       ↓
TerrainGeometryFactory (creates Three.js mesh)
       ↓
3D Visualization (terrain surface in scene)
```

### Contextual Pipeline (contextual.md:15-38)
```
OpenStreetMap (via Overpass API)
       ↓
ContextDataManager (loads/caches tiles around drone)
       ↓
ContextDataTileParser (parses OverpassJSON, classifies features)
       ↓
Feature categories:
  - Buildings (3D extrusion to canvas + mesh)
  - Roads (canvas texture)
  - ...
       ↓
TerrainTextureObjectManager (renders to canvas for terrain)
MeshObjectManager (creates 3D meshes for buildings, trees, structures)
       ↓
3D Visualization (textured terrain + 3D objects in scene)
```

**Observation:** Nearly identical structure; only the names and intermediate steps differ.

### Ground Surface Pipeline (ground-surface.md:12-50)
```
┌──────────────────────────────────────────────────────────┐
│                    Terrain Rendering System               │
├──────────────────────────────────────────────────────────┤
│                                                            │
│  Elevation Pipeline              Texture Pipeline         │
│  ───────────────────────────     ─────────────────────    │
│                                                            │
│  ElevationData                   ContextData (OSM)        │
│        │                              │                   │
│        ├─ Ring-based loading          ├─ Ring-based load  │
│        ├─ Tile caching                ├─ Tile caching     │
│        │                              │                   │
│        ↓                              ↓                   │
│  TerrainGeometryFactory          TerrainCanvasRenderer    │
│        │                              │                   │
│        ├─ 256×256 vertices           ├─ 2048×2048 canvas │
│        ├─ Elevation sampling          ├─ OSM feature draw │
│        │                              │                   │
│        ↓                              ↓                   │
│  Three.js Geometry + Normals     Canvas Texture          │
│        │                              │                   │
│        └──────────┬───────────────────┘                   │
│                   │                                       │
│                   ↓                                       │
│         TerrainObjectFactory                             │
│                   │                                       │
│                   ├─ Create mesh (geometry + texture)    │
│                   ├─ Position at tile center             │
│                   │                                       │
│                   ↓                                       │
│         Three.js Mesh in Scene                           │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

More detailed and shows dual pipeline (good).

### Objects Pipeline (objects.md:433-493)
```
OSM Tile Data (GeoJSON)
        ↓
STAGE 1: Feature Extraction (Parser)
        ↓
STAGE 2: Mesh Creation (Factories with Strategies)
        ↓
Elevation Integration (ElevationSampler)
        ↓
Position in Three.js Scene
        ↓
MeshObjectManager
```

Simplified and linear (appropriate for objects context).

## Problem Details

### Reader Recognition Pattern
A reader opening multiple docs encounters:
1. **Read elevations.md** → See pipeline diagram → "Good, I understand the pattern"
2. **Read contextual.md** → See nearly identical diagram → "Oh, same pattern"
3. **Read ground-surface.md** → See expanded version → "OK, more detail"
4. **Read objects.md** → See simplified version → "Same idea again"

Result:
- ✓ Pattern recognition good (consistency is helpful)
- ❓ Is this repetition or important variation?
- ❓ Are the diagrams showing the same concept or different?

### Consistency vs. Repetition
**Good side:**
- Pattern consistency helps readers understand architecture
- Each shows the pattern applied to different data types
- Readers recognize "this is a manager → parser → factory system"

**Problem side:**
- Diagram format is nearly identical in 4 files
- Reader time spent reading similar diagrams
- Subtle variations hard to distinguish at a glance

### Formatting Inconsistency
- Some diagrams use `→` arrows (ASCII)
- Some use Unicode arrows (`↓`)
- Some use boxes with borders (ASCII art)
- Some are plain text with indentation

Inconsistent style across 4 files.

## Root Cause
Good architectural instinct: each data system (elevation, contextual) deserves its own pipeline diagram showing how it flows through the system.

However:
- No shared template for pipeline diagrams
- Each author formatted independently
- Didn't recognize the pattern was repeating across 4 files
- No pass to standardize formats

## Impact Assessment

### Low-Risk Scenarios
Current repetition isn't critical because:
- ✓ Pattern is consistent (readers understand the architecture)
- ✓ Each diagram shows actual differences (not identical copies)
- ✓ Diagrams are helpful (worth including in each doc)
- ✓ Readers benefit from seeing pattern applied to different data

### Minor Issues

1. **Visual Clutter**
   - Readers see 4 similar diagrams in sequence
   - Might feel like unnecessary repetition
   - Could blur the important differences

2. **Formatting Inconsistency**
   - Some use fancy ASCII boxes, some use plain arrows
   - Some use vertical layout, some show dual pipelines
   - Inconsistent style is unprofessional

3. **Hard to Compare**
   - If reader wants to compare elevation vs. contextual pipelines
   - Need to flip between files
   - Difficult to see similarities and differences side-by-side

## Solution

### Proposed Action
**OPTIONAL** - Lower priority than coordinate system or configuration issues.

#### Option A: Create Standard Pipeline Diagram Template (RECOMMENDED)
1. **Create `doc/patterns/data-pipeline.md`**
   ```markdown
   # Data Pipeline Pattern

   The system follows a consistent pattern for handling data:

   ```
   Source → Manager → Parser → Factory → Visualization
   ```

   **Stage 1: Manager**
   - Ring-based tile loading around drone
   - In-memory and IndexedDB caching
   - Lifecycle management (load/unload)

   **Stage 2: Parser**
   - Decode raw data format (PNG, JSON, etc.)
   - Extract relevant features
   - Classify into visual types

   **Stage 3: Factory**
   - Convert features to 3D geometry
   - Create Three.js objects (meshes, textures)
   - Apply materials and colors

   **Stage 4: Visualization**
   - Add objects to Three.js scene
   - Manager coordinates lifecycle
   - Seamless loading/unloading

   ## Examples

   This pattern is applied to:
   - **Elevation Data**: AWS Terrarium PNG tiles
   - **Contextual Data**: OpenStreetMap via Overpass
   - **Terrain Texture**: Canvas rendering of OSM features
   - **3D Objects**: Buildings, vegetation, structures

   See specific system docs for implementation details.
   ```

2. **In each system doc, reference the pattern**
   ```markdown
   ## Architecture

   The elevation system follows the standard **Data Pipeline Pattern**
   (see [patterns/data-pipeline.md](../../patterns/data-pipeline.md)):

   ```
   AWS Terrarium (PNG)
       ↓
   ElevationDataManager
       ↓
   ElevationDataTileParser
       ↓
   TerrainGeometryFactory
       ↓
   Three.js Scene
   ```

   For the general pattern explanation and how it applies across
   the system, see the Data Pipeline Pattern document.
   ```

3. **Keep feature-specific diagrams** (not eliminated)
   - Each doc shows diagram relevant to its context
   - But less explanation (readers know the pattern)
   - More focus on feature-specific details

#### Option B: Standardize Diagram Format (Lighter Approach)
If you don't want to create a new patterns doc:

1. **Choose a standard ASCII format**
   - Use consistent arrow style (all Unicode arrows or all ASCII)
   - Use consistent box style (all simple, or all fancy)
   - Apply consistently across all 4 files

2. **Add brief legend**
   ```markdown
   ## Data Flow

   The system uses this standard pipeline:

   [Source] → [Manager] → [Parser] → [Factory] → [Scene]

   Each system (elevation, contextual, texture) follows this pattern.
   ```

### Why Not Full Consolidation?
Unlike Z-negation formula (must consolidate), pipeline diagrams should stay distributed because:
- ✓ Readers benefit from seeing pattern in context
- ✓ Each diagram shows feature-specific details
- ✓ Distribution aids understanding ("here's how elevation works")
- ✓ Consolidation might obscure how concepts apply

## Verification Checklist

If pursuing this issue:
- [ ] Standard pipeline pattern documented (if Option A)
- [ ] All diagrams use consistent formatting
- [ ] Each doc references the pattern clearly
- [ ] Feature-specific details visible in each diagram
- [ ] No word-for-word identical diagrams
- [ ] Readers understand pattern and variations

## Related Issues
- See: `coordinate-system-duplication.md` (similar architecture, higher severity)
- See: `glossary-consolidation.md` (could explain "Manager", "Parser", "Factory" once)

## Priority
**Low-Medium** - Worth fixing if doing a documentation cleanup, but not urgent.
Current duplication is consistent and helpful (good repetition, not bad).

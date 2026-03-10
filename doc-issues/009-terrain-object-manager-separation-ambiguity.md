# Issue 009: TerrainObjectManager vs Component Separation Ambiguity

## Severity
🟡 **Medium** - Potential confusion about architecture

## Description
Documentation uses "TerrainObjectManager" to describe the high-level terrain orchestrator, but the actual system separates into TerrainGeometryObjectManager and TerrainTextureObjectManager. This terminology mismatch could confuse developers about what TerrainObjectManager actually does.

## Locations
1. `doc/visualization/ground-surface.md` lines 100-111
2. `doc/architecture.md` lines 38-47
3. `CLAUDE.md` section on Core Components

## Current Text

### architecture.md (38-47)
```
### Terrain Visualization
- **TerrainObjectManager**: Oversees the complete terrain rendering pipeline
  - Coordinates geometry generation and texture application
  - Creates/removes 3D mesh objects as needed
- **TerrainGeometryObjectManager**: Converts raw elevation data into 3D mesh geometry
  - Builds the terrain surface from elevation tiles
  - Culls meshes that are too far away or out of view
- **TerrainTextureObjectManager**: Renders textures (colors, patterns) on terrain
  - Generates visual appearance based on elevation and context data
```

### ground-surface.md (100-111)
```
### 3. Mesh Integration
Orchestrates both pipelines and creates final 3D meshes:

```
TerrainObjectManager (watches drone position)
        ├─ tile added → TerrainGeometryFactory
        ├─ tile added → TerrainCanvasRenderer
        ├─ both complete → TerrainObjectFactory creates mesh
        └─ position mesh in Three.js scene
```
```

## The Problem
1. **Naming ambiguity**: "TerrainObjectManager" sounds like it manages terrain objects
2. **Actual role unclear**: Is it a high-level orchestrator or a specific component?
3. **Relationship to factories unclear**: Does TerrainObjectManager use TerrainObjectFactory?
4. **Component count confusion**: Three components (Manager, GeometryManager, TextureManager) vs. two (Geometry, Texture)
5. **Possible missing component**: "TerrainObjectManager" or "TerrainMeshManager" might be implicit

## Questions Needing Answers
1. Does `TerrainObjectManager` actually exist in the codebase?
2. If yes: What files does it coordinate? (TerrainGeometryObjectManager + TerrainTextureObjectManager?)
3. If no: What orchestrates the two components?
4. Is `TerrainObjectFactory` separate from manager classes?
5. What is the actual class hierarchy?

## Likely Scenarios

### Scenario A: TerrainObjectManager is High-Level Orchestrator
```
TerrainObjectManager
  ├─ subscribes to drone position
  ├─ manages TerrainGeometryObjectManager
  ├─ manages TerrainTextureObjectManager
  └─ coordinates mesh creation/disposal
```

### Scenario B: Direct Subscription Model
```
TerrainGeometryObjectManager
  ├─ subscribes to elevation data
  └─ creates meshes directly

TerrainTextureObjectManager
  ├─ subscribes to context data
  └─ creates textures directly
```

### Scenario C: Mixed Pattern
```
TerrainObjectManager (watches drone)
  └─ coordinates factories (TerrainGeometryFactory, TerrainCanvasRenderer)

TerrainGeometryObjectManager & TerrainTextureObjectManager
  └─ separate listeners/handlers
```

## Impact
- **Developer confusion**: Unclear how terrain rendering is orchestrated
- **Maintenance difficulty**: If naming doesn't match implementation, docs become misleading
- **Integration difficulty**: New developers can't determine what to subscribe to for terrain events

## Solution
1. **Verify actual implementation**
   - Search codebase for `TerrainObjectManager`, `TerrainGeometryObjectManager`, `TerrainTextureObjectManager`
   - Determine actual class names and responsibilities
   - Map actual files to documentation

2. **Update documentation** to match implementation exactly:
   - Use actual class names
   - Show actual responsibility boundaries
   - Create accurate call/data flow diagram

3. **Add concrete examples**:
   ```markdown
   **TerrainObjectManager** (`src/visualization/terrain/TerrainObjectManager.ts`)
   - Subscribes to `drone.locationChanged` event
   - Calls `elevationData.setLocation()` and `contextData.setLocation()`
   - Emits: `meshAdded`, `meshRemoved`
   ```

## Files Needing Verification
1. `src/visualization/terrain/` - list all files
2. Check for actual class names:
   - `TerrainObjectManager.ts` (exists?)
   - `TerrainGeometryObjectManager.ts` (exists?)
   - `TerrainTextureObjectManager.ts` (exists?)
   - `TerrainObjectFactory.ts` (exists?)
   - `TerrainGeometryFactory.ts` (exists?)
   - `TerrainCanvasRenderer.ts` (exists?)

## Files to Update
1. `doc/architecture.md` - verify component names and responsibilities
2. `doc/visualization/ground-surface.md` - update orchestration diagram
3. `CLAUDE.md` - update core components section if needed

## Status
⏳ Pending Verification & Fix

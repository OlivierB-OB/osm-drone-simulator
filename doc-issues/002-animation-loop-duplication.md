# Issue 002: Animation Loop Documentation Duplication

## Severity
🟡 **Medium** - Maintenance burden, inconsistency risk

## Description
The animation frame sequence (7-9 steps) is documented in three separate places with minor variations. This creates a single source of truth problem: if the actual animation loop changes, all three docs must be updated to stay consistent.

## Locations
1. `doc/data/elevations.md` lines 344-357 (7 steps + title)
2. `doc/visualization/ground-surface.md` lines 315-323 (7 steps, slight variation)
3. `doc/data/contextual.md` lines 740-752 (9 steps, more detailed)

## Current Inconsistencies

### Version 1: elevations.md (344-357)
```
AnimationLoop.tick(deltaTime):
  1. drone.applyMove(deltaTime)
  2. elevationData.setLocation(...)
  3. contextData.setLocation(...)
  4. terrainObjectManager.refresh()
  5. droneObject.update()
  6. camera.updateChaseCamera()
  7. viewer3D.render()
```

### Version 2: ground-surface.md (315-323)
```
Frame-Rate-Independent Animation Order:
1. drone.applyMove(deltaTime)
2. elevationData.setLocation(drone.location)
3. contextData.setLocation(drone.location)
4. terrainObjectManager.refresh()
5. droneObject.update()
6. camera.updateChaseCamera()
7. viewer3D.render()
```

### Version 3: contextual.md (740-752)
```
1. drone.applyMove(deltaTime)
2. elevationData.setLocation(...)
3. contextData.setLocation()
4. terrainObjectManager.refresh()
5. textureObjectManager.refresh() (implicit) - CREATE TEXTURES ON TILEADDED
6. meshObjectManager.refresh()
7. droneObject.update()
8. camera.updateChaseCamera()
9. viewer3D.render()
```

### Differences
- Version 3 adds explicit steps for `textureObjectManager.refresh()` and `meshObjectManager.refresh()`
- Version 1 & 2 say `terrainObjectManager.refresh()` but contextual.md separates texture + mesh
- Exact parameter styles vary

## Impact
- If actual animation order changes, all three must be updated
- Readers see conflicting information (is step 5 `droneObject.update()` or `textureObjectManager.refresh()`?)
- Risk of docs becoming stale (only one gets updated)

## Solution Options

### Option A: Single Source Reference
Create one canonical `doc/animation-loop.md` and reference it from all three docs:
```markdown
See [Animation Loop Order](../animation-loop.md) for detailed frame timing.
```

### Option B: Move to CLAUDE.md
Move to `CLAUDE.md` (already has Architecture section) since it's the project's source of truth:
```markdown
**Animation Frame Order:**
1. ...
```

### Option C: Keep One, Link Others
Keep most detailed version (contextual.md) as primary, link from other two.

## Recommendation
**Option A** - Create single source of truth in `doc/animation-loop.md` with all variations explained. This:
- Solves single source of truth problem
- Allows side-by-side comparison of concerns (elevation, context, mesh, rendering)
- Makes updates easier
- Central location for animation system understanding

## Files to Update
1. Create `doc/animation-loop.md` (new)
2. Update `doc/data/elevations.md` (link instead of copy)
3. Update `doc/visualization/ground-surface.md` (link instead of copy)
4. Update `doc/data/contextual.md` (link instead of copy)

## Related Files
- `CLAUDE.md` - mentions animation frame order at high level
- `src/core/AnimationLoop.ts` - actual implementation
- `src/App.tsx` - orchestration of animation loop

## Status
⏳ Pending Fix

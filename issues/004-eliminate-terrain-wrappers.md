# Issue 004 — Eliminate Unnecessary Terrain Wrapper Classes

**Severity:** HIGH

## Problem

Three container classes add zero behavior — pure getters over constructor fields:

- `TerrainGeometryObject` (43 LOC) — wraps BufferGeometry + tileKey + bounds
- `TerrainTextureObject` (46 LOC) — wraps Texture + tileKey + bounds
- `TerrainObject` (39 LOC) — wraps Mesh + tileKey

## Proposal

Replace with a single generic type/interface (e.g., `TileResource<T>` with `{ tileKey, resource, bounds, dispose() }`) or inline the data directly into the managers. ~130 lines eliminated.

## Affected Files

- `src/visualization/terrain/geometry/TerrainGeometryObject.ts`
- `src/visualization/terrain/texture/TerrainTextureObject.ts`
- `src/visualization/terrain/TerrainObject.ts`
- All consumers of these classes (managers, factories)

## Estimated Impact

- ~130 lines eliminated
- 3 files deleted or replaced by a single generic type
- Consumers updated to use the shared type

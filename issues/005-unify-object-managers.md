# Issue 005 — Unify Terrain Object Managers

**Severity:** HIGH

## Problem

`TerrainGeometryObjectManager` and `TerrainTextureObjectManager` are **99% identical**: both extend TypedEventEmitter, store objects in `Map<TileKey, T>`, listen to data tile events, call a factory, emit added/removed events. Same structure, same lifecycle.

`MeshObjectManager` follows the same boilerplate pattern.

## Proposal

Extract a generic `TileObjectManager<TInput, TOutput>` base class parameterized by input tile type and output object type. Concrete subclasses only specify the factory call.

## Affected Files

- `src/visualization/terrain/geometry/TerrainGeometryObjectManager.ts`
- `src/visualization/terrain/texture/TerrainTextureObjectManager.ts`
- `src/visualization/mesh/MeshObjectManager.ts`
- New: shared `TileObjectManager.ts` base class

## Estimated Impact

- ~75 lines of duplication eliminated
- 3 managers reduced to thin subclasses specifying only their factory
- 1 new generic base class

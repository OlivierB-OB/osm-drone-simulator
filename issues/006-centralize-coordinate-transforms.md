# Issue 006 — Centralize Coordinate Transforms

**Severity:** MEDIUM

## Problem

`mercatorToThreeJs()` exists in `src/gis/types.ts` but 5+ factory files still do inline Z-negation (`-centroid[1]`, `-midY`, `-y`) instead of calling the utility.

This makes the coordinate convention fragile — if the transform ever changes, each inline usage must be found and updated manually.

## Proposal

Replace all inline `position.set(x, y, -z)` patterns with `mercatorToThreeJs()` calls.

## Affected Files

- `src/visualization/terrain/TerrainObjectFactory.ts` (line 52)
- `src/visualization/mesh/building/BuildingMeshFactory.ts` (lines 180, 186)
- `src/visualization/mesh/barrier/BarrierMeshFactory.ts` (line 49)
- `src/visualization/mesh/bridge/BridgeMeshFactory.ts` (line 79)
- `src/visualization/mesh/vegetation/strategies/SingleTreeStrategy.ts` (line 63)

## Estimated Impact

- ~10 lines changed
- Coordinate convention enforced through a single function
- Reduced risk of Z-negation bugs

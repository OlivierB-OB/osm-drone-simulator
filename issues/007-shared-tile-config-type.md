# Issue 007 — Shared Tile Config Type

**Severity:** MEDIUM

## Problem

`elevationConfig` and `contextDataConfig` in `src/config.ts` have identical fields (`zoomLevel: 15`, `ringRadius: 1`, `maxConcurrentLoads: 3`) defined separately with no shared type.

## Proposal

Create a `TileDataConfig` interface. Both configs extend it with source-specific fields (e.g., `queryTimeout` for context).

## Affected Files

- `src/config.ts`

## Estimated Impact

- ~10 lines changed
- Shared config structure enforced by types
- Supports opportunities #1 and #2 (generic classes can accept `TileDataConfig`)

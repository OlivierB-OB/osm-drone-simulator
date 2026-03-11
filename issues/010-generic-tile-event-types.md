# Issue 010 — Generic Tile Event Types

**Severity:** LOW

## Problem

`ElevationDataEvents` and `ContextDataEvents` both define identical `{ tileAdded: { key, tile }, tileRemoved: { key } }` structures.

## Proposal

Create `TileDataEvents<T>` generic type. Minor standalone improvement but supports opportunities #2 and #5 (generic base classes need generic event types).

## Affected Files

- `src/data/elevation/ElevationDataManager.ts`
- `src/data/contextual/ContextDataManager.ts`
- New: shared `TileDataEvents.ts` type (or colocated with base class from #2)

## Estimated Impact

- ~5 lines of duplication eliminated
- Generic event type reusable by `TileDataManager<T>` base class

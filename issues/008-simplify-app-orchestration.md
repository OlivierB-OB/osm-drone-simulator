# Issue 008 — Simplify App.tsx Orchestration

**Severity:** MEDIUM

## Problem

`App.tsx` initializes 12+ subsystems with interleaved dependency chains. Cleanup order is implicit and fragile.

## Proposal

Extract a `CompositionRoot` or `bootstrap()` function that encapsulates initialization order and returns a single `dispose()` function with correct teardown order. `App.tsx` becomes a thin SolidJS shell.

Benefits from doing #1-5 first (fewer things to wire).

## Affected Files

- `src/App.tsx`
- New: `src/CompositionRoot.ts` (or similar)

## Estimated Impact

- ~30 lines moved/reorganized
- Initialization and teardown order made explicit and testable
- `App.tsx` reduced to UI concerns only

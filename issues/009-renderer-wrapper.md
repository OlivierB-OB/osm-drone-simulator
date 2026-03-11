# Issue 009 — Renderer Wrapper Value

**Severity:** LOW

## Problem

`Renderer.ts` is a pure pass-through — `render()` just delegates to `this.object.render()`. Constructor only calls `setSize()` and `setPixelRatio()`.

## Proposal

Consider inlining into Viewer3D or keeping only if the DI testability value justifies the indirection.

## Affected Files

- `src/3Dviewer/Renderer.ts`
- `src/3Dviewer/Viewer3D.ts` (if inlined)

## Estimated Impact

- ~30 lines eliminated (if inlined)
- One less indirection layer
- Trade-off: reduced DI testability for Renderer in isolation

# Issue 003: Canvas Texture Size Configuration Not Verified

## Severity
🟡 **Medium** - Documentation may be incorrect or outdated

## Description
The ground-surface documentation references a canvas texture config parameter that hasn't been verified against the actual codebase implementation.

## Location
- `doc/visualization/ground-surface.md` line 446
- `doc/visualization/ground-surface.md` line 58

## Current Text
```
| Canvas Size | 2048×2048 pixels | OSM feature texture detail |
```

And in the Key Values section:
```
| `textureConfig.groundCanvasSize: 2048` | Canvas texture dimensions |
```

## Problem
1. **Unverified parameter name**: The key `textureConfig.groundCanvasSize` hasn't been cross-checked against `src/config.ts`
2. **Unknown actual value**: Documentation doesn't indicate whether this is actually 2048 or different
3. **Parameter structure unclear**: Is it `textureConfig` or nested differently in config?
4. **No implementation reference**: No file reference to verify how this config is actually used

## What Needs Verification
1. Does `src/config.ts` actually define a `textureConfig` object?
2. Is the key actually `groundCanvasSize` or something else (e.g., `canvasSize`, `textureSize`, `surfaceTextureSize`)?
3. Is the value actually 2048, or different (1024, 4096)?
4. What file(s) use this config value?

## Impact
- Developers following this documentation might use wrong parameter names
- Config tuning instructions are unreliable
- If actual value differs, performance expectations are incorrect

## Solution
1. **Search** `src/config.ts` for canvas/texture/surface configuration
2. **Find actual** key name, object structure, and value
3. **Locate** the factory/renderer that uses this value
4. **Update** documentation with exact parameter name, value, and implementation file reference
5. **Add cross-reference** to implementation

## Expected Fix
Example format after fix:
```
| Canvas Size | 2048×2048 pixels | OSM feature texture detail (see `TerrainCanvasRenderer.ts:42`) |

### Texture Configuration
See `src/config.ts` lines XXX-XXX for texture rendering options:
```typescript
textureConfig: {
  groundCanvasSize: 2048,  // Canvas dimensions for terrain surface
  // ... other properties
}
```
Used in: `src/visualization/terrain/texture/TerrainCanvasRenderer.ts`
```

## Files to Update
1. `doc/visualization/ground-surface.md` - verify and add implementation reference

## Related Files
- `src/config.ts` - source of truth for config
- `src/visualization/terrain/texture/TerrainCanvasRenderer.ts` - likely consumer
- `src/visualization/terrain/texture/TerrainTextureObjectManager.ts` - likely consumer

## Status
⏳ Pending Verification & Fix

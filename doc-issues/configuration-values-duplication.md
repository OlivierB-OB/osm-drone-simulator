# Issue: Configuration Values Duplication Across Docs

## Severity
🟠 **MODERATE** - Same values repeated in multiple docs; not critical, but creates maintenance burden

## Summary
Configuration values (zoom level, ring radius, concurrency limits, canvas sizes) are mentioned repeatedly across documentation. These values should be referenced from a single source (the actual `src/config.ts` file) rather than copy-pasted into comments.

## Affected Configuration Values

### `elevationConfig.zoomLevel: 15`
**Appears in (at least 4 files):**
- `CLAUDE.md:96` - "elevation zoom/ring/concurrency"
- `doc/data/elevations.md:64` - "zoomLevel: 15, // Detail level"
- `doc/visualization/ground-surface.md:56` - "Zoom Level | 15"
- `doc/visualization/objects.md:692` - config table

### `elevationConfig.ringRadius: 1`
**Appears in (3-4 files):**
- `CLAUDE.md:97` - "ringRadius: 1"
- `doc/data/elevations.md:65` - "ringRadius: 1"
- `doc/visualization/ground-surface.md:59` - "Ring Radius | 1-3"
- `doc/visualization/objects.md:700` - implied

### `elevationConfig.maxConcurrentLoads: 3`
**Appears in (3 files):**
- `CLAUDE.md:98` - "maxConcurrentLoads (3)"
- `doc/data/elevations.md:66` - "maxConcurrentLoads: 3"
- `doc/visualization/ground-surface.md:60` - "Max Concurrent Loads | 3"

### `textureConfig.groundCanvasSize: 2048`
**Appears in (2 files):**
- `doc/visualization/ground-surface.md:58` - "Canvas Size | 2048×2048"
- `doc/visualization/objects.md:695` - configuration table

### Building Height Defaults
**Appears in (3 files):**
- `doc/visualization/objects.md:88-97` - Full table
- `doc/data/contextual.md:181-189` - "Example Heights by Type"
- `CLAUDE.md:` (referenced implicitly)

### Vegetation Configuration
**Appears in (multiple files):**
- `doc/visualization/objects.md:176-189` - Complete config table
- `doc/data/contextual.md:293-299` - Similar information

## Problem Details

### Maintenance Nightmare
When a configuration value changes (e.g., `ringRadius: 1` → `ringRadius: 2`):

**Current Process:**
1. Developer changes `src/config.ts`
2. (Hopefully) Updates `CLAUDE.md`
3. (Hopefully) Updates `doc/data/elevations.md`
4. (Hopefully) Updates `doc/visualization/ground-surface.md`
5. Might miss 1 or 2 files → inconsistent documentation

**Result:** Docs show conflicting values; reader doesn't know which is correct

### Example: Recent Changes
If the team increased `maxConcurrentLoads` from 3 → 5:
- ❌ `doc/data/elevations.md` still says "3"
- ❌ `doc/visualization/ground-surface.md` still says "3"
- ✓ `src/config.ts` says "5"
- Reader trust degraded: "Which is the real value?"

### Cognitive Load
A developer reading the docs encounters same value 4 times:
- First time: "Good, this is important"
- Second time: "Wait, is it the same value?"
- Third time: "Why repeat this 4 times?"
- Fourth time: "I don't trust any of these values"

## Root Cause
- Original docs written with config values embedded for context
- No systematic way to reference `src/config.ts` from markdown
- Each module author included values independently
- No deduplication pass after initial documentation

## Impact Assessment

### High-Risk Scenarios
1. **Config Change Without Docs Update**
   - Dev changes zoom level from 15 → 16
   - Updates `src/config.ts`
   - Forgets to update docs
   - Docs stay at 15 forever
   - System runs with zoom 16, docs describe zoom 15

2. **Conflicting Docs**
   - One doc says "ringRadius: 1 (9 tiles)"
   - Another says "ringRadius: 1-3"
   - Reader unsure which is correct

3. **Search Results Confuse**
   - Developer searches for "ringRadius"
   - Finds it in 4 places with slightly different formatting
   - Hard to tell which is canonical

## Solution

### Proposed Action

#### Option A: Create Centralized Configuration Reference (RECOMMENDED)
Create `doc/configuration.md` with a single source-of-truth table:

```markdown
# Configuration Reference

All configuration values are defined in `src/config.ts`. This document
provides quick reference. For implementation details, see the source file.

## Elevation Configuration

| Parameter | Value | Purpose | Effect |
|-----------|-------|---------|--------|
| `zoomLevel` | 15 | Web Mercator zoom level | ~4.77m per pixel; controls tile resolution |
| `ringRadius` | 1 | Tile loading radius | 3×3 grid of tiles around drone |
| `maxConcurrentLoads` | 3 | Simultaneous downloads | Balances performance vs. network saturation |

## Visualization Configuration

| Parameter | Value | Purpose |
|-----------|-------|---------|
| `groundCanvasSize` | 2048 | OSM feature texture resolution | High detail on terrain |
| `buildingHeightDefaults.residential` | 6m | Default house height | Fallback if height tag missing |
| `vegetationMeshConfig.forest.densityPer100m2` | 1.0 | Trees per 100m² | Visual density of forests |

... [rest of config]
```

Then in each doc, replace config tables with:
```markdown
See **[doc/configuration.md](../configuration.md)** for all configuration parameters
and their current values.
```

#### Option B: Link to Source Code Comments
Update `src/config.ts` with inline documentation, then:
```markdown
Configuration is defined in [`src/config.ts`](../../src/config.ts#L64-L72).
Current values:
- Zoom level: 15
- Ring radius: 1
- ...

See source file for detailed comments on each setting.
```

**Recommendation:** Option A is better because:
- Quick reference table easier to scan
- No need for readers to open source code
- Can explain "why" each value exists
- Easy to add examples ("ringRadius: 1 = 3×3 grid = 9 tiles")

### Implementation Pattern

**Current (duplicated):**
```markdown
## Configuration

| Parameter | Value | Purpose |
|-----------|-------|---------|
| zoomLevel | 15 | Detail level |
| ringRadius | 1 | Number of tiles |
| maxConcurrentLoads | 3 | Network limit |
```

**After (centralized):**
```markdown
## Configuration

See **[Configuration Reference](../configuration.md)** for current values of:
- `elevationConfig.zoomLevel` - Tile resolution (detail vs. performance)
- `elevationConfig.ringRadius` - Tiles loaded around drone
- `elevationConfig.maxConcurrentLoads` - Network request limit

The default ring radius of 1 loads a 3×3 grid of tiles (~9 tiles total).
```

## Affected Files to Update

**Files with Config Value Tables:**
1. `doc/visualization/objects.md:176-189` (vegetation table)
2. `doc/visualization/objects.md:681-702` (complete config section)
3. `doc/visualization/objects.md:714-730` (barrier/bridge config)

**Files with Inline Config Values:**
1. `CLAUDE.md:96-98` (config comment)
2. `doc/data/elevations.md:60-69` (elevation config block)
3. `doc/visualization/ground-surface.md:54-62` (key properties table)
4. `doc/data/contextual.md:181-189` (building defaults)
5. `doc/data/contextual.md:293-299` (vegetation config)

## Verification Checklist

After implementation:
- [ ] Single source of truth exists: `doc/configuration.md`
- [ ] All config values in one place
- [ ] Each doc links to central reference instead of embedding values
- [ ] Developer changing `src/config.ts` knows to update `doc/configuration.md`
- [ ] No doc copy-pastes config tables (except maybe brief summaries)
- [ ] Readers can quickly find all config values in one document

## Related Issues
- See: `coordinate-system-duplication.md` (similar pattern, more critical)
- See: `ring-based-loading-duplication.md` (overlaps slightly)

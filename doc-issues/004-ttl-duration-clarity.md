# Issue 004: IndexedDB TTL Duration Policy Clarity

## Severity
🟡 **Medium** - Potential confusion (though technically correct)

## Description
Two different persistence cache systems are documented with different TTL (Time-To-Live) durations. While technically correct (different systems, different policies), the documentation could be clearer about why they differ.

## Locations
1. `doc/data/elevations.md` line 91 - **30-day TTL**
2. `doc/data/contextual.md` line 132 - **24-hour TTL**

## Current Text

### Elevations (elevations.md:91)
```
2. **Persistent cache** (IndexedDB)
   - Survives page reloads
   - 30-day TTL prevents stale data
   - Gracefully falls back to network if expired
```

### Contextual (contextual.md:132)
```
2. **IndexedDB persistent cache** (browser storage)
   - Survives page reloads and application restarts
   - 24-hour TTL prevents stale data
   - Automatic expiry cleanup on app startup
   - Gracefully falls back to network if expired
```

## Problem
1. **Reader confusion**: Different TTLs for what appear to be similar caching strategies
2. **No explanation**: Why is elevation data cached 30 days but context data 24 hours?
3. **No rationale**: Readers don't understand the design decision behind each TTL
4. **Inconsistent detail level**: One mentions "automatic expiry cleanup", the other doesn't

## Why Different TTLs Are Reasonable

### Elevation Data (30 days)
- **Source**: AWS Terrarium (static geographic data)
- **Change rate**: Very slow (major geological changes are rare)
- **Accuracy needs**: Sub-meter precision, rarely updated
- **Rationale**: Topography doesn't change often; longer cache is safe
- **Trade-off**: Older elevation data acceptable; saves network bandwidth

### Contextual Data (24 hours)
- **Source**: OpenStreetMap (crowd-sourced, frequently updated)
- **Change rate**: Medium to fast (buildings, roads, landuse change regularly)
- **Accuracy needs**: Recent feature positions, new constructions, removed structures
- **Rationale**: OSM data changes more frequently; shorter cache ensures freshness
- **Trade-off**: More frequent revalidation; balances freshness vs. performance

## Solution
1. **Clarify the difference** in both files
2. **Explain the reasoning** for each TTL
3. **Add cross-reference** between the two files to show they're intentionally different
4. **Verify actual implementation** matches documented values

## Suggested Updates

### elevations.md (line 91)
```markdown
2. **Persistent cache** (IndexedDB)
   - Survives page reloads
   - **30-day TTL**: Elevation data changes slowly (geological timescale);
     30 days balances freshness with network efficiency. See
     [Contextual Data System](../data/contextual.md) for comparison (24-hour TTL).
   - Gracefully falls back to network if expired
```

### contextual.md (line 132)
```markdown
2. **IndexedDB persistent cache** (browser storage)
   - Survives page reloads and application restarts
   - **24-hour TTL**: OSM data changes frequently (roads, buildings, landuse);
     24 hours ensures reasonable freshness. Shorter than elevation cache
     (see [Elevation System](../data/elevations.md), 30-day TTL) due to
     higher change frequency.
   - Automatic expiry cleanup on app startup
   - Gracefully falls back to network if expired
```

## Files to Update
1. `doc/data/elevations.md` - clarify 30-day TTL reasoning
2. `doc/data/contextual.md` - clarify 24-hour TTL reasoning
3. Add cross-references between the two

## Related Implementation
- `src/data/elevation/ElevationTilePersistenceCache.ts` - verify TTL value
- `src/data/contextual/ContextTilePersistenceCache.ts` - verify TTL value

## Status
⏳ Pending Fix (documentation clarity)

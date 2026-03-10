# Issue 001: Tile Bounds Notation Error

## Severity
🔴 **High** - Mathematical inaccuracy

## Description
The Web Mercator tile bounds documentation uses imprecise notation that could confuse developers about the actual tile count.

## Location
- `doc/data/elevations.md` line 181

## Current Text
```
Bounds at zoom 15: X from 0 to ~2^15, Y from 0 to ~2^15
```

## Problem
- The tilde (~) suggests approximation, which is incorrect
- At zoom 15, there are exactly 2^15 = 32,768 tiles
- Valid indices range from 0 to 32,767 (i.e., 0 to 2^15 - 1)
- The "~2^15" notation is ambiguous and mathematically imprecise

## Correct Text
```
Bounds at zoom 15: X from 0 to 2^15 - 1, Y from 0 to 2^15 - 1
```

Or alternatively:
```
Bounds at zoom 15: 2^15 = 32,768 tiles in each dimension (indices 0-32,767)
```

## Why This Matters
- Developers implementing tile loading logic need exact bounds
- Off-by-one errors are common; precision matters
- Matches standard Web Mercator specification (EPSG:3857)

## Files to Update
1. `doc/data/elevations.md` - line 181

## Related Documentation
- `doc/data/contextual.md` line 514-522 (should verify consistency here too)

## Status
⏳ Pending Fix

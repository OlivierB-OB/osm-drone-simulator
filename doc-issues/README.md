# Documentation Issues & Findings

This folder contains detailed issues found during a comprehensive review of the `doc/` folder structure.

## Overview

**Total Issues Found**: 9
**Severity Breakdown**:
- 🔴 **High (Critical)**: 1
- 🟡 **Medium (Attention Needed)**: 6
- 🔵 **Low (Polish)**: 2

## Issue Summary

| # | Title | Severity | Status | Files |
|---|-------|----------|--------|-------|
| 001 | Tile Bounds Notation Error | 🔴 High | ⏳ Pending | `elevations.md:181` |
| 002 | Animation Loop Documentation Duplication | 🟡 Medium | ⏳ Pending | 3 files |
| 003 | Canvas Texture Config Unverified | 🟡 Medium | ⏳ Verify | `ground-surface.md:446` |
| 004 | TTL Duration Clarity | 🟡 Medium | ⏳ Fix | 2 files |
| 005 | Tile Coverage Precision Measurement | 🟡 Medium | ⏳ Verify | 3 files |
| 006 | Ring Visualization Inconsistency | 🔵 Low | ⏳ Fix | 3 files |
| 007 | Coordinate Transformation Duplication | 🟡 Medium | ⏳ Refactor | 4 files |
| 008 | Ellipsis Notation Inconsistency | 🔵 Low | ⏳ Fix | 2 files |
| 009 | TerrainObjectManager Ambiguity | 🟡 Medium | ⏳ Verify | 3 files |

## Quick Links to Issues

### High Priority (Must Fix)
- **001-tile-bounds-notation.md** - Mathematical accuracy issue in zoom level documentation

### Medium Priority (Should Fix)
- **002-animation-loop-duplication.md** - Consolidate 3 copies of animation loop sequence
- **003-canvas-texture-config-unverified.md** - Verify canvas texture config exists and is correct
- **004-ttl-duration-clarity.md** - Explain why elevation (30d) and context (24h) differ
- **005-tile-coverage-precision-measurement.md** - Clarify pixel vs. tile measurements
- **007-coordinate-transformation-duplication.md** - Replace duplicates with centralized reference
- **009-terrain-object-manager-separation-ambiguity.md** - Verify component names match reality

### Low Priority (Nice to Have)
- **006-ring-visualization-variation.md** - Standardize ASCII art style
- **008-ellipsis-notation-inconsistency.md** - Fix spacing: `2km` → `2 km`

## Files Most Affected

| File | Issues | Lines |
|------|--------|-------|
| `doc/data/elevations.md` | 001, 005, 007 | 91, 146, 181, 361-384 |
| `doc/data/contextual.md` | 002, 005, 006, 007, 008 | 92, 132, 532-547, 740-752 |
| `doc/visualization/ground-surface.md` | 002, 003, 005, 006, 007 | 58, 222, 269-307, 315-323, 446 |
| `doc/visualization/objects.md` | 006, 007, 009 | 542-555, 557-581 |
| `doc/architecture.md` | 009 | 38-47 |

## Recommended Fix Order

1. **First** (Correctness): 001 - Fix tile bounds notation
2. **Second** (Architecture): 009 - Verify TerrainObjectManager names
3. **Third** (Configuration): 003, 005 - Verify measurements against code
4. **Fourth** (Refactoring): 002, 007 - Consolidate duplicates
5. **Fifth** (Clarity): 004 - Explain TTL differences
6. **Last** (Polish): 006, 008 - Visual/style consistency

## How to Use These Files

Each issue file contains:
- **Description** - What the problem is
- **Severity** - Impact level
- **Locations** - Where in docs it appears
- **Current Text** - What the docs say now
- **Problem** - Detailed explanation of the issue
- **Solution** - Recommended fix approach
- **Files to Update** - Which docs need changes
- **Status** - Pending/In Progress/Complete

### To Fix an Issue:
1. Open the issue file (e.g., `001-tile-bounds-notation.md`)
2. Read the **Problem** section
3. Follow the **Solution** section recommendations
4. Update the specified **Files to Update**
5. Update **Status** to "✅ Completed" when done

## Notes for Implementation

### When Verifying Against Code:
- Check `src/config.ts` for configuration values
- Look at `src/visualization/terrain/` structure
- Cross-reference with actual implementation files

### When Consolidating:
- Keep the most detailed version as source of truth
- Add cross-reference links from other locations
- Ensure all three data flows are explained

### When Standardizing:
- Pick one ASCII art style and apply everywhere
- Use SI unit notation consistently (space between number and unit)
- Follow existing doc patterns from CLAUDE.md

## Contact & Questions

If you have questions about any issue:
1. Check the issue file for detailed explanation
2. Look at related implementation files mentioned
3. Review CLAUDE.md for architectural context

---

**Last Updated**: 2025-03-10
**Review Performed By**: Claude Code Documentation Audit
**Files Reviewed**: 9 documentation files, ~2400 lines

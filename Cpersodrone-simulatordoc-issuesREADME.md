# Documentation Issues & Duplication Analysis

This folder contains detailed analysis of duplication and redundancy in the project documentation.

## Quick Summary

The drone simulator documentation contains **5 major duplication patterns** affecting **9 core documentation files**. These are categorized by severity and include specific action plans for remediation.

---

## Issues by Severity

### 🔴 SEVERE (Fix First)

#### 1. **Coordinate System Z-Negation Duplication**
📄 [`coordinate-system-duplication.md`](coordinate-system-duplication.md)

**Problem:** The critical Z-negation formula (`z = -mercatorY`) and its explanation are repeated **identically in 6 different files**.

**Risk:** If the formula changes, all 6 files must be updated or the system breaks.

**Solution:** Keep full details in `doc/coordinate-system.md` (canonical source), replace lengthy explanations elsewhere with cross-links.

---

#### 2. **Three.js Formula Duplication**
📄 [`three-js-formula-duplication.md`](three-js-formula-duplication.md)

**Problem:** The exact Three.js position formula is repeated verbatim in **4 separate files**.

**Risk:** Copy-paste of core formula ensures inconsistency on changes.

**Solution:** Single source (`coordinate-system.md`), all others reference it.

---

### 🟠 MODERATE (Fix Soon)

#### 3. **Configuration Values Duplication**
📄 [`configuration-values-duplication.md`](configuration-values-duplication.md)

**Problem:** Config values (zoom=15, ringRadius=1, etc.) repeated in multiple files.

**Solution:** Create `doc/configuration.md` as single reference.

---

#### 4. **Ring-Based Loading Explanation Duplication**
📄 [`ring-based-loading-duplication.md`](ring-based-loading-duplication.md)

**Problem:** Ring explanation repeated in 4 documents with nearly identical ASCII diagrams.

**Solution:** Keep canonical explanation in `doc/data/elevations.md`, cross-link from others.

---

#### 5. **Data Pipeline Diagrams Duplication**
📄 [`data-pipeline-duplication.md`](data-pipeline-duplication.md)

**Problem:** Nearly identical pipeline flow diagrams in 4 files.

**Solution:** Consider creating pattern doc or standardize formatting.

---

### 🟡 MINOR (Fix if Time Permits)

#### 6. **Web Mercator Projection Overview Duplication**
📄 [`web-mercator-duplication.md`](web-mercator-duplication.md)

**Problem:** Web Mercator basics explained in 4 files.

**Solution:** Add brief cross-references, keep context-specific explanations.

---

#### 7. **Glossary Consolidation**
📄 [`glossary-consolidation.md`](glossary-consolidation.md)

**Problem:** Four separate glossaries with overlapping term definitions. ⚠️ **Terrarium attribution error** (AWS vs. Mapbox).

**Solution:** Create `doc/glossary.md`, remove individual glossaries.

---

## Implementation Priority

### Phase 1 (Critical)
1. Coordinate System Duplication
2. Three.js Formula

### Phase 2 (Important)
3. Configuration Values
4. Ring-Based Loading
5. Glossary

### Phase 3 (Optional)
6. Data Pipeline Duplication
7. Web Mercator

---

## Expected Benefits

✓ Consistency - Same formula/value everywhere  
✓ Maintainability - Update once, affects all  
✓ Clarity - Readers know where canonical info lives  
✓ Search - Finding definitions is fast  
✓ Trust - No contradictory information  
✓ Professionalism - Polished documentation  

---

Each issue file includes root cause, impact assessment, detailed solution with examples, and verification checklist.

*Analysis Date: 2026-03-10*

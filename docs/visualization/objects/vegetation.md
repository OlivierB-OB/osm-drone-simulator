# Vegetation

## Visual Characteristics

Vegetation appears as distributed trees, forests, shrubs, and cultivated areas. Trees have visible trunks (cylinders) and canopies (spheres for broadleaf, cones for needleleaf). Scrub and shrubs are compact bushes. Large forests appear as dense point clouds at distance.

**Examples:**
- Forest: hundreds of tall trees with dark green canopies (#3a7a30)
- Orchard: grid of evenly-spaced fruit trees
- Vineyard: dense, low vegetation with small canopies
- Scrub: scattered bushes without visible trunks (#5a8a40)

## Data Sources

Vegetation areas identified by Overture fields:
- `natural=forest`, `wood`, `scrub`, `heath`, `grassland`
- `landuse=forest`, `wood`, `vineyard`, `orchard`
- `leaf_type=deciduous` or `needleleaved` (determines canopy shape)
- Single trees: `natural=tree` (Point geometry)
- Tree rows: `natural=tree_row` (LineString geometry)

## Rendering Strategy

**Strategy Pattern**: Each vegetation type (forest, scrub, orchard, vineyard, single tree, tree row) uses a dedicated strategy class implementing `collectPoints()`.

**Key Optimization: Unified InstancedMesh Batching**

All vegetation in a tile is batched into a maximum of **4 draw calls**, regardless of how many forests, orchards, or single trees are present:

| Mesh | Geometry | Count |
|------|----------|-------|
| Trunk | `CylinderGeometry` | All trees in tile |
| Broadleaf canopy | `SphereGeometry` | All broadleaf trees |
| Needle canopy | `ConeGeometry` | All needleleaf trees |
| Bush | `SphereGeometry` | All bushes (scrub, vineyard) |

**Two-Pass Batch in `VegetationMeshFactory`:**
1. **Pass 1 — collect**: each strategy's `collectPoints()` pushes `TreePoint` or `BushPoint` records into shared arrays (no Three.js objects created yet)
2. **Pass 2 — batch**: `batchInstancedTrees()` and `batchInstancedBushes()` create a single `InstancedMesh` per geometry type across all collected points

Shared geometries (`TRUNK_GEOM`, `BROADLEAF_GEOM`, `NEEDLE_GEOM`, `BUSH_GEOM`) are module-level constants — created once and reused by every `InstancedMesh` in every tile.

**Distribution Methods:**

1. **Forest/Scrub**: Distribute points randomly within polygon using seeded hash function
   - Density configured as trees per 100m² (`densityPer100m2`)
   - Jitter applied to grid to avoid grid artifact
2. **Orchard/Vineyard**: Regular grid spacing with optional jitter
   - `spacingX` × `spacingY` meters between plants
3. **Single Tree**: Point geometry → one `TreePoint` with exact dimensions (no random variation)
4. **Tree Row**: LineString interpolated at regular intervals along path

## Geometry Details

**Tree Structure:**
- **Trunk**: Tapered cylinder (base 0.2m radius, top 0.15m radius, height 40% of tree)
- **Canopy**:
  - Broadleaf: Sphere scaled to crown radius
  - Needleleaf: Cone scaled to height and radius
- **Coloring**: Per-instance color assigned from palette using seeded hash (deterministic)
- **Elevation**: Sampled at tree point; trunk base at terrain elevation

**Bush Structure (Scrub/Vineyard):**
- Single sphere (no trunk), height × 0.6 × radius aspect ratio
- Color varied from palette (#4a7a38 to #5a8a40)

**Instancing Implementation:**
```
Pass 1 — strategies push TreePoint/BushPoint records (geo coords + size range + colors)

Pass 2 — batchInstancedTrees(treePoints, elevation, origin):
  Split points into broadleaf[] and needle[]
  trunkMesh = InstancedMesh(TRUNK_GEOM, count=all points)
  broadleafMesh = InstancedMesh(BROADLEAF_GEOM, count=broadleaf.length)  [if any]
  needleMesh = InstancedMesh(NEEDLE_GEOM, count=needle.length)           [if any]
  For each point:
    seed = hash(lng, lat)  →  deterministic random variation
    Sample terrain elevation, compute matrix, setMatrixAt(i), setColorAt(i)
  Return [trunkMesh, broadleafMesh?, needleMesh?]

batchInstancedBushes(bushPoints, elevation, origin):
  bushMesh = InstancedMesh(BUSH_GEOM, count=all points)
  For each point: setMatrixAt(i), setColorAt(i)
  Return [bushMesh]
```

## Configuration

| Parameter | Forest | Scrub | Orchard | Vineyard | Tree Row |
|-----------|--------|-------|---------|----------|----------|
| **Density** | 1.0 trees/100m² | 4.0 trees/100m² | — | — | — |
| **Spacing X** | calculated | calculated | 5m | 2m | 8m interval |
| **Spacing Y** | calculated | calculated | 4m | 1m | along path |
| **Trunk height min** | 8m | 0m | 3m | 0m | 6m |
| **Trunk height max** | 15m | 0m | 6m | 0m | 12m |
| **Crown radius min** | 2m | 1m | 1.5m | 0.4m | 1.5m |
| **Crown radius max** | 5m | 2.5m | 2.5m | 0.8m | 3m |
| **Max points per area** | 2000 | 2000 | 2000 | 2000 | — |
| **Trunk color** | #6b4226 | #6b4226 | #6b4226 | #6b4226 | #6b4226 |
| **Canopy colors** | See below | #4a7a38–#5a8a40 | #2d6b1e–#408030 | #2d6b1e–#408030 | #2d6b1e–#408030 |

**Color Palettes:**
- Broadleaf: #2d6b1e, #3a7a30, #357a28, #408030
- Needleleaf: #1a5020, #205828, #256030, #1a4a20

## Performance Optimization

**Instanced Mesh Advantage:**

Traditional approach (one mesh per tree):
- A forest with 1,000 trees = 2,000 draw calls (trunk + canopy)
- Significant GPU overhead

With `InstancedMesh`:
- Single trunk geometry drawn 1,000 times with different transform matrices
- Single canopy geometry drawn 1,000 times with different matrices + per-instance colors
- **Result: 2 draw calls regardless of tree count**

**GPU Memory Impact:**
- Geometry: ~10KB (shared)
- Per-instance data: ~64 bytes × count (transform matrix only)
- 1,000 trees: ~64KB instance data vs. ~10MB for individual meshes

**Density Adaptation:**
If estimated point count exceeds 2,000, spacing automatically increased to maintain performance.

## Elevation Handling

- **Per-tree sampling**: `ElevationSampler.sampleAt()` called for each tree instance during mesh creation
- **Terrain-aware positioning**: Trunk base positioned at sampled elevation
- **Precision**: Matrix transforms include full position (x, terrainY, -y)
- **Density adaptation**: If estimated point count exceeds 2,000, spacing automatically increased to maintain performance

## See Also

- **[Buildings](buildings.md)** — 3D structures
- **[Systems](systems.md#performance--optimization)** — General performance strategies
- **[Data Pipeline](../../data-pipeline.md)** — Feature extraction process

# Contextual Data System

## Overview

The drone simulator uses **Overture Maps Foundation** data served as **PMTiles archives** to render the environment's features and landmarks. This system provides:

- **Real-world buildings, roads, railways, water** and other structures from 3 Overture themes (buildings, transportation, base)
- **Efficient tile loading** using Web Mercator projection with z/x/y coordinates at zoom level 15
- **Ring-based caching** around the drone to minimize network requests
- **Dual rendering** - 2D canvas textures on terrain + 3D meshes in the scene
- **Graceful degradation** when cache or network is unavailable

The contextual data system follows the standard **Data Pipeline Pattern**
(see [`data-pipeline.md`](../data-pipeline.md) for detailed explanation).

### Contextual Data Pipeline

```
Overture Maps Data (via PMTiles archives)
       |
ContextDataManager (Ring-based loading, caching)
       |
ContextDataTileLoader (PMTiles fetch, overzoom, persistence cache)
       |
PMTilesReader (multi-archive query, per-archive overzoom)
       |
OvertureParser (MVT layer routing, feature classification)
       |
Feature Categories:
  - Buildings, Roads, Waterways, Vegetation, Aeroway, Railways, Landuse
       |
MeshObjectManager (3D buildings, trees, structures)
TerrainTextureObjectManager (Canvas rendering for texture)
       |
Textured Terrain + 3D Objects in Scene
```

For the general Manager -> Loader -> Parser -> Factory pattern and how it applies across
the system, see the Data Pipeline Pattern documentation.

## Data Source & Format

### Overture Maps Foundation & PMTiles

**Source:** [Overture Maps Foundation](https://overturemaps.org/) - open map data with a structured, versioned schema

**Format:** PMTiles archives containing MVT (Mapbox Vector Tiles) decoded via `@mapbox/vector-tile` + `pbf`

**URL pattern:** `{baseUrl}/{version}/{theme}.pmtiles`

Example: `https://tiles.overturemaps.org/2026-02-18.0/buildings.pmtiles`

**License:** Community-contributed open data (see Overture Maps licensing)

Unlike OSM's free-form key/value tags, Overture data is strongly typed with explicit field names, types, and enumerations. See [`overture/README.md`](../overture/README.md) for schema reference.

### Why Overture Maps / PMTiles?

- **Strongly typed** - structured schema with explicit fields (not free-form tags)
- **No rate limits** - PMTiles are pre-packaged static archives, no API quotas
- **Pre-packaged** - no query language needed; tiles fetched by z/x/y coordinates
- **Global coverage** - worldwide feature data for any location
- **Versioned releases** - reproducible data with release identifiers
- **Efficient** - binary MVT format, range requests on single archive files

### Ring-Based Loading

The system maintains a **ring of tiles** around the drone's current position. Tiles load as the drone approaches ring edges and unload when it leaves, keeping memory usage constant and network requests minimal.

For detailed ring patterns, lifecycle phases, and spatial organization, see [`tile-ring-system.md`](../tile-ring-system.md).

## Configuration

All contextual data settings are in `src/config.ts` (`contextDataConfig`):

```typescript
contextDataConfig = {
  zoomLevel: 15,            // Web Mercator zoom level (overzoom from maxZoom 13/14)
  ringRadius: 1,            // Number of tiles in each direction (3x3 grid)
  maxConcurrentLoads: 6,    // Max simultaneous PMTiles requests (no rate limits)
  queryTimeout: 30000,      // Query timeout in milliseconds

  // Overture Maps PMTiles
  overtureVersion: '2026-02-18.0',
  overtureBaseUrl: 'https://tiles.overturemaps.org',
  overtureThemes: ['buildings', 'transportation', 'base'],
};
```

| Setting                   | Purpose                                                                          |
| ------------------------- | -------------------------------------------------------------------------------- |
| **zoomLevel: 15**         | Detail level; ~1.22 km x 1.22 km per tile (Web Mercator)                       |
| **ringRadius: 1**         | 3x3 grid = 9 tiles total; expands to 5x5 (25 tiles) if set to 2               |
| **maxConcurrentLoads: 6** | Higher than elevation (3) since PMTiles have no rate limits                     |
| **queryTimeout: 30000**   | 30-second timeout per tile load                                                 |
| **Ring updates**          | Only when drone crosses tile boundary, not continuously                         |

## PMTiles & Overzoom Architecture

### PMTilesReader

`PMTilesReader` holds one `PMTiles` instance per Overture theme and queries all archives in parallel for each tile request.

```
PMTilesReader
  |-- buildings.pmtiles  (maxZoom: 14)
  |-- transportation.pmtiles  (maxZoom: 13)
  |-- base.pmtiles  (maxZoom: 13)
```

Each archive is constructed from the URL pattern `{baseUrl}/{version}/{theme}.pmtiles` and opened via `FetchSource` (HTTP range requests).

### Per-Archive Overzoom

Each PMTiles archive has an independent `maxZoom` declared in its header. When the requested zoom level (15) exceeds an archive's maxZoom, the reader transparently handles overzoom per-archive:

```
Requested: z=15, x=16832, y=11432

buildings.pmtiles (maxZoom=14):
  dz = 15 - 14 = 1
  fetch parent: z=14, x=8416, y=5716

transportation.pmtiles (maxZoom=13):
  dz = 15 - 13 = 2
  fetch parent: z=13, x=4208, y=2858

base.pmtiles (maxZoom=13):
  dz = 15 - 13 = 2
  fetch parent: z=13, x=4208, y=2858
```

Archives at the same effective zoom share one group during parsing. This ensures high-resolution archives (buildings at Z:14) are not downgraded to match lower-resolution ones (transport at Z:13).

### Effective Data Zoom

```
effectiveDataZoom = Math.max(...allArchiveMaxZooms)
```

This is the highest zoom level at which any theme has native data. It determines whether tile-level overzoom (parent fetch + fan-out) is needed in the loader.

### Parent Fetch + Fan-Out

When `ContextDataTileLoader` detects overzoom (requested Z > effectiveDataZoom), it:

1. **Computes parent coordinates** by right-shifting: `parentX = x >> dz`, `parentY = y >> dz`
2. **Fetches the parent tile** via `PMTilesReader.getTile(parentCoords)`
3. **Parses all features** from the parent tile
4. **Fans out** features to all child sub-tiles using `filterFeaturesByBounds`
5. **Pre-caches siblings** in IndexedDB (fire-and-forget) so adjacent tiles load instantly

### Deduplication

A static `parentFetches` Map on `ContextDataTileLoader` prevents concurrent duplicate parent requests. When multiple child tiles request the same parent simultaneously, only one network fetch occurs. The promise is shared and cleaned up after resolution.

```
Tile 15:16832:11432 --|
Tile 15:16833:11432 --|-- share parent fetch for 14:8416:5716
Tile 15:16832:11433 --|
Tile 15:16833:11433 --|
```

### Bounds Filtering

`featureBoundsFilter.ts` clips features to sub-tile bounds using an "any coordinate" overlap check. For each feature, if at least one coordinate falls within the sub-tile's Mercator bounds, the feature is included. This is an approximate check sufficient for small sub-tiles.

## Caching

The system implements **two-tier caching**:

1. **In-memory cache** (RAM)
   - Fastest access during gameplay
   - Stores parsed `ContextDataTile` objects
   - Automatically cleared when tiles leave the ring

2. **IndexedDB persistent cache** (browser storage)
   - Survives page reloads and application restarts
   - 24-hour TTL prevents stale data (consistent with elevation cache;
     see [Elevation System](./elevations.md) for comparison)
   - Automatic expiry cleanup on app startup
   - Gracefully falls back to network if expired

**Cache flow:**

```
Load tile 15:16832:11432
  | (miss in-memory)
Check IndexedDB persistence cache
  | (miss or expired)
Fetch from PMTiles (with overzoom if needed)
  | (success)
Store in IndexedDB (24-hour TTL)
Store in memory cache
  |
Return parsed ContextDataTile
```

The `loadWithPersistenceCache` utility (in `src/data/shared/tileLoaderUtils.ts`) orchestrates the IndexedDB check + network fallback + write-back pattern, shared with the elevation system.

## Feature Classification Pipeline

### MVT Layer Routing

`OvertureParser` receives decoded MVT layers from all Overture themes and routes each layer to the appropriate classification function:

```
PMTiles Archives (buildings, transportation, base)
       |
PMTilesReader.getTile() -- parallel fetch, per-archive overzoom
       |
ArchiveGroup[] (grouped by fetch coordinates)
       |
OvertureParser.parse()
  |-- "building"        -> processBuildings()
  |-- "building_part"   -> processBuildings(isPart=true)
  |-- "segment"         -> processTransportSegments()
  |-- "land_use"        -> processLandUse()
  |-- "land"            -> processLand()
  |-- "land_cover"      -> processLandCover()
  |-- "infrastructure"  -> processInfrastructure()
  |-- "water"           -> processWater()
       |
ModulesFeatures (buildings, roads, railways, waters, airports, vegetation, landuse)
       |
  FeatureModuleRegistry
  |-- drawAllCanvas() -> 2D canvas texture
  |-- createAllMeshes() -> 3D scene objects
```

### Classifiers

Seven classifier functions in `src/features/*/overtureClassify.ts` convert MVT feature properties into typed visual features:

| Classifier | File | Overture Fields |
|------------|------|-----------------|
| `classifyOvertureBuilding` | `src/features/building/overtureClassify.ts` | `height`, `num_floors`, `roof_shape`, `class` |
| `classifyOvertureRoad` | `src/features/road/overtureClassify.ts` | `class`, `subclass`, `road_surface` |
| `classifyOvertureRailway` | `src/features/railway/overtureClassify.ts` | `class` (rail, tram, metro, etc.) |
| `classifyOvertureWater` | `src/features/water/overtureClassify.ts` | `class`, `subtype` |
| `classifyOvertureAeroway` | `src/features/aeroway/overtureClassify.ts` | `class` (runway, taxiway, helipad, etc.) |
| `classifyOvertureLanduse` | `src/features/landuse/overtureClassify.ts` | `class`, `subtype` |
| `classifyOvertureVegetation` | `src/features/vegetation/overtureClassify.ts` | `subtype` (forest, wood, scrub, heath) |

### Transport Segment Routing

The `segment` MVT layer contains both roads and railways. `OvertureParser` routes by `class`:

- **Rail classes** (`rail`, `narrow_gauge`, `light_rail`, `tram`, `metro`, `monorail`, `funicular`, `disused`, `abandoned`) -> `classifyOvertureRailway`
- **All others** -> `classifyOvertureRoad`

### Land Layer Routing

The `land` MVT layer routes by `subtype`:

- **Vegetation subtypes** (`forest`, `wood`, `scrub`, `heath`) -> `classifyOvertureVegetation`
- **Other polygon subtypes** -> `classifyOvertureLanduse`

### Feature Module Registry

`FeatureModuleRegistry` (`src/features/registry.ts`) orchestrates canvas drawing and mesh creation. It holds 10 registered modules from `src/features/registration.ts`:

| Module | Canvas | Mesh |
|--------|--------|------|
| building | - | Extruded polygon + roof |
| road | Lines (width by type) | - |
| railway | Dashed gray lines | - |
| water | Blue areas / lines | - |
| aeroway | Colored areas | - |
| vegetation | Green areas | Trees, shrubs |
| landuse | Filled background | - |
| structure | - | Cylinders, boxes, tapers |
| barrier | - | Extruded walls/hedges |
| bridge | - | Bridge spans |

### Geometry Conversion

`mvtGeometry.ts` converts MVT tile-local coordinates (0-4096 extent) to absolute Mercator meters using the tile's bounds:

```
MVT coordinate (tileX, tileY)
  |
mercatorX = bounds.minX + (tileX / extent) * (bounds.maxX - bounds.minX)
mercatorY = bounds.maxY - (tileY / extent) * (bounds.maxY - bounds.minY)
```

Supports Point, LineString, and Polygon geometry types. Polygon rings are auto-closed if needed.

## Feature Categories

Nine categories of contextual features are parsed and rendered:

| Feature Type   | Canvas (2D)                   | Mesh (3D)                | Overture Source                                    |
| -------------- | ----------------------------- | ------------------------ | -------------------------------------------------- |
| **Buildings**  | -                             | Extruded polygon + roof  | `building`, `building_part` layers                 |
| **Roads**      | Colored lines (width by type) | -                        | `segment` layer (non-rail classes)                 |
| **Railways**   | Dashed gray lines             | -                        | `segment` layer (rail classes)                     |
| **Water**      | Blue areas / blue lines       | -                        | `water` layer                                      |
| **Vegetation** | Green areas                   | Trees, shrubs, crowns    | `land` (forest/wood subtypes), `land_cover` layer  |
| **Landuse**    | Filled background areas       | -                        | `land_use` layer, `land` (non-vegetation subtypes) |
| **Aeroways**   | Colored areas                 | -                        | `infrastructure` layer (aeroway classes)           |
| **Structures** | -                             | Cylinders, boxes, tapers | (post-processing from buildings/features)          |
| **Barriers**   | -                             | Extruded walls/hedges    | (post-processing from features)                    |

For colors, widths, heights, and detailed rendering specs, see:

- **[Canvas Rendering](../visualization/canvas-rendering.md)** - layer ordering, colors, widths, dash patterns, drawing algorithms
- **[3D Object Visualization](../visualization/objects/README.md)** - heights, shapes, geometry, materials, roof types

## Graceful Degradation

The system handles missing data and failures gracefully:

**When cache unavailable:**

- Skip tile rendering (no error)
- Terrain remains visible with default color
- User continues exploration unaffected

**When network fails:**

- Exponential backoff retry (100ms, 200ms, 400ms) up to 3 attempts
- Return null, terrain renders with no overlay

**When geometry missing:**

- Use fallback defaults (height, color, width)
- Skip 3D mesh generation if insufficient data
- Canvas texture still renders what it can

## Integration & Performance

Context data loads when the drone moves, after elevation updates. For tile ring management, caching, and network concurrency, see:

- **[Tile Ring System](../tile-ring-system.md)** - ring lifecycle, caching, eviction, network concurrency
- **[Coordinate System](../coordinate-system.md)** - Mercator -> Three.js transforms

## Key Files & References

### Core System

| File                                                   | Purpose                                                               |
| ------------------------------------------------------ | --------------------------------------------------------------------- |
| `src/data/contextual/ContextDataManager.ts`            | Orchestrates tile loading, caching, ring management; emits tile events |
| `src/data/contextual/ContextDataTileLoader.ts`         | Fetches tiles from PMTiles; handles overzoom, retry, persistence      |
| `src/data/contextual/ContextTilePersistenceCache.ts`   | IndexedDB-based tile caching (24-hour TTL)                            |
| `src/data/contextual/types.ts`                         | TypeScript interfaces for all feature types and data structures       |

### PMTiles & Parsing

| File                                                   | Purpose                                                               |
| ------------------------------------------------------ | --------------------------------------------------------------------- |
| `src/data/contextual/pmtiles/PMTilesReader.ts`         | Multi-archive PMTiles querying, per-archive overzoom                  |
| `src/data/contextual/pmtiles/OvertureParser.ts`        | Routes MVT layers to classify functions                               |
| `src/data/contextual/pmtiles/mvtGeometry.ts`           | Converts MVT tile-local coords to Mercator GeoJSON                   |
| `src/data/contextual/pmtiles/featureBoundsFilter.ts`   | Clips features to sub-tile Mercator bounds                            |

### Feature Classification

| File                                            | Feature Type                              |
| ----------------------------------------------- | ----------------------------------------- |
| `src/features/building/overtureClassify.ts`     | Buildings (footprints, heights, roofs)     |
| `src/features/road/overtureClassify.ts`         | Roads and paths                            |
| `src/features/railway/overtureClassify.ts`      | Railways and trams                         |
| `src/features/water/overtureClassify.ts`        | Water bodies and waterways                 |
| `src/features/vegetation/overtureClassify.ts`   | Forests, scrub, vegetation patches         |
| `src/features/landuse/overtureClassify.ts`      | Landuse areas (parks, farmland, etc.)      |
| `src/features/aeroway/overtureClassify.ts`      | Aeroways (runways, taxiways, helipads)     |
| `src/features/registry.ts`                      | FeatureModuleRegistry (orchestration)      |
| `src/features/registration.ts`                  | 10 module registrations                    |

### Visualization Integration

| File                                                               | Purpose                                                                 |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| `src/visualization/terrain/texture/TerrainTextureObjectManager.ts` | Manages canvas texture generation and application to terrain            |
| `src/visualization/terrain/texture/TerrainTextureFactory.ts`       | Canvas rendering: roads, water, vegetation, landuse, aeroways           |
| `src/visualization/mesh/MeshObjectManager.ts`                      | Manages 3D mesh objects for buildings, vegetation, structures, barriers |

### Configuration

| File            | Lines    | Purpose                                                              |
| --------------- | -------- | -------------------------------------------------------------------- |
| `src/config.ts` | 92-114   | contextDataConfig: zoom, ring, concurrency, timeout, Overture config |
| `src/config.ts` | 119-158  | colorPalette, buildingHeightDefaults, material colors, roof colors   |
| `src/config.ts` | 189-290  | structureDefaults, barrierDefaults, vegetationMeshConfig             |
| `src/config.ts` | 295-348  | groundColors: landuse and water colors                               |
| `src/config.ts` | 353-429  | roadSpec, surfaceColors, railwaySpec, waterwayWidthsMeters           |

## See Also

- **[Overture Maps Schema Reference](../overture/README.md)** - Overture schema details (base, buildings, transportation)
- **[Data Pipeline Pattern](../data-pipeline.md)** - Five-stage pipeline used across all data systems
- **[Glossary](../glossary.md)** - Definitions of all technical terms

# Ground Surface Rendering

## Overview

The ground surface rendering system displays realistic terrain by combining two data sources:

1. **Elevation data** → Three.js mesh geometry (3D shape)
2. **OpenStreetMap (OSM) features** → Canvas texture (visual detail)

This two-stage asynchronous pipeline ensures responsive rendering: elevation geometry loads first (basic terrain shape), then texture details appear as canvas rendering completes. Both pipelines work independently and converge in the 3D scene.

### High-Level Data Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    Terrain Rendering System                   │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  Elevation Pipeline              Texture Pipeline             │
│  ───────────────────────────     ─────────────────────────    │
│                                                                │
│  ElevationData                   ContextData (OSM)            │
│        │                              │                       │
│        ├─ Ring-based loading          ├─ Ring-based loading   │
│        ├─ Tile caching (3 concurrent) ├─ Tile caching         │
│        │                              │                       │
│        ↓                              ↓                       │
│  TerrainGeometryFactory          TerrainCanvasRenderer        │
│        │                              │                       │
│        ├─ 256×256 vertices           ├─ 2048×2048 canvas      │
│        ├─ Elevation sampling          ├─ OSM feature drawing   │
│        ├─ Normal computation          ├─ Painter's algorithm   │
│        │                              │                       │
│        ↓                              ↓                       │
│  Three.js Geometry + Normals     Canvas Texture              │
│        │                              │                       │
│        └──────────┬───────────────────┘                       │
│                   │                                           │
│                   ↓                                           │
│         TerrainObjectFactory                                 │
│                   │                                           │
│                   ├─ Create mesh (geometry + texture)        │
│                   ├─ Position at tile center                 │
│                   ├─ Add material (MeshPhongMaterial)        │
│                   │                                           │
│                   ↓                                           │
│         Three.js Mesh in Scene                               │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Key Properties

| Property | Value | Purpose |
|----------|-------|---------|
| **Zoom Level** | 15 (Web Mercator) | Tile resolution (tighter zoom = more detail tiles) |
| **Tile Size** | 256×256 pixels | Elevation grid dimension |
| **Canvas Size** | 2048×2048 pixels | OSM feature texture detail |
| **Ring Radius** | 1-3 (configurable) | Tile loading radius around drone (1=3×3 grid) |
| **Max Concurrent Loads** | 3 | Network concurrency limit |
| **Elevation Range** | -430m to ~9000m | Dead Sea to Everest |
| **Elevation Precision** | ±0.1m (sub-meter) | Terrarium RGB format accuracy |

---

## Core Architecture

The terrain rendering system consists of three main components working in concert:

### 1. Elevation Pipeline
Converts elevation data tiles into Three.js geometry:

```
Web Mercator Tiles (z:x:y)
        ↓
ElevationDataManager (tile caching, ring-based loading)
        ↓
TerrainGeometryFactory (vertex/index generation, normal computation)
        ↓
Three.js BufferGeometry (positions, normals, UVs, indices)
```

### 2. Texture Pipeline
Renders OSM features onto a canvas texture:

```
OSM Features (roads, water, landuse, etc.)
        ↓
ContextDataManager (tile caching, feature extraction)
        ↓
TerrainCanvasRenderer (painter's algorithm, feature-specific drawing)
        ↓
Canvas Texture (2048×2048, applied to geometry UVs)
```

### 3. Mesh Integration
Orchestrates both pipelines and creates final 3D meshes:

```
TerrainObjectManager (watches drone position)
        ├─ tile added → TerrainGeometryFactory
        ├─ tile added → TerrainCanvasRenderer
        ├─ both complete → TerrainObjectFactory creates mesh
        └─ position mesh in Three.js scene
```

**TerrainObjectManager** is the main orchestrator. It:
- Subscribes to drone position changes
- Triggers both elevation and texture pipeline for new tiles
- Coordinates mesh creation when both are ready
- Manages mesh lifecycle (add/remove from scene)

---

## Elevation Data to Geometry

### Source Data

Elevation tiles come from **ElevationDataManager**, which fetches 256×256 pixel PNG images from AWS Terrarium service at Web Mercator zoom level 15. Each pixel encodes elevation using the **Terrarium RGB formula**:

```
Elevation (meters) = (R × 256 + G + B/256) - 32768
```

Example values:
- RGB(128, 0, 0) = 0m (sea level)
- RGB(129, 0, 0) = 256m
- RGB(162, 144, 0) ≈ 8848m (Mount Everest)
- RGB(127, 255, 255) ≈ -430m (Dead Sea)

See `doc/data/elevations.md` for detailed elevation specifications.

### Vertex Generation

**TerrainGeometryFactory** converts elevation data into Three.js mesh geometry:

1. **Grid sampling**: 256×256 elevation values → 256×256 vertices
2. **Coordinate mapping**:
   ```
   X = centerMercatorX + (column / 256) × tileWidthMeters
   Y = elevation[row][column]
   Z = -(centerMercatorY + (row / 256) × tileHeightMeters)
   ```
   *Note: Z is negated because Mercator Y increases northward; Three.js camera looks along -Z axis.*

3. **Index generation**: 255×255 grid of square cells = 2 triangles per cell = 390,150 indices

### Attributes

Each vertex includes:

| Attribute | Type | Purpose |
|-----------|------|---------|
| **Position** | Vec3 (x, y, z) | 3D location (Mercator + elevation) |
| **Normal** | Vec3 | Face normal for lighting (computed via `computeVertexNormals()`) |
| **UV** | Vec2 (u, v) | Texture coordinates for canvas overlay |

### Normals & Lighting

Normals are **computed automatically** from the triangle mesh using Three.js's `computeVertexNormals()`. This calculates per-vertex normals by averaging face normals of adjacent triangles. Proper normals are critical for realistic **Phong lighting** (the material used for ground meshes).

---

## Texture Rendering (OSM Features)

### Purpose

While elevation geometry provides the 3D shape, OSM feature textures add visual detail: roads, water bodies, landuse areas, vegetation, railways, etc. Drawing these as individual meshes would be prohibitively expensive (millions of geometry objects); instead, they're rasterized to a **2048×2048 canvas texture**.

### Drawing Order (Painter's Algorithm)

**TerrainCanvasRenderer** draws features in **back-to-front** order to handle transparency and layering correctly:

```
1. Base ground fill     → groundColor (e.g., #d8c8a8)
2. Landuse/landcover   → feature-specific colors
3. Water (polygons)    → waterColor (#7db8dc)
4. Wetlands            → wetlandColor (#9dd9d9)
5. Waterway lines      → waterwayColor (#7db8dc)
6. Vegetation          → vegetationColor (#a8d4a8)
7. Aeroways            → aerowayColor (#ddd8c4)
8. Roads (sorted by width ascending) → roadColor variants
9. Railways            → railwayColor (#707070)
```

Wider features (larger z-index in OSM) are drawn later to appear on top. This order ensures water flows under roads, landuse under water, etc.

### Feature Types & Colors

| Feature Type | OSM Key | Color | Example |
|--------------|---------|-------|---------|
| **Roads** | `highway` | Multiple widths (minor: gray, major: white) | Streets, motorways |
| **Water** | `water`, `natural=water` | #7db8dc | Lakes, rivers (polygon areas) |
| **Waterways** | `waterway` | #7db8dc | Stream/river lines |
| **Landuse** | `landuse` | Varies (#a8d4a8 for forest, #ddd8c4 for residential) | Parks, forests, residential areas |
| **Vegetation** | `natural=wood`, `natural=grassland` | #a8d4a8 | Natural areas |
| **Aeroways** | `aeroway` | #ddd8c4 | Airports, runways |
| **Railways** | `railway` | #707070 | Train tracks, rail lines |

### Coordinate Transformation

OSM features are in geographic coordinates (latitude/longitude). **TerrainCanvasRenderer** transforms them to canvas pixel coordinates:

```
canvasPixelX = ((osmLon - tileLeft) / tileWidth) × canvasWidth
canvasPixelY = ((osmLat - tileTop) / tileHeight) × canvasHeight
```

Where `tileLeft/Top` and `tileWidth/Height` are derived from the Web Mercator tile bounds at zoom 15.

---

## Spatial Organization

### Web Mercator Projection

Ground surface tiles are organized using the **Web Mercator projection** at zoom level 15:

- **Tile key**: `z:x:y` (zoom:column:row)
  - z = 15 (fixed)
  - x, y derived from drone's Mercator coordinates
  - Each tile covers ~2 km × ~2 km at equator (resolution varies by latitude)

- **Tile size**: 256×256 pixels
  - Maps to (tileWidthMeters × tileHeightMeters) in real-world coordinates
  - Exact meters depend on latitude

See `doc/coordinate-system.md` for projection details.

### Ring-Based Loading

Tiles are loaded in concentric rings around the drone's current position:

```
Ring 1 (3×3 grid):
  [◯◯◯]
  [◯🚁◯]
  [◯◯◯]

Ring 2 (5×5 grid):
  [◯◯◯◯◯]
  [◯◯◯◯◯]
  [◯◯🚁◯◯]
  [◯◯◯◯◯]
  [◯◯◯◯◯]
```

**Advantages**:
- Predictable loading pattern (tiles near drone load first)
- Easy to configure via `ringRadius` parameter
- Prevents excessive memory use (old tiles evicted when outside ring)

**Configuration**: `src/config.ts` → `elevationConfig.ringRadius` (default: 1)

### Mesh Positioning

Each loaded tile is positioned at its **tile center** in Mercator space:

```typescript
meshPosition.x = tileCenter_mercatorX
meshPosition.y = 0  // Ground reference; elevation adjusts individual vertices
meshPosition.z = -tileCenter_mercatorY  // Z-negated (critical for Three.js)
```

**Why Z-negated?** See `doc/coordinate-system.md`. Mercator Y increases northward; Three.js camera looks along -Z. Negating Z aligns the two systems.

---

## Coordinate System & Z-Negation

### Critical Transformation

**Mercator Y increases northward** (geographic north), but **Three.js camera looks along -Z** (by default). To align them, we negate Z:

```
Mercator Coordinates         Three.js Coordinates
─────────────────────────    ─────────────────────
X (east)         → +X        (east)        ✓
Y (north)        → -Z        (north = -Z)  ✓
Elevation        → +Y        (up)          ✓
```

### Mesh Positioning Formula

```
position.x = tileCenter.mercatorX
position.y = 0
position.z = -tileCenter.mercatorY
```

This ensures:
- North (increasing Mercator Y) = decreasing Z = camera's forward direction
- East (increasing Mercator X) = increasing X = camera's right direction
- Vertical = elevation (Y)

### Why This Matters

If Z **weren't** negated:
- Mercator Y (northward) would map to +Z
- Camera looks along -Z, so north would appear *behind* camera
- Everything would appear rotated 180°

All ground surface code uses this negation consistently. Verify it in:
- `TerrainObjectFactory.ts:52` (mesh positioning)
- `TerrainGeometryFactory.ts` (vertex Z = -mercatorY)
- `TerrainCanvasRenderer.ts` (texture UV calculation)

---

## Integration with Drone System

### Lifecycle

Ground surface rendering is tightly integrated with the drone's **animation loop**:

**Frame-Rate-Independent Animation Order**:
1. `drone.applyMove(deltaTime)` — Update drone position
2. `elevationData.setLocation(drone.location)` — Update tile ring
3. `contextData.setLocation(drone.location)` — Update texture tiles
4. `terrainObjectManager.refresh()` — Add/remove meshes from scene
5. `droneObject.update()` — Position drone cone
6. `camera.updateChaseCamera()` — Position camera
7. `viewer3D.render()` — Render Three.js scene

Terrain tiles are added/removed as the drone moves. The system maintains a configurable ring of tiles around the drone and evicts tiles outside the ring.

### Elevation Sampling

Other 3D objects (buildings, trees, vegetation) can **sample the terrain elevation** to position themselves realistically on the ground. The elevation system provides `getTileAt(location)` and elevation sampling methods for this purpose. See `doc/data/elevations.md`.

### Graceful Degradation

The system degrades gracefully if data is unavailable:

- **Elevation data unavailable**: Geometry rendered with default elevation or wireframe
- **Texture unavailable**: Mesh renders with solid ground color (#d8c8a8) until texture loads
- **Both unavailable**: Wireframe mesh visible (debug fallback)

---

## Performance & Optimization

### Why Canvas Textures

OSM features include millions of line segments (roads, railways, waterways). Rendering each as individual Three.js geometry would create millions of mesh objects, causing:
- Excessive draw calls
- Memory overhead (vertices + indices per feature)
- GPU bottleneck

Rasterizing to a **2048×2048 canvas** solves this:
- Single texture per tile (minimal memory)
- Single mesh per tile (single draw call)
- CPU rendering of vector data is fast enough for offline canvas

### Tile Caching

Loaded tiles are cached in memory to avoid re-fetching and re-parsing:

| Cache Layer | Type | Scope |
|------------|------|-------|
| **In-memory** | `Map<z:x:y, Tile>` | Active tiles + recent history |
| **IndexedDB** (optional) | Persistent browser storage | Survive page reloads |

Tiles outside the ring are **evicted** automatically to prevent unbounded memory growth.

### Concurrency Limits

To avoid network saturation:
- Maximum **3 concurrent elevation tile loads**
- Excess tiles queued and processed as loads complete
- Similar limit for texture tiles

This prevents hundreds of simultaneous HTTP requests.

### Level-of-Detail (LOD)

Currently, a **single mesh per tile** is rendered regardless of distance. No LOD variants. Future optimization could:
- Simplify distant tile geometry (fewer vertices)
- Use lower-resolution textures for distant tiles

For now, all tiles use full 256×256 vertex resolution.

---

## Material & Rendering

### MeshPhongMaterial

Ground meshes use Three.js **MeshPhongMaterial**:

```javascript
new THREE.MeshPhongMaterial({
  map: canvasTexture,      // OSM feature texture
  shininess: 10,           // Low shininess (matte terrain)
  side: THREE.FrontSide,   // Only front faces visible
})
```

This material:
- Applies **canvas texture** to mesh UVs
- Supports **Phong reflection** (combines ambient + diffuse + specular lighting)
- Works with Three.js lights and shadows

### Texture Filtering

Three.js applies **mipmapping** for texture filtering:
- **Close**: `NearestFilter` (sharp pixels visible)
- **Distance**: `LinearMipmapLinearFilter` (blurred, prevents flickering)

This ensures terrain looks crisp when close and smooth when far.

### Wireframe Mode (Debug)

For development, meshes can render as **wireframe** (triangle edges visible):

```javascript
material.wireframe = true;
```

Useful for:
- Visualizing vertex grid (256×256)
- Debugging mesh positioning (Z-negation)
- Performance profiling (polygon count)

---

## Key Files & References

### Core Implementation

| File | Purpose | Responsibility |
|------|---------|-----------------|
| `TerrainObjectManager.ts` | Main orchestrator | Subscribe to drone position, trigger pipelines, manage mesh lifecycle |
| `TerrainGeometryFactory.ts` | Geometry creation | Convert elevation data → vertex buffer + normals |
| `TerrainCanvasRenderer.ts` | Texture rendering | Draw OSM features → canvas texture (painter's algorithm) |
| `TerrainObjectFactory.ts` | Mesh integration | Create Three.js mesh (geometry + texture), position at tile center |
| `ElevationDataManager.ts` | Tile caching | Fetch/cache elevation tiles, manage ring-based loading |
| `ContextDataManager.ts` | OSM feature caching | Fetch/cache OSM tiles, manage feature extraction |

### Configuration

| File | Key Values | Purpose |
|------|-----------|---------|
| `src/config.ts` | `elevationConfig.zoomLevel: 15` | Web Mercator zoom (controls tile resolution) |
| | `elevationConfig.ringRadius: 1` | Tile ring size (1=3×3, 2=5×5) |
| | `textureConfig.groundCanvasSize: 2048` | Canvas texture dimensions |
| | `groundColors.default: '#d8c8a8'` | Base ground fill color |

### Related Documentation

- **`doc/coordinate-system.md`** — Z-negation and Mercator projection details
- **`doc/data/elevations.md`** — Elevation data source, Terrarium format, precision
- **`CLAUDE.md`** — System architecture, animation frame order

---

## Glossary

| Term | Definition |
|------|-----------|
| **Web Mercator** | Cylindrical map projection used for web maps (Google, OSM, etc.). Distorts polar regions but preserves local shapes. |
| **Tile (z:x:y)** | Grid cell in Web Mercator. z=zoom level, x=column, y=row. Each tile covers ~2 km² at equator (zoom 15). |
| **Terrarium Format** | PNG encoding scheme: (R × 256 + G + B/256) - 32768 = elevation in meters. Used by Amazon's elevation service. |
| **Ring-Based Loading** | Concentric grid pattern around drone. Ring 1 = 3×3, Ring 2 = 5×5, etc. Optimizes network I/O. |
| **Canvas Texture** | 2D image rendered to HTML Canvas, then converted to Three.js Texture. OSM features rasterized here. |
| **Painter's Algorithm** | Drawing objects back-to-front to achieve correct layering without explicit depth testing. |
| **Z-Negation** | Mercator Y (northward) maps to -Z (Three.js camera forward). Critical for coordinate alignment. |
| **MeshPhongMaterial** | Three.js material supporting Phong reflection (combines ambient, diffuse, specular lighting). |
| **Mipmapping** | Pre-computed texture pyramids for efficient filtering at different scales/distances. |
| **Vertex Normal** | Direction perpendicular to mesh surface, computed per-vertex. Essential for realistic lighting. |
| **OSM (OpenStreetMap)** | Collaborative global map database. Features include roads, water, landuse, vegetation, railways, etc. |
| **Index Buffer** | Array of vertex indices defining triangle faces. Avoids vertex duplication. |
| **UV Coordinates** | 2D texture coordinates (u, v) mapped to 3D vertices. Range [0,1] for each tile. |

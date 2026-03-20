import { type BufferGeometry, Mesh } from 'three';
import { Scene } from '../../3Dviewer/Scene';
import { TerrainObjectFactory } from './TerrainObjectFactory';
import { TerrainGeometryObjectManager } from './geometry/TerrainGeometryObjectManager';
import type { TerrainTextureObjectManager } from './texture/TerrainTextureObjectManager';
import type { TileKey } from './geometry/types';
import type { TileResource } from './types';
import { TileObjectManager } from '../TileObjectManager';
import { OriginManager } from '../../gis/OriginManager';
import { geoToLocal, type GeoCoordinates } from '../../gis/GeoCoordinates';

/**
 * Manages terrain mesh resources in the 3D scene.
 * Uses TerrainGeometryObjectManager as the primary source and
 * TerrainTextureObjectManager as a secondary rebuild trigger.
 *
 * Meshes are created as soon as geometry arrives; if a texture is available
 * at that point it is applied immediately. When a texture arrives later,
 * the mesh is rebuilt (dispose + recreate) with the texture applied.
 *
 * When the drone moves and the origin changes, all existing tile meshes are
 * repositioned exactly via geoToLocal(tileCenter, newOrigin).
 */
export class TerrainObjectManager extends TileObjectManager<
  TileResource<BufferGeometry>,
  TileResource<Mesh>
> {
  constructor(
    private readonly scene: Scene,
    private readonly geometryManager: TerrainGeometryObjectManager,
    private readonly textureManager: TerrainTextureObjectManager,
    private readonly originManager: OriginManager,
    private readonly factory: TerrainObjectFactory = new TerrainObjectFactory()
  ) {
    super(geometryManager, [textureManager]);
    this.originManager.onChange(this.onOriginChange);
  }

  protected override createObject(
    key: string,
    geometryResource: TileResource<BufferGeometry>
  ): TileResource<Mesh> {
    const textureResource =
      this.textureManager.getTerrainTextureObject(key) ?? null;
    const terrainObject = this.factory.createTerrainObject(
      geometryResource,
      textureResource,
      this.originManager.getOrigin()
    );
    this.scene.add(terrainObject.resource);
    return terrainObject;
  }

  protected override disposeObject(obj: TileResource<Mesh>): void {
    this.scene.remove(obj.resource);
    obj.dispose();
  }

  /**
   * Get a terrain object by its tile key.
   */
  getTerrainObject(tileKey: TileKey): TileResource<Mesh> | undefined {
    return this.objects.get(tileKey);
  }

  /**
   * Clean up all objects, remove from scene, and dispose owned sub-managers.
   */
  override dispose(): void {
    this.originManager.offChange(this.onOriginChange);
    super.dispose();
    this.geometryManager.dispose();
    this.textureManager.dispose();
  }

  private readonly onOriginChange = (newOrigin: GeoCoordinates): void => {
    for (const tile of this.objects.values()) {
      const b = tile.bounds;
      const pos = geoToLocal(
        (b.minLat + b.maxLat) / 2,
        (b.minLng + b.maxLng) / 2,
        0,
        newOrigin
      );
      tile.resource.position.set(pos.x, pos.y, pos.z);
    }
  };
}

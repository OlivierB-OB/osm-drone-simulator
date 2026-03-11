import { Mesh, MeshPhongMaterial, MeshBasicMaterial } from 'three';
import { debugConfig } from '../../config';
import { mercatorToThreeJs } from '../../gis/types';
import { TerrainObject } from './TerrainObject';
import { TerrainGeometryObject } from './geometry/TerrainGeometryObject';
import type { TerrainTextureObject } from './texture/TerrainTextureObject';

/**
 * Factory for creating TerrainObject instances from TerrainGeometryObject.
 * Creates a Mesh with a new MeshPhongMaterial for each geometry.
 */
export class TerrainObjectFactory {
  constructor(
    private readonly meshConstructor: typeof Mesh = Mesh,
    private readonly materialConstructor: typeof MeshPhongMaterial = MeshPhongMaterial
  ) {}

  /**
   * Create a TerrainObject from a TerrainGeometryObject with optional texture.
   *
   * @param geometryObject - The geometry to create mesh from
   * @param textureObject - Optional texture object; if provided, texture is applied to material
   *
   * Creates a new mesh with a MeshPhongMaterial (or MeshBasicMaterial in debug mode).
   * If texture provided, applies it to the material's map property.
   * Positions the mesh at the tile's Mercator coordinates.
   */
  createTerrainObject(
    geometryObject: TerrainGeometryObject,
    textureObject?: TerrainTextureObject | null
  ): TerrainObject {
    const texture = textureObject?.getTexture();
    const material =
      debugConfig.useSimpleTerrainMaterial || !texture
        ? new MeshBasicMaterial({
            color: 0x111111,
            wireframe: true,
          })
        : new this.materialConstructor({
            map: texture,
          });

    const mesh = new this.meshConstructor(
      geometryObject.getGeometry(),
      material
    );

    const bounds = geometryObject.getMercatorBounds();
    const centerX = (bounds.minX + bounds.maxX) / 2;
    const centerY = (bounds.minY + bounds.maxY) / 2;
    const pos = mercatorToThreeJs({ x: centerX, y: centerY }, 0);
    mesh.position.set(pos.x, pos.y, pos.z);

    return new TerrainObject(geometryObject.getTileKey(), mesh);
  }
}

import { Mesh, MeshPhongMaterial, MeshBasicMaterial } from 'three';
import type * as THREE from 'three';
import { debugConfig } from '../../config';
import { mercatorToThreeJs } from '../../gis/types';
import type { TileResource } from './types';
import type { BufferGeometry } from 'three';

/**
 * Factory for creating terrain mesh resources from geometry and texture resources.
 * Creates a Mesh with a new MeshPhongMaterial for each geometry.
 */
export class TerrainObjectFactory {
  constructor(
    private readonly meshConstructor: typeof Mesh = Mesh,
    private readonly materialConstructor: typeof MeshPhongMaterial = MeshPhongMaterial
  ) {}

  /**
   * Create a terrain mesh resource from a geometry resource with optional texture.
   *
   * @param geometryResource - The geometry resource to create mesh from
   * @param textureResource - Optional texture resource; if provided, texture is applied to material
   *
   * Creates a new mesh with a MeshPhongMaterial (or MeshBasicMaterial in debug mode).
   * If texture provided, applies it to the material's map property.
   * Positions the mesh at the tile's Mercator coordinates.
   */
  createTerrainObject(
    geometryResource: TileResource<BufferGeometry>,
    textureResource?: TileResource<THREE.Texture> | null
  ): TileResource<Mesh> {
    const texture = textureResource?.resource;
    const material =
      debugConfig.useSimpleTerrainMaterial || !texture
        ? new MeshBasicMaterial({
            color: 0x111111,
            wireframe: true,
          })
        : new this.materialConstructor({
            map: texture,
          });

    const mesh = new this.meshConstructor(geometryResource.resource, material);

    const bounds = geometryResource.bounds;
    const centerX = (bounds.minX + bounds.maxX) / 2;
    const centerY = (bounds.minY + bounds.maxY) / 2;
    const pos = mercatorToThreeJs({ x: centerX, y: centerY }, 0);
    mesh.position.set(pos.x, pos.y, pos.z);

    return {
      tileKey: geometryResource.tileKey,
      resource: mesh,
      bounds: geometryResource.bounds,
      dispose: () => {
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat) => mat.dispose());
        } else {
          mesh.material.dispose();
        }
      },
    };
  }
}

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  Mesh,
  BufferGeometry,
  Texture,
  MeshPhongMaterial,
  MeshBasicMaterial,
} from 'three';
import { TerrainObjectFactory } from './TerrainObjectFactory';
import type { TileResource } from './types';
import { debugConfig } from '../../config';

describe('TerrainObjectFactory', () => {
  let factory: TerrainObjectFactory;
  let geometryResource: TileResource<BufferGeometry>;
  let geometry: BufferGeometry;
  const tileKey = '9:261:168';
  const mercatorBounds = { minX: 0, maxX: 1000, minY: 0, maxY: 1000 };

  beforeEach(() => {
    geometry = new BufferGeometry();
    geometryResource = {
      tileKey,
      resource: geometry,
      bounds: mercatorBounds,
      dispose: vi.fn(),
    };
  });

  describe('constructor', () => {
    it('should use default Mesh and MeshPhongMaterial constructors', () => {
      factory = new TerrainObjectFactory();
      expect(factory).toBeDefined();
    });

    it('should accept optional injected constructors', () => {
      const customFactory = new TerrainObjectFactory(Mesh, MeshPhongMaterial);
      expect(customFactory).toBeDefined();
      const terrainResource =
        customFactory.createTerrainObject(geometryResource);
      expect(terrainResource).toBeDefined();
    });
  });

  describe('createTerrainObject', () => {
    beforeEach(() => {
      factory = new TerrainObjectFactory();
    });

    it('should create a terrain resource with tile key and mesh', () => {
      const terrainResource = factory.createTerrainObject(geometryResource);

      expect(terrainResource.tileKey).toBe(tileKey);
      expect(terrainResource.resource).toBeDefined();
    });

    it('should create a mesh with the provided geometry', () => {
      const terrainResource = factory.createTerrainObject(geometryResource);

      expect(terrainResource.resource.geometry).toBe(geometry);
    });

    describe('material type', () => {
      const originalUseSimple = debugConfig.useSimpleTerrainMaterial;
      let textureResource: TileResource<Texture>;
      let texture: Texture;

      beforeEach(() => {
        (debugConfig as any).useSimpleTerrainMaterial = false;
        texture = new Texture();
        textureResource = {
          tileKey,
          resource: texture,
          bounds: mercatorBounds,
          dispose: vi.fn(),
        };
      });

      afterEach(() => {
        (debugConfig as any).useSimpleTerrainMaterial = originalUseSimple;
      });

      it('should create a mesh with a MeshPhongMaterial when texture is provided', () => {
        const terrainResource = factory.createTerrainObject(
          geometryResource,
          textureResource
        );

        expect(terrainResource.resource.material).toBeInstanceOf(
          MeshPhongMaterial
        );
      });

      it('should apply texture map to material', () => {
        const terrainResource = factory.createTerrainObject(
          geometryResource,
          textureResource
        );
        const material = terrainResource.resource.material as MeshPhongMaterial;

        expect(material.map).toBe(texture);
      });
    });

    it('should create different mesh instances for each call', () => {
      const resource1 = factory.createTerrainObject(geometryResource);
      const resource2 = factory.createTerrainObject(geometryResource);

      expect(resource1.resource).not.toBe(resource2.resource);
    });

    it('should create different material instances for each call', () => {
      const resource1 = factory.createTerrainObject(geometryResource);
      const resource2 = factory.createTerrainObject(geometryResource);

      expect(resource1.resource.material).not.toBe(resource2.resource.material);
    });

    it('should position mesh at tile center in Mercator space', () => {
      const terrainResource = factory.createTerrainObject(geometryResource);
      const mesh = terrainResource.resource;

      // Expected center: (0+1000)/2 = 500 for X, -500 for Z (negated Mercator Y)
      expect(mesh.position.x).toBe(500);
      expect(mesh.position.y).toBe(0);
      expect(mesh.position.z).toBe(-500);
    });

    it('should propagate bounds from geometry resource', () => {
      const terrainResource = factory.createTerrainObject(geometryResource);

      expect(terrainResource.bounds).toBe(mercatorBounds);
    });

    describe('debug wireframe mode', () => {
      const originalUseSimple = debugConfig.useSimpleTerrainMaterial;

      afterEach(() => {
        (debugConfig as any).useSimpleTerrainMaterial = originalUseSimple;
      });

      it('should use wireframe rendering for debug material', () => {
        (debugConfig as any).useSimpleTerrainMaterial = true;
        const terrainResource = factory.createTerrainObject(geometryResource);
        const material = terrainResource.resource.material as MeshBasicMaterial;

        expect(material.wireframe).toBe(true);
      });
    });
  });
});

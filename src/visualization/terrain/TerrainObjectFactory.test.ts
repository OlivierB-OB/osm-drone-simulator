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
  const geoBounds = {
    minLat: 48.85,
    maxLat: 48.86,
    minLng: 2.34,
    maxLng: 2.35,
  };
  const origin = { lat: 48.855, lng: 2.345 };

  beforeEach(() => {
    geometry = new BufferGeometry();
    geometryResource = {
      tileKey,
      resource: geometry,
      bounds: geoBounds,
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
      const terrainResource = customFactory.createTerrainObject(
        geometryResource,
        null,
        { lat: 48.855, lng: 2.345 }
      );
      expect(terrainResource).toBeDefined();
    });
  });

  describe('createTerrainObject', () => {
    beforeEach(() => {
      factory = new TerrainObjectFactory();
    });

    it('should create a terrain resource with tile key and mesh', () => {
      const terrainResource = factory.createTerrainObject(
        geometryResource,
        null,
        origin
      );

      expect(terrainResource.tileKey).toBe(tileKey);
      expect(terrainResource.resource).toBeDefined();
    });

    it('should create a mesh with the provided geometry', () => {
      const terrainResource = factory.createTerrainObject(
        geometryResource,
        null,
        origin
      );

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
          bounds: geoBounds,
          dispose: vi.fn(),
        };
      });

      afterEach(() => {
        (debugConfig as any).useSimpleTerrainMaterial = originalUseSimple;
      });

      it('should create a mesh with a MeshPhongMaterial when texture is provided', () => {
        const terrainResource = factory.createTerrainObject(
          geometryResource,
          textureResource,
          origin
        );

        expect(terrainResource.resource.material).toBeInstanceOf(
          MeshPhongMaterial
        );
      });

      it('should apply texture map to material', () => {
        const terrainResource = factory.createTerrainObject(
          geometryResource,
          textureResource,
          origin
        );
        const material = terrainResource.resource.material as MeshPhongMaterial;

        expect(material.map).toBe(texture);
      });
    });

    it('should create different mesh instances for each call', () => {
      const resource1 = factory.createTerrainObject(
        geometryResource,
        null,
        origin
      );
      const resource2 = factory.createTerrainObject(
        geometryResource,
        null,
        origin
      );

      expect(resource1.resource).not.toBe(resource2.resource);
    });

    it('should create different material instances for each call', () => {
      const resource1 = factory.createTerrainObject(
        geometryResource,
        null,
        origin
      );
      const resource2 = factory.createTerrainObject(
        geometryResource,
        null,
        origin
      );

      expect(resource1.resource.material).not.toBe(resource2.resource.material);
    });

    it('should position mesh at (0,0,0) when origin matches tile center', () => {
      const centerLat = (geoBounds.minLat + geoBounds.maxLat) / 2;
      const centerLng = (geoBounds.minLng + geoBounds.maxLng) / 2;
      const terrainResource = factory.createTerrainObject(
        geometryResource,
        null,
        {
          lat: centerLat,
          lng: centerLng,
        }
      );
      const mesh = terrainResource.resource;

      expect(mesh.position.x).toBeCloseTo(0, 10);
      expect(mesh.position.y).toBeCloseTo(0, 10);
      expect(mesh.position.z).toBeCloseTo(0, 10);
    });

    it('should position mesh at non-zero offset when origin differs from tile center', () => {
      // origin (48.855, 2.345) differs from tile center (48.855, 2.345) — same here, offset will be small
      // Use an origin clearly far from the tile center
      const farOrigin = { lat: 0, lng: 0 };
      const terrainResource2 = factory.createTerrainObject(
        geometryResource,
        null,
        farOrigin
      );
      const mesh2 = terrainResource2.resource;

      const dist = Math.sqrt(mesh2.position.x ** 2 + mesh2.position.z ** 2);
      expect(dist).toBeGreaterThan(0);
    });

    it('should propagate bounds from geometry resource', () => {
      const terrainResource = factory.createTerrainObject(
        geometryResource,
        null,
        origin
      );

      expect(terrainResource.bounds).toBe(geoBounds);
    });

    describe('debug wireframe mode', () => {
      const originalUseSimple = debugConfig.useSimpleTerrainMaterial;

      afterEach(() => {
        (debugConfig as any).useSimpleTerrainMaterial = originalUseSimple;
      });

      it('should use wireframe rendering for debug material', () => {
        (debugConfig as any).useSimpleTerrainMaterial = true;
        const terrainResource = factory.createTerrainObject(
          geometryResource,
          null,
          origin
        );
        const material = terrainResource.resource.material as MeshBasicMaterial;

        expect(material.wireframe).toBe(true);
      });
    });
  });
});

import * as THREE from 'three';
import { Scene } from '../../3Dviewer/Scene';
import type { ContextDataManager } from '../../data/contextual/ContextDataManager';
import type { ContextDataTile } from '../../data/contextual/types';
import type { ElevationDataManager } from '../../data/elevation/ElevationDataManager';
import type { ElevationSampler } from './util/ElevationSampler';
import { featureRegistry } from '../../features/registry';
import '../../features/registration';
import { TileObjectManager } from '../TileObjectManager';
import type { OriginManager } from '../../gis/OriginManager';
import {
  geoToLocal,
  type GeoCoordinates,
  type GeoBounds,
} from '../../gis/GeoCoordinates';

/**
 * Manages 3D mesh objects (buildings, vegetation, structures, barriers, bridges)
 * in response to context data tile lifecycle events.
 *
 * Each tile gets a THREE.Group positioned at its geographic center. Feature
 * meshes inside the group are positioned relative to that center, so only the
 * group position needs updating when the drone (origin) moves.
 */
export class MeshObjectManager extends TileObjectManager<
  ContextDataTile,
  THREE.Group
> {
  constructor(
    private readonly scene: Scene,
    contextData: ContextDataManager,
    private readonly elevationSampler: ElevationSampler,
    elevationData: ElevationDataManager,
    private readonly originManager: OriginManager
  ) {
    super(contextData, [elevationData]);
    this.originManager.onChange(this.onOriginChange);
  }

  protected override createObject(
    _key: string,
    tile: ContextDataTile
  ): THREE.Group {
    const group = new THREE.Group();

    const b = tile.geoBounds;
    const centerLat = (b.minLat + b.maxLat) / 2;
    const centerLng = (b.minLng + b.maxLng) / 2;

    const groupPos = geoToLocal(
      centerLat,
      centerLng,
      0,
      this.originManager.getOrigin()
    );
    group.position.set(groupPos.x, 0, groupPos.z);

    const tileCenter: GeoCoordinates = { lat: centerLat, lng: centerLng };
    const meshes = featureRegistry.createAllMeshes(
      tile.features,
      this.elevationSampler,
      tileCenter
    );
    for (const mesh of meshes) group.add(mesh);

    group.userData.bounds = b;
    this.scene.add(group);
    return group;
  }

  protected override disposeObject(group: THREE.Group): void {
    this.scene.remove(group);
    group.traverse((child) => {
      const m = child as unknown as {
        geometry?: { dispose: () => void };
        material?: { dispose: () => void } | { dispose: () => void }[];
      };
      m.geometry?.dispose();
      if (Array.isArray(m.material)) {
        m.material.forEach((mat) => mat.dispose());
      } else {
        m.material?.dispose();
      }
    });
  }

  override dispose(): void {
    this.originManager.offChange(this.onOriginChange);
    super.dispose();
  }

  private readonly onOriginChange = (newOrigin: GeoCoordinates): void => {
    for (const group of this.objects.values()) {
      const b = group.userData.bounds as GeoBounds;
      const pos = geoToLocal(
        (b.minLat + b.maxLat) / 2,
        (b.minLng + b.maxLng) / 2,
        0,
        newOrigin
      );
      group.position.set(pos.x, 0, pos.z);
    }
  };
}

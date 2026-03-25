import type { FeatureModule } from '../types';
import type { Object3D } from 'three';
import type { ElevationSampler } from '../../visualization/mesh/util/ElevationSampler';
import type { GeoCoordinates } from '../../gis/GeoCoordinates';
import { BuildingMeshFactory } from './BuildingMeshFactory';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import centroid from '@turf/centroid';
import type { Polygon } from 'geojson';
import type { BuildingVisual, ModuleFeatures } from './types';

function nestBuildingParts(buildings: BuildingVisual[]): void {
  const nonParts = buildings.filter(
    (b) => !b.isPart && b.geometry.type === 'Polygon'
  );
  const parts = buildings.filter(
    (b) => b.isPart && b.geometry.type === 'Polygon'
  );

  for (const part of parts) {
    for (const parent of nonParts) {
      if (
        booleanPointInPolygon(
          centroid(part.geometry),
          parent.geometry as Polygon
        )
      ) {
        parent.hasParts = true;
        parent.children ??= [];
        parent.children.push(part);
        part.parentId = parent.id;
        break;
      }
    }
  }
}

export const buildingModule: FeatureModule<ModuleFeatures> = {
  classifyPriority: 10,

  moduleFeaturesFactory(): ModuleFeatures {
    return { buildings: [] };
  },

  postProcess(features: ModuleFeatures): void {
    nestBuildingParts(features.buildings);
  },

  createMeshes(
    features: ModuleFeatures,
    elevationSampler: ElevationSampler,
    origin: GeoCoordinates
  ): Object3D[] {
    const factory = new BuildingMeshFactory(elevationSampler);
    return factory.create(features.buildings, origin);
  },
};

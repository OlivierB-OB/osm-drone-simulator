import type { FeatureModule } from '../types';
import type { Object3D } from 'three';
import type { ElevationSampler } from '../../visualization/mesh/util/ElevationSampler';
import { classifyBuilding } from './buildingStrategy';
import { BuildingMeshFactory } from './BuildingMeshFactory';
import booleanContains from '@turf/boolean-contains';
import type { BuildingVisual, ModuleFeatures } from './types';
import type { LineString, Point, Polygon } from 'geojson';

function markBuildingParents(buildings: BuildingVisual[]): void {
  const nonParts = buildings.filter(
    (b) => !b.isPart && b.geometry.type === 'Polygon'
  );
  const parts = buildings.filter(
    (b) => b.isPart && b.geometry.type === 'Polygon'
  );

  for (const part of parts) {
    for (const parent of nonParts) {
      if (booleanContains(parent.geometry, part.geometry)) {
        parent.hasParts = true;
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

  overpassFragments(bbox: string): string[] {
    return [
      `node["building"](${bbox});`,
      `way["building"](${bbox});`,
      `relation["building"](${bbox});`,
      `node["building:part"](${bbox});`,
      `way["building:part"](${bbox});`,
      `relation["building:part"](${bbox});`,
    ];
  },

  matches(tags: Record<string, string>): boolean {
    return !!(tags.building || tags['building:part']);
  },

  classify(
    id: string,
    tags: Record<string, string>,
    geometry: Point | LineString | Polygon,
    features: ModuleFeatures
  ): void {
    const feature = classifyBuilding(id, tags, geometry);
    if (feature) features.buildings.push(feature);
  },

  postProcess(features: ModuleFeatures): void {
    markBuildingParents(features.buildings);
  },

  createMeshes(
    features: ModuleFeatures,
    elevationSampler: ElevationSampler
  ): Object3D[] {
    const factory = new BuildingMeshFactory(elevationSampler);
    return factory.create(features.buildings);
  },
};

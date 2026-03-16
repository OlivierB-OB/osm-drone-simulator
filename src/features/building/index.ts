import type { FeatureModule } from '../types';
import type { BuildingVisual } from '../../data/contextual/types';
import type { Object3D } from 'three';
import type { ContextDataTile } from '../sharedTypes';
import type { ElevationSampler } from '../../visualization/mesh/util/ElevationSampler';
import { classifyBuilding } from './buildingStrategy';
import { BuildingMeshFactory } from './BuildingMeshFactory';
import booleanContains from '@turf/boolean-contains';

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

export const buildingModule: FeatureModule<BuildingVisual> = {
  name: 'building',
  featureKey: 'buildings',
  classifyPriority: 10,

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

  classify(id, tags, geometry): BuildingVisual {
    return classifyBuilding(id, tags, geometry);
  },

  postProcess(features: ContextDataTile['features']): void {
    markBuildingParents(features.buildings);
  },

  createMeshes(
    features: BuildingVisual[],
    _allFeatures: ContextDataTile['features'],
    elevationSampler: ElevationSampler
  ): Object3D[] {
    const factory = new BuildingMeshFactory(elevationSampler);
    return factory.create(features);
  },
};

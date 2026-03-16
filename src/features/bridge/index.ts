import type { FeatureModule } from '../types';
import type { Object3D } from 'three';
import type { ContextDataTile } from '../sharedTypes';
import type { ElevationSampler } from '../../visualization/mesh/util/ElevationSampler';
import { BridgeMeshFactory } from './BridgeMeshFactory';

export const bridgeModule: FeatureModule = {
  name: 'bridge',
  featureKey: 'roads', // reads from roads (and railways via allFeatures)
  classifyPriority: Infinity, // never classifies

  createMeshes(
    _features: unknown[],
    allFeatures: ContextDataTile['features'],
    elevationSampler: ElevationSampler
  ): Object3D[] {
    const factory = new BridgeMeshFactory(elevationSampler);
    return [
      ...factory.createFromRoads(allFeatures.roads),
      ...factory.createFromRailways(allFeatures.railways),
    ];
  },
};

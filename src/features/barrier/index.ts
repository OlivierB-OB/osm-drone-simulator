import type { FeatureModule } from '../types';
import type { BarrierVisual } from '../../data/contextual/types';
import type { Object3D } from 'three';
import type { LineString } from 'geojson';
import type { ContextDataTile } from '../sharedTypes';
import type { ElevationSampler } from '../../visualization/mesh/util/ElevationSampler';
import { BARRIER_TYPES, classifyBarrier } from './barrierStrategy';
import { BarrierMeshFactory } from './BarrierMeshFactory';

export const barrierModule: FeatureModule<BarrierVisual> = {
  name: 'barrier',
  featureKey: 'barriers',
  classifyPriority: 57,

  overpassFragments(bbox: string): string[] {
    return [`way["barrier"~"wall|city_wall|retaining_wall|hedge"](${bbox});`];
  },

  matches(tags: Record<string, string>, geometryType: string): boolean {
    return (
      !!tags.barrier &&
      BARRIER_TYPES.has(tags.barrier) &&
      geometryType === 'LineString'
    );
  },

  classify(id, tags, geometry): BarrierVisual | null {
    return classifyBarrier(id, tags, geometry as LineString);
  },

  createMeshes(
    features: BarrierVisual[],
    _allFeatures: ContextDataTile['features'],
    elevationSampler: ElevationSampler
  ): Object3D[] {
    const factory = new BarrierMeshFactory(elevationSampler);
    return factory.create(features);
  },
};

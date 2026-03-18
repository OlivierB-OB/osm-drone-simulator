import type { FeatureModule } from '../types';
import type { Object3D } from 'three';
import type { LineString, Point, Polygon } from 'geojson';
import type { ElevationSampler } from '../../visualization/mesh/util/ElevationSampler';
import { BARRIER_TYPES, classifyBarrier } from './barrierStrategy';
import { BarrierMeshFactory } from './BarrierMeshFactory';
import type { ModuleFeatures } from './types';

export const barrierModule: FeatureModule<ModuleFeatures> = {
  classifyPriority: 57,

  moduleFeaturesFactory(): ModuleFeatures {
    return { barriers: [] };
  },

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

  classify(
    id: string,
    tags: Record<string, string>,
    geometry: Point | LineString | Polygon,
    features: ModuleFeatures
  ): void {
    const feature = classifyBarrier(id, tags, geometry as LineString);
    if (feature) features.barriers.push(feature);
  },

  createMeshes(
    features: ModuleFeatures,
    elevationSampler: ElevationSampler
  ): Object3D[] {
    const factory = new BarrierMeshFactory(elevationSampler);
    return factory.create(features.barriers);
  },
};

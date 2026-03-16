import type { FeatureModule } from '../types';
import type { VegetationVisual } from '../../data/contextual/types';
import type { Object3D } from 'three';
import type { ContextDataTile } from '../sharedTypes';
import type { ElevationSampler } from '../../visualization/mesh/util/ElevationSampler';
import { classifyVegetation } from './vegetationStrategy';
import { drawVegetation } from './canvas';
import { VegetationMeshFactory } from './VegetationMeshFactory';
import { NATURAL_LANDUSE_TYPES } from '../landuse/landuseStrategy';

export const vegetationModule: FeatureModule<VegetationVisual> = {
  name: 'vegetation',
  featureKey: 'vegetation',
  classifyPriority: 60,
  canvasOrder: 50,

  overpassFragments(bbox: string): string[] {
    return [
      `way["natural"~"forest|wood|scrub|heath"](${bbox});`,
      `node["natural"~"tree|trees"](${bbox});`,
      `way["natural"="tree_row"](${bbox});`,
    ];
  },

  matches(tags: Record<string, string>): boolean {
    // landuse=forest is vegetation, not landuse
    if (tags.landuse === 'forest') return true;
    // natural=* vegetation (but not water/wetland/coastline/landuse-natural types)
    if (tags.natural) {
      // Exclude types handled by water module
      if (
        tags.natural === 'water' ||
        tags.natural === 'wetland' ||
        tags.natural === 'coastline'
      )
        return false;
      // Exclude types handled by landuse module
      if (NATURAL_LANDUSE_TYPES.has(tags.natural)) return false;
      return true;
    }
    return false;
  },

  classify(id, tags, geometry): VegetationVisual | null {
    const isForest = tags.landuse === 'forest';
    return classifyVegetation(id, tags, geometry, isForest);
  },

  drawCanvas(features, draw): void {
    drawVegetation(features, draw);
  },

  createMeshes(
    features: VegetationVisual[],
    _allFeatures: ContextDataTile['features'],
    elevationSampler: ElevationSampler
  ): Object3D[] {
    const factory = new VegetationMeshFactory(elevationSampler);
    return factory.create(features);
  },
};

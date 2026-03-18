import type { CanvasDrawContext, FeatureModule } from '../types';
import type { Object3D } from 'three';
import type { ElevationSampler } from '../../visualization/mesh/util/ElevationSampler';
import { classifyVegetation } from './vegetationStrategy';
import { drawVegetation } from './canvas';
import { VegetationMeshFactory } from './VegetationMeshFactory';
import { NATURAL_LANDUSE_TYPES } from '../landuse/landuseStrategy';
import type { ModuleFeatures } from './types';
import type { Point, LineString, Polygon } from 'geojson';

export const vegetationModule: FeatureModule<ModuleFeatures> = {
  classifyPriority: 60,
  canvasOrder: 50,

  moduleFeaturesFactory(): ModuleFeatures {
    return { vegetation: [] };
  },

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

  classify(
    id: string,
    tags: Record<string, string>,
    geometry: Point | LineString | Polygon,
    features: ModuleFeatures
  ): void {
    const isForest = tags.landuse === 'forest';
    const feature = classifyVegetation(id, tags, geometry, isForest);
    if (feature) features.vegetation.push(feature);
  },

  drawCanvas(features: ModuleFeatures, draw: CanvasDrawContext): void {
    drawVegetation(features.vegetation, draw);
  },

  createMeshes(
    features: ModuleFeatures,
    elevationSampler: ElevationSampler
  ): Object3D[] {
    const factory = new VegetationMeshFactory(elevationSampler);
    return factory.create(features.vegetation);
  },
};

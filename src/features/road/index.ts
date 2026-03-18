import type { CanvasDrawContext, FeatureModule } from '../types';
import type { LineString, Point, Polygon } from 'geojson';
import { classifyRoad } from './roadStrategy';
import { drawRoads } from './canvas';
import type { ModuleFeatures } from './types';

export const roadModule: FeatureModule<ModuleFeatures> = {
  classifyPriority: 20,
  canvasOrder: 70,

  moduleFeaturesFactory(): ModuleFeatures {
    return { roads: [] };
  },

  overpassFragments(bbox: string): string[] {
    return [`way["highway"](${bbox});`];
  },

  matches(tags: Record<string, string>, geometryType: string): boolean {
    return !!tags.highway && geometryType === 'LineString';
  },

  classify(
    id: string,
    tags: Record<string, string>,
    geometry: Point | LineString | Polygon,
    features: ModuleFeatures
  ): void {
    const feature = classifyRoad(id, tags, geometry as LineString);
    if (feature) features.roads.push(feature);
  },

  drawCanvas(features: ModuleFeatures, draw: CanvasDrawContext): void {
    drawRoads(features.roads, draw);
  },
};

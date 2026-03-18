import type { CanvasDrawContext, FeatureModule } from '../types';
import type { LineString, Point, Polygon } from 'geojson';
import { classifyRailway } from './railwayStrategy';
import { drawRailways } from './canvas';
import type { ModuleFeatures } from './types';

export const railwayModule: FeatureModule<ModuleFeatures> = {
  classifyPriority: 30,
  canvasOrder: 80,

  moduleFeaturesFactory(): ModuleFeatures {
    return { railways: [] };
  },

  overpassFragments(bbox: string): string[] {
    return [`way["railway"](${bbox});`];
  },

  matches(tags: Record<string, string>, geometryType: string): boolean {
    return !!tags.railway && geometryType === 'LineString';
  },

  classify(
    id: string,
    tags: Record<string, string>,
    geometry: Point | LineString | Polygon,
    features: ModuleFeatures
  ): void {
    const feature = classifyRailway(id, tags, geometry as LineString);
    if (feature) features.railways.push(feature);
  },

  drawCanvas(features: ModuleFeatures, draw: CanvasDrawContext): void {
    drawRailways(features.railways, draw);
  },
};

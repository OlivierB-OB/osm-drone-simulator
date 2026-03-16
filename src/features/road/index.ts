import type { FeatureModule } from '../types';
import type { RoadVisual } from '../../data/contextual/types';
import type { LineString } from 'geojson';
import { classifyRoad } from './roadStrategy';
import { drawRoads } from './canvas';

export const roadModule: FeatureModule<RoadVisual> = {
  name: 'road',
  featureKey: 'roads',
  classifyPriority: 20,
  canvasOrder: 70,

  overpassFragments(bbox: string): string[] {
    return [`way["highway"](${bbox});`];
  },

  matches(tags: Record<string, string>, geometryType: string): boolean {
    return !!tags.highway && geometryType === 'LineString';
  },

  classify(id, tags, geometry): RoadVisual {
    return classifyRoad(id, tags, geometry as LineString);
  },

  drawCanvas(features, draw): void {
    drawRoads(features, draw);
  },
};

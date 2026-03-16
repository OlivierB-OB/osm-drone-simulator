import type { FeatureModule } from '../types';
import type { RailwayVisual } from '../../data/contextual/types';
import type { LineString } from 'geojson';
import { classifyRailway } from './railwayStrategy';
import { drawRailways } from './canvas';

export const railwayModule: FeatureModule<RailwayVisual> = {
  name: 'railway',
  featureKey: 'railways',
  classifyPriority: 30,
  canvasOrder: 80,

  overpassFragments(bbox: string): string[] {
    return [`way["railway"](${bbox});`];
  },

  matches(tags: Record<string, string>, geometryType: string): boolean {
    return !!tags.railway && geometryType === 'LineString';
  },

  classify(id, tags, geometry): RailwayVisual {
    return classifyRailway(id, tags, geometry as LineString);
  },

  drawCanvas(features, draw): void {
    drawRailways(features, draw);
  },
};

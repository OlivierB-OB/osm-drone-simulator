import type { LineString, Point, Polygon } from 'geojson';
import type { CanvasDrawContext, FeatureModule } from '../types';
import { AEROWAY_TYPES, classifyAeroway } from './aerowayStrategy';
import { drawAeroways } from './canvas';
import type { ModuleFeatures } from './types';

export const aerowayModule: FeatureModule<ModuleFeatures> = {
  classifyPriority: 50,
  canvasOrder: 60,

  moduleFeaturesFactory(): ModuleFeatures {
    return { airports: [] };
  },

  overpassFragments(bbox: string): string[] {
    return [
      `node["aeroway"="aerodrome"](${bbox});`,
      `way["aeroway"="aerodrome"](${bbox});`,
      `relation["aeroway"="aerodrome"](${bbox});`,
      `way["aeroway"~"runway|taxiway|taxilane|apron|helipad"](${bbox});`,
    ];
  },

  matches(tags: Record<string, string>): boolean {
    return !!tags.aeroway && AEROWAY_TYPES.has(tags.aeroway);
  },

  classify(
    id: string,
    tags: Record<string, string>,
    geometry: Point | LineString | Polygon,
    features: ModuleFeatures
  ): void {
    const feature = classifyAeroway(id, tags, geometry);
    if (feature) features.airports.push(feature);
  },

  drawCanvas(features: ModuleFeatures, draw: CanvasDrawContext): void {
    drawAeroways(features.airports, draw);
  },
};

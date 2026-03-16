import type { FeatureModule } from '../types';
import type { AerowayVisual } from '../../data/contextual/types';
import { AEROWAY_TYPES, classifyAeroway } from './aerowayStrategy';
import { drawAeroways } from './canvas';

export const aerowayModule: FeatureModule<AerowayVisual> = {
  name: 'aeroway',
  featureKey: 'airports',
  classifyPriority: 50,
  canvasOrder: 60,

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

  classify(id, tags, geometry): AerowayVisual {
    return classifyAeroway(id, tags, geometry);
  },

  drawCanvas(features, draw): void {
    drawAeroways(features, draw);
  },
};

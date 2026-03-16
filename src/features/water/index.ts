import type { FeatureModule } from '../types';
import type { WaterVisual } from '../../data/contextual/types';
import type { LineString, Polygon } from 'geojson';
import { classifyWater } from './waterStrategy';
import { drawWater } from './canvas';

export const waterModule: FeatureModule<WaterVisual> = {
  name: 'water',
  featureKey: 'waters',
  classifyPriority: 40,
  canvasOrder: 20,

  overpassFragments(bbox: string): string[] {
    return [
      `way["waterway"](${bbox});`,
      `node["waterway"](${bbox});`,
      `way["natural"="water"](${bbox});`,
      `relation["natural"="water"](${bbox});`,
      `way["water"~"lake|pond|reservoir"](${bbox});`,
      `way["natural"="wetland"](${bbox});`,
      `way["natural"="coastline"](${bbox});`,
      `way["landuse"="water"](${bbox});`,
      `relation["landuse"="water"](${bbox});`,
    ];
  },

  matches(tags: Record<string, string>, geometryType: string): boolean {
    const isWater =
      !!tags.waterway ||
      tags['natural'] === 'water' ||
      tags['natural'] === 'wetland' ||
      tags['natural'] === 'coastline' ||
      !!tags.water ||
      tags.landuse === 'water';
    return (
      isWater && (geometryType === 'LineString' || geometryType === 'Polygon')
    );
  },

  classify(id, tags, geometry): WaterVisual {
    return classifyWater(id, tags, geometry as Polygon | LineString);
  },

  drawCanvas(features, draw): void {
    drawWater(features, draw);
  },
};

import type { CanvasDrawContext, FeatureModule } from '../types';
import type { LineString, Point, Polygon } from 'geojson';
import { classifyWater } from './waterStrategy';
import { drawWater } from './canvas';
import type { ModuleFeatures } from './types';

export const waterModule: FeatureModule<ModuleFeatures> = {
  classifyPriority: 40,
  canvasOrder: 20,

  moduleFeaturesFactory(): ModuleFeatures {
    return { waters: [] };
  },

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

  classify(
    id: string,
    tags: Record<string, string>,
    geometry: Point | LineString | Polygon,
    features: ModuleFeatures
  ): void {
    const feature = classifyWater(id, tags, geometry as Polygon | LineString);
    if (feature) features.waters.push(feature);
  },

  drawCanvas(features: ModuleFeatures, draw: CanvasDrawContext): void {
    drawWater(features.waters, draw);
  },
};

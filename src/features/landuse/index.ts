import type { CanvasDrawContext, FeatureModule } from '../types';
import type { LineString, Point, Polygon } from 'geojson';
import {
  classifyLanduse,
  LANDUSE_TYPES,
  NATURAL_LANDUSE_TYPES,
} from './landuseStrategy';
import { drawLanduse } from './canvas';
import type { ModuleFeatures } from './types';

export const landuseModule: FeatureModule<ModuleFeatures> = {
  classifyPriority: 65,
  canvasOrder: 10,

  moduleFeaturesFactory(): ModuleFeatures {
    return { landuse: [] };
  },

  overpassFragments(bbox: string): string[] {
    return [
      `way["natural"~"sand|beach|dune|bare_rock|scree|mud|glacier|grassland"](${bbox});`,
      `way["landuse"~"farmland|meadow|orchard|vineyard|allotments|cemetery|construction|recreation_ground|residential|commercial|retail|industrial|military|plant_nursery|grass"](${bbox});`,
      `way["leisure"~"park|garden"](${bbox});`,
    ];
  },

  matches(tags: Record<string, string>, geometryType: string): boolean {
    if (geometryType !== 'Polygon') return false;

    // landuse=forest is handled by vegetation module
    if (tags.landuse === 'forest') return false;

    if (
      (tags.landuse && LANDUSE_TYPES.has(tags.landuse)) ||
      tags.leisure === 'park' ||
      tags.leisure === 'garden'
    ) {
      return true;
    }

    if (tags.natural && NATURAL_LANDUSE_TYPES.has(tags.natural)) {
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
    const isNatural = !!(
      tags.natural && NATURAL_LANDUSE_TYPES.has(tags.natural)
    );
    const feature = classifyLanduse(id, tags, geometry as Polygon, isNatural);
    if (feature) features.landuse.push(feature);
  },

  drawCanvas(features: ModuleFeatures, draw: CanvasDrawContext): void {
    drawLanduse(features.landuse, draw);
  },
};

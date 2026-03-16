import type { FeatureModule } from '../types';
import type { LanduseVisual } from '../../data/contextual/types';
import type { Polygon } from 'geojson';
import {
  classifyLanduse,
  LANDUSE_TYPES,
  NATURAL_LANDUSE_TYPES,
} from './landuseStrategy';
import { drawLanduse } from './canvas';

export const landuseModule: FeatureModule<LanduseVisual> = {
  name: 'landuse',
  featureKey: 'landuse',
  classifyPriority: 65,
  canvasOrder: 10,

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

  classify(id, tags, geometry): LanduseVisual {
    const isNatural = !!(
      tags.natural && NATURAL_LANDUSE_TYPES.has(tags.natural)
    );
    return classifyLanduse(id, tags, geometry as Polygon, isNatural);
  },

  drawCanvas(features, draw): void {
    drawLanduse(features, draw);
  },
};

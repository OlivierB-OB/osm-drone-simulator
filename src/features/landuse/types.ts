import type { Polygon } from 'geojson';
import type { HexColor } from '../sharedTypes';

/**
 * Visual properties for landuse/landcover areas - filled ground surface regions
 */
export interface LanduseVisual {
  id: string;
  geometry: Polygon;
  type: string; // farmland, meadow, park, residential, commercial, etc.
  color: HexColor;
  area: number; // m², computed from original geometry before clipping
}

export interface ModuleFeatures {
  landuse: LanduseVisual[];
}

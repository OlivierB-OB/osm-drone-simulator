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
}

export interface ModuleFeatures {
  landuse: LanduseVisual[];
}

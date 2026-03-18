import type { LineString } from 'geojson';
import type { HexColor } from '../sharedTypes';

/**
 * Visual properties for barriers rendered as 3D extruded segments
 */
export interface BarrierVisual {
  id: string;
  geometry: LineString;
  type: string; // wall|city_wall|retaining_wall|hedge
  height?: number; // meters (overrides type default)
  width: number; // mesh width in meters
  color: HexColor;
  material?: string; // material tag for color override
}

export interface ModuleFeatures {
  barriers: BarrierVisual[];
}

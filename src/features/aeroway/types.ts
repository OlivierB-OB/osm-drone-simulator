import type { Point, Polygon, LineString } from 'geojson';
import type { HexColor } from '../sharedTypes';

/**
 * Visual properties for aeroways - focused on rendering: location, type, color
 */
export interface AerowayVisual {
  id: string;
  geometry: Point | Polygon | LineString; // Point for nodes, Polygon/LineString for ways/relations
  type: string; // aerodrome, runway, taxiway, taxilane, apron, helipad
  color: HexColor;
  widthMeters?: number; // Real-world width in meters for LineString aeroways (runway: 45, taxiway: 23, taxilane: 12)
}

export interface ModuleFeatures {
  airports: AerowayVisual[];
}

import type { LineString, Polygon } from 'geojson';
import type { HexColor } from '../sharedTypes';

/**
 * Visual properties for water bodies - focused on rendering: shape, water type, color
 */
export interface WaterVisual {
  id: string;
  geometry: LineString | Polygon;
  type: string; // Water category: river, lake, canal, stream, wetland, reservoir, etc.
  isArea: boolean; // true for lakes/ponds/wetlands, false for rivers/streams/canals
  widthMeters: number; // Real-world width in meters for waterway lines; 0 for polygon bodies
  intermittent?: boolean; // is_intermittent=true — rendered with dash pattern
  color: HexColor; // Blue variants derived from water type
}

export interface ModuleFeatures {
  waters: WaterVisual[];
}

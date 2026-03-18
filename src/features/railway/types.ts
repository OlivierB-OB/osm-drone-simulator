import type { LineString } from 'geojson';
import type { HexColor } from '../sharedTypes';

/**
 * Visual properties for railways - focused on rendering: shape, track count, type, color
 */
export interface RailwayVisual {
  id: string;
  geometry: LineString;
  type: string; // Railway category: rail, light_rail, tram, metro, etc.
  trackCount?: number; // Number of tracks/rails
  widthMeters: number; // Real-world width in meters derived from railway type
  dash: number[]; // Line dash pattern [dashLen, gapLen]
  color: HexColor; // Derived from railway type
  bridge?: boolean; // bridge=yes
  layer?: number; // layer tag
}

export interface ModuleFeatures {
  railways: RailwayVisual[];
}

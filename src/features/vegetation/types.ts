import type { LineString, Polygon, Point } from 'geojson';
import type { HexColor } from '../sharedTypes';

/**
 * Visual properties for vegetation - focused on rendering: shape, vegetation type, height, color
 */
export interface VegetationVisual {
  id: string;
  geometry: LineString | Polygon | Point;
  type: string; // Vegetation category: forest, wood, scrub, grass, tree, tree_row, hedge, etc.
  height?: number; // meters (for trees and tall vegetation)
  heightCategory: 'tall' | 'medium' | 'short'; // Normalized height
  color: HexColor; // Green variants derived from vegetation type
  leafType?: 'broadleaved' | 'needleleaved'; // leaf_type tag — affects 3D canopy shape
  leafCycle?: 'evergreen' | 'deciduous'; // leaf_cycle tag — affects 3D canopy color range
  crownDiameter?: number; // diameter_crown tag in meters
  trunkCircumference?: number; // circumference tag in meters
}

export interface ModuleFeatures {
  vegetation: VegetationVisual[];
}

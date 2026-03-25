import type { LineString, Point, Polygon } from 'geojson';
import type { HexColor } from '../sharedTypes';

/**
 * Visual properties for buildings - focused on rendering: shape, size, levels, color
 */
export interface BuildingVisual {
  id: string;
  geometry: Polygon | Point | LineString; // Polygon for relations, Point for nodes, LineString for simple ways
  type: string; // Building category: residential, commercial, industrial, office, etc.
  height?: number; // meters above ground
  minHeight?: number; // meters above ground (min_height tag — for building parts)
  levelCount?: number; // number of floors
  minLevelCount?: number; // number of floors at base (building:min_level tag)
  color: HexColor; // Wall color: building:colour → building:material → type default
  roofColor?: HexColor; // Roof color: roof:colour → roof:material → shape default
  roofShape?: string; // flat | gabled | hipped | pyramidal | dome | onion | cone | skillion
  roofHeight?: number; // roof height in meters (roof:height tag)
  roofDirection?: number; // roof ridge direction in degrees
  roofOrientation?: 'along' | 'across'; // ridge orientation relative to longest wall
  isPart?: boolean; // true when building:part=yes
  hasParts?: boolean; // true when building:part polygons are spatially contained within this building
  children?: BuildingVisual[]; // nested building parts linked during post-processing
  parentId?: string; // set on parts linked to a parent (skipped in flat iteration)
}

export interface ModuleFeatures {
  buildings: BuildingVisual[];
}

export function moduleFeaturesFactory(): ModuleFeatures {
  return { buildings: [] };
}

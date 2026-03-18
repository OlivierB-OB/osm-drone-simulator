import type { Point, Polygon } from 'geojson';
import type { HexColor } from '../sharedTypes';

/**
 * Visual properties for man-made structures rendered as 3D meshes
 */
export interface StructureVisual {
  id: string;
  geometry: Point | Polygon;
  type: string; // tower|chimney|mast|communications_tower|water_tower|silo|storage_tank|lighthouse|crane|power_tower|power_pole|aerialway_pylon
  height?: number; // meters
  diameter?: number; // meters (storage_tank, silo)
  color: HexColor;
}

export interface ModuleFeatures {
  structures: StructureVisual[];
}

import type { MercatorCoordinates } from './types';
import type { TileCoordinates, MercatorBounds } from '../data/elevation/types';

export const EARTH_RADIUS = 6378137; // meters
export const MAX_EXTENT = EARTH_RADIUS * Math.PI; // bounds of Web Mercator

/**
 * Converts Mercator coordinates to Web Mercator tile coordinates at a given zoom level.
 * Web Mercator uses (0,0) at top-left, with x increasing right and y increasing down.
 *
 * @param location - Mercator coordinates in meters
 * @param zoomLevel - Web Mercator zoom level (0-28)
 * @returns Tile coordinates {z, x, y}
 */
export function getTileCoordinates(
  location: MercatorCoordinates,
  zoomLevel: number
): TileCoordinates {
  const n = Math.pow(2, zoomLevel);
  const x = ((location.x + MAX_EXTENT) / (2 * MAX_EXTENT)) * n;
  const y = ((MAX_EXTENT - location.y) / (2 * MAX_EXTENT)) * n;

  return {
    z: zoomLevel,
    x: Math.floor(x),
    y: Math.floor(y),
  };
}

/**
 * Calculates the Mercator geographic bounds of a tile.
 * Returns bounds in meters within the Web Mercator projection.
 *
 * @param coordinates - Tile coordinates
 * @returns Mercator bounds in meters
 */
export function getTileMercatorBounds(
  coordinates: TileCoordinates
): MercatorBounds {
  const n = Math.pow(2, coordinates.z);

  const minNormX = coordinates.x / n;
  const maxNormX = (coordinates.x + 1) / n;
  const minNormY = coordinates.y / n;
  const maxNormY = (coordinates.y + 1) / n;

  const minX = minNormX * 2 * MAX_EXTENT - MAX_EXTENT;
  const maxX = maxNormX * 2 * MAX_EXTENT - MAX_EXTENT;
  const minY = MAX_EXTENT - maxNormY * 2 * MAX_EXTENT;
  const maxY = MAX_EXTENT - minNormY * 2 * MAX_EXTENT;

  return { minX, maxX, minY, maxY };
}

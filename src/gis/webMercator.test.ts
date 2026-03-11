import { describe, it, expect } from 'vitest';
import {
  EARTH_RADIUS,
  MAX_EXTENT,
  getTileCoordinates,
  getTileMercatorBounds,
} from './webMercator';

describe('webMercator constants', () => {
  it('EARTH_RADIUS is the standard WGS-84 semi-major axis in meters', () => {
    expect(EARTH_RADIUS).toBe(6378137);
  });

  it('MAX_EXTENT equals EARTH_RADIUS × π', () => {
    expect(MAX_EXTENT).toBeCloseTo(EARTH_RADIUS * Math.PI, 5);
  });
});

describe('getTileCoordinates', () => {
  it('returns correct zoom level', () => {
    const tile = getTileCoordinates({ x: 0, y: 0 }, 13);
    expect(tile.z).toBe(13);
  });

  it('maps origin (0,0) to the center tile', () => {
    const zoom = 13;
    const n = Math.pow(2, zoom);
    const tile = getTileCoordinates({ x: 0, y: 0 }, zoom);

    // (0,0) Mercator is center of projection → half-way through tile grid
    expect(tile.x).toBe(n / 2);
    expect(tile.y).toBe(n / 2);
  });

  it('converts Paris Mercator coordinates to expected tile at zoom 13', () => {
    // Paris ~48.85°N, 2.35°E → Mercator (261,700m, 6,250,000m)
    const paris = { x: 262144, y: 6250000 };
    const tile = getTileCoordinates(paris, 13);

    expect(tile.z).toBe(13);
    expect(tile.x).toBeGreaterThanOrEqual(0);
    expect(tile.y).toBeGreaterThanOrEqual(0);
    // Paris is north of equator → y < n/2 (tiles count from top)
    expect(tile.y).toBeLessThan(Math.pow(2, 13) / 2);
    // Paris is east of prime meridian → x > n/2
    expect(tile.x).toBeGreaterThan(Math.pow(2, 13) / 2);
  });

  it('higher zoom produces larger tile indices for the same location', () => {
    const location = { x: 262144, y: 6250000 };
    const tile10 = getTileCoordinates(location, 10);
    const tile13 = getTileCoordinates(location, 13);

    expect(tile13.x).toBeGreaterThan(tile10.x);
    expect(tile13.y).toBeGreaterThan(tile10.y);
  });

  it('produces different tiles for clearly different locations', () => {
    const tile1 = getTileCoordinates({ x: 0, y: 0 }, 14);
    const tile2 = getTileCoordinates({ x: 1000000, y: 1000000 }, 14);

    expect(tile1).not.toEqual(tile2);
  });

  it('floors fractional tile positions', () => {
    // Any location should return integer x and y
    const tile = getTileCoordinates({ x: 123456.789, y: 987654.321 }, 15);
    expect(tile.x).toBe(Math.floor(tile.x));
    expect(tile.y).toBe(Math.floor(tile.y));
  });
});

describe('getTileMercatorBounds', () => {
  it('returns minX < maxX and minY < maxY', () => {
    const bounds = getTileMercatorBounds({ z: 13, x: 4520, y: 3102 });

    expect(bounds.minX).toBeLessThan(bounds.maxX);
    expect(bounds.minY).toBeLessThan(bounds.maxY);
  });

  it('adjacent tiles (same row, consecutive columns) share an X boundary', () => {
    const bounds1 = getTileMercatorBounds({ z: 13, x: 4520, y: 3102 });
    const bounds2 = getTileMercatorBounds({ z: 13, x: 4521, y: 3102 });

    expect(bounds1.maxX).toBe(bounds2.minX);
  });

  it('adjacent tiles (same column, consecutive rows) share a Y boundary', () => {
    const bounds1 = getTileMercatorBounds({ z: 13, x: 4520, y: 3102 });
    const bounds2 = getTileMercatorBounds({ z: 13, x: 4520, y: 3103 });

    expect(bounds1.minY).toBe(bounds2.maxY);
  });

  it('bounds are larger at lower zoom levels', () => {
    const boundsZ10 = getTileMercatorBounds({ z: 10, x: 565, y: 388 });
    const boundsZ13 = getTileMercatorBounds({ z: 13, x: 4520, y: 3102 });

    const widthZ10 = boundsZ10.maxX - boundsZ10.minX;
    const widthZ13 = boundsZ13.maxX - boundsZ13.minX;

    expect(widthZ10).toBeGreaterThan(widthZ13);
  });

  it('round-trip: coordinates → tile → bounds contains original coordinates', () => {
    const location = { x: 262144, y: 6250000 };
    const zoom = 13;

    const tile = getTileCoordinates(location, zoom);
    const bounds = getTileMercatorBounds(tile);

    expect(location.x).toBeGreaterThanOrEqual(bounds.minX);
    expect(location.x).toBeLessThan(bounds.maxX);
    expect(location.y).toBeGreaterThanOrEqual(bounds.minY);
    expect(location.y).toBeLessThan(bounds.maxY);
  });
});

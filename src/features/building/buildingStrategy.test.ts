import { describe, it, expect } from 'vitest';
import { classifyBuilding } from './buildingStrategy';
import type { Polygon } from 'geojson';

const squarePolygon: Polygon = {
  type: 'Polygon',
  coordinates: [
    [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
      [0, 0],
    ],
  ],
};

describe('classifyBuilding – isPart', () => {
  it('isPart=false when building:part is absent', () => {
    const result = classifyBuilding('1', { building: 'yes' }, squarePolygon);
    expect(result.isPart).toBe(false);
  });

  it('isPart=true for building:part=yes', () => {
    const result = classifyBuilding(
      '2',
      { 'building:part': 'yes' },
      squarePolygon
    );
    expect(result.isPart).toBe(true);
  });

  it('isPart=true for building:part=porch', () => {
    const result = classifyBuilding(
      '3',
      { 'building:part': 'porch' },
      squarePolygon
    );
    expect(result.isPart).toBe(true);
  });

  it('isPart=true for building:part=roof', () => {
    const result = classifyBuilding(
      '4',
      { 'building:part': 'roof' },
      squarePolygon
    );
    expect(result.isPart).toBe(true);
  });

  it('isPart=true for building:part=balcony', () => {
    const result = classifyBuilding(
      '5',
      { 'building:part': 'balcony' },
      squarePolygon
    );
    expect(result.isPart).toBe(true);
  });
});

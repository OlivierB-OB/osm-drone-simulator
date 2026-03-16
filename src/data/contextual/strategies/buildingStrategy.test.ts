import { describe, it, expect } from 'vitest';
import { classifyBuilding } from './buildingStrategy';
import type { ContextDataTile } from '../types';
import type { Polygon } from 'geojson';

function makeFeatures(): ContextDataTile['features'] {
  return {
    buildings: [],
    roads: [],
    railways: [],
    waters: [],
    airports: [],
    vegetation: [],
    landuse: [],
    structures: [],
    barriers: [],
  };
}

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
    const features = makeFeatures();
    classifyBuilding('1', { building: 'yes' }, squarePolygon, features);
    expect(features.buildings[0]?.isPart).toBe(false);
  });

  it('isPart=true for building:part=yes', () => {
    const features = makeFeatures();
    classifyBuilding('2', { 'building:part': 'yes' }, squarePolygon, features);
    expect(features.buildings[0]?.isPart).toBe(true);
  });

  it('isPart=true for building:part=porch', () => {
    const features = makeFeatures();
    classifyBuilding(
      '3',
      { 'building:part': 'porch' },
      squarePolygon,
      features
    );
    expect(features.buildings[0]?.isPart).toBe(true);
  });

  it('isPart=true for building:part=roof', () => {
    const features = makeFeatures();
    classifyBuilding('4', { 'building:part': 'roof' }, squarePolygon, features);
    expect(features.buildings[0]?.isPart).toBe(true);
  });

  it('isPart=true for building:part=balcony', () => {
    const features = makeFeatures();
    classifyBuilding(
      '5',
      { 'building:part': 'balcony' },
      squarePolygon,
      features
    );
    expect(features.buildings[0]?.isPart).toBe(true);
  });
});

import { describe, it, expect } from 'vitest';
import { buildingModule } from './index';
import type { BuildingVisual, ModuleFeatures } from './types';
import type { Polygon } from 'geojson';

const parentPolygon: Polygon = {
  type: 'Polygon',
  coordinates: [
    [
      [0, 0],
      [10, 0],
      [10, 10],
      [0, 10],
      [0, 0],
    ],
  ],
};

const childInsidePolygon: Polygon = {
  type: 'Polygon',
  coordinates: [
    [
      [1, 1],
      [5, 1],
      [5, 5],
      [1, 5],
      [1, 1],
    ],
  ],
};

const childOutsidePolygon: Polygon = {
  type: 'Polygon',
  coordinates: [
    [
      [20, 20],
      [25, 20],
      [25, 25],
      [20, 25],
      [20, 20],
    ],
  ],
};

function makeBuilding(overrides: Partial<BuildingVisual>): BuildingVisual {
  return {
    id: 'b-1',
    geometry: parentPolygon,
    type: 'house',
    color: '#ccc',
    ...overrides,
  };
}

describe('nestBuildingParts (via postProcess)', () => {
  it('nests a part under its spatially containing parent', () => {
    const parent = makeBuilding({ id: 'parent' });
    const child = makeBuilding({
      id: 'child',
      geometry: childInsidePolygon,
      isPart: true,
    });
    const features: ModuleFeatures = { buildings: [parent, child] };

    buildingModule.postProcess!(features as never);

    expect(parent.hasParts).toBe(true);
    expect(parent.children).toHaveLength(1);
    expect(parent.children![0]).toBe(child);
    expect(child.parentId).toBe('parent');
  });

  it('does not nest orphan parts', () => {
    const parent = makeBuilding({ id: 'parent' });
    const orphan = makeBuilding({
      id: 'orphan',
      geometry: childOutsidePolygon,
      isPart: true,
    });
    const features: ModuleFeatures = { buildings: [parent, orphan] };

    buildingModule.postProcess!(features as never);

    expect(parent.hasParts).toBeUndefined();
    expect(parent.children).toBeUndefined();
    expect(orphan.parentId).toBeUndefined();
  });

  it('nests multiple parts under the same parent', () => {
    const parent = makeBuilding({ id: 'parent' });
    const child1 = makeBuilding({
      id: 'child-1',
      geometry: childInsidePolygon,
      isPart: true,
    });
    const child2Poly: Polygon = {
      type: 'Polygon',
      coordinates: [
        [
          [6, 6],
          [9, 6],
          [9, 9],
          [6, 9],
          [6, 6],
        ],
      ],
    };
    const child2 = makeBuilding({
      id: 'child-2',
      geometry: child2Poly,
      isPart: true,
    });
    const features: ModuleFeatures = { buildings: [parent, child1, child2] };

    buildingModule.postProcess!(features as never);

    expect(parent.children).toHaveLength(2);
    expect(child1.parentId).toBe('parent');
    expect(child2.parentId).toBe('parent');
  });
});

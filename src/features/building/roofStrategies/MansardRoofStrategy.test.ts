import { describe, it, expect } from 'vitest';
import { MansardRoofStrategy } from './MansardRoofStrategy';

// 20×10 rectangle centred at origin (CCW)
const rect: [number, number][] = [
  [-10, -5],
  [10, -5],
  [10, 5],
  [-10, 5],
];

// Narrow building: 1×10, halfWidth=0.5 — break inset is small but valid
const narrow: [number, number][] = [
  [-0.5, -5],
  [0.5, -5],
  [0.5, 5],
  [-0.5, 5],
];

// Square 8×8
const square: [number, number][] = [
  [-4, -4],
  [4, -4],
  [4, 4],
  [-4, 4],
];

// L-shaped footprint
const lShape: [number, number][] = [
  [0, 0],
  [10, 0],
  [10, 5],
  [5, 5],
  [5, 10],
  [0, 10],
];

const strategy = new MansardRoofStrategy();

const baseParams = {
  outerRing: rect,
  roofShape: 'mansard' as const,
  roofHeight: 5,
  ridgeAngle: 0,
};

const BREAK_HEIGHT_FRACTION = 0.6;
const breakH = baseParams.roofHeight * BREAK_HEIGHT_FRACTION; // 3.0

// --------------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------------

function getYValues(geom: ReturnType<typeof strategy.create>): number[] {
  const pos = geom.attributes.position!;
  const ys: number[] = [];
  for (let i = 0; i < pos.count; i++) ys.push(pos.getY(i));
  return ys;
}

function hasYNear(ys: number[], target: number, tol = 0.15): boolean {
  return ys.some((y) => Math.abs(y - target) < tol);
}

// --------------------------------------------------------------------------
// Geometry validity
// --------------------------------------------------------------------------

describe('MansardRoofStrategy', () => {
  it('creates non-indexed geometry with position attribute', () => {
    const geom = strategy.create(baseParams);
    expect(geom).toBeDefined();
    expect(geom.attributes.position).toBeDefined();
    expect(geom.index).toBeNull();
  });

  it('has vertices (non-empty)', () => {
    const geom = strategy.create(baseParams);
    expect(geom.attributes.position!.count).toBeGreaterThan(0);
  });

  it('all vertex Y values are in [0, roofHeight]', () => {
    const geom = strategy.create(baseParams);
    const ys = getYValues(geom);
    for (const y of ys) {
      expect(y).toBeGreaterThanOrEqual(-1e-6);
      expect(y).toBeLessThanOrEqual(baseParams.roofHeight + 1e-6);
    }
  });

  it('has vertices at Y=0 (eave level)', () => {
    const ys = getYValues(strategy.create(baseParams));
    expect(hasYNear(ys, 0, 1e-5)).toBe(true);
  });

  it('has vertices near Y=breakH (break line level)', () => {
    const ys = getYValues(strategy.create(baseParams));
    expect(hasYNear(ys, breakH, 0.2)).toBe(true);
  });

  it('has vertices near Y=roofHeight (plateau/ridge level)', () => {
    const ys = getYValues(strategy.create(baseParams));
    expect(hasYNear(ys, baseParams.roofHeight, 0.1)).toBe(true);
  });

  it('has three distinct height bands: 0, breakH, roofHeight', () => {
    const ys = getYValues(strategy.create(baseParams));
    expect(hasYNear(ys, 0, 1e-5)).toBe(true);
    expect(hasYNear(ys, breakH, 0.2)).toBe(true);
    expect(hasYNear(ys, baseParams.roofHeight, 0.1)).toBe(true);
  });

  // --------------------------------------------------------------------------
  // Normal direction
  // --------------------------------------------------------------------------

  it('slope normals have non-negative Y component', () => {
    const geom = strategy.create(baseParams);
    geom.computeVertexNormals();
    const normals = geom.attributes.normal!;
    for (let i = 0; i < normals.count; i++) {
      expect(normals.getY(i)).toBeGreaterThanOrEqual(-0.01);
    }
  });

  // --------------------------------------------------------------------------
  // Footprint variations
  // --------------------------------------------------------------------------

  it('square footprint produces valid geometry', () => {
    const geom = strategy.create({ ...baseParams, outerRing: square });
    expect(geom.attributes.position!.count).toBeGreaterThan(0);
    const ys = getYValues(geom);
    for (const y of ys) {
      expect(y).toBeGreaterThanOrEqual(-1e-6);
      expect(y).toBeLessThanOrEqual(baseParams.roofHeight + 1e-6);
    }
  });

  it('L-shaped footprint produces valid geometry', () => {
    const geom = strategy.create({ ...baseParams, outerRing: lShape });
    expect(geom.attributes.position!.count).toBeGreaterThan(0);
    const ys = getYValues(geom);
    for (const y of ys) {
      expect(y).toBeGreaterThanOrEqual(-1e-6);
      expect(y).toBeLessThanOrEqual(baseParams.roofHeight + 1e-6);
    }
  });

  it('narrow building produces valid geometry', () => {
    const geom = strategy.create({ ...baseParams, outerRing: narrow });
    expect(geom.attributes.position!.count).toBeGreaterThan(0);
    const ys = getYValues(geom);
    for (const y of ys) {
      expect(y).toBeGreaterThanOrEqual(-1e-6);
      expect(y).toBeLessThanOrEqual(baseParams.roofHeight + 1e-6);
    }
  });

  // --------------------------------------------------------------------------
  // Edge cases
  // --------------------------------------------------------------------------

  it('degenerate polygon (< 3 vertices) returns empty geometry', () => {
    const geom = strategy.create({
      ...baseParams,
      outerRing: [
        [0, 0],
        [1, 0],
      ] as [number, number][],
    });
    expect(geom.attributes.position).toBeUndefined();
  });

  it('roofHeight=0: all vertices at Y=0', () => {
    const geom = strategy.create({ ...baseParams, roofHeight: 0 });
    const ys = getYValues(geom);
    for (const y of ys) {
      expect(y).toBeCloseTo(0, 5);
    }
  });

  it('closed ring and open ring produce same vertex count', () => {
    const rectClosed: [number, number][] = [...rect, rect[0]!];
    const geomOpen = strategy.create(baseParams);
    const geomClosed = strategy.create({
      ...baseParams,
      outerRing: rectClosed,
    });
    expect(geomOpen.attributes.position!.count).toBe(
      geomClosed.attributes.position!.count
    );
  });
});

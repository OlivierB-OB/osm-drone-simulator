import { describe, it, expect } from 'vitest';
import { ShapeUtils, Vector2 } from 'three';
import { HalfHippedRoofStrategy } from './HalfHippedRoofStrategy';

// 20×10 rectangle (elongated, centred at origin, CCW)
const rect: [number, number][] = [
  [-10, -5],
  [10, -5],
  [10, 5],
  [-10, 5],
];

// Hexagon with vertices on the ridge centreline
const hexRing: [number, number][] = [
  [-10, -5],
  [10, -5],
  [10, 0], // ridge vertex
  [10, 5],
  [-10, 5],
  [-10, 0], // ridge vertex
];

function expectedFloatCount(ring: [number, number][]): number {
  const contour = ring.map(([x, y]) => new Vector2(x, y));
  const topTriCount = ShapeUtils.triangulateShape(contour, []).length;
  const sideTriCount = ring.length * 2;
  return (topTriCount + sideTriCount) * 3 * 3;
}

const strategy = new HalfHippedRoofStrategy();
const baseParams = {
  outerRing: rect,
  roofShape: 'half-hipped',
  roofHeight: 5,
  ridgeAngle: 0,
};

describe('HalfHippedRoofStrategy', () => {
  it('creates geometry without error', () => {
    const geom = strategy.create(baseParams);
    expect(geom).toBeDefined();
    expect(geom.attributes.position).toBeDefined();
  });

  it('produces correct vertex count for outline-based geometry', () => {
    const geom = strategy.create(baseParams);
    expect(geom.attributes.position!.array.length).toBe(
      expectedFloatCount(rect)
    );
  });

  it('base is at Y=0', () => {
    const geom = strategy.create(baseParams);
    const pos = geom.attributes.position!;
    let minY = Infinity;
    for (let i = 0; i < pos.count; i++) minY = Math.min(minY, pos.getY(i));
    expect(minY).toBeCloseTo(0, 5);
  });

  it('ridge region has heights above zero', () => {
    // HalfHipped hips the gable ends, so boundary vertices can't reach full roofHeight
    const geom = strategy.create({ ...baseParams, outerRing: hexRing });
    const pos = geom.attributes.position!;
    let maxY = -Infinity;
    for (let i = 0; i < pos.count; i++) maxY = Math.max(maxY, pos.getY(i));
    expect(maxY).toBeGreaterThan(0);
    expect(maxY).toBeLessThanOrEqual(baseParams.roofHeight + 1e-6);
  });

  it('all heights are in [0, roofHeight]', () => {
    const geom = strategy.create(baseParams);
    const pos = geom.attributes.position!;
    for (let i = 0; i < pos.count; i++) {
      expect(pos.getY(i)).toBeGreaterThanOrEqual(-1e-6);
      expect(pos.getY(i)).toBeLessThanOrEqual(baseParams.roofHeight + 1e-6);
    }
  });

  it('produces geometry for L-shaped building', () => {
    const lShape: [number, number][] = [
      [0, 0],
      [10, 0],
      [10, 5],
      [5, 5],
      [5, 10],
      [0, 10],
    ];
    const geom = strategy.create({ ...baseParams, outerRing: lShape });
    const pos = geom.attributes.position!;
    expect(pos.count).toBeGreaterThan(0);
    for (let i = 0; i < pos.count; i++) {
      expect(pos.getY(i)).toBeGreaterThanOrEqual(-1e-6);
      expect(pos.getY(i)).toBeLessThanOrEqual(baseParams.roofHeight + 1e-6);
    }
  });

  it('normals have non-negative Y component', () => {
    const geom = strategy.create(baseParams);
    const normals = geom.attributes.normal!;
    for (let i = 0; i < normals.count; i++) {
      expect(normals.getY(i)).toBeGreaterThanOrEqual(-0.01);
    }
  });
});

import { describe, it, expect } from 'vitest';
import { ShapeUtils, Vector2 } from 'three';
import { SawtoothRoofStrategy } from './SawtoothRoofStrategy';

// 20×10 rectangle (CCW)
const rect: [number, number][] = [
  [-10, -5],
  [10, -5],
  [10, 5],
  [-10, 5],
];

// Very narrow (degenerate)
const degenerate: [number, number][] = [
  [-5, -0.0001],
  [5, -0.0001],
  [5, 0.0001],
  [-5, 0.0001],
];

function expectedFloatCount(ring: [number, number][]): number {
  const contour = ring.map(([x, y]) => new Vector2(x, y));
  const topTriCount = ShapeUtils.triangulateShape(contour, []).length;
  const sideTriCount = ring.length * 2;
  return (topTriCount + sideTriCount) * 3 * 3;
}

const strategy = new SawtoothRoofStrategy();
const baseParams = {
  outerRing: rect,
  roofShape: 'sawtooth',
  roofHeight: 5,
  ridgeAngle: 0,
};

describe('SawtoothRoofStrategy', () => {
  it('creates geometry without error', () => {
    const geom = strategy.create(baseParams);
    expect(geom).toBeDefined();
    expect(geom.attributes.position).toBeDefined();
  });

  it('is non-indexed geometry', () => {
    const geom = strategy.create(baseParams);
    expect(geom.index).toBeNull();
  });

  it('produces correct vertex count for outline-based geometry', () => {
    const geom = strategy.create(baseParams);
    expect(geom.attributes.position!.array.length).toBe(
      expectedFloatCount(rect)
    );
  });

  it('all heights are in [0, roofHeight]', () => {
    const geom = strategy.create(baseParams);
    const pos = geom.attributes.position!;
    for (let i = 0; i < pos.count; i++) {
      expect(pos.getY(i)).toBeGreaterThanOrEqual(-1e-6);
      expect(pos.getY(i)).toBeLessThanOrEqual(baseParams.roofHeight + 1e-6);
    }
  });

  it('base is at Y=0', () => {
    const geom = strategy.create(baseParams);
    const pos = geom.attributes.position!;
    let minY = Infinity;
    for (let i = 0; i < pos.count; i++) minY = Math.min(minY, pos.getY(i));
    expect(minY).toBeCloseTo(0, 5);
  });

  it('degenerate (very narrow) building returns empty geometry', () => {
    const geom = strategy.create({ ...baseParams, outerRing: degenerate });
    const pos = geom.attributes.position;
    expect(pos === undefined || pos.count === 0).toBe(true);
  });

  it('different ridgeAngle produces same vertex count', () => {
    const geomA = strategy.create(baseParams);
    const geomB = strategy.create({ ...baseParams, ridgeAngle: Math.PI / 3 });
    expect(geomA.attributes.position!.count).toBe(
      geomB.attributes.position!.count
    );
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
});

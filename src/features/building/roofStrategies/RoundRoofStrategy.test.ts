import { describe, it, expect } from 'vitest';
import { ShapeUtils, Vector2 } from 'three';
import { RoundRoofStrategy } from './RoundRoofStrategy';

// 20×10 rectangle (elongated, CCW)
const rect: [number, number][] = [
  [-10, -5],
  [10, -5],
  [10, 5],
  [-10, 5],
];

// Wide rectangle (to test axis-swap path when hW > hL)
const wideRect: [number, number][] = [
  [-5, -10],
  [5, -10],
  [5, 10],
  [-5, 10],
];

// Octagon with vertices on the ridge centreline (across=0 at Y=0)
const octRing: [number, number][] = [
  [-10, -5],
  [10, -5],
  [10, 0],
  [10, 5],
  [-10, 5],
  [-10, 0],
];

function expectedFloatCount(ring: [number, number][]): number {
  const contour = ring.map(([x, y]) => new Vector2(x, y));
  const topTriCount = ShapeUtils.triangulateShape(contour, []).length;
  const sideTriCount = ring.length * 2;
  return (topTriCount + sideTriCount) * 3 * 3;
}

const strategy = new RoundRoofStrategy();
const baseParams = {
  outerRing: rect,
  roofShape: 'round',
  roofHeight: 5,
  ridgeAngle: 0,
};

describe('RoundRoofStrategy', () => {
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

  it('ridge vertex reaches roofHeight', () => {
    // Use octagon which has vertices on the ridge centreline (across=0 at Y=0)
    const geom = strategy.create({ ...baseParams, outerRing: octRing });
    const pos = geom.attributes.position!;
    let maxY = -Infinity;
    for (let i = 0; i < pos.count; i++) maxY = Math.max(maxY, pos.getY(i));
    expect(maxY).toBeCloseTo(baseParams.roofHeight, 1);
  });

  it('base is at Y=0', () => {
    const geom = strategy.create(baseParams);
    const pos = geom.attributes.position!;
    let minY = Infinity;
    for (let i = 0; i < pos.count; i++) minY = Math.min(minY, pos.getY(i));
    expect(minY).toBeCloseTo(0, 5);
  });

  it('wide rectangle (hW > hL) swaps axes and produces geometry', () => {
    const geom = strategy.create({ ...baseParams, outerRing: wideRect });
    expect(geom.attributes.position!.array.length).toBe(
      expectedFloatCount(wideRect)
    );
  });

  it('different ridgeAngle produces same vertex count', () => {
    const geomA = strategy.create(baseParams);
    const geomB = strategy.create({ ...baseParams, ridgeAngle: Math.PI / 4 });
    expect(geomA.attributes.position!.array.length).toBe(
      geomB.attributes.position!.array.length
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

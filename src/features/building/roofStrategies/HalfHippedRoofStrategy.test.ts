import { describe, it, expect } from 'vitest';
import { HalfHippedRoofStrategy } from './HalfHippedRoofStrategy';

// 20×10 rectangle (elongated, centred at origin, CCW)
const rect: [number, number][] = [
  [-10, -5],
  [10, -5],
  [10, 5],
  [-10, 5],
];

// Same rectangle but CW
const rectCW: [number, number][] = [...rect].reverse();

// Square — should delegate to Pyramidal
const square: [number, number][] = [
  [-5, -5],
  [5, -5],
  [5, 5],
  [-5, 5],
];

const strategy = new HalfHippedRoofStrategy();
const baseParams = {
  outerRing: rect,
  roofShape: 'half_hipped',
  roofHeight: 5,
  ridgeAngle: 0,
};

describe('HalfHippedRoofStrategy', () => {
  it('creates geometry without error', () => {
    const geom = strategy.create(baseParams);
    expect(geom).toBeDefined();
    expect(geom.attributes.position).toBeDefined();
    expect(geom.attributes.position!.count).toBeGreaterThan(0);
  });

  it('produces non-indexed geometry', () => {
    const geom = strategy.create(baseParams);
    expect(geom.index).toBeNull();
  });

  it('base is at Y=0', () => {
    const geom = strategy.create(baseParams);
    const pos = geom.attributes.position!;
    let minY = Infinity;
    for (let i = 0; i < pos.count; i++) minY = Math.min(minY, pos.getY(i));
    expect(minY).toBeCloseTo(0, 5);
  });

  it('ridge vertices reach roofHeight', () => {
    const geom = strategy.create(baseParams);
    const pos = geom.attributes.position!;
    let maxY = -Infinity;
    for (let i = 0; i < pos.count; i++) maxY = Math.max(maxY, pos.getY(i));
    expect(maxY).toBeCloseTo(baseParams.roofHeight, 4);
  });

  it('all heights are in [0, roofHeight]', () => {
    const geom = strategy.create(baseParams);
    const pos = geom.attributes.position!;
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

  it('CW and CCW winding both produce valid geometry', () => {
    const geomCCW = strategy.create(baseParams);
    const geomCW = strategy.create({ ...baseParams, outerRing: rectCW });
    expect(geomCCW.attributes.position!.count).toBeGreaterThan(0);
    expect(geomCW.attributes.position!.count).toBeGreaterThan(0);
  });

  it('near-square footprint delegates (produces valid geometry)', () => {
    const geom = strategy.create({ ...baseParams, outerRing: square });
    expect(geom.attributes.position!.count).toBeGreaterThan(0);
    for (let i = 0; i < geom.attributes.position!.count; i++) {
      expect(geom.attributes.position!.getY(i)).toBeGreaterThanOrEqual(-1e-6);
      expect(geom.attributes.position!.getY(i)).toBeLessThanOrEqual(
        baseParams.roofHeight + 1e-6
      );
    }
  });
});

import { describe, it, expect } from 'vitest';
import { ShapeUtils, Vector2 } from 'three';
import { GambrelRoofStrategy } from './GambrelRoofStrategy';

// 10×6 rectangle, centred at origin (CCW)
const rect: [number, number][] = [
  [-5, -3],
  [5, -3],
  [5, 3],
  [-5, 3],
];

// Closed ring variant
const rectClosed: [number, number][] = [...rect, rect[0]!];

// Hexagon with vertices on and off the ridge line
const hexRing: [number, number][] = [
  [-5, -3],
  [5, -3],
  [5, 0], // ridge vertex
  [5, 3],
  [-5, 3],
  [-5, 0], // ridge vertex
];

function expectedFloatCount(ring: [number, number][]): number {
  const contour = ring.map(([x, y]) => new Vector2(x, y));
  const topTriCount = ShapeUtils.triangulateShape(contour, []).length;
  const sideTriCount = ring.length * 2;
  return (topTriCount + sideTriCount) * 3 * 3;
}

const strategy = new GambrelRoofStrategy();
const baseParams = {
  outerRing: rect,
  roofShape: 'gambrel',
  roofHeight: 5,
  ridgeAngle: 0,
};

describe('GambrelRoofStrategy', () => {
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

  it('is non-indexed geometry', () => {
    const geom = strategy.create(baseParams);
    expect(geom.index).toBeNull();
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
    // Use hexagon which has vertices on the ridge centreline
    const geom = strategy.create({ ...baseParams, outerRing: hexRing });
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

  it('has upward-facing faces (top surface normals with positive Y)', () => {
    const geom = strategy.create(baseParams);
    const pos = geom.attributes.position!;
    let foundUpward = false;
    for (let t = 0; t < pos.count; t += 3) {
      const ax = pos.getX(t + 1) - pos.getX(t);
      const az = pos.getZ(t + 1) - pos.getZ(t);
      const bx = pos.getX(t + 2) - pos.getX(t);
      const bz = pos.getZ(t + 2) - pos.getZ(t);
      const ny = az * bx - ax * bz;
      if (ny > 0.01) {
        foundUpward = true;
        break;
      }
    }
    expect(foundUpward).toBe(true);
  });

  it('produces same geometry for closed and open ring', () => {
    const geomOpen = strategy.create(baseParams);
    const geomClosed = strategy.create({
      ...baseParams,
      outerRing: rectClosed,
    });
    expect(geomOpen.attributes.position!.array.length).toBe(
      geomClosed.attributes.position!.array.length
    );
  });

  it('different ridgeAngle produces same vertex count', () => {
    const geomA = strategy.create(baseParams);
    const geomB = strategy.create({ ...baseParams, ridgeAngle: Math.PI / 4 });
    expect(geomA.attributes.position!.array.length).toBe(
      geomB.attributes.position!.array.length
    );
  });
});

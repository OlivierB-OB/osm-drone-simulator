import { describe, it, expect } from 'vitest';
import { SaltboxRoofStrategy } from './SaltboxRoofStrategy';

// 10×6 rectangle, centred at origin (CCW)
const rect: [number, number][] = [
  [-5, -3],
  [5, -3],
  [5, 3],
  [-5, 3],
];

// CW version
const rectCW: [number, number][] = [...rect].reverse() as [number, number][];

// Closed ring
const rectClosed: [number, number][] = [...rect, rect[0]!];

const strategy = new SaltboxRoofStrategy();
const baseParams = {
  outerRing: rect,
  roofShape: 'saltbox',
  roofHeight: 5,
  ridgeAngle: 0,
};

describe('SaltboxRoofStrategy', () => {
  it('creates geometry without error', () => {
    const geom = strategy.create(baseParams);
    expect(geom).toBeDefined();
    expect(geom.attributes.position).toBeDefined();
  });

  it('is non-indexed geometry', () => {
    const geom = strategy.create(baseParams);
    expect(geom.index).toBeNull();
  });

  it('base (eave) vertices are at Y=0', () => {
    const geom = strategy.create(baseParams);
    const pos = geom.attributes.position!;
    let minY = Infinity;
    for (let i = 0; i < pos.count; i++) minY = Math.min(minY, pos.getY(i));
    expect(minY).toBeCloseTo(0, 5);
  });

  it('ridge vertices are at Y=roofHeight', () => {
    const geom = strategy.create(baseParams);
    const pos = geom.attributes.position!;
    let maxY = -Infinity;
    for (let i = 0; i < pos.count; i++) maxY = Math.max(maxY, pos.getY(i));
    expect(maxY).toBeCloseTo(baseParams.roofHeight, 1);
  });

  it('all heights are in [0, roofHeight]', () => {
    const geom = strategy.create(baseParams);
    const pos = geom.attributes.position!;
    for (let i = 0; i < pos.count; i++) {
      expect(pos.getY(i)).toBeGreaterThanOrEqual(-1e-6);
      expect(pos.getY(i)).toBeLessThanOrEqual(baseParams.roofHeight + 1e-6);
    }
  });

  it('has upward-facing faces (top surface)', () => {
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

  it('CW ring: has upward-facing face', () => {
    const geom = strategy.create({ ...baseParams, outerRing: rectCW });
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

  it('closed ring produces same vertex count as open ring', () => {
    const geomOpen = strategy.create(baseParams);
    const geomClosed = strategy.create({
      ...baseParams,
      outerRing: rectClosed,
    });
    expect(geomOpen.attributes.position!.array.length).toBe(
      geomClosed.attributes.position!.array.length
    );
  });

  it('ridge is offset from footprint centreline (saltbox asymmetry)', () => {
    // ridgeAngle=0: ridge runs along X, across-direction is +Y.
    // The offset ridge shifts toward +Y, so ridge Z coords (Three.js Z = -mercY)
    // should be at -ridgeOffset, not at 0 (the footprint centre).
    const geom = strategy.create(baseParams);
    const pos = geom.attributes.position!;

    // Collect Z coordinates of the ridge vertices (those at Y=roofHeight)
    const ridgeZs: number[] = [];
    for (let i = 0; i < pos.count; i++) {
      if (Math.abs(pos.getY(i) - baseParams.roofHeight) < 0.1) {
        ridgeZs.push(pos.getZ(i));
      }
    }
    expect(ridgeZs.length).toBeGreaterThan(0);

    // All ridge Z values must be the same (ridge is a straight line in this axis)
    const ridgeZ = ridgeZs[0]!;
    for (const z of ridgeZs) {
      expect(z).toBeCloseTo(ridgeZ, 3);
    }

    // Ridge Z should NOT be at 0 (the footprint centre) — it is offset
    expect(Math.abs(ridgeZ)).toBeGreaterThan(0.1);
  });

  it('short-side slope is steeper than long-side slope', () => {
    // ridgeAngle=0: across = +Y. Ridge shifts to +Y (mercY), so Three.js Z = -mercY (negative Z).
    // Short side: between ridge and +Y eave (positive mercY → negative Z) → narrower horizontal span.
    // Long side: between ridge and -Y eave (negative mercY → positive Z) → wider horizontal span.
    // Same vertical rise (roofHeight) over different horizontal distances → short side steeper.
    const geom = strategy.create(baseParams);
    const pos = geom.attributes.position!;

    let ridgeZ = 0;
    for (let i = 0; i < pos.count; i++) {
      if (Math.abs(pos.getY(i) - baseParams.roofHeight) < 0.1) {
        ridgeZ = pos.getZ(i);
        break;
      }
    }

    // Max eave Z (long side, positive Z = -mercY, away from ridge offset)
    let maxEaveZ = -Infinity;
    let minEaveZ = Infinity;
    for (let i = 0; i < pos.count; i++) {
      if (pos.getY(i) < 0.1) {
        maxEaveZ = Math.max(maxEaveZ, pos.getZ(i));
        minEaveZ = Math.min(minEaveZ, pos.getZ(i));
      }
    }

    const longSideSpan = Math.abs(maxEaveZ - ridgeZ);
    const shortSideSpan = Math.abs(minEaveZ - ridgeZ);
    expect(shortSideSpan).toBeLessThan(longSideSpan);
  });

  it('roofHeight=0: all vertices at Y=0', () => {
    const geom = strategy.create({ ...baseParams, roofHeight: 0 });
    const pos = geom.attributes.position!;
    for (let i = 0; i < pos.count; i++) {
      expect(pos.getY(i)).toBeCloseTo(0, 5);
    }
  });

  it('triangle footprint: does not crash and produces geometry', () => {
    const triangle: [number, number][] = [
      [0, 5],
      [-5, -5],
      [5, -5],
    ];
    const geom = strategy.create({ ...baseParams, outerRing: triangle });
    expect(geom).toBeDefined();
    expect(geom.attributes.position!.count).toBeGreaterThan(0);
  });
});

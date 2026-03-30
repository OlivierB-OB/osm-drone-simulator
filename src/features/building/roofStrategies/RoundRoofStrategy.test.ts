import { describe, it, expect } from 'vitest';
import { RoundRoofStrategy } from './RoundRoofStrategy';

// 20×10 rectangle (elongated, ridgeAngle=0 → across = Y axis, halfWidth=5)
const rect: [number, number][] = [
  [-10, -5],
  [10, -5],
  [10, 5],
  [-10, 5],
];

// Wide rectangle (halfWidth > halfLength → axes swap)
const wideRect: [number, number][] = [
  [-5, -10],
  [5, -10],
  [5, 10],
  [-5, 10],
];

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

  it('all heights are in [0, roofHeight]', () => {
    const geom = strategy.create(baseParams);
    const pos = geom.attributes.position!;
    for (let i = 0; i < pos.count; i++) {
      expect(pos.getY(i)).toBeGreaterThanOrEqual(-1e-6);
      expect(pos.getY(i)).toBeLessThanOrEqual(baseParams.roofHeight + 1e-6);
    }
  });

  it('base vertices are at Y=0', () => {
    const geom = strategy.create(baseParams);
    const pos = geom.attributes.position!;
    let minY = Infinity;
    for (let i = 0; i < pos.count; i++) minY = Math.min(minY, pos.getY(i));
    expect(minY).toBeCloseTo(0, 5);
  });

  it('enrichment adds subdivision vertices (more vertices than outline-only)', () => {
    // Outline-only 4-vertex rect would give 30 vertices; enrichment adds more
    const geom = strategy.create(baseParams);
    expect(geom.attributes.position!.count).toBeGreaterThan(30);
  });

  it('ridge centreline vertices reach roofHeight', () => {
    // ridgeAngle=0 → across = Y axis → vertices with Y≈0 are on the centreline
    // We inject a point at (0, 0) by using a ring that includes it explicitly
    const ringWithCentre: [number, number][] = [
      [-10, -5],
      [10, -5],
      [10, 0], // on centreline
      [10, 5],
      [-10, 5],
      [-10, 0], // on centreline
    ];
    const geom = strategy.create({ ...baseParams, outerRing: ringWithCentre });
    const pos = geom.attributes.position!;
    let maxY = -Infinity;
    for (let i = 0; i < pos.count; i++) maxY = Math.max(maxY, pos.getY(i));
    expect(maxY).toBeCloseTo(baseParams.roofHeight, 1);
  });

  it('intermediate vertex at t≈0.5 has height ≈ 0.866 × roofHeight (semi-ellipse)', () => {
    // t=0.5 → sqrt(1 - 0.25) = sqrt(0.75) ≈ 0.866
    // For 8 arc segments: subdivision lines at t = -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75
    // acrossValue at t=0.5 → proj = 0.5 * halfWidth = 2.5
    // The right vertical edge (x=10) has a subdivision vertex at Mercator Y=2.5 (Three.js Z=-2.5).
    // Side walls have both a base (Y=0) and roof vertex at that XZ; take the max.
    const geom = strategy.create(baseParams);
    const pos = geom.attributes.position!;
    const expected = Math.sqrt(0.75) * baseParams.roofHeight; // ≈ 4.330
    let maxYAtPoint = -Infinity;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i); // Three.js Z = -Mercator Y
      if (Math.abs(x - 10) < 0.01 && Math.abs(-z - 2.5) < 0.01) {
        maxYAtPoint = Math.max(maxYAtPoint, pos.getY(i));
      }
    }
    expect(maxYAtPoint).toBeGreaterThan(-Infinity); // vertex was found
    expect(maxYAtPoint).toBeCloseTo(expected, 1);
  });

  it('wide rectangle (halfWidth > halfLength) swaps axes and produces valid heights', () => {
    const geom = strategy.create({ ...baseParams, outerRing: wideRect });
    const pos = geom.attributes.position!;
    expect(pos.count).toBeGreaterThan(30);
    for (let i = 0; i < pos.count; i++) {
      expect(pos.getY(i)).toBeGreaterThanOrEqual(-1e-6);
      expect(pos.getY(i)).toBeLessThanOrEqual(baseParams.roofHeight + 1e-6);
    }
  });

  it('non-zero ridgeAngle produces heights in valid range', () => {
    const geom = strategy.create({ ...baseParams, ridgeAngle: Math.PI / 4 });
    const pos = geom.attributes.position!;
    for (let i = 0; i < pos.count; i++) {
      expect(pos.getY(i)).toBeGreaterThanOrEqual(-1e-6);
      expect(pos.getY(i)).toBeLessThanOrEqual(baseParams.roofHeight + 1e-6);
    }
  });

  it('L-shaped building produces valid geometry', () => {
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

  it('courtyard (inner ring) is enriched and preserved in geometry', () => {
    const outer: [number, number][] = [
      [-15, -8],
      [15, -8],
      [15, 8],
      [-15, 8],
    ];
    const inner: [number, number][] = [
      [-5, -3],
      [5, -3],
      [5, 3],
      [-5, 3],
    ];
    const geom = strategy.create({
      ...baseParams,
      outerRing: outer,
      innerRings: [inner],
    });
    const pos = geom.attributes.position!;
    // Should have more vertices than the outer-only enriched ring (inner ring adds walls)
    const outerOnly = strategy.create({ ...baseParams, outerRing: outer });
    expect(pos.count).toBeGreaterThan(outerOnly.attributes.position!.count);
    for (let i = 0; i < pos.count; i++) {
      expect(pos.getY(i)).toBeGreaterThanOrEqual(-1e-6);
      expect(pos.getY(i)).toBeLessThanOrEqual(baseParams.roofHeight + 1e-6);
    }
  });

  it('very small building produces geometry without error', () => {
    const tiny: [number, number][] = [
      [-0.5, -0.25],
      [0.5, -0.25],
      [0.5, 0.25],
      [-0.5, 0.25],
    ];
    const geom = strategy.create({ ...baseParams, outerRing: tiny });
    expect(geom.attributes.position!.count).toBeGreaterThan(0);
  });

  it('near-zero roofHeight produces all heights near zero', () => {
    const geom = strategy.create({ ...baseParams, roofHeight: 0.001 });
    const pos = geom.attributes.position!;
    for (let i = 0; i < pos.count; i++) {
      expect(pos.getY(i)).toBeLessThanOrEqual(0.002);
    }
  });
});

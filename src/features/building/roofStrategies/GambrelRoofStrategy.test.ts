import { describe, it, expect } from 'vitest';
import { GambrelRoofStrategy } from './GambrelRoofStrategy';

// 10×6 rectangle centred at origin (CCW)
const rect: [number, number][] = [
  [-5, -3],
  [5, -3],
  [5, 3],
  [-5, 3],
];

const rectClosed: [number, number][] = [...rect, rect[0]!];

// Square 6×6
const square: [number, number][] = [
  [-3, -3],
  [3, -3],
  [3, 3],
  [-3, 3],
];

const strategy = new GambrelRoofStrategy();

const baseParams = {
  outerRing: rect,
  roofShape: 'gambrel' as const,
  roofHeight: 5,
  ridgeAngle: 0,
};

const BREAK_HEIGHT_FRACTION = 0.55;
const breakH = baseParams.roofHeight * BREAK_HEIGHT_FRACTION; // 2.75

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

function hasFaceWithNormalY(
  geom: ReturnType<typeof strategy.create>,
  predicate: (ny: number) => boolean
): boolean {
  const pos = geom.attributes.position!;
  for (let t = 0; t < pos.count; t += 3) {
    const ax = pos.getX(t + 1) - pos.getX(t);
    const _ay = pos.getY(t + 1) - pos.getY(t);
    const az = pos.getZ(t + 1) - pos.getZ(t);
    const bx = pos.getX(t + 2) - pos.getX(t);
    const _by = pos.getY(t + 2) - pos.getY(t);
    const bz = pos.getZ(t + 2) - pos.getZ(t);
    const ny = az * bx - ax * bz;
    // Also compute nx, nz for gable detection if needed
    if (predicate(ny)) return true;
  }
  return false;
}

// --------------------------------------------------------------------------
// Geometry validity
// --------------------------------------------------------------------------

describe('GambrelRoofStrategy', () => {
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

  it('has vertices at Y=0 (eave)', () => {
    const ys = getYValues(strategy.create(baseParams));
    expect(hasYNear(ys, 0, 1e-5)).toBe(true);
  });

  it('has vertices at Y≈roofHeight (ridge)', () => {
    const ys = getYValues(strategy.create(baseParams));
    expect(hasYNear(ys, baseParams.roofHeight, 0.1)).toBe(true);
  });

  // --------------------------------------------------------------------------
  // Gambrel-specific shape
  // --------------------------------------------------------------------------

  it('has vertices at break height (Y ≈ breakH)', () => {
    const ys = getYValues(strategy.create(baseParams));
    expect(hasYNear(ys, breakH, 0.15)).toBe(true);
  });

  it('has three distinct height bands: 0, breakH, roofHeight', () => {
    const ys = getYValues(strategy.create(baseParams));
    expect(hasYNear(ys, 0, 1e-5)).toBe(true);
    expect(hasYNear(ys, breakH, 0.15)).toBe(true);
    expect(hasYNear(ys, baseParams.roofHeight, 0.1)).toBe(true);
  });

  it('has upward-facing slope faces (face normal Y > 0)', () => {
    const geom = strategy.create(baseParams);
    expect(hasFaceWithNormalY(geom, (ny) => ny > 0.01)).toBe(true);
  });

  it('has gable-end faces with normals pointing along the ridge direction', () => {
    // ridgeAngle=0: ridge along X → gable faces have |nx| dominant
    const geom = strategy.create(baseParams);
    const pos = geom.attributes.position!;
    let found = false;
    for (let t = 0; t < pos.count; t += 3) {
      const ax = pos.getX(t + 1) - pos.getX(t),
        ay = pos.getY(t + 1) - pos.getY(t),
        az = pos.getZ(t + 1) - pos.getZ(t);
      const bx = pos.getX(t + 2) - pos.getX(t),
        by = pos.getY(t + 2) - pos.getY(t),
        bz = pos.getZ(t + 2) - pos.getZ(t);
      const nx = ay * bz - az * by;
      const ny = az * bx - ax * bz;
      const nz = ax * by - ay * bx;
      const lenSq = nx * nx + ny * ny + nz * nz;
      if (lenSq < 1e-12) continue;
      // Gable end for ridgeAngle=0: normal mostly in X direction
      if (Math.abs(nx) / Math.sqrt(lenSq) > 0.6) {
        found = true;
        break;
      }
    }
    expect(found).toBe(true);
  });

  // --------------------------------------------------------------------------
  // Ridge direction
  // --------------------------------------------------------------------------

  it('ridgeAngle=0: ridge vertices (Y=roofHeight) all have Z≈0 (ridge along X)', () => {
    const geom = strategy.create(baseParams);
    const pos = geom.attributes.position!;
    let found = false;
    for (let i = 0; i < pos.count; i++) {
      if (Math.abs(pos.getY(i) - baseParams.roofHeight) < 0.1) {
        expect(Math.abs(pos.getZ(i))).toBeLessThan(0.1);
        found = true;
      }
    }
    expect(found).toBe(true);
  });

  it('ridgeAngle=π/2: ridge vertices (Y=roofHeight) all have X≈0 (ridge along local Y)', () => {
    const geom = strategy.create({ ...baseParams, ridgeAngle: Math.PI / 2 });
    const pos = geom.attributes.position!;
    let found = false;
    for (let i = 0; i < pos.count; i++) {
      if (Math.abs(pos.getY(i) - baseParams.roofHeight) < 0.1) {
        expect(Math.abs(pos.getX(i))).toBeLessThan(0.1);
        found = true;
      }
    }
    expect(found).toBe(true);
  });

  // --------------------------------------------------------------------------
  // Footprint variations
  // --------------------------------------------------------------------------

  it('square footprint produces valid gambrel geometry', () => {
    const geom = strategy.create({ ...baseParams, outerRing: square });
    expect(geom.attributes.position!.count).toBeGreaterThan(0);
    const ys = getYValues(geom);
    for (const y of ys) {
      expect(y).toBeGreaterThanOrEqual(-1e-6);
      expect(y).toBeLessThanOrEqual(baseParams.roofHeight + 1e-6);
    }
  });

  it('closed ring and open ring produce identical vertex count', () => {
    const geomOpen = strategy.create(baseParams);
    const geomClosed = strategy.create({
      ...baseParams,
      outerRing: rectClosed,
    });
    expect(geomOpen.attributes.position!.count).toBe(
      geomClosed.attributes.position!.count
    );
  });

  // --------------------------------------------------------------------------
  // Edge cases
  // --------------------------------------------------------------------------

  it('roofHeight=0: all vertices at Y=0', () => {
    const geom = strategy.create({ ...baseParams, roofHeight: 0 });
    const ys = getYValues(geom);
    for (const y of ys) {
      expect(y).toBeCloseTo(0, 5);
    }
  });

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
});

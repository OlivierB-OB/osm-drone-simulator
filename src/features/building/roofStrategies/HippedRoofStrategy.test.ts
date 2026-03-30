import { describe, it, expect } from 'vitest';
import { HippedRoofStrategy } from './HippedRoofStrategy';

// Helper: rectangle ring CCW in Mercator XY (width w along X, depth d along Y)
function rectRing(w: number, d: number): [number, number][] {
  const hw = w / 2;
  const hd = d / 2;
  return [
    [-hw, -hd],
    [hw, -hd],
    [hw, hd],
    [-hw, hd],
  ];
}

// Helper: same rectangle but CW
function rectRingCW(w: number, d: number): [number, number][] {
  const hw = w / 2;
  const hd = d / 2;
  return [
    [-hw, hd],
    [hw, hd],
    [hw, -hd],
    [-hw, -hd],
  ];
}

// Helper: closed ring (last == first)
function closedRectRing(w: number, d: number): [number, number][] {
  const ring = rectRing(w, d);
  return [...ring, ring[0]!];
}

// L-shaped ring (CCW), elongated so OBB is not square
function lShapeRing(): [number, number][] {
  return [
    [0, 0],
    [20, 0],
    [20, 3],
    [10, 3],
    [10, 6],
    [0, 6],
  ];
}

const strategy = new HippedRoofStrategy();

describe('HippedRoofStrategy', () => {
  describe('rectangle', () => {
    it('produces non-empty non-indexed geometry', () => {
      const geom = strategy.create({
        outerRing: rectRing(10, 6),
        roofShape: 'hipped',
        roofHeight: 3,
        ridgeAngle: 0,
      });
      expect(geom.getAttribute('position')).toBeDefined();
      expect(geom.getAttribute('position').array.length).toBeGreaterThan(0);
      expect(geom.index).toBeNull();
    });

    it('all heights are in range [0, roofHeight]', () => {
      const roofHeight = 5;
      const geom = strategy.create({
        outerRing: rectRing(10, 6),
        roofShape: 'hipped',
        roofHeight,
        ridgeAngle: Math.PI / 4,
      });
      const arr = geom.getAttribute('position').array as Float32Array;
      for (let i = 1; i < arr.length; i += 3) {
        expect(arr[i]!).toBeGreaterThanOrEqual(-1e-6);
        expect(arr[i]!).toBeLessThanOrEqual(roofHeight + 1e-6);
      }
    });

    it('max Y equals roofHeight (ridge reaches peak)', () => {
      const roofHeight = 4;
      const geom = strategy.create({
        outerRing: rectRing(10, 4),
        roofShape: 'hipped',
        roofHeight,
        ridgeAngle: 0,
      });
      const arr = geom.getAttribute('position').array as Float32Array;
      let maxY = -Infinity;
      for (let i = 1; i < arr.length; i += 3) {
        if (arr[i]! > maxY) maxY = arr[i]!;
      }
      expect(maxY).toBeCloseTo(roofHeight, 3);
    });

    it('eave vertices have height 0', () => {
      const geom = strategy.create({
        outerRing: rectRing(10, 6),
        roofShape: 'hipped',
        roofHeight: 4,
        ridgeAngle: 0,
      });
      const arr = geom.getAttribute('position').array as Float32Array;
      let foundZero = false;
      for (let i = 1; i < arr.length; i += 3) {
        if (Math.abs(arr[i]!) < 1e-6) {
          foundZero = true;
          break;
        }
      }
      expect(foundZero).toBe(true);
    });
  });

  describe('closed ring', () => {
    it('produces same vertex count as open ring', () => {
      const params = {
        roofShape: 'hipped',
        roofHeight: 3,
        ridgeAngle: 0,
      } as const;
      const geomOpen = strategy.create({
        outerRing: rectRing(10, 6),
        ...params,
      });
      const geomClosed = strategy.create({
        outerRing: closedRectRing(10, 6),
        ...params,
      });
      expect(geomOpen.getAttribute('position').array.length).toBe(
        geomClosed.getAttribute('position').array.length
      );
    });
  });

  describe('CW winding', () => {
    it('produces same vertex count as CCW ring', () => {
      const params = {
        roofShape: 'hipped',
        roofHeight: 3,
        ridgeAngle: 0,
      } as const;
      const geomCCW = strategy.create({
        outerRing: rectRing(10, 6),
        ...params,
      });
      const geomCW = strategy.create({
        outerRing: rectRingCW(10, 6),
        ...params,
      });
      expect(geomCW.getAttribute('position').array.length).toBe(
        geomCCW.getAttribute('position').array.length
      );
    });
  });

  describe('square footprint → pyramidal delegation', () => {
    it('returns non-empty geometry (delegates to PyramidalRoofStrategy)', () => {
      const geom = strategy.create({
        outerRing: rectRing(6, 6),
        roofShape: 'hipped',
        roofHeight: 3,
        ridgeAngle: 0,
      });
      const pos = geom.getAttribute('position');
      expect(pos).toBeDefined();
      expect(pos.array.length).toBeGreaterThan(0);
    });
  });

  describe('L-shaped footprint', () => {
    it('produces non-empty geometry', () => {
      const geom = strategy.create({
        outerRing: lShapeRing(),
        roofShape: 'hipped',
        roofHeight: 4,
        ridgeAngle: 0,
      });
      const pos = geom.getAttribute('position');
      expect(pos).toBeDefined();
      expect(pos.array.length).toBeGreaterThan(0);
    });

    it('all heights are in [0, roofHeight] for L-shape', () => {
      const roofHeight = 4;
      const geom = strategy.create({
        outerRing: lShapeRing(),
        roofShape: 'hipped',
        roofHeight,
        ridgeAngle: 0,
      });
      const arr = geom.getAttribute('position').array as Float32Array;
      for (let i = 1; i < arr.length; i += 3) {
        expect(arr[i]!).toBeGreaterThanOrEqual(-1e-6);
        expect(arr[i]!).toBeLessThanOrEqual(roofHeight + 1e-6);
      }
    });
  });

  describe('edge cases', () => {
    it('roofHeight = 0 produces valid flat geometry', () => {
      const geom = strategy.create({
        outerRing: rectRing(10, 6),
        roofShape: 'hipped',
        roofHeight: 0,
        ridgeAngle: 0,
      });
      const arr = geom.getAttribute('position').array as Float32Array;
      for (let i = 1; i < arr.length; i += 3) {
        expect(arr[i]).toBeCloseTo(0);
      }
    });

    it('degenerate polygon with fewer than 3 vertices returns empty geometry', () => {
      const geom = strategy.create({
        outerRing: [
          [0, 0],
          [5, 0],
        ],
        roofShape: 'hipped',
        roofHeight: 3,
        ridgeAngle: 0,
      });
      expect(geom.getAttribute('position')).toBeUndefined();
    });
  });
});

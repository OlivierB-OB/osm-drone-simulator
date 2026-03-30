import { describe, it, expect } from 'vitest';
import { GabledRoofStrategy } from './GabledRoofStrategy';

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

function lShapeRing(): [number, number][] {
  return [
    [0, 0],
    [10, 0],
    [10, 5],
    [5, 5],
    [5, 10],
    [0, 10],
  ];
}

const strategy = new GabledRoofStrategy();

describe('GabledRoofStrategy', () => {
  describe('rectangle, ridgeAngle = 0', () => {
    const ring = rectRing(20, 10);
    const params = {
      outerRing: ring,
      roofShape: 'gabled' as const,
      roofHeight: 4,
      ridgeAngle: 0,
    };

    it('produces non-zero vertex count', () => {
      const geom = strategy.create(params);
      const pos = geom.getAttribute('position');
      expect(pos).toBeDefined();
      expect(pos.count).toBeGreaterThan(0);
    });

    it('all vertex Y values are in [0, roofHeight]', () => {
      const geom = strategy.create(params);
      const arr = geom.getAttribute('position').array as Float32Array;
      for (let i = 1; i < arr.length; i += 3) {
        expect(arr[i]!).toBeGreaterThanOrEqual(-1e-4);
        expect(arr[i]!).toBeLessThanOrEqual(params.roofHeight + 1e-4);
      }
    });

    it('at least one vertex at roofHeight (ridge vertex)', () => {
      const geom = strategy.create(params);
      const arr = geom.getAttribute('position').array as Float32Array;
      let hasRidge = false;
      for (let i = 1; i < arr.length; i += 3) {
        if (Math.abs(arr[i]! - params.roofHeight) < 0.01) hasRidge = true;
      }
      expect(hasRidge).toBe(true);
    });

    it('at least one vertex at Y=0 (eave vertex)', () => {
      const geom = strategy.create(params);
      const arr = geom.getAttribute('position').array as Float32Array;
      let hasEave = false;
      for (let i = 1; i < arr.length; i += 3) {
        if (Math.abs(arr[i]!) < 0.01) hasEave = true;
      }
      expect(hasEave).toBe(true);
    });
  });

  describe('ridge direction', () => {
    it('ridgeAngle=PI/2 — heights still in valid range', () => {
      const ring = rectRing(20, 10);
      const geom = strategy.create({
        outerRing: ring,
        roofShape: 'gabled',
        roofHeight: 5,
        ridgeAngle: Math.PI / 2,
      });
      const arr = geom.getAttribute('position').array as Float32Array;
      for (let i = 1; i < arr.length; i += 3) {
        expect(arr[i]!).toBeGreaterThanOrEqual(-1e-4);
        expect(arr[i]!).toBeLessThanOrEqual(5 + 1e-4);
      }
    });

    it('ridgeAngle=PI/4 — heights still in valid range', () => {
      const ring = rectRing(20, 10);
      const geom = strategy.create({
        outerRing: ring,
        roofShape: 'gabled',
        roofHeight: 3,
        ridgeAngle: Math.PI / 4,
      });
      const arr = geom.getAttribute('position').array as Float32Array;
      for (let i = 1; i < arr.length; i += 3) {
        expect(arr[i]!).toBeGreaterThanOrEqual(-1e-4);
        expect(arr[i]!).toBeLessThanOrEqual(3 + 1e-4);
      }
    });
  });

  describe('winding', () => {
    it('CW ring produces same vertex count as CCW', () => {
      const ccw = rectRing(20, 10);
      const cw = rectRingCW(20, 10);
      const base = {
        roofShape: 'gabled' as const,
        roofHeight: 4,
        ridgeAngle: 0,
      };
      const gCCW = strategy.create({ outerRing: ccw, ...base });
      const gCW = strategy.create({ outerRing: cw, ...base });
      expect(gCW.getAttribute('position').count).toBe(
        gCCW.getAttribute('position').count
      );
    });
  });

  describe('closed ring', () => {
    it('produces same vertex count as open ring', () => {
      const open = rectRing(20, 10);
      const closed: [number, number][] = [...open, open[0]!];
      const base = {
        roofShape: 'gabled' as const,
        roofHeight: 4,
        ridgeAngle: 0,
      };
      const gOpen = strategy.create({ outerRing: open, ...base });
      const gClosed = strategy.create({ outerRing: closed, ...base });
      expect(gClosed.getAttribute('position').count).toBe(
        gOpen.getAttribute('position').count
      );
    });
  });

  describe('edge cases', () => {
    it('roofHeight=0 — all vertices at Y=0', () => {
      const ring = rectRing(20, 10);
      const geom = strategy.create({
        outerRing: ring,
        roofShape: 'gabled',
        roofHeight: 0,
        ridgeAngle: 0,
      });
      const arr = geom.getAttribute('position').array as Float32Array;
      for (let i = 1; i < arr.length; i += 3) {
        expect(arr[i]).toBeCloseTo(0, 5);
      }
    });

    it('fewer than 3 vertices returns empty geometry', () => {
      const geom = strategy.create({
        outerRing: [
          [0, 0],
          [5, 0],
        ],
        roofShape: 'gabled',
        roofHeight: 3,
        ridgeAngle: 0,
      });
      expect(geom.getAttribute('position')).toBeUndefined();
    });

    it('degenerate thin building does not throw', () => {
      const ring: [number, number][] = [
        [0, 0],
        [10, 0],
        [10, 1e-9],
        [0, 1e-9],
      ];
      expect(() =>
        strategy.create({
          outerRing: ring,
          roofShape: 'gabled',
          roofHeight: 3,
          ridgeAngle: 0,
        })
      ).not.toThrow();
    });
  });

  describe('L-shaped footprint', () => {
    it('produces geometry without crashing', () => {
      const geom = strategy.create({
        outerRing: lShapeRing(),
        roofShape: 'gabled',
        roofHeight: 4,
        ridgeAngle: 0,
      });
      const pos = geom.getAttribute('position');
      expect(pos).toBeDefined();
      expect(pos.count).toBeGreaterThan(0);
    });

    it('L-shaped heights in valid range', () => {
      const roofHeight = 4;
      const geom = strategy.create({
        outerRing: lShapeRing(),
        roofShape: 'gabled',
        roofHeight,
        ridgeAngle: 0,
      });
      const arr = geom.getAttribute('position').array as Float32Array;
      for (let i = 1; i < arr.length; i += 3) {
        expect(arr[i]!).toBeGreaterThanOrEqual(-1e-4);
        expect(arr[i]!).toBeLessThanOrEqual(roofHeight + 1e-4);
      }
    });
  });

  describe('normals', () => {
    it('slope normals have positive Y component (face upward)', () => {
      const geom = strategy.create({
        outerRing: rectRing(20, 10),
        roofShape: 'gabled',
        roofHeight: 4,
        ridgeAngle: 0,
      });
      const normals = geom.getAttribute('normal').array as Float32Array;
      // Check first triangle (a slope face) — it should face upward
      let hasUpward = false;
      for (let i = 1; i < normals.length; i += 3) {
        if (normals[i]! > 0.1) hasUpward = true;
      }
      expect(hasUpward).toBe(true);
    });
  });
});

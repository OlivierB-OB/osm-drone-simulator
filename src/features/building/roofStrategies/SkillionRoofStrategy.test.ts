import { describe, it, expect } from 'vitest';
import { ShapeUtils, Vector2 } from 'three';
import { SkillionRoofStrategy } from './SkillionRoofStrategy';

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

function expectedFloatCount(ring: [number, number][]): number {
  const contour = ring.map(([x, y]) => new Vector2(x, y));
  const topTriCount = ShapeUtils.triangulateShape(contour, []).length;
  const sideTriCount = ring.length * 2;
  return (topTriCount + sideTriCount) * 3 * 3;
}

const strategy = new SkillionRoofStrategy();

describe('SkillionRoofStrategy', () => {
  describe('rectangle, ridgeAngle=0', () => {
    const ring = rectRing(10, 6);
    const params = {
      outerRing: ring,
      roofShape: 'skillion' as const,
      roofHeight: 4,
      ridgeAngle: 0,
    };

    it('produces correct vertex count', () => {
      const geom = strategy.create(params);
      expect(geom.getAttribute('position').array.length).toBe(
        expectedFloatCount(ring)
      );
    });

    it('heights range from 0 to roofHeight', () => {
      const geom = strategy.create(params);
      const arr = geom.getAttribute('position').array as Float32Array;
      let minY = Infinity;
      let maxY = -Infinity;
      for (let i = 1; i < arr.length; i += 3) {
        if (arr[i]! < minY) minY = arr[i]!;
        if (arr[i]! > maxY) maxY = arr[i]!;
      }
      expect(minY).toBeCloseTo(0, 5);
      expect(maxY).toBeCloseTo(4, 5);
    });

    it('low side is at Y=0, high side at roofHeight', () => {
      // ridgeAngle=0 → across = (0,1), proj = y-coord
      // minProj = -3, maxProj = 3. height = h * (proj - minProj) / range
      // y=-3 → height=0, y=+3 → height=4
      const geom = strategy.create(params);
      const arr = geom.getAttribute('position').array as Float32Array;
      const topFaceEnd = 2 * 3 * 3; // 2 top triangles for rectangle
      // Check top face vertices only
      for (let i = 0; i < topFaceEnd; i += 3) {
        const z = arr[i + 2]!; // Z = -mercY
        const y = arr[i + 1]!;
        const mercY = -z;
        const expectedH = (4 * (mercY + 3)) / 6;
        expect(y).toBeCloseTo(expectedH, 3);
      }
    });
  });

  describe('CW winding', () => {
    it('produces same vertex count as CCW', () => {
      const ccw = rectRing(10, 6);
      const cw = rectRingCW(10, 6);
      const params = {
        roofShape: 'skillion' as const,
        roofHeight: 3,
        ridgeAngle: 0,
      };
      const geomCCW = strategy.create({ outerRing: ccw, ...params });
      const geomCW = strategy.create({ outerRing: cw, ...params });
      expect(geomCW.getAttribute('position').array.length).toBe(
        geomCCW.getAttribute('position').array.length
      );
    });
  });

  describe('closed ring', () => {
    it('produces same vertex count as open ring', () => {
      const open = rectRing(10, 6);
      const closed = [...open, open[0]!] as [number, number][];
      const params = {
        roofShape: 'skillion' as const,
        roofHeight: 3,
        ridgeAngle: 0,
      };
      const geomOpen = strategy.create({ outerRing: open, ...params });
      const geomClosed = strategy.create({ outerRing: closed, ...params });
      expect(geomOpen.getAttribute('position').array.length).toBe(
        geomClosed.getAttribute('position').array.length
      );
    });
  });

  describe('edge cases', () => {
    it('roofHeight=0 produces all Y=0', () => {
      const ring = rectRing(10, 6);
      const geom = strategy.create({
        outerRing: ring,
        roofShape: 'skillion',
        roofHeight: 0,
        ridgeAngle: 0,
      });
      const arr = geom.getAttribute('position').array as Float32Array;
      for (let i = 1; i < arr.length; i += 3) {
        expect(arr[i]).toBeCloseTo(0);
      }
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
          roofShape: 'skillion',
          roofHeight: 3,
          ridgeAngle: 0,
        })
      ).not.toThrow();
    });

    it('square footprint spans full height range', () => {
      const ring: [number, number][] = [
        [-5, -5],
        [5, -5],
        [5, 5],
        [-5, 5],
      ];
      const geom = strategy.create({
        outerRing: ring,
        roofShape: 'skillion',
        roofHeight: 4,
        ridgeAngle: 0,
      });
      const arr = geom.getAttribute('position').array as Float32Array;
      let minY = Infinity;
      let maxY = -Infinity;
      for (let i = 1; i < arr.length; i += 3) {
        if (arr[i]! < minY) minY = arr[i]!;
        if (arr[i]! > maxY) maxY = arr[i]!;
      }
      expect(minY).toBeCloseTo(0, 5);
      expect(maxY).toBeCloseTo(4, 5);
    });
  });

  describe('direction control', () => {
    const ring = rectRing(10, 6); // x: [-5,5], y: [-3,3]

    it('ridgeAngle=PI/2 — high side at negative X (West)', () => {
      // across = (-1, 0) → proj = -mercX
      // x=-5 → proj=5 (high, height=roofHeight), x=+5 → proj=-5 (low, height=0)
      const geom = strategy.create({
        outerRing: ring,
        roofShape: 'skillion',
        roofHeight: 4,
        ridgeAngle: Math.PI / 2,
      });
      const arr = geom.getAttribute('position').array as Float32Array;
      const topFaceEnd = 2 * 3 * 3;
      for (let i = 0; i < topFaceEnd; i += 3) {
        const x = arr[i]!;
        const y = arr[i + 1]!;
        // proj = -x, minProj = -5, projRange = 10
        const expectedH = (4 * (-x - -5)) / 10;
        expect(y).toBeCloseTo(expectedH, 3);
      }
    });

    it('ridgeAngle=PI — slope is opposite to ridgeAngle=0', () => {
      // across = (0, -1) → proj = -mercY
      // y=-3 → proj=3 (high, height=roofHeight), y=+3 → proj=-3 (low, height=0)
      const geom = strategy.create({
        outerRing: ring,
        roofShape: 'skillion',
        roofHeight: 4,
        ridgeAngle: Math.PI,
      });
      const arr = geom.getAttribute('position').array as Float32Array;
      const topFaceEnd = 2 * 3 * 3;
      for (let i = 0; i < topFaceEnd; i += 3) {
        const z = arr[i + 2]!;
        const y = arr[i + 1]!;
        const mercY = -z;
        // proj = -mercY, minProj = -3, projRange = 6
        const expectedH = (4 * (-mercY - -3)) / 6;
        expect(y).toBeCloseTo(expectedH, 3);
      }
    });

    it('ridgeAngle=PI/4 — heights span [0, roofHeight]', () => {
      const geom = strategy.create({
        outerRing: ring,
        roofShape: 'skillion',
        roofHeight: 4,
        ridgeAngle: Math.PI / 4,
      });
      const arr = geom.getAttribute('position').array as Float32Array;
      let minY = Infinity;
      let maxY = -Infinity;
      for (let i = 1; i < arr.length; i += 3) {
        if (arr[i]! < minY) minY = arr[i]!;
        if (arr[i]! > maxY) maxY = arr[i]!;
      }
      expect(minY).toBeCloseTo(0, 5);
      expect(maxY).toBeCloseTo(4, 5);
    });
  });

  describe('ring variants', () => {
    it('triangle footprint (3 vertices) produces valid geometry', () => {
      const ring: [number, number][] = [
        [0, 0],
        [10, 0],
        [5, 8],
      ];
      const geom = strategy.create({
        outerRing: ring,
        roofShape: 'skillion',
        roofHeight: 3,
        ridgeAngle: 0,
      });
      const arr = geom.getAttribute('position').array as Float32Array;
      expect(arr.length).toBeGreaterThan(0);
      let minY = Infinity;
      let maxY = -Infinity;
      for (let i = 1; i < arr.length; i += 3) {
        if (arr[i]! < minY) minY = arr[i]!;
        if (arr[i]! > maxY) maxY = arr[i]!;
      }
      expect(minY).toBeCloseTo(0, 5);
      expect(maxY).toBeCloseTo(3, 5);
    });
  });

  describe('inner rings (courtyards)', () => {
    const outer = rectRing(20, 12); // x: [-10,10], y: [-6,6]
    const inner = rectRing(6, 4); // x: [-3,3], y: [-2,2]

    it('does not throw with courtyard', () => {
      expect(() =>
        strategy.create({
          outerRing: outer,
          innerRings: [inner],
          roofShape: 'skillion',
          roofHeight: 4,
          ridgeAngle: 0,
        })
      ).not.toThrow();
    });

    it('courtyard vertex count includes inner ring side walls', () => {
      const geom = strategy.create({
        outerRing: outer,
        innerRings: [inner],
        roofShape: 'skillion',
        roofHeight: 4,
        ridgeAngle: 0,
      });
      const outerContour = outer.map(([x, y]) => new Vector2(x, y));
      const innerHole = inner.map(([x, y]) => new Vector2(x, y));
      const topTriCount = ShapeUtils.triangulateShape(outerContour, [
        innerHole,
      ]).length;
      const sideTriCount = (outer.length + inner.length) * 2;
      const expected = (topTriCount + sideTriCount) * 3 * 3;
      expect(geom.getAttribute('position').array.length).toBe(expected);
    });

    it('courtyard vertices lie on the same slope plane as outer ring', () => {
      // ridgeAngle=0 → across=(0,1), proj=mercY, outer minProj=-6, projRange=12
      // All top-face vertices (outer + inner) satisfy: height = 4*(mercY+6)/12
      const geom = strategy.create({
        outerRing: outer,
        innerRings: [inner],
        roofShape: 'skillion',
        roofHeight: 4,
        ridgeAngle: 0,
      });
      const arr = geom.getAttribute('position').array as Float32Array;
      const outerContour = outer.map(([x, y]) => new Vector2(x, y));
      const innerHole = inner.map(([x, y]) => new Vector2(x, y));
      const topTriCount = ShapeUtils.triangulateShape(outerContour, [
        innerHole,
      ]).length;
      const topFaceEnd = topTriCount * 3 * 3;
      for (let i = 0; i < topFaceEnd; i += 3) {
        const z = arr[i + 2]!;
        const y = arr[i + 1]!;
        const mercY = -z;
        const expectedH = (4 * (mercY - -6)) / 12;
        expect(y).toBeCloseTo(expectedH, 3);
      }
    });
  });

  describe('normals', () => {
    it('top face has upward-facing normals (positive Y component)', () => {
      const ring = rectRing(10, 6);
      const geom = strategy.create({
        outerRing: ring,
        roofShape: 'skillion',
        roofHeight: 4,
        ridgeAngle: 0,
      });
      const normals = geom.getAttribute('normal').array as Float32Array;
      const topFaceEnd = 2 * 3 * 3;
      let hasUpward = false;
      for (let i = 1; i < topFaceEnd; i += 3) {
        if (normals[i]! > 0) hasUpward = true;
      }
      expect(hasUpward).toBe(true);
    });
  });
});

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
        const expectedH = 4 * (mercY + 3) / 6;
        expect(y).toBeCloseTo(expectedH, 3);
      }
    });
  });

  describe('CW winding', () => {
    it('produces same vertex count as CCW', () => {
      const ccw = rectRing(10, 6);
      const cw = rectRingCW(10, 6);
      const params = { roofShape: 'skillion' as const, roofHeight: 3, ridgeAngle: 0 };
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
      const params = { roofShape: 'skillion' as const, roofHeight: 3, ridgeAngle: 0 };
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
  });
});

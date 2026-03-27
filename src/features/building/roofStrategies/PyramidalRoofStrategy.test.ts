import { describe, it, expect } from 'vitest';
import { PyramidalRoofStrategy } from './PyramidalRoofStrategy';

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

const strategy = new PyramidalRoofStrategy();

describe('PyramidalRoofStrategy', () => {
  describe('rectangle', () => {
    const ring = rectRing(10, 6);
    const params = {
      outerRing: ring,
      roofShape: 'pyramidal' as const,
      roofHeight: 5,
      ridgeAngle: 0,
    };

    it('produces count*3 vertices (one triangle per edge)', () => {
      const geom = strategy.create(params);
      // 4 edges → 4 triangles → 12 vertices → 36 floats
      expect(geom.getAttribute('position').count).toBe(12);
    });

    it('apex is at (0, roofHeight, 0)', () => {
      const geom = strategy.create(params);
      const arr = geom.getAttribute('position').array as Float32Array;
      let foundApex = false;
      for (let i = 0; i < arr.length; i += 3) {
        if (
          Math.abs(arr[i]!) < 0.001 &&
          Math.abs(arr[i + 1]! - 5) < 0.001 &&
          Math.abs(arr[i + 2]!) < 0.001
        ) {
          foundApex = true;
          break;
        }
      }
      expect(foundApex).toBe(true);
    });

    it('base vertices are at Y=0', () => {
      const geom = strategy.create(params);
      const arr = geom.getAttribute('position').array as Float32Array;
      for (let i = 0; i < arr.length; i += 3) {
        const y = arr[i + 1]!;
        // Each vertex is either apex (h=5) or base (h=0)
        expect(y === 0 || Math.abs(y - 5) < 0.001).toBe(true);
      }
    });
  });

  describe('CW winding', () => {
    it('produces same vertex count as CCW', () => {
      const ccw = rectRing(10, 6);
      const cw = rectRingCW(10, 6);
      const params = { roofShape: 'pyramidal' as const, roofHeight: 3, ridgeAngle: 0 };
      const geomCCW = strategy.create({ outerRing: ccw, ...params });
      const geomCW = strategy.create({ outerRing: cw, ...params });
      expect(geomCW.getAttribute('position').count).toBe(
        geomCCW.getAttribute('position').count
      );
    });
  });

  describe('closed ring', () => {
    it('produces same vertex count as open ring', () => {
      const open = rectRing(10, 6);
      const closed = [...open, open[0]!] as [number, number][];
      const params = { roofShape: 'pyramidal' as const, roofHeight: 3, ridgeAngle: 0 };
      const geomOpen = strategy.create({ outerRing: open, ...params });
      const geomClosed = strategy.create({ outerRing: closed, ...params });
      expect(geomOpen.getAttribute('position').count).toBe(
        geomClosed.getAttribute('position').count
      );
    });
  });

  describe('pentagon', () => {
    it('produces 5 triangles', () => {
      const ring: [number, number][] = [
        [0, 5],
        [4.76, 1.55],
        [2.94, -4.05],
        [-2.94, -4.05],
        [-4.76, 1.55],
      ];
      const geom = strategy.create({
        outerRing: ring,
        roofShape: 'pyramidal',
        roofHeight: 3,
        ridgeAngle: 0,
      });
      expect(geom.getAttribute('position').count).toBe(15);
    });
  });

  describe('edge cases', () => {
    it('roofHeight=0 produces all Y=0', () => {
      const ring = rectRing(10, 6);
      const geom = strategy.create({
        outerRing: ring,
        roofShape: 'pyramidal',
        roofHeight: 0,
        ridgeAngle: 0,
      });
      const arr = geom.getAttribute('position').array as Float32Array;
      for (let i = 1; i < arr.length; i += 3) {
        expect(arr[i]).toBeCloseTo(0);
      }
    });
  });
});

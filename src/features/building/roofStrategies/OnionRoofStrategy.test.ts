import { describe, it, expect } from 'vitest';
import { OnionRoofStrategy } from './OnionRoofStrategy';

function squareRing(s: number): [number, number][] {
  return [
    [-s, -s],
    [s, -s],
    [s, s],
    [-s, s],
  ];
}

function circularRing(r: number, n: number): [number, number][] {
  return Array.from({ length: n }, (_, i) => {
    const a = (i * 2 * Math.PI) / n;
    return [Math.cos(a) * r, Math.sin(a) * r] as [number, number];
  });
}

const strategy = new OnionRoofStrategy();

describe('OnionRoofStrategy', () => {
  const roofHeight = 4;

  it('apex is at roofHeight', () => {
    const geom = strategy.create({
      outerRing: squareRing(5),
      roofShape: 'onion',
      roofHeight,
      ridgeAngle: 0,
    });
    const pos = geom.attributes.position!;
    let maxY = -Infinity;
    for (let i = 0; i < pos.count; i++) maxY = Math.max(maxY, pos.getY(i));
    expect(maxY).toBeCloseTo(roofHeight, 1);
  });

  it('base is at Y=0', () => {
    const geom = strategy.create({
      outerRing: squareRing(5),
      roofShape: 'onion',
      roofHeight,
      ridgeAngle: 0,
    });
    const pos = geom.attributes.position!;
    let minY = Infinity;
    for (let i = 0; i < pos.count; i++) minY = Math.min(minY, pos.getY(i));
    expect(minY).toBeCloseTo(0, 5);
  });

  it('has expected vertex count for 32×24 segments', () => {
    const geom = strategy.create({
      outerRing: squareRing(5),
      roofShape: 'onion',
      roofHeight,
      ridgeAngle: 0,
    });
    expect(geom.attributes.position!.count).toBeGreaterThan(800);
  });

  it('mid-height vertices extend beyond base radius (onion bulge)', () => {
    const r = 5;
    const ring = circularRing(r, 32);
    const geom = strategy.create({
      outerRing: ring,
      roofShape: 'onion',
      roofHeight,
      ridgeAngle: 0,
    });
    const pos = geom.attributes.position!;
    const midY = roofHeight * 0.4;
    const tolerance = roofHeight * 0.15;
    let maxMidDist = 0;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      if (y > midY - tolerance && y < midY + tolerance) {
        const dx = pos.getX(i);
        const dz = pos.getZ(i);
        maxMidDist = Math.max(maxMidDist, Math.sqrt(dx * dx + dz * dz));
      }
    }
    expect(maxMidDist).toBeGreaterThan(r);
  });

  it('produces no NaN in position buffer', () => {
    const geom = strategy.create({
      outerRing: squareRing(5),
      roofShape: 'onion',
      roofHeight,
      ridgeAngle: 0,
    });
    const arr = geom.attributes.position!.array;
    for (let i = 0; i < arr.length; i++) expect(isNaN(arr[i]!)).toBe(false);
  });

  it('roofHeight=0 collapses to flat disc (all Y≈0)', () => {
    const geom = strategy.create({
      outerRing: squareRing(5),
      roofShape: 'onion',
      roofHeight: 0,
      ridgeAngle: 0,
    });
    const pos = geom.attributes.position!;
    for (let i = 0; i < pos.count; i++) expect(pos.getY(i)).toBeCloseTo(0, 5);
  });

  it('inner rings ignored: output identical with or without innerRings', () => {
    const ring = squareRing(5);
    const inner: [number, number][] = [
      [1, 1],
      [-1, 1],
      [-1, -1],
      [1, -1],
    ];
    const geomWithout = strategy.create({
      outerRing: ring,
      roofShape: 'onion',
      roofHeight,
      ridgeAngle: 0,
    });
    const geomWith = strategy.create({
      outerRing: ring,
      innerRings: [inner],
      roofShape: 'onion',
      roofHeight,
      ridgeAngle: 0,
    });
    const posOut = geomWithout.attributes.position!;
    const posWith = geomWith.attributes.position!;
    expect(posOut.count).toBe(posWith.count);
    for (let i = 0; i < posOut.count; i++) {
      expect(posOut.getY(i)).toBeCloseTo(posWith.getY(i), 5);
    }
  });
});

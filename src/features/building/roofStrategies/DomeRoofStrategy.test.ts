import { describe, it, expect } from 'vitest';
import { DomeRoofStrategy } from './DomeRoofStrategy';
import { computeMinBoundingCircle } from './roofGeometryUtils';

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

function rectRing(hw: number, hh: number): [number, number][] {
  return [
    [-hw, -hh],
    [hw, -hh],
    [hw, hh],
    [-hw, hh],
  ];
}

const strategy = new DomeRoofStrategy();

describe('computeMinBoundingCircle', () => {
  it('square ring: center ≈ (0,0), radius ≈ half-diagonal', () => {
    const s = 5;
    const mbc = computeMinBoundingCircle(squareRing(s));
    expect(mbc.center[0]).toBeCloseTo(0, 3);
    expect(mbc.center[1]).toBeCloseTo(0, 3);
    expect(mbc.radius).toBeCloseTo(s * Math.sqrt(2), 2);
  });

  it('circular ring: center ≈ (0,0), radius ≈ input radius', () => {
    const r = 7;
    const mbc = computeMinBoundingCircle(circularRing(r, 32));
    expect(mbc.center[0]).toBeCloseTo(0, 1);
    expect(mbc.center[1]).toBeCloseTo(0, 1);
    expect(mbc.radius).toBeCloseTo(r, 1);
  });

  it('offset rectangle: center at rectangle center', () => {
    // rectangle from (2,3) to (8,9) → center (5,6), half-diag = sqrt(9+9)
    const pts: [number, number][] = [
      [2, 3],
      [8, 3],
      [8, 9],
      [2, 9],
    ];
    const mbc = computeMinBoundingCircle(pts);
    expect(mbc.center[0]).toBeCloseTo(5, 2);
    expect(mbc.center[1]).toBeCloseTo(6, 2);
    expect(mbc.radius).toBeCloseTo(Math.sqrt(18), 2);
  });

  it('2-point input: radius = half distance', () => {
    const mbc = computeMinBoundingCircle([
      [0, 0],
      [6, 8],
    ]);
    expect(mbc.radius).toBeCloseTo(5, 2); // half of 10
    expect(mbc.center[0]).toBeCloseTo(3, 2);
    expect(mbc.center[1]).toBeCloseTo(4, 2);
  });

  it('closed ring (first===last) is treated as open', () => {
    const open = squareRing(4);
    const closed: [number, number][] = [...open, open[0]!];
    const mbcOpen = computeMinBoundingCircle(open);
    const mbcClosed = computeMinBoundingCircle(closed);
    expect(mbcOpen.radius).toBeCloseTo(mbcClosed.radius, 3);
  });
});

describe('DomeRoofStrategy', () => {
  const roofHeight = 4;

  it('apex is at roofHeight', () => {
    const geom = strategy.create({
      outerRing: squareRing(5),
      roofShape: 'dome',
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
      roofShape: 'dome',
      roofHeight,
      ridgeAngle: 0,
    });
    const pos = geom.attributes.position!;
    let minY = Infinity;
    for (let i = 0; i < pos.count; i++) minY = Math.min(minY, pos.getY(i));
    expect(minY).toBeCloseTo(0, 5);
  });

  it('base vertices lie on MBC circle', () => {
    const ring = squareRing(5);
    const mbc = computeMinBoundingCircle(ring);
    const geom = strategy.create({
      outerRing: ring,
      roofShape: 'dome',
      roofHeight,
      ridgeAngle: 0,
    });
    const pos = geom.attributes.position!;
    for (let i = 0; i < pos.count; i++) {
      if (pos.getY(i) > 0.01) continue; // only equator vertices
      const dx = pos.getX(i) - mbc.center[0];
      const dz = pos.getZ(i) - -mbc.center[1];
      expect(Math.sqrt(dx * dx + dz * dz)).toBeCloseTo(mbc.radius, 1);
    }
  });

  it('produces no NaN in position buffer', () => {
    const geom = strategy.create({
      outerRing: squareRing(5),
      roofShape: 'dome',
      roofHeight,
      ridgeAngle: 0,
    });
    const arr = geom.attributes.position!.array;
    for (let i = 0; i < arr.length; i++) expect(isNaN(arr[i]!)).toBe(false);
  });

  it('roofHeight=0 collapses to flat disc (all Y≈0)', () => {
    const geom = strategy.create({
      outerRing: squareRing(5),
      roofShape: 'dome',
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
      roofShape: 'dome',
      roofHeight,
      ridgeAngle: 0,
    });
    const geomWith = strategy.create({
      outerRing: ring,
      innerRings: [inner],
      roofShape: 'dome',
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

  it('elongated rectangle: MBC radius = half diagonal', () => {
    // 20×4 rectangle: half-diagonal = sqrt(100+4) ≈ 10.198
    const ring = rectRing(10, 2);
    const mbc = computeMinBoundingCircle(ring);
    expect(mbc.radius).toBeCloseTo(Math.sqrt(104), 1);
    const geom = strategy.create({
      outerRing: ring,
      roofShape: 'dome',
      roofHeight,
      ridgeAngle: 0,
    });
    const pos = geom.attributes.position!;
    for (let i = 0; i < pos.count; i++) {
      if (pos.getY(i) > 0.01) continue;
      const dx = pos.getX(i) - mbc.center[0];
      const dz = pos.getZ(i) - -mbc.center[1];
      expect(Math.sqrt(dx * dx + dz * dz)).toBeCloseTo(mbc.radius, 1);
    }
  });
});

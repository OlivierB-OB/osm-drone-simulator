import {
  CylinderGeometry,
  SphereGeometry,
  ConeGeometry,
  MeshLambertMaterial,
  InstancedMesh,
  Matrix4,
  Color,
  type Object3D,
} from 'three';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point } from '@turf/helpers';
import type { Polygon } from 'geojson';
import type { ElevationSampler } from '../../util/ElevationSampler';

export const TRUNK_COLOR = '#6b4226';
export const BROADLEAF_COLORS = ['#2d6b1e', '#3a7a30', '#357a28', '#408030'];
export const NEEDLELEAF_COLORS = ['#1a5020', '#205828', '#256030', '#1a4a20'];
export const SCRUB_COLORS = ['#4a7a38', '#5a8a40', '#4a8030'];

export function hash(x: number, y: number): number {
  const a = Math.floor(x * 1000) & 0xffff;
  const b = Math.floor(y * 1000) & 0xffff;
  return ((a * 73856093) ^ (b * 19349663)) & 0x7fffffff;
}

export function seededRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export function distributePointsInPolygon(
  polygon: Polygon,
  densityPer100m2: number
): [number, number][] {
  const ring = polygon.coordinates[0];
  if (!ring || ring.length < 4) return [];

  const spacing = Math.sqrt(100 / densityPer100m2);
  return distributeGridInPolygon(polygon, spacing, spacing, true);
}

export function distributeGridInPolygon(
  polygon: Polygon,
  spacingX: number,
  spacingY: number,
  jitter: boolean = false
): [number, number][] {
  const ring = polygon.coordinates[0];
  if (!ring || ring.length < 4) return [];

  let minX = Infinity,
    maxX = -Infinity;
  let minY = Infinity,
    maxY = -Infinity;
  for (const [x, y] of ring as [number, number][]) {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }

  const maxPoints = 2000;
  const estimatedCount =
    ((maxX - minX) / spacingX) * ((maxY - minY) / spacingY);
  const effectiveSpacingX =
    estimatedCount > maxPoints
      ? spacingX * Math.sqrt(estimatedCount / maxPoints)
      : spacingX;
  const effectiveSpacingY =
    estimatedCount > maxPoints
      ? spacingY * Math.sqrt(estimatedCount / maxPoints)
      : spacingY;

  const points: [number, number][] = [];

  for (let x = minX; x <= maxX; x += effectiveSpacingX) {
    for (let y = minY; y <= maxY; y += effectiveSpacingY) {
      let px = x;
      let py = y;

      if (jitter) {
        const seed = hash(x, y);
        px += (seededRandom(seed + 2) - 0.5) * effectiveSpacingX * 0.8;
        py += (seededRandom(seed + 3) - 0.5) * effectiveSpacingY * 0.8;
      }

      if (booleanPointInPolygon(point([px, py]), polygon)) {
        points.push([px, py]);
      }
    }
  }

  return points;
}

export function createInstancedTrees(
  points: [number, number][],
  trunkHeightMin: number,
  trunkHeightMax: number,
  crownRadiusMin: number,
  crownRadiusMax: number,
  isNeedle: boolean,
  colors: string[],
  elevation: ElevationSampler
): Object3D[] {
  const count = points.length;
  if (count === 0) return [];

  const trunkGeom = new CylinderGeometry(0.15, 0.2, 1, 5);
  const canopyGeom = isNeedle
    ? new ConeGeometry(1, 1, 6)
    : new SphereGeometry(1, 6, 4);

  const trunkMat = new MeshLambertMaterial({ color: TRUNK_COLOR });
  const canopyMat = new MeshLambertMaterial({ color: colors[0]! });

  const trunkMesh = new InstancedMesh(trunkGeom, trunkMat, count);
  const canopyMesh = new InstancedMesh(canopyGeom, canopyMat, count);

  const matrix = new Matrix4();
  const color = new Color();

  for (let i = 0; i < count; i++) {
    const [x, y] = points[i]!;
    const seed = hash(x, y);
    const t = seededRandom(seed);

    const treeHeight = trunkHeightMin + t * (trunkHeightMax - trunkHeightMin);
    const crownRadius = crownRadiusMin + t * (crownRadiusMax - crownRadiusMin);
    const trunkHeight = treeHeight * 0.4;
    const trunkRadius = crownRadius * 0.15;
    const terrainY = elevation.sampleAt(x, y);

    matrix.makeScale(trunkRadius / 0.15, trunkHeight, trunkRadius / 0.15);
    matrix.setPosition(x, terrainY + trunkHeight / 2, -y);
    trunkMesh.setMatrixAt(i, matrix);

    const canopyHeight = treeHeight - trunkHeight;
    if (isNeedle) {
      matrix.makeScale(crownRadius, canopyHeight, crownRadius);
      matrix.setPosition(x, terrainY + trunkHeight + canopyHeight / 2, -y);
    } else {
      matrix.makeScale(crownRadius, crownRadius, crownRadius);
      matrix.setPosition(x, terrainY + trunkHeight + crownRadius, -y);
    }
    canopyMesh.setMatrixAt(i, matrix);

    const colorIdx = Math.floor(seededRandom(seed + 1) * colors.length);
    color.set(colors[colorIdx]!);
    canopyMesh.setColorAt(i, color);
  }

  trunkMesh.instanceMatrix.needsUpdate = true;
  canopyMesh.instanceMatrix.needsUpdate = true;
  if (canopyMesh.instanceColor) canopyMesh.instanceColor.needsUpdate = true;

  return [trunkMesh, canopyMesh];
}

export function createInstancedBushes(
  points: [number, number][],
  radiusMin: number,
  radiusMax: number,
  colors: string[],
  elevation: ElevationSampler
): Object3D[] {
  const count = points.length;
  if (count === 0) return [];

  const bushGeom = new SphereGeometry(1, 6, 4);
  const bushMat = new MeshLambertMaterial({ color: colors[0]! });
  const bushMesh = new InstancedMesh(bushGeom, bushMat, count);

  const matrix = new Matrix4();
  const color = new Color();

  for (let i = 0; i < count; i++) {
    const [x, y] = points[i]!;
    const seed = hash(x, y);
    const t = seededRandom(seed);

    const radius = radiusMin + t * (radiusMax - radiusMin);
    const terrainY = elevation.sampleAt(x, y);

    matrix.makeScale(radius, radius * 0.6, radius);
    matrix.setPosition(x, terrainY + radius * 0.6, -y);
    bushMesh.setMatrixAt(i, matrix);

    const colorIdx = Math.floor(seededRandom(seed + 1) * colors.length);
    color.set(colors[colorIdx]!);
    bushMesh.setColorAt(i, color);
  }

  bushMesh.instanceMatrix.needsUpdate = true;
  if (bushMesh.instanceColor) bushMesh.instanceColor.needsUpdate = true;

  return [bushMesh];
}

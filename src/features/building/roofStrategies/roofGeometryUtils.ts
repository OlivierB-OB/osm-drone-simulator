import type { OBB } from './types';

/**
 * Computes the oriented bounding box of a polygon ring by finding the
 * longest edge and projecting all vertices onto that axis.
 */
export function computeOBB(ring: [number, number][]): OBB {
  const count =
    ring.length > 0 &&
    ring[0]![0] === ring[ring.length - 1]![0] &&
    ring[0]![1] === ring[ring.length - 1]![1]
      ? ring.length - 1
      : ring.length;

  // Find longest edge to determine primary axis
  let longestSq = 0;
  let ax = 1;
  let ay = 0;
  for (let i = 0; i < count; i++) {
    const j = (i + 1) % count;
    const dx = ring[j]![0] - ring[i]![0];
    const dy = ring[j]![1] - ring[i]![1];
    const lenSq = dx * dx + dy * dy;
    if (lenSq > longestSq) {
      longestSq = lenSq;
      const len = Math.sqrt(lenSq);
      ax = dx / len;
      ay = dy / len;
    }
  }

  // Perpendicular axis
  const bx = -ay;
  const by = ax;

  // Project all vertices onto both axes
  let minA = Infinity,
    maxA = -Infinity;
  let minB = Infinity,
    maxB = -Infinity;
  for (let i = 0; i < count; i++) {
    const px = ring[i]![0];
    const py = ring[i]![1];
    const projA = px * ax + py * ay;
    const projB = px * bx + py * by;
    if (projA < minA) minA = projA;
    if (projA > maxA) maxA = projA;
    if (projB < minB) minB = projB;
    if (projB > maxB) maxB = projB;
  }

  const halfLength = (maxA - minA) / 2;
  const halfWidth = (maxB - minB) / 2;
  const centerA = (minA + maxA) / 2;
  const centerB = (minB + maxB) / 2;

  return {
    center: [centerA * ax + centerB * bx, centerA * ay + centerB * by],
    halfLength,
    halfWidth,
    angle: Math.atan2(ay, ax),
  };
}

/**
 * Resolves the ridge direction angle in local Mercator radians.
 *
 * Priority:
 * 1. roof:direction (compass degrees) → converted to local Mercator radians
 * 2. roof:orientation=across → OBB angle + 90°
 * 3. Default (along) → OBB angle
 */
export function resolveRidgeAngle(
  obbAngle: number,
  roofDirection?: number,
  roofOrientation?: 'along' | 'across'
): number {
  if (roofDirection !== undefined) {
    // Compass degrees (0=North, CW) → local Mercator radians (0=+X East, CCW)
    return Math.PI / 2 - (roofDirection * Math.PI) / 180;
  }
  if (roofOrientation === 'across') {
    return obbAngle + Math.PI / 2;
  }
  return obbAngle;
}

/**
 * Computes OBB corners in Three.js local space (XZ plane).
 * Returns [C0, C1, C2, C3] going around the OBB.
 */
export function getOBBCorners(
  obb: OBB,
  ridgeAngle: number
): [number, number, number][] {
  const cos = Math.cos(ridgeAngle);
  const sin = Math.sin(ridgeAngle);

  // Along-ridge direction in Mercator: (cos, sin)
  // Across-ridge direction in Mercator: (-sin, cos)
  // Map to Three.js: threeX = mercX, threeZ = -mercY
  const alongX = cos;
  const alongZ = -sin;
  const acrossX = -sin;
  const acrossZ = -cos;

  const cx = obb.center[0];
  const cz = -obb.center[1];
  const hL = obb.halfLength;
  const hW = obb.halfWidth;

  return [
    [cx + hL * alongX + hW * acrossX, 0, cz + hL * alongZ + hW * acrossZ], // C0: +along +across
    [cx + hL * alongX - hW * acrossX, 0, cz + hL * alongZ - hW * acrossZ], // C1: +along -across
    [cx - hL * alongX - hW * acrossX, 0, cz - hL * alongZ - hW * acrossZ], // C2: -along -across
    [cx - hL * alongX + hW * acrossX, 0, cz - hL * alongZ + hW * acrossZ], // C3: -along +across
  ];
}

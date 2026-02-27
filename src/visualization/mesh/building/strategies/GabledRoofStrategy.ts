import { BufferGeometry, Float32BufferAttribute } from 'three';
import type { IRoofGeometryStrategy, RoofParams } from './types';
import { computeOBB, getOBBCorners } from './roofGeometryUtils';

export class GabledRoofStrategy implements IRoofGeometryStrategy {
  create(params: RoofParams): BufferGeometry {
    const obb = computeOBB(params.outerRing);
    const corners = getOBBCorners(obb, params.ridgeAngle);
    const h = params.roofHeight;

    const cos = Math.cos(params.ridgeAngle);
    const sin = Math.sin(params.ridgeAngle);
    const cx = obb.center[0];
    const cz = -obb.center[1];
    const hL = obb.halfLength;

    // Ridge endpoints at center of across-axis, extending full length
    const r0x = cx + hL * cos;
    const r0z = cz + hL * -sin;
    const r1x = cx - hL * cos;
    const r1z = cz - hL * -sin;

    // 6 vertices: 4 base corners + 2 ridge points
    const positions = new Float32Array([
      corners[0]![0],
      0,
      corners[0]![2], // 0: C0 (+along +across)
      corners[1]![0],
      0,
      corners[1]![2], // 1: C1 (+along -across)
      corners[2]![0],
      0,
      corners[2]![2], // 2: C2 (-along -across)
      corners[3]![0],
      0,
      corners[3]![2], // 3: C3 (-along +across)
      r0x,
      h,
      r0z, // 4: R0 (+along end of ridge)
      r1x,
      h,
      r1z, // 5: R1 (-along end of ridge)
    ]);

    // Faces (CCW winding):
    const indices = [
      // Left slope (C3-C0-R0 and C3-R0-R1)
      3, 0, 4, 3, 4, 5,
      // Right slope (C1-C2-R1 and C1-R1-R0)
      1, 2, 5, 1, 5, 4,
      // Gable end +along (C0-C1-R0)
      0, 1, 4,
      // Gable end -along (C3-C2-R1) — reversed for outward normal
      2, 3, 5,
    ];

    const geom = new BufferGeometry();
    geom.setAttribute('position', new Float32BufferAttribute(positions, 3));
    geom.setIndex(indices);
    geom.computeVertexNormals();
    return geom;
  }
}

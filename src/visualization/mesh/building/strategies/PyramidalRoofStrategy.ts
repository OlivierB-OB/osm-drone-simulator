import { BufferGeometry, Float32BufferAttribute } from 'three';
import type { IRoofGeometryStrategy, RoofParams } from './types';
import { computeOBB, getOBBCorners } from './roofGeometryUtils';

export class PyramidalRoofStrategy implements IRoofGeometryStrategy {
  create(params: RoofParams): BufferGeometry {
    const obb = computeOBB(params.outerRing);
    const corners = getOBBCorners(obb, params.ridgeAngle);
    const cx = obb.center[0];
    const cz = -obb.center[1];
    const h = params.roofHeight;

    // 5 vertices: 4 base corners + 1 apex
    const positions = new Float32Array([
      // Base corners (Y=0)
      corners[0]![0],
      0,
      corners[0]![2],
      corners[1]![0],
      0,
      corners[1]![2],
      corners[2]![0],
      0,
      corners[2]![2],
      corners[3]![0],
      0,
      corners[3]![2],
      // Apex
      cx,
      h,
      cz,
    ]);

    // 4 triangular faces (CCW winding for outward normals)
    const indices = [
      0,
      1,
      4, // +along side
      1,
      2,
      4, // -across side
      2,
      3,
      4, // -along side
      3,
      0,
      4, // +across side
    ];

    const geom = new BufferGeometry();
    geom.setAttribute('position', new Float32BufferAttribute(positions, 3));
    geom.setIndex(indices);
    geom.computeVertexNormals();
    return geom;
  }
}

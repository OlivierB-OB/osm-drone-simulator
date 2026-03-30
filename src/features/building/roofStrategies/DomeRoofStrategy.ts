import { BufferGeometry, SphereGeometry } from 'three';
import type { IRoofGeometryStrategy, RoofParams } from './types';
import { computeMinBoundingCircle } from './roofGeometryUtils';

export class DomeRoofStrategy implements IRoofGeometryStrategy {
  create(params: RoofParams): BufferGeometry {
    const mbc = computeMinBoundingCircle(params.outerRing);
    const h = params.roofHeight;
    const cx = mbc.center[0];
    const cy = mbc.center[1]; // polygon Y → Three.js -Z
    const r = mbc.radius;

    // Unit upper hemisphere: pole at Y=1, equator at Y=0
    const geom = new SphereGeometry(1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);

    const pos = geom.attributes.position!;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i); // [0..1]: 1 = pole, 0 = equator
      const z = pos.getZ(i);

      const sinPhi = Math.sqrt(x * x + z * z); // horizontal radius on unit sphere
      if (sinPhi < 0.001) {
        pos.setXYZ(i, cx, h, -cy);
        continue;
      }

      const theta = Math.atan2(z, x);
      pos.setXYZ(
        i,
        cx + r * sinPhi * Math.cos(theta),
        h * y,
        -(cy + r * sinPhi * Math.sin(theta))
      );
    }
    pos.needsUpdate = true;
    // Z-negation in vertex transform is a reflection that reverses triangle winding.
    // Swap index 0↔2 in every triangle to restore outward-facing normals.
    const idx = geom.index!;
    const arr = idx.array;
    for (let i = 0; i < arr.length; i += 3) {
      const tmp = arr[i]!;
      arr[i] = arr[i + 2]!;
      arr[i + 2] = tmp;
    }
    idx.needsUpdate = true;
    geom.computeVertexNormals();
    return geom;
  }
}

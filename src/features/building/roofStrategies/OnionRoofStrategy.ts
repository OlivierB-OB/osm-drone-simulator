import { BufferGeometry, SphereGeometry } from 'three';
import type { IRoofGeometryStrategy, RoofParams } from './types';
import {
  computeMinBoundingCircle,
  polygonExtentAtAngle,
} from './roofGeometryUtils';

export class OnionRoofStrategy implements IRoofGeometryStrategy {
  create(params: RoofParams): BufferGeometry {
    const mbc = computeMinBoundingCircle(params.outerRing);
    const h = params.roofHeight;
    const cx = mbc.center[0];
    const cy = mbc.center[1]; // polygon Y → Three.js -Z

    // Unit upper hemisphere: pole at Y=1, equator at Y=0
    const geom = new SphereGeometry(1, 32, 24, 0, Math.PI * 2, 0, Math.PI / 2);

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
      const extent = polygonExtentAtAngle(params.outerRing, theta);
      const bulge = 1 + 0.35 * Math.sin(y * Math.PI);
      const taper = 1 - y * 0.2;
      const finalR = extent * taper * bulge * sinPhi;
      pos.setXYZ(
        i,
        cx + finalR * Math.cos(theta),
        y * h,
        -(cy + finalR * Math.sin(theta))
      );
    }
    pos.needsUpdate = true;
    geom.computeVertexNormals();
    return geom;
  }
}

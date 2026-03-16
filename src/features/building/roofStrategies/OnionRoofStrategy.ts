import { BufferGeometry, SphereGeometry } from 'three';
import type { IRoofGeometryStrategy, RoofParams } from './types';
import { computeOBB } from './roofGeometryUtils';

export class OnionRoofStrategy implements IRoofGeometryStrategy {
  create(params: RoofParams): BufferGeometry {
    const obb = computeOBB(params.outerRing);
    const hL = obb.halfLength;
    const hW = obb.halfWidth;
    const baseRadius = Math.min(hL, hW);

    // Start from upper hemisphere
    const geom = new SphereGeometry(1, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);

    // Modify vertices for onion profile: wider at ~30% height, narrows to point
    const pos = geom.attributes.position!;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i); // 0 at equator, 1 at pole (unit sphere)
      const t = y; // [0, 1]
      const bulge = 1 + 0.35 * Math.sin(t * Math.PI);
      const taper = 1 - t * 0.2;
      const scale = taper * bulge;
      pos.setX(i, pos.getX(i) * scale);
      pos.setZ(i, pos.getZ(i) * scale);
    }
    pos.needsUpdate = true;

    // Scale to fit footprint and height
    geom.scale(hL / baseRadius, params.roofHeight, hW / baseRadius);

    geom.rotateY(-params.ridgeAngle);
    const cx = obb.center[0];
    const cz = -obb.center[1];
    geom.translate(cx, 0, cz);
    geom.computeVertexNormals();
    return geom;
  }
}

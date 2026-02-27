import { BufferGeometry, ConeGeometry } from 'three';
import type { IRoofGeometryStrategy, RoofParams } from './types';
import { computeOBB } from './roofGeometryUtils';

export class ConeRoofStrategy implements IRoofGeometryStrategy {
  create(params: RoofParams): BufferGeometry {
    const obb = computeOBB(params.outerRing);
    const hL = obb.halfLength;
    const hW = obb.halfWidth;
    const baseRadius = Math.min(hL, hW);

    // Cone: open-ended (no base cap, wall extrusion cap covers it)
    const geom = new ConeGeometry(baseRadius, params.roofHeight, 16, 1, true);

    // ConeGeometry centers at origin; translate so base is at Y=0
    geom.translate(0, params.roofHeight / 2, 0);

    // Scale to fit elongated footprint
    geom.scale(hL / baseRadius, 1, hW / baseRadius);

    geom.rotateY(-params.ridgeAngle);
    const cx = obb.center[0];
    const cz = -obb.center[1];
    geom.translate(cx, 0, cz);
    return geom;
  }
}

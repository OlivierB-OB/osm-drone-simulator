import { BufferGeometry, SphereGeometry } from 'three';
import type { IRoofGeometryStrategy, RoofParams } from './types';
import { computeOBB } from './roofGeometryUtils';

export class DomeRoofStrategy implements IRoofGeometryStrategy {
  create(params: RoofParams): BufferGeometry {
    const obb = computeOBB(params.outerRing);
    const hL = obb.halfLength;
    const hW = obb.halfWidth;
    const baseRadius = Math.min(hL, hW);

    // Upper hemisphere: thetaStart=0 (pole), thetaLength=PI/2 (to equator)
    const geom = new SphereGeometry(
      baseRadius,
      16,
      8,
      0,
      Math.PI * 2,
      0,
      Math.PI / 2
    );

    // Scale to fit the footprint OBB and desired height
    geom.scale(
      hL / baseRadius,
      params.roofHeight / baseRadius,
      hW / baseRadius
    );

    // Rotate to match ridge direction, then translate to OBB center
    geom.rotateY(-params.ridgeAngle);
    const cx = obb.center[0];
    const cz = -obb.center[1];
    geom.translate(cx, 0, cz);

    return geom;
  }
}

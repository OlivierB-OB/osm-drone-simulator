import type { BufferGeometry } from 'three';

export interface OBB {
  center: [number, number]; // center in local Mercator coords
  halfLength: number; // half-extent along primary axis (longest edge direction)
  halfWidth: number; // half-extent perpendicular to primary axis
  angle: number; // angle of primary axis in radians from +X, CCW
}

export interface RoofParams {
  outerRing: [number, number][]; // local Mercator coords (relative to centroid)
  innerRings?: [number, number][][]; // inner rings (holes/courtyards) in same coords
  roofShape: string;
  roofHeight: number; // meters
  ridgeAngle: number; // radians in local Mercator XY plane
}

export interface IRoofGeometryStrategy {
  create(params: RoofParams): BufferGeometry;
}

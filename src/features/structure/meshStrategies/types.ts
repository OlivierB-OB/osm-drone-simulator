import type { Object3D } from 'three';

export interface StructureParams {
  radius: number;
  height: number;
  color: string;
}

export interface IStructureStrategy {
  create(params: StructureParams): Object3D;
}

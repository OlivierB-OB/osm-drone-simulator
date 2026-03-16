import { CylinderGeometry } from 'three';
import type { IStructureStrategy, StructureParams } from './types';
import { makeMesh } from './structureMeshUtils';

export class CylinderStrategy implements IStructureStrategy {
  create({ radius, height, color }: StructureParams) {
    return makeMesh(new CylinderGeometry(radius, radius, height, 8), color);
  }
}

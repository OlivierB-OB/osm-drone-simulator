import { CylinderGeometry } from 'three';
import type { IStructureStrategy, StructureParams } from './types';
import { makeMesh } from './structureMeshUtils';

export class TaperedCylinderStrategy implements IStructureStrategy {
  create({ radius, height, color }: StructureParams) {
    return makeMesh(
      new CylinderGeometry(radius * 0.6, radius, height, 8),
      color
    );
  }
}

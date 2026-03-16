import { BoxGeometry } from 'three';
import type { IStructureStrategy, StructureParams } from './types';
import { makeMesh } from './structureMeshUtils';

export class BoxStrategy implements IStructureStrategy {
  create({ radius, height, color }: StructureParams) {
    return makeMesh(new BoxGeometry(radius * 2, height, radius * 2), color);
  }
}

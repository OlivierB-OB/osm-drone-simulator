import type { Object3D } from 'three';
import type { VegetationVisual } from '../types';

export interface IVegetationStrategy {
  create(veg: VegetationVisual): Object3D[];
}

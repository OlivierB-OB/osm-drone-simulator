import { BoxGeometry, Mesh, MeshLambertMaterial, Group } from 'three';
import type { IStructureStrategy, StructureParams } from './types';

export class CraneStrategy implements IStructureStrategy {
  create({ radius, height, color }: StructureParams): Group {
    const group = new Group();
    const material = new MeshLambertMaterial({ color });

    // Vertical mast
    const mast = new Mesh(
      new BoxGeometry(radius * 2, height, radius * 2),
      material
    );
    group.add(mast);

    // Horizontal arm
    const armLength = height * 0.6;
    const arm = new Mesh(new BoxGeometry(armLength, radius, radius), material);
    arm.position.set(armLength / 2, height / 2 - radius, 0);
    group.add(arm);

    return group;
  }
}

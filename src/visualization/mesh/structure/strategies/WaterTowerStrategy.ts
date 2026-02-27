import {
  CylinderGeometry,
  SphereGeometry,
  Mesh,
  MeshLambertMaterial,
  Group,
} from 'three';
import type { IStructureStrategy, StructureParams } from './types';

export class WaterTowerStrategy implements IStructureStrategy {
  create({ radius, height, color }: StructureParams): Group {
    const group = new Group();
    const material = new MeshLambertMaterial({ color });

    // Support column (thinner cylinder, bottom 2/3)
    const columnHeight = height * 0.65;
    const column = new Mesh(
      new CylinderGeometry(radius * 0.3, radius * 0.3, columnHeight, 8),
      material
    );
    column.position.y = -height / 2 + columnHeight / 2;
    group.add(column);

    // Tank (sphere at top)
    const tank = new Mesh(new SphereGeometry(radius, 12, 8), material);
    tank.position.y = height / 2 - radius;
    group.add(tank);

    return group;
  }
}

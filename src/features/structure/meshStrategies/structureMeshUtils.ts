import { Mesh, MeshLambertMaterial } from 'three';
import type { BufferGeometry } from 'three';

export function makeMesh(geometry: BufferGeometry, color: string): Mesh {
  return new Mesh(geometry, new MeshLambertMaterial({ color }));
}

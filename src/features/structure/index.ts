import type { FeatureModule } from '../types';
import type { Object3D } from 'three';
import type { LineString, Point, Polygon } from 'geojson';
import type { ElevationSampler } from '../../visualization/mesh/util/ElevationSampler';
import { STRUCTURE_TYPES, classifyStructure } from './structureStrategy';
import { StructureMeshFactory } from './StructureMeshFactory';
import type { ModuleFeatures } from './types';

export const structureModule: FeatureModule<ModuleFeatures> = {
  classifyPriority: 55,

  moduleFeaturesFactory(): ModuleFeatures {
    return { structures: [] };
  },

  overpassFragments(bbox: string): string[] {
    return [
      `node["man_made"~"tower|chimney|mast|communications_tower|water_tower|silo|storage_tank|lighthouse|crane"](${bbox});`,
      `way["man_made"~"tower|chimney|mast|communications_tower|water_tower|silo|storage_tank|lighthouse|crane"](${bbox});`,
      `node["power"~"tower|pole"](${bbox});`,
      `node["aerialway"="pylon"](${bbox});`,
    ];
  },

  matches(tags: Record<string, string>, geometryType: string): boolean {
    const isStructure =
      (!!tags.man_made && STRUCTURE_TYPES.has(tags.man_made)) ||
      tags.power === 'tower' ||
      tags.power === 'pole' ||
      tags.aerialway === 'pylon';
    return (
      isStructure && (geometryType === 'Polygon' || geometryType === 'Point')
    );
  },

  classify(
    id: string,
    tags: Record<string, string>,
    geometry: Point | LineString | Polygon,
    features: ModuleFeatures
  ): void {
    const feature = classifyStructure(id, tags, geometry as Polygon | Point);
    if (feature) features.structures.push(feature);
  },

  createMeshes(
    features: ModuleFeatures,
    elevationSampler: ElevationSampler
  ): Object3D[] {
    const factory = new StructureMeshFactory(elevationSampler);
    return factory.create(features.structures);
  },
};

import type { FeatureModule } from '../types';
import type { StructureVisual } from '../../data/contextual/types';
import type { Object3D } from 'three';
import type { Point, Polygon } from 'geojson';
import type { ContextDataTile } from '../sharedTypes';
import type { ElevationSampler } from '../../visualization/mesh/util/ElevationSampler';
import { STRUCTURE_TYPES, classifyStructure } from './structureStrategy';
import { StructureMeshFactory } from './StructureMeshFactory';

export const structureModule: FeatureModule<StructureVisual> = {
  name: 'structure',
  featureKey: 'structures',
  classifyPriority: 55,

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

  classify(id, tags, geometry): StructureVisual | null {
    return classifyStructure(id, tags, geometry as Polygon | Point);
  },

  createMeshes(
    features: StructureVisual[],
    _allFeatures: ContextDataTile['features'],
    elevationSampler: ElevationSampler
  ): Object3D[] {
    const factory = new StructureMeshFactory(elevationSampler);
    return factory.create(features);
  },
};

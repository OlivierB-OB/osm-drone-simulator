import type { Object3D } from 'three';
import type { Point, LineString, Polygon } from 'geojson';
import type { CanvasDrawContext } from './types';
import type { ElevationSampler } from '../visualization/mesh/util/ElevationSampler';
import type { ModulesFeatures } from './registrationTypes';
import { MODULES } from './registration';

export class FeatureModuleRegistry {
  private readonly modules = MODULES;

  modulesFeaturesFactory(): ModulesFeatures {
    return this.modules.reduce(
      (res, mod) => ({ ...res, ...mod.moduleFeaturesFactory() }),
      {} as ModulesFeatures
    );
  }

  classify(
    id: string,
    tags: Record<string, string>,
    geometry: Point | LineString | Polygon,
    features: ModulesFeatures
  ): void {
    for (const mod of this.modules) {
      if (!mod.matches || !mod.classify) continue;
      if (!mod.matches(tags, geometry.type)) continue;
      mod.classify(id, tags, geometry, features);
      return; // first match wins
    }
  }

  runPostProcessing(features: ModulesFeatures): void {
    for (const mod of this.modules) {
      mod.postProcess?.(features);
    }
  }

  getQueryModules(): typeof MODULES {
    return this.modules.filter((m) => m.overpassFragments);
  }

  getCanvasModules(): typeof MODULES {
    return this.modules
      .filter((m) => m.drawCanvas && m.canvasOrder !== undefined)
      .sort((a, b) => a.canvasOrder! - b.canvasOrder!);
  }

  getMeshModules(): typeof MODULES {
    return this.modules.filter((m) => m.createMeshes);
  }

  createAllMeshes(
    features: ModulesFeatures,
    elevationSampler: ElevationSampler
  ): Object3D[] {
    const meshes: Object3D[] = [];
    for (const mod of this.getMeshModules()) {
      meshes.push(...mod.createMeshes!(features, elevationSampler));
    }
    return meshes;
  }

  drawAllCanvas(features: ModulesFeatures, draw: CanvasDrawContext): void {
    for (const mod of this.getCanvasModules()) {
      mod.drawCanvas!(features, draw);
    }
  }
}

export const featureRegistry = new FeatureModuleRegistry();

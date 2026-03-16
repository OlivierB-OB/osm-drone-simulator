import type { Object3D } from 'three';
import type { Point, LineString, Polygon } from 'geojson';
import type { FeatureModule, CanvasDrawContext } from './types';
import type { ContextDataTile } from './sharedTypes';
import type { ElevationSampler } from '../visualization/mesh/util/ElevationSampler';

export class FeatureModuleRegistry {
  private modules: FeatureModule[] = [];

  register(module: FeatureModule): void {
    this.modules.push(module);
    this.modules.sort((a, b) => a.classifyPriority - b.classifyPriority);
  }

  classify(
    id: string,
    tags: Record<string, string>,
    geometry: Point | LineString | Polygon,
    features: ContextDataTile['features']
  ): void {
    for (const mod of this.modules) {
      if (!mod.matches || !mod.classify) continue;
      if (!mod.matches(tags, geometry.type)) continue;
      const result = mod.classify(id, tags, geometry);
      if (result !== null) {
        const arr = features[mod.featureKey as keyof typeof features];
        if (Array.isArray(arr)) {
          (arr as unknown[]).push(result);
        }
      }
      return; // first match wins
    }
  }

  runPostProcessing(features: ContextDataTile['features']): void {
    for (const mod of this.modules) {
      mod.postProcess?.(features);
    }
  }

  getQueryModules(): FeatureModule[] {
    return this.modules.filter((m) => m.overpassFragments);
  }

  getCanvasModules(): FeatureModule[] {
    return this.modules
      .filter((m) => m.drawCanvas && m.canvasOrder !== undefined)
      .sort((a, b) => a.canvasOrder! - b.canvasOrder!);
  }

  getMeshModules(): FeatureModule[] {
    return this.modules.filter((m) => m.createMeshes);
  }

  createAllMeshes(
    features: ContextDataTile['features'],
    elevationSampler: ElevationSampler
  ): Object3D[] {
    const meshes: Object3D[] = [];
    for (const mod of this.getMeshModules()) {
      const featureArray = features[
        mod.featureKey as keyof typeof features
      ] as unknown[];
      meshes.push(
        ...mod.createMeshes!(featureArray, features, elevationSampler)
      );
    }
    return meshes;
  }

  drawAllCanvas(
    features: ContextDataTile['features'],
    draw: CanvasDrawContext
  ): void {
    for (const mod of this.getCanvasModules()) {
      const featureArray = features[
        mod.featureKey as keyof typeof features
      ] as unknown[];
      mod.drawCanvas!(featureArray, draw);
    }
  }
}

export const featureRegistry = new FeatureModuleRegistry();

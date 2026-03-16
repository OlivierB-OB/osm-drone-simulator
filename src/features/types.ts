import type { Object3D } from 'three';
import type { Point, LineString, Polygon } from 'geojson';
import type { MercatorBounds } from '../gis/types';
import type { ContextDataTile } from './sharedTypes';
import type { ElevationSampler } from '../visualization/mesh/util/ElevationSampler';

export interface CanvasDrawContext {
  ctx: CanvasRenderingContext2D;
  bounds: MercatorBounds;
  scaleX: number;
  scaleY: number;
}

export interface FeatureModule<T = unknown> {
  readonly name: string;
  readonly featureKey: string;
  readonly classifyPriority: number;
  readonly canvasOrder?: number;

  overpassFragments?(bbox: string): string[];

  matches?(tags: Record<string, string>, geometryType: string): boolean;
  classify?(
    id: string,
    tags: Record<string, string>,
    geometry: Point | LineString | Polygon
  ): T | null;
  postProcess?(features: ContextDataTile['features']): void;

  drawCanvas?(features: T[], draw: CanvasDrawContext): void;

  createMeshes?(
    features: T[],
    allFeatures: ContextDataTile['features'],
    elevationSampler: ElevationSampler
  ): Object3D[];
}

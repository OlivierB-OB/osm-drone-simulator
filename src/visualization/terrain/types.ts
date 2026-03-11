import type { TileKey } from './geometry/types';
import type { MercatorBounds } from '../../gis/types';

export type TileResource<T> = {
  tileKey: TileKey;
  resource: T;
  bounds: MercatorBounds;
  dispose(): void;
};

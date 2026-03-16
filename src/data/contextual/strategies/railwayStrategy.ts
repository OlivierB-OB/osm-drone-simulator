import type { ContextDataTile, RailwayVisual, HexColor } from '../types';
import { railwaySpec } from '../../../config';
import type { LineString } from 'geojson';

function getRailwaySpecForType(type: string): {
  widthMeters: number;
  dash: number[];
  color: HexColor;
} {
  return (
    railwaySpec[type.toLowerCase()] ??
    railwaySpec['default'] ?? {
      widthMeters: 3,
      dash: [3, 2],
      color: '#888878',
    }
  );
}

function getTrackCount(gauge?: string): number {
  if (!gauge) return 1;
  return 1;
}

export function classifyRailway(
  id: string,
  tags: Record<string, string>,
  geometry: LineString,
  features: ContextDataTile['features']
): void {
  const railwayType = tags.railway!.toLowerCase();
  const spec = getRailwaySpecForType(railwayType);
  const railway: RailwayVisual = {
    id,
    geometry,
    type: railwayType,
    trackCount: getTrackCount(tags.gauge),
    widthMeters: spec.widthMeters,
    dash: spec.dash,
    color: spec.color,
    bridge: tags.bridge === 'yes' ? true : undefined,
    layer: tags.layer ? parseInt(tags.layer, 10) : undefined,
  };
  features.railways.push(railway);
}

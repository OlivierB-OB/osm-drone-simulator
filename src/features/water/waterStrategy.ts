import type { WaterVisual } from './types';
import type { HexColor } from '../sharedTypes';
import { groundColors, waterwayWidthsMeters } from '../../config';
import type { LineString, Polygon } from 'geojson';

function getWaterColorAndWidth(
  waterType: string,
  isArea: boolean
): { color: HexColor; widthMeters: number } {
  if (waterType === 'wetland') {
    return { color: groundColors.water.wetland, widthMeters: 0 };
  }
  if (isArea) {
    return { color: groundColors.water.body, widthMeters: 0 };
  }
  const widthMeters =
    waterwayWidthsMeters[waterType.toLowerCase()] ??
    waterwayWidthsMeters['default'] ??
    3;
  const waterColors = groundColors.water as Record<string, string | undefined>;
  const color = waterColors[waterType.toLowerCase()] ?? groundColors.water.line;
  return { color, widthMeters };
}

export function classifyWater(
  id: string,
  tags: Record<string, string>,
  geometry: Polygon | LineString
): WaterVisual {
  const waterType: string =
    tags.waterway || tags.water || tags['natural'] || tags.landuse || 'water';

  const isArea = geometry.type === 'Polygon';
  const { color, widthMeters } = getWaterColorAndWidth(waterType, isArea);
  return {
    id,
    geometry,
    type: waterType,
    isArea,
    widthMeters,
    color,
  };
}

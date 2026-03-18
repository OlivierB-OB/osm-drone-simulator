import type { BuildingVisual } from './types';
import type { HexColor } from '../sharedTypes';
import {
  colorPalette,
  buildingMaterialColors,
  roofMaterialColors,
} from '../../config';
import type { LineString, Point, Polygon } from 'geojson';

function getColorForBuilding(
  tags: Record<string, string>,
  buildingType: string
): HexColor {
  const material = tags['building:material'];
  if (material && buildingMaterialColors[material]) {
    return buildingMaterialColors[material]!;
  }
  if (tags['building:colour']) return tags['building:colour'];
  const colors = colorPalette.buildings as Record<string, HexColor>;
  return (colors[buildingType] || colors.default) as HexColor;
}

function getRoofColor(tags: Record<string, string>): HexColor | undefined {
  const material = tags['roof:material'];
  if (material && roofMaterialColors[material]) {
    return roofMaterialColors[material]!;
  }
  if (tags['roof:colour']) return tags['roof:colour'];
  return undefined;
}

export function classifyBuilding(
  id: string,
  tags: Record<string, string>,
  geometry: Polygon | LineString | Point
): BuildingVisual {
  const height = tags.height ? parseFloat(tags.height) : undefined;
  const levels = tags['building:levels']
    ? parseInt(tags['building:levels'], 10)
    : undefined;
  const minHeight = tags.min_height ? parseFloat(tags.min_height) : undefined;
  const minLevels = tags['building:min_level']
    ? parseInt(tags['building:min_level'], 10)
    : undefined;

  const buildingType = tags['building:type'] || tags.building || 'other';

  return {
    id,
    geometry,
    type: buildingType,
    height,
    minHeight,
    levelCount: levels,
    minLevelCount: minLevels,
    color: getColorForBuilding(tags, buildingType),
    roofColor: getRoofColor(tags),
    roofShape: tags['roof:shape'],
    roofHeight: tags['roof:height']
      ? parseFloat(tags['roof:height'])
      : undefined,
    roofDirection: tags['roof:direction']
      ? parseFloat(tags['roof:direction'])
      : undefined,
    roofOrientation:
      tags['roof:orientation'] === 'across'
        ? 'across'
        : tags['roof:orientation'] === 'along'
          ? 'along'
          : undefined,
    isPart: !!tags['building:part'] && tags['building:part'] !== 'no',
  };
}

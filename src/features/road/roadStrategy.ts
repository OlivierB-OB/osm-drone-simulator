import type { RoadVisual, HexColor } from '../../data/contextual/types';
import { roadSpec, surfaceColors } from '../../config';
import type { LineString } from 'geojson';

function getRoadWidthMeters(type: string): number {
  return (
    roadSpec[type.toLowerCase()]?.widthMeters ??
    roadSpec['default']?.widthMeters ??
    7
  );
}

function getColorForRoad(roadType: string): HexColor {
  return (
    roadSpec[roadType.toLowerCase()]?.color ??
    roadSpec['default']?.color ??
    '#c8c0b8'
  );
}

function getRoadSurfaceColor(surface?: string): HexColor | undefined {
  if (!surface) return undefined;
  return surfaceColors[surface.toLowerCase()];
}

export function classifyRoad(
  id: string,
  tags: Record<string, string>,
  geometry: LineString
): RoadVisual {
  const highwayType = tags.highway!.toLowerCase();
  return {
    id,
    geometry,
    type: tags.highway!,
    widthMeters: getRoadWidthMeters(highwayType),
    laneCount: tags.lanes ? parseInt(tags.lanes, 10) : undefined,
    color: getColorForRoad(highwayType),
    surfaceColor: getRoadSurfaceColor(tags.surface),
    treeLined: tags.tree_lined as RoadVisual['treeLined'],
    bridge: tags.bridge === 'yes' ? true : undefined,
    layer: tags.layer ? parseInt(tags.layer, 10) : undefined,
  };
}

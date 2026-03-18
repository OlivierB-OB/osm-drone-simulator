import type { Point, LineString, Polygon } from 'geojson';
import type { MercatorBounds } from '../elevation/types';
import { latLngToMercator } from './strategies/parserUtils';
import { featureRegistry } from '../../features/registry';
import '../../features/registration';
import { lineString, point, polygon } from '@turf/helpers';
import type { ModulesFeatures } from '../../features/registrationTypes';

/**
 * Parser for OSM (OpenStreetMap) data tiles.
 * Converts raw Overpass API JSON responses into categorized visual features.
 * Delegates feature classification to strategy functions in ./strategies/.
 */
export class ContextDataTileParser {
  /**
   * Parses OSM JSON response data and groups features by type.
   * Only extracts visual properties; ignores non-rendering attributes.
   */
  static parseOSMData(
    osmData: Record<string, unknown>,
    // Retained for future use (bounds-based filtering, zoom-dependent detail)
    _bounds: MercatorBounds,
    _zoomLevel: number
  ): ModulesFeatures {
    const features = featureRegistry.modulesFeaturesFactory();

    if (!Array.isArray(osmData.elements)) {
      return features;
    }

    // Build node map for coordinate lookup
    const nodeMap = new Map<number, { lat: number; lng: number }>();
    const osm_elements = osmData.elements as Record<string, unknown>[];

    for (const element of osm_elements) {
      if (element.type === 'node' && typeof element.id === 'number') {
        const id = element.id;
        const lat = element.lat as number;
        const lng = element.lon as number;
        nodeMap.set(id, { lat, lng });
      }
    }

    // Build way map for relation member coordinate lookup
    const wayMap = new Map<number, [number, number][]>();
    for (const element of osm_elements) {
      if (element.type === 'way' && typeof element.id === 'number') {
        const nodes = (element.nodes as number[]) || [];
        const geometry = element.geometry as
          | { lat: number; lon: number }[]
          | undefined;
        const coords = this.buildLineStringCoordinates(
          nodes,
          geometry,
          nodeMap
        );
        if (coords.length > 0) {
          wayMap.set(element.id, coords);
        }
      }
    }

    // Process ways and relations
    for (const element of osm_elements) {
      if (element.type === 'way') {
        this.processWay(element, nodeMap, features);
      } else if (element.type === 'node' && element.tags) {
        this.processNode(element, features);
      } else if (element.type === 'relation') {
        this.processRelation(element, wayMap, features);
      }
    }

    featureRegistry.runPostProcessing(features);

    return features;
  }

  /**
   * Dispatches a classified element to the appropriate feature module via the registry.
   */
  private static classifyElement(
    id: string,
    tags: Record<string, string>,
    geometry: Point | LineString | Polygon,
    features: ModulesFeatures
  ): void {
    featureRegistry.classify(id, tags, geometry, features);
  }

  /**
   * Processes a way element: prepares geometry, then delegates to classifyElement.
   */
  private static processWay(
    element: Record<string, unknown>,
    nodeMap: Map<number, { lat: number; lng: number }>,
    features: ModulesFeatures
  ): void {
    const id = String(element.id);
    const tags = (element.tags as Record<string, string>) || {};
    const nodes = (element.nodes as number[]) || [];
    const geom = element.geometry as { lat: number; lon: number }[] | undefined;

    if (Object.keys(tags).length === 0) return;

    // Skip underground/tunnel features
    if (
      tags.tunnel === 'yes' ||
      tags.location === 'underground' ||
      (tags.level !== undefined && parseInt(tags.level, 10) < 0)
    ) {
      return;
    }

    const coordinates = this.buildLineStringCoordinates(nodes, geom, nodeMap);
    if (coordinates.length === 0) return;

    // Detect closed ring: prefer node-ID equality (authoritative per OSM spec),
    // fall back to coordinate comparison when only geometry array is available.
    const firstCoord = coordinates[0];
    const lastCoord = coordinates[coordinates.length - 1];
    const isClosed: boolean =
      nodes.length >= 2
        ? nodes[0] === nodes[nodes.length - 1] && coordinates.length >= 3
        : coordinates.length >= 3 &&
          !!firstCoord &&
          !!lastCoord &&
          firstCoord[0] === lastCoord[0] &&
          firstCoord[1] === lastCoord[1];

    const geometry = isClosed
      ? polygon([coordinates]).geometry
      : lineString(coordinates).geometry;

    this.classifyElement(id, tags, geometry, features);
  }

  /**
   * Processes a node element: prepares point geometry, then delegates to classifyElement.
   */
  private static processNode(
    element: Record<string, unknown>,
    features: ModulesFeatures
  ): void {
    const id = String(element.id);
    const tags = (element.tags as Record<string, string>) || {};
    const lat = element.lat as number;
    const lng = element.lon as number;

    if (Object.keys(tags).length === 0) return;
    if (typeof lat !== 'number' || typeof lng !== 'number') return;

    const [x, y] = latLngToMercator(lat, lng);
    const geometry = point([x, y]).geometry;

    this.classifyElement(id, tags, geometry, features);
  }

  /**
   * Processes a relation element: assembles polygon from member ways,
   * then delegates to classifyElement.
   */
  private static processRelation(
    element: Record<string, unknown>,
    wayMap: Map<number, [number, number][]>,
    features: ModulesFeatures
  ): void {
    const id = String(element.id);
    const tags = (element.tags as Record<string, string>) || {};

    if (Object.keys(tags).length === 0) return;

    // Only multipolygon relations represent areas
    if (tags.type !== 'multipolygon') return;

    // Skip underground/tunnel features
    if (
      tags.tunnel === 'yes' ||
      tags.location === 'underground' ||
      (tags.level !== undefined && parseInt(tags.level, 10) < 0)
    ) {
      return;
    }

    const members = element.members as
      | { type: string; ref: number; role: string }[]
      | undefined;
    if (!members || members.length === 0) return;

    // Separate way members by role
    const wayMembers = members.filter((m) => m.type === 'way');
    const outerWayMembers = wayMembers.filter((m) => m.role === 'outer');
    const innerWayMembers = wayMembers.filter((m) => m.role === 'inner');

    const effectiveOuterRefs =
      outerWayMembers.length > 0
        ? outerWayMembers.map((m) => m.ref)
        : wayMembers.filter((m) => m.role !== 'inner').map((m) => m.ref);
    const innerRefs = innerWayMembers.map((m) => m.ref);

    const outerRing = this.assembleRing(effectiveOuterRefs, wayMap);
    if (!outerRing || outerRing.length < 4) return;

    const innerRings = innerRefs
      .map((ref) => this.assembleRing([ref], wayMap))
      .filter((r): r is [number, number][] => r !== null && r.length >= 4);

    const geometry = polygon([outerRing, ...innerRings]).geometry;

    this.classifyElement(id, tags, geometry, features);
  }

  /**
   * Assembles an ordered list of way refs into a single closed coordinate ring.
   */
  private static assembleRing(
    wayRefs: number[],
    wayMap: Map<number, [number, number][]>
  ): [number, number][] | null {
    if (wayRefs.length === 0) return null;

    if (wayRefs.length === 1) {
      const coords = wayMap.get(wayRefs[0]!);
      if (!coords || coords.length < 2) return null;
      const ring = coords.slice() as [number, number][];
      const first = ring[0]!;
      const last = ring[ring.length - 1]!;
      if (first[0] !== last[0] || first[1] !== last[1]) {
        ring.push(first);
      }
      return ring;
    }

    // Multi-way: greedy chaining by matching endpoints
    const segments = wayRefs
      .map((ref) => wayMap.get(ref))
      .filter((s): s is [number, number][] => s !== undefined && s.length >= 2);

    if (segments.length === 0) return null;

    const ring: [number, number][] = segments[0]!.slice() as [number, number][];
    const remaining = segments.slice(1);

    while (remaining.length > 0) {
      const tail = ring[ring.length - 1]!;
      const idx = remaining.findIndex((seg) => {
        const head = seg[0]!;
        const end = seg[seg.length - 1]!;
        return (
          (head[0] === tail[0] && head[1] === tail[1]) ||
          (end[0] === tail[0] && end[1] === tail[1])
        );
      });

      if (idx === -1) break;

      const seg = remaining.splice(idx, 1)[0]!;
      const head = seg[0]!;
      if (head[0] === tail[0] && head[1] === tail[1]) {
        ring.push(...(seg.slice(1) as [number, number][]));
      } else {
        ring.push(...([...seg].reverse().slice(1) as [number, number][]));
      }
    }

    // Close the ring
    const first = ring[0]!;
    const last = ring[ring.length - 1]!;
    if (first[0] !== last[0] || first[1] !== last[1]) {
      ring.push(first);
    }

    return ring.length >= 4 ? ring : null;
  }

  /**
   * Builds a LineString from way nodes or geometry array.
   */
  private static buildLineStringCoordinates(
    nodes: number[],
    geometry: { lat: number; lon: number }[] | undefined,
    nodeMap: Map<number, { lat: number; lng: number }>
  ): [number, number][] {
    const coordinates: [number, number][] = [];

    if (geometry && Array.isArray(geometry)) {
      for (const { lat, lon } of geometry) {
        coordinates.push(latLngToMercator(lat as number, lon as number));
      }
    } else {
      for (const nodeId of nodes) {
        const node = nodeMap.get(nodeId);
        if (node) {
          coordinates.push(latLngToMercator(node.lat, node.lng));
        }
      }
    }

    return coordinates;
  }
}

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TileDataManager, type TileManagerConfig } from './TileDataManager';
import type { TileCoordinates } from '../elevation/types';
import type { MercatorCoordinates } from '../../gis/types';
import { Drone } from '../../drone/Drone';

// --- Test doubles --------------------------------------------------------

/**
 * Minimal concrete implementation for testing base class behaviour.
 * getTileCoordinates buckets every 1000 Mercator units into one tile.
 * loadTileAsync stores a string directly to tileCache (synchronous, no network).
 *
 * IMPORTANT: Fields touched during super() (via abstract method calls) must use
 * `declare` (no emit) + `??=` lazy init. Using `!:` with an initialiser, or
 * plain `= []`, causes useDefineForClassFields to reset the property to
 * undefined AFTER super() returns, discarding anything written during super().
 */
class TestTileManager extends TileDataManager<string> {
  // `declare` emits NO JavaScript — avoids the useDefineForClassFields reset
  declare loadTileAsyncCallKeys: string[];
  declare evictedKeys: string[];
  declare disposeCalled: boolean;

  constructor(drone: Drone) {
    super(drone);
  }

  // Prototype method — available immediately when super() calls getConfig()
  protected getConfig(): TileManagerConfig {
    return { zoomLevel: 10, ringRadius: 1, maxConcurrentLoads: 3 };
  }

  protected getTileCoordinates(
    loc: MercatorCoordinates,
    zoom: number
  ): TileCoordinates {
    return {
      z: zoom,
      x: Math.floor(loc.x / 1000),
      y: Math.floor(loc.y / 1000),
    };
  }

  protected override loadTileAsync(key: string): void {
    // ??= initialises the array lazily — safe when called during super()
    (this.loadTileAsyncCallKeys ??= []).push(key);
    const tile = `tile:${key}`;
    this.tileCache.set(key, tile);
    this.emit('tileAdded', { key, tile });
  }

  protected override processQueuedTiles(): void {}

  protected override onTileEvicted(key: string): void {
    (this.evictedKeys ??= []).push(key);
  }

  protected override onDispose(): void {
    this.disposeCalled = true;
  }

  // Expose protected helpers for assertions
  exposeParseTileKey(key: string): [number, number, number] {
    return this.parseTileKey(key);
  }

  exposeGetTileKey(coords: TileCoordinates): string {
    return this.getTileKey(coords);
  }

  getCacheSize(): number {
    return this.tileCache.size;
  }

  getPendingLoadsSize(): number {
    return this.pendingLoads.size;
  }

  getLoadingCount(): number {
    return this.loadingCount;
  }

  getAbortController(): AbortController {
    return this.abortController;
  }

  getCurrentTileCenter(): TileCoordinates | null {
    return this.currentTileCenter;
  }
}

/** Variant with ringRadius=0 to test single-tile ring. */
class SingleTileManager extends TestTileManager {
  protected override getConfig(): TileManagerConfig {
    return { zoomLevel: 10, ringRadius: 0, maxConcurrentLoads: 3 };
  }
}

// --- Helpers -------------------------------------------------------------

// Drone at x=500,y=500 → tile (0,0) at zoom 10
function makeDrone(x = 500, y = 500): Drone {
  return new Drone({ x, y }, 0);
}

// A key that is neither in the initial ring (0±1, 0±1) nor in the far ring (999±1, 999±1)
const STALE_KEY = '10:500:500';

// --- Tests ---------------------------------------------------------------

describe('TileDataManager (base class)', () => {
  let drone: Drone;
  let manager: TestTileManager;

  beforeEach(() => {
    drone = makeDrone();
    manager = new TestTileManager(drone);
  });

  afterEach(() => {
    manager.dispose();
    drone.dispose();
  });

  // -----------------------------------------------------------------------
  describe('construction and subscription', () => {
    it('subscribes to drone locationChanged during construction', () => {
      const testDrone = makeDrone();
      const onSpy = vi.spyOn(testDrone, 'on');
      const m = new TestTileManager(testDrone);

      expect(onSpy).toHaveBeenCalledWith(
        'locationChanged',
        expect.any(Function)
      );
      m.dispose();
      testDrone.dispose();
    });

    it('initialises the tile ring immediately on construction (ringRadius=1 → 9 tiles)', () => {
      const uniqueKeys = new Set(manager.loadTileAsyncCallKeys);
      expect(uniqueKeys.size).toBe(9);
    });
  });

  // -----------------------------------------------------------------------
  describe('initial ring size', () => {
    it('ringRadius=1 → 9 loadTileAsync calls', () => {
      const d = makeDrone();
      const m = new TestTileManager(d);
      expect(new Set(m.loadTileAsyncCallKeys).size).toBe(9);
      m.dispose();
      d.dispose();
    });

    it('ringRadius=0 → 1 loadTileAsync call', () => {
      const d = makeDrone();
      const m = new SingleTileManager(d);
      expect(new Set(m.loadTileAsyncCallKeys).size).toBe(1);
      m.dispose();
      d.dispose();
    });
  });

  // -----------------------------------------------------------------------
  describe('setLocation', () => {
    it('same tile: does not trigger more loadTileAsync calls', () => {
      // x=100 → Math.floor(100/1000)=0, same tile as x=500 (center=(0,0))
      const callsBefore = manager.loadTileAsyncCallKeys.length;
      manager.setLocation({ x: 100, y: 100 });
      expect(manager.loadTileAsyncCallKeys).toHaveLength(callsBefore);
    });

    it('new tile: triggers ring update and loads new tiles', () => {
      const callsBefore = manager.loadTileAsyncCallKeys.length;
      manager.setLocation({ x: 999000, y: 999000 }); // center=(999,999)
      expect(manager.loadTileAsyncCallKeys.length).toBeGreaterThan(callsBefore);
    });

    it('new tile: emits tileRemoved for keys no longer in ring', () => {
      // STALE_KEY is in neither the initial ring (0±1) nor the new ring (999±1)
      (manager as any).tileCache.set(STALE_KEY, 'stale-tile');

      const removedKeys: string[] = [];
      manager.on('tileRemoved', ({ key }) => removedKeys.push(key));

      manager.setLocation({ x: 999000, y: 999000 });

      expect(removedKeys).toContain(STALE_KEY);
    });

    it('new tile: updates currentTileCenter correctly', () => {
      manager.setLocation({ x: 999000, y: 999000 });
      expect(manager.getCurrentTileCenter()).toEqual({ z: 10, x: 999, y: 999 });
    });
  });

  // -----------------------------------------------------------------------
  describe('onTileEvicted hook', () => {
    it('is called for each key evicted from tileCache', () => {
      (manager as any).tileCache.set(STALE_KEY, 'stale');

      manager.setLocation({ x: 999000, y: 999000 });

      expect(manager.evictedKeys).toContain(STALE_KEY);
    });

    it('is called for pendingLoads-only entries outside the ring', () => {
      (manager as any).pendingLoads.set(STALE_KEY, Promise.resolve(null));

      manager.setLocation({ x: 999000, y: 999000 });

      expect(manager.evictedKeys).toContain(STALE_KEY);
    });

    it('is NOT called for keys that remain in the ring after same-bucket move', () => {
      const center = manager.getCurrentTileCenter()!;
      const keepKey = manager.exposeGetTileKey(center);

      manager.setLocation({ x: 100, y: 100 }); // same tile
      expect(manager.evictedKeys ?? []).not.toContain(keepKey);
    });
  });

  // -----------------------------------------------------------------------
  describe('getTileKey / parseTileKey', () => {
    it('round-trips correctly', () => {
      const coords: TileCoordinates = { z: 15, x: 16384, y: 10741 };
      const key = manager.exposeGetTileKey(coords);
      const [z, x, y] = manager.exposeParseTileKey(key);
      expect(z).toBe(15);
      expect(x).toBe(16384);
      expect(y).toBe(10741);
    });

    it('produces "z:x:y" format', () => {
      expect(manager.exposeGetTileKey({ z: 10, x: 5, y: 3 })).toBe('10:5:3');
    });

    it('parseTileKey throws on wrong part count', () => {
      expect(() => manager.exposeParseTileKey('invalid')).toThrow(
        /Invalid tile key format/
      );
      expect(() => manager.exposeParseTileKey('15:100')).toThrow(
        /Invalid tile key format/
      );
      expect(() => manager.exposeParseTileKey('15:100:100:extra')).toThrow(
        /Invalid tile key format/
      );
    });

    it('parseTileKey throws on non-integer values', () => {
      expect(() => manager.exposeParseTileKey('15.5:100:100')).toThrow(
        /non-integer values/
      );
      expect(() => manager.exposeParseTileKey('15:100.5:100')).toThrow(
        /non-integer values/
      );
      expect(() => manager.exposeParseTileKey('15:100:100.5')).toThrow(
        /non-integer values/
      );
    });
  });

  // -----------------------------------------------------------------------
  describe('dispose', () => {
    it('calls onDispose hook', () => {
      manager.dispose();
      expect(manager.disposeCalled).toBe(true);
    });

    it('calls drone.off to unsubscribe from locationChanged', () => {
      const offSpy = vi.spyOn(drone, 'off');
      manager.dispose();
      expect(offSpy).toHaveBeenCalledWith(
        'locationChanged',
        expect.any(Function)
      );
    });

    it('aborts the AbortController', () => {
      const abortSpy = vi.spyOn(manager.getAbortController(), 'abort');
      manager.dispose();
      expect(abortSpy).toHaveBeenCalled();
    });

    it('clears tileCache', () => {
      expect(manager.getCacheSize()).toBeGreaterThan(0);
      manager.dispose();
      expect(manager.getCacheSize()).toBe(0);
    });

    it('clears pendingLoads', () => {
      (manager as any).pendingLoads.set('test-key', Promise.resolve(null));
      manager.dispose();
      expect(manager.getPendingLoadsSize()).toBe(0);
    });

    it('resets loadingCount to 0', () => {
      (manager as any).loadingCount = 5;
      manager.dispose();
      expect(manager.getLoadingCount()).toBe(0);
    });

    it('removes all event listeners so no events fire after dispose', () => {
      const received: string[] = [];
      manager.on('tileAdded', ({ key }) => received.push(key));

      manager.dispose();
      (manager as any).emit('tileAdded', { key: 'ghost', tile: 'x' });

      expect(received).toHaveLength(0);
    });
  });
});

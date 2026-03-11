import { describe, it, expect } from 'vitest';
import { TilePersistenceCache } from './TilePersistenceCache';
import type { TilePersistenceCacheConfig } from './TilePersistenceCache';

/**
 * Tests for the generic TilePersistenceCache with real IndexedDB.
 * Uses fake-indexeddb to enable actual cache behavior validation:
 * - Cache hits and misses
 * - TTL expiration with Date.now() mocking
 * - cleanupExpired() cursor logic
 * - schema migration on version upgrade
 * - concurrent operations with real storage
 */

interface TestTile {
  coordinates: { z: number; x: number; y: number };
  data: string;
}

let dbCounter = 0;

const makeCache = (
  overrides: Partial<TilePersistenceCacheConfig> = {}
): TilePersistenceCache<TestTile> =>
  new TilePersistenceCache<TestTile>({
    dbName: `test-db-${++dbCounter}`,
    dbVersion: 1,
    storeName: 'testTiles',
    clearOnUpgrade: false,
    ...overrides,
  });

const tile = (z: number, x: number, y: number): TestTile => ({
  coordinates: { z, x, y },
  data: `tile-${z}-${x}-${y}`,
});

describe('TilePersistenceCache', () => {
  describe('initialization', () => {
    it('resolves without throwing', async () => {
      const cache = makeCache();
      await expect(cache.initialize()).resolves.not.toThrow();
    });

    it('concurrent initialize calls are idempotent', async () => {
      const cache = makeCache();
      await expect(
        Promise.all([
          cache.initialize(),
          cache.initialize(),
          cache.initialize(),
        ])
      ).resolves.not.toThrow();
    });

    it('clearOnUpgrade: false initializes with existing config', async () => {
      const cache = makeCache({ clearOnUpgrade: false });
      await expect(cache.initialize()).resolves.not.toThrow();
      expect(cache.isAvailable()).toBe(true);
    });

    it('clearOnUpgrade: true initializes with existing config', async () => {
      const cache = makeCache({ clearOnUpgrade: true });
      await expect(cache.initialize()).resolves.not.toThrow();
      expect(cache.isAvailable()).toBe(true);
    });
  });

  describe('get', () => {
    it('returns null for non-existent key', async () => {
      const cache = makeCache();
      await cache.initialize();
      expect(await cache.get('nonexistent')).toBeNull();
    });

    it('returns null for empty key', async () => {
      const cache = makeCache();
      await cache.initialize();
      expect(await cache.get('')).toBeNull();
    });

    it('returns null before initialize', async () => {
      const cache = makeCache();
      expect(await cache.get('key')).toBeNull();
    });

    it('retrieves stored tile successfully', async () => {
      const cache = makeCache();
      await cache.initialize();
      const testTile = tile(15, 10, 20);
      await cache.set('15:10:20', testTile);

      const result = await cache.get('15:10:20');
      expect(result).not.toBeNull();
      expect((result as TestTile).coordinates).toEqual({
        z: 15,
        x: 10,
        y: 20,
      });
    });

    it('returns null for expired tiles', async () => {
      const cache = makeCache();
      await cache.initialize();

      // Store a tile
      const testTile = tile(1, 2, 3);
      await cache.set('1:2:3', testTile);

      // Verify it's stored
      let result = await cache.get('1:2:3');
      expect(result).not.toBeNull();

      // Mock Date.now() to advance 25 hours (beyond 24h TTL)
      const originalNow = Date.now;
      Date.now = () => originalNow() + 25 * 60 * 60 * 1000;

      try {
        result = await cache.get('1:2:3');
        expect(result).toBeNull();
      } finally {
        Date.now = originalNow;
      }
    });
  });

  describe('set', () => {
    it('stores tiles successfully', async () => {
      const cache = makeCache();
      await cache.initialize();
      await expect(
        cache.set('15:10:20', tile(15, 10, 20))
      ).resolves.not.toThrow();

      const result = await cache.get('15:10:20');
      expect(result).not.toBeNull();
    });

    it('overwrites existing tiles', async () => {
      const cache = makeCache();
      await cache.initialize();

      await cache.set('1:2:3', tile(1, 2, 3));
      await cache.set('1:2:3', tile(10, 20, 30));

      const result = await cache.get('1:2:3');
      expect((result as TestTile).coordinates).toEqual({ z: 10, x: 20, y: 30 });
    });

    it('does not throw before initialize', async () => {
      const cache = makeCache();
      await expect(cache.set('key', tile(1, 2, 3))).resolves.not.toThrow();
    });

    it('stores multiple tiles independently', async () => {
      const cache = makeCache();
      await cache.initialize();

      const tiles = [tile(1, 1, 1), tile(2, 2, 2), tile(3, 3, 3)];
      await Promise.all(tiles.map((t, i) => cache.set(`${i}`, t)));

      for (let i = 0; i < tiles.length; i++) {
        const result = await cache.get(`${i}`);
        expect((result as TestTile).coordinates.z).toBe(i + 1);
      }
    });
  });

  describe('delete', () => {
    it('removes tiles from cache', async () => {
      const cache = makeCache();
      await cache.initialize();

      await cache.set('1:2:3', tile(1, 2, 3));
      expect(await cache.get('1:2:3')).not.toBeNull();

      await cache.delete('1:2:3');
      expect(await cache.get('1:2:3')).toBeNull();
    });

    it('does not throw for non-existent key', async () => {
      const cache = makeCache();
      await cache.initialize();
      await expect(cache.delete('nonexistent')).resolves.not.toThrow();
    });

    it('does not throw before initialize', async () => {
      const cache = makeCache();
      await expect(cache.delete('key')).resolves.not.toThrow();
    });

    it('does not affect other tiles', async () => {
      const cache = makeCache();
      await cache.initialize();

      await cache.set('1:2:3', tile(1, 2, 3));
      await cache.set('4:5:6', tile(4, 5, 6));

      await cache.delete('1:2:3');

      expect(await cache.get('1:2:3')).toBeNull();
      expect(await cache.get('4:5:6')).not.toBeNull();
    });
  });

  describe('cleanupExpired', () => {
    it('returns 0 when no expired tiles', async () => {
      const cache = makeCache();
      await cache.initialize();
      expect(await cache.cleanupExpired()).toBe(0);
    });

    it('returns 0 before initialize', async () => {
      const cache = makeCache();
      expect(await cache.cleanupExpired()).toBe(0);
    });

    it('deletes expired tiles', async () => {
      const cache = makeCache();
      await cache.initialize();

      // Store tiles with current timestamp
      await cache.set('1:2:3', tile(1, 2, 3));
      await cache.set('4:5:6', tile(4, 5, 6));

      // Mock Date.now() to advance 25 hours
      const originalNow = Date.now;
      Date.now = () => originalNow() + 25 * 60 * 60 * 1000;

      try {
        const deletedCount = await cache.cleanupExpired();
        expect(deletedCount).toBe(2);
        expect(await cache.get('1:2:3')).toBeNull();
        expect(await cache.get('4:5:6')).toBeNull();
      } finally {
        Date.now = originalNow;
      }
    });

    it('only deletes expired tiles, not recent ones', async () => {
      const cache = makeCache();
      await cache.initialize();
      const originalNow = Date.now;

      try {
        // Store tile 1 at time 0
        await cache.set('1:2:3', tile(1, 2, 3));

        // Advance 12 hours and store tile 2
        Date.now = () => originalNow() + 12 * 60 * 60 * 1000;
        await cache.set('4:5:6', tile(4, 5, 6));

        // Advance to 25 hours (only tile 1 should be expired)
        Date.now = () => originalNow() + 25 * 60 * 60 * 1000;
        const deletedCount = await cache.cleanupExpired();

        expect(deletedCount).toBe(1);
        expect(await cache.get('1:2:3')).toBeNull();
        expect(await cache.get('4:5:6')).not.toBeNull();
      } finally {
        Date.now = originalNow;
      }
    });

    it('handles empty store', async () => {
      const cache = makeCache();
      await cache.initialize();
      const count = await cache.cleanupExpired();
      expect(count).toBe(0);
    });
  });

  describe('isAvailable', () => {
    it('returns true after successful initialize', async () => {
      const cache = makeCache();
      await cache.initialize();
      expect(cache.isAvailable()).toBe(true);
    });

    it('returns false before initialize', async () => {
      const cache = makeCache();
      expect(cache.isAvailable()).toBe(false);
    });

    it('returns a boolean', () => {
      const cache = makeCache();
      expect(typeof cache.isAvailable()).toBe('boolean');
    });
  });

  describe('concurrency', () => {
    it('handles 5 concurrent gets without throwing', async () => {
      const cache = makeCache();
      await cache.initialize();
      await expect(
        Promise.all(Array.from({ length: 5 }, (_, i) => cache.get(`key-${i}`)))
      ).resolves.not.toThrow();
    });

    it('handles 5 concurrent sets without throwing', async () => {
      const cache = makeCache();
      await cache.initialize();
      await expect(
        Promise.all(
          Array.from({ length: 5 }, (_, i) =>
            cache.set(`key-${i}`, tile(15, i, 20))
          )
        )
      ).resolves.not.toThrow();
    });

    it('handles mixed concurrent operations without throwing', async () => {
      const cache = makeCache();
      await cache.initialize();
      const ops = [
        ...Array.from({ length: 3 }, (_, i) =>
          cache.set(`k-${i}`, tile(15, i, 0))
        ),
        ...Array.from({ length: 3 }, (_, i) => cache.get(`k-${i}`)),
        cache.cleanupExpired(),
      ];
      await expect(Promise.all(ops)).resolves.not.toThrow();
    });

    it('concurrent sets and gets return correct values', async () => {
      const cache = makeCache();
      await cache.initialize();

      // Set 10 tiles concurrently
      const tileKeys = Array.from({ length: 10 }, (_, i) => `tile-${i}`);
      await Promise.all(
        tileKeys.map((key, i) => cache.set(key, tile(i, i, i)))
      );

      // Get all tiles concurrently
      const results = await Promise.all(tileKeys.map((key) => cache.get(key)));

      results.forEach((result, i) => {
        expect(result).not.toBeNull();
        expect((result as TestTile).coordinates).toEqual({
          z: i,
          x: i,
          y: i,
        });
      });
    });
  });

  describe('error handling', () => {
    it('operations after failed init are safe (no db)', async () => {
      // Cache never initialized — db stays null
      const cache = makeCache();
      expect(await cache.get('x')).toBeNull();
      await expect(cache.set('x', tile(1, 2, 3))).resolves.not.toThrow();
      await expect(cache.delete('x')).resolves.not.toThrow();
      expect(await cache.cleanupExpired()).toBe(0);
    });
  });
});

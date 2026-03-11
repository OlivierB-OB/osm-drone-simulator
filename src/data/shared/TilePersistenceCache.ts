export interface TilePersistenceCacheConfig {
  dbName: string;
  dbVersion: number;
  storeName: string;
  /** true = delete+recreate store on upgrade; false = create only if missing */
  clearOnUpgrade: boolean;
}

type CachedEntry<T> = T & { key: string; storedAt: number; expiresAt: number };

/**
 * Generic IndexedDB-based persistence cache for tile data.
 * Caches tiles with a 24-hour TTL. Gracefully degrades if IndexedDB is
 * unavailable (private mode, old browser).
 *
 * Use as a module-level singleton and delegate from a typed wrapper object
 * to preserve static-like call syntax at consumer sites.
 */
export class TilePersistenceCache<T> {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<void> | null = null;
  private readonly TTL_MS = 24 * 60 * 60 * 1000;

  constructor(private readonly config: TilePersistenceCacheConfig) {}

  /**
   * Initialize IndexedDB. Safe to call multiple times — subsequent calls
   * return the cached promise.
   */
  async initialize(): Promise<void> {
    if (this.initPromise) {
      return this.initPromise;
    }
    this.initPromise = this._performInitialization();
    return this.initPromise;
  }

  private async _performInitialization(): Promise<void> {
    try {
      if (!this._isIndexedDBAvailable()) {
        console.warn(
          `IndexedDB not available; persistent ${this.config.storeName} cache disabled`
        );
        return;
      }

      this.db = await this._openDatabase();

      const deletedCount = await this.cleanupExpired();
      if (deletedCount > 0) {
        console.debug(
          `Cleaned up ${deletedCount} expired entries from ${this.config.storeName} cache`
        );
      }
    } catch (error) {
      console.warn(
        `Failed to initialize ${this.config.storeName} persistence cache:`,
        error
      );
      this.db = null;
    }
  }

  /**
   * Retrieve a tile from cache. Returns null if not found, expired, or cache
   * unavailable.
   */
  async get(key: string): Promise<T | null> {
    if (!this.db) {
      return null;
    }

    try {
      const entry = (await this._getEntry(key)) as CachedEntry<T> | undefined;

      if (!entry) {
        return null;
      }

      if (entry.expiresAt < Date.now()) {
        await this.delete(key);
        return null;
      }

      return entry as T;
    } catch (error) {
      console.warn(
        `Error retrieving ${this.config.storeName} entry ${key}:`,
        error
      );
      return null;
    }
  }

  /**
   * Store a tile with a 24-hour TTL. Silently fails if cache unavailable.
   */
  async set(key: string, tile: T): Promise<void> {
    if (!this.db) {
      return;
    }

    try {
      const now = Date.now();
      const entry: CachedEntry<T> = {
        ...(tile as object),
        key,
        storedAt: now,
        expiresAt: now + this.TTL_MS,
      } as CachedEntry<T>;

      await this._putEntry(entry);
    } catch (error) {
      console.warn(
        `Error caching ${this.config.storeName} entry ${key}:`,
        error
      );
    }
  }

  /** Delete a single tile from cache. */
  async delete(key: string): Promise<void> {
    if (!this.db) {
      return;
    }

    try {
      await this._deleteEntry(key);
    } catch (error) {
      console.warn(
        `Error deleting ${this.config.storeName} entry ${key}:`,
        error
      );
    }
  }

  /**
   * Delete all expired tiles. Returns the count of deleted entries.
   */
  async cleanupExpired(): Promise<number> {
    if (!this.db) {
      return 0;
    }

    try {
      const now = Date.now();
      const index = this.db
        .transaction(this.config.storeName, 'readonly')
        .objectStore(this.config.storeName)
        .index('expiresAt');

      const expiredRange = IDBKeyRange.upperBound(now);
      const expiredKeys: string[] = [];

      await new Promise<void>((resolve, reject) => {
        const request = index.openCursor(expiredRange);

        request.onsuccess = () => {
          const cursor = request.result;
          if (cursor) {
            expiredKeys.push(cursor.primaryKey as string);
            cursor.continue();
          } else {
            resolve();
          }
        };

        request.onerror = () => reject(request.error);
      });

      for (const key of expiredKeys) {
        await this._deleteEntry(key);
      }

      return expiredKeys.length;
    } catch (error) {
      console.warn(
        `Error cleaning up expired ${this.config.storeName} entries:`,
        error
      );
      return 0;
    }
  }

  /** Returns true if IndexedDB was successfully opened. */
  isAvailable(): boolean {
    return this.db !== null && this._isIndexedDBAvailable();
  }

  // ===== Private helpers =====

  private _isIndexedDBAvailable(): boolean {
    try {
      const idb = window.indexedDB;
      return idb !== undefined && idb !== null;
    } catch {
      return false;
    }
  }

  private _openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.config.dbName, this.config.dbVersion);

      request.onupgradeneeded = () => {
        const db = request.result;

        if (this.config.clearOnUpgrade) {
          // Delete existing store to clear stale data on schema changes
          if (db.objectStoreNames.contains(this.config.storeName)) {
            db.deleteObjectStore(this.config.storeName);
          }
        }

        if (!db.objectStoreNames.contains(this.config.storeName)) {
          const store = db.createObjectStore(this.config.storeName, {
            keyPath: 'key',
          });
          store.createIndex('expiresAt', 'expiresAt', { unique: false });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  private _getEntry(key: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const request = this.db
        .transaction(this.config.storeName, 'readonly')
        .objectStore(this.config.storeName)
        .get(key);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  private _putEntry(entry: unknown): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const request = this.db
        .transaction(this.config.storeName, 'readwrite')
        .objectStore(this.config.storeName)
        .put(entry);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private _deleteEntry(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const request = this.db
        .transaction(this.config.storeName, 'readwrite')
        .objectStore(this.config.storeName)
        .delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

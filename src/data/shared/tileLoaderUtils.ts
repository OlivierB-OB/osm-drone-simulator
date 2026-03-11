/**
 * Loads a value from a persistence cache if available; otherwise calls loadFn,
 * caches the result on success, and returns it.
 *
 * Cache errors are silently swallowed — the cache is an optional enhancement,
 * not a critical path. Retry logic stays in the caller's loadFn.
 *
 * @param key - Cache key
 * @param persistenceCache - Object with get/set methods
 * @param loadFn - Network/fallback loader; returns null on failure
 * @returns Cached or freshly loaded value, or null if load failed
 */
export async function loadWithPersistenceCache<T>(
  key: string,
  persistenceCache: {
    get(key: string): Promise<T | null>;
    set(key: string, value: T): Promise<void>;
  },
  loadFn: () => Promise<T | null>
): Promise<T | null> {
  try {
    const cached = await persistenceCache.get(key);
    if (cached) return cached;
  } catch (error) {
    console.warn(
      'Persistent cache unavailable, falling back to network',
      error
    );
  }

  const result = await loadFn();

  if (result) {
    try {
      await persistenceCache.set(key, result);
    } catch (error) {
      console.warn(`Failed to cache tile ${key}:`, error);
    }
  }

  return result;
}

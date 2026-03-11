/**
 * Vitest setup file: Initialize fake-indexeddb for tests.
 * Enables actual IndexedDB functionality in test environment.
 */
import 'fake-indexeddb/auto';
import { afterEach } from 'vitest';

/**
 * Global teardown hook to ensure async operations settle before test cleanup.
 * Prevents happy-dom AbortError when timers/promises are still pending.
 *
 * This gives time for:
 * - setTimeout/setInterval callbacks to complete
 * - Unhandled promise rejections to be caught
 * - Async resource cleanup to finish
 */
afterEach(async () => {
  // Small delay to allow microtasks and immediate timers to settle
  await new Promise(resolve => setTimeout(resolve, 0));
});

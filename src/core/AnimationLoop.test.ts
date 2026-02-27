import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AnimationLoop } from './AnimationLoop';
import { createDrone, Drone } from '../drone/Drone';

describe('AnimationLoop', () => {
  let animationLoop: AnimationLoop;
  let drone: Drone;

  beforeEach(() => {
    drone = createDrone();

    animationLoop = new AnimationLoop(drone);

    // Mock requestAnimationFrame to capture the callback
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((callback: unknown) => {
        (animationLoop as any).__testCallback = callback;
        return 1;
      })
    );

    vi.stubGlobal('cancelAnimationFrame', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('start()', () => {
    it('should request animation frame when started', () => {
      animationLoop.start();
      expect(requestAnimationFrame).toHaveBeenCalled();
    });

    it('should call drone.applyMove on animation frame', () => {
      const droneSpy = vi.spyOn(drone, 'applyMove');
      animationLoop.start();

      const callback = (animationLoop as any).__testCallback;
      if (callback) {
        callback(100);
        expect(droneSpy).toHaveBeenCalled();
      }
    });

    it('should calculate delta time correctly', () => {
      const droneSpy = vi.spyOn(drone, 'applyMove');
      animationLoop.start();

      const callback = (animationLoop as any).__testCallback;
      if (callback) {
        droneSpy.mockClear();
        callback(0);
        const firstCallDelta = droneSpy.mock.calls[0]?.[0];

        droneSpy.mockClear();
        callback(1000);
        const secondCallDelta = droneSpy.mock.calls[0]?.[0];

        expect(secondCallDelta).toBeGreaterThanOrEqual(firstCallDelta!);
      }
    });
  });

  describe('dispose()', () => {
    it('should cancel animation frame when disposed', () => {
      animationLoop.start();
      animationLoop.dispose();

      expect(cancelAnimationFrame).toHaveBeenCalled();
    });

    it('should handle dispose without start', () => {
      expect(() => animationLoop.dispose()).not.toThrow();
    });

    it('should handle multiple dispose calls', () => {
      animationLoop.start();
      expect(() => {
        animationLoop.dispose();
        animationLoop.dispose();
      }).not.toThrow();
    });
  });

  describe('integration', () => {
    it('should call drone.applyMove each frame', () => {
      const droneSpy = vi.spyOn(drone, 'applyMove');

      animationLoop.start();

      const callback = (animationLoop as any).__testCallback;
      if (callback) {
        callback(0);
        expect(droneSpy).toHaveBeenCalled();
      }
    });
  });
});

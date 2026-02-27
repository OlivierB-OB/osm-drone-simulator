import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AnimationLoop } from './AnimationLoop';
import { createDrone, Drone } from './Drone';

describe('AnimationLoop', () => {
  let animationLoop: AnimationLoop;
  let drone: Drone;
  let lastRAFCallback: ((time: number) => void) | null = null;

  beforeEach(() => {
    drone = createDrone();
    lastRAFCallback = null;

    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((callback: (time: number) => void) => {
        lastRAFCallback = callback;
        return 1;
      })
    );

    vi.stubGlobal('cancelAnimationFrame', vi.fn());

    animationLoop = new AnimationLoop(drone);
  });

  afterEach(() => {
    animationLoop.dispose();
    vi.unstubAllGlobals();
  });

  describe('construction', () => {
    it('should not start RAF on construction', () => {
      expect(requestAnimationFrame).not.toHaveBeenCalled();
    });
  });

  describe('start/stop via movingChanged event', () => {
    it('should start RAF when drone starts moving', () => {
      drone.startMovingForward();
      expect(requestAnimationFrame).toHaveBeenCalled();
    });

    it('should not start RAF again when a second direction is added while already moving', () => {
      drone.startMovingForward();
      vi.mocked(requestAnimationFrame).mockClear();
      drone.startMovingRight();
      expect(requestAnimationFrame).not.toHaveBeenCalled();
    });

    it('should stop RAF when drone stops moving', () => {
      drone.startMovingForward();
      drone.stopMovingForward();
      expect(cancelAnimationFrame).toHaveBeenCalled();
    });

    it('should not stop RAF when one direction stops but another is still active', () => {
      drone.startMovingForward();
      drone.startMovingRight();
      drone.stopMovingForward();
      expect(cancelAnimationFrame).not.toHaveBeenCalled();
    });

    it('should restart RAF after stop and new movement', () => {
      drone.startMovingForward();
      drone.stopMovingForward();
      vi.mocked(requestAnimationFrame).mockClear();
      drone.startMovingForward();
      expect(requestAnimationFrame).toHaveBeenCalled();
    });
  });

  describe('frame callbacks', () => {
    it('should call drone.applyMove on each animation frame', () => {
      const droneSpy = vi.spyOn(drone, 'applyMove');
      drone.startMovingForward();

      droneSpy.mockClear();
      lastRAFCallback?.(100);

      expect(droneSpy).toHaveBeenCalled();
    });

    it('should pass 0 delta time on first frame', () => {
      const droneSpy = vi.spyOn(drone, 'applyMove');
      drone.startMovingForward();

      // animate(0) is the initial call: lastFrameTime=0 → deltaTime=0
      expect(droneSpy).toHaveBeenCalledWith(0);
    });

    it('should calculate delta time correctly between frames', () => {
      const droneSpy = vi.spyOn(drone, 'applyMove');
      drone.startMovingForward();

      // animate(0) already ran: lastFrameTime=0 → delta=0, lastFrameTime=0
      // First explicit frame: lastFrameTime=0 → delta=0, lastFrameTime=500
      lastRAFCallback?.(500);
      // Second explicit frame: lastFrameTime=500 → delta=(1000-500)/1000>0
      droneSpy.mockClear();
      lastRAFCallback?.(1000);
      const delta = droneSpy.mock.calls[0]?.[0];

      expect(delta).toBeGreaterThan(0);
    });

    it('should reset lastFrameTime to 0 after stop', () => {
      const droneSpy = vi.spyOn(drone, 'applyMove');
      drone.startMovingForward();
      lastRAFCallback?.(500); // advance lastFrameTime past 0
      lastRAFCallback?.(5000); // advance further

      drone.stopMovingForward(); // stop() resets lastFrameTime to 0

      droneSpy.mockClear();
      drone.startMovingForward(); // restart → animate(0) → applyMove(0)

      // First frame after restart: lastFrameTime was reset to 0 → deltaTime = 0
      expect(droneSpy).toHaveBeenCalledWith(0);
    });
  });

  describe('dispose()', () => {
    it('should cancel RAF when disposed while moving', () => {
      drone.startMovingForward();
      animationLoop.dispose();
      expect(cancelAnimationFrame).toHaveBeenCalled();
    });

    it('should handle dispose without movement', () => {
      expect(() => animationLoop.dispose()).not.toThrow();
    });

    it('should stop receiving movingChanged events after dispose', () => {
      animationLoop.dispose();
      vi.mocked(requestAnimationFrame).mockClear();
      drone.startMovingForward();
      expect(requestAnimationFrame).not.toHaveBeenCalled();
    });
  });
});

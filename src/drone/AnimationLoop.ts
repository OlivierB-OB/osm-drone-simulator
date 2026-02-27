import { Drone } from './Drone';

export class AnimationLoop {
  private animationFrameId: number | null = null;
  private lastFrameTime: number = 0;
  private readonly onMovingChanged: (isMoving: boolean) => void;

  constructor(private readonly drone: Drone) {
    this.onMovingChanged = (isMoving) => {
      if (isMoving) this.start();
      else this.stop();
    };
    drone.on('movingChanged', this.onMovingChanged);
  }

  private start(): void {
    if (this.animationFrameId !== null) return;
    const animate = (currentTime: number) => {
      this.animationFrameId = requestAnimationFrame(animate);
      const deltaTime =
        this.lastFrameTime === 0
          ? 0
          : (currentTime - this.lastFrameTime) / 1000;
      this.lastFrameTime = currentTime;
      this.drone.applyMove(deltaTime);
    };
    animate(0);
  }

  private stop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.lastFrameTime = 0;
  }

  public dispose(): void {
    this.stop();
    this.drone.off('movingChanged', this.onMovingChanged);
  }
}

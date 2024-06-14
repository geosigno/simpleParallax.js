// AnimationManager.ts
class AnimationManager {
  private static instance: AnimationManager;
  private callbacks: Set<() => void> = new Set();
  private animationFrameId: number | null = null;

  private constructor() {}

  public static getInstance(): AnimationManager {
    if (!AnimationManager.instance) {
      AnimationManager.instance = new AnimationManager();
    }
    return AnimationManager.instance;
  }

  public register(callback: () => void): void {
    this.callbacks.add(callback);
    if (this.animationFrameId === null) {
      this.start();
    }
  }

  public unregister(callback: () => void): void {
    this.callbacks.delete(callback);
    if (this.callbacks.size === 0 && this.animationFrameId !== null) {
      this.stop();
    }
  }

  private start(): void {
    const animate = () => {
      this.callbacks.forEach((callback) => callback());
      this.animationFrameId = requestAnimationFrame(animate);
    };
    this.animationFrameId = requestAnimationFrame(animate);
  }

  private stop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
}

export default AnimationManager.getInstance();

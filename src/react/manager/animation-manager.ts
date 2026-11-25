// Task run on every frame, in two passes so DOM reads and writes are not
// interleaved between images (each switch forces a style recalculation).
interface FrameTask {
  measure: (scrollY: number) => void;
  update: (dt: number) => void;
}

class AnimationManager {
  private static instance: AnimationManager;
  private readonly tasks: Set<FrameTask> = new Set();
  private animationFrameId: number | null = null;

  static getInstance(): AnimationManager {
    if (!AnimationManager.instance) {
      AnimationManager.instance = new AnimationManager();
    }
    return AnimationManager.instance;
  }

  register(task: FrameTask): void {
    this.tasks.add(task);
    this.updateRAFState();
  }

  unregister(task: FrameTask): void {
    this.tasks.delete(task);
    this.updateRAFState();
  }

  // The loop only runs while there is an image left to animate.
  private updateRAFState(): void {
    const shouldRun = this.tasks.size > 0;

    if (shouldRun && this.animationFrameId === null) {
      this.startRAF();
    } else if (!shouldRun && this.animationFrameId !== null) {
      this.stopRAF();
    }
  }

  private startRAF(): void {
    if (typeof window === "undefined") {
      return;
    }
    let lastTime = performance.now();
    const animate = (now: number) => {
      const dt = now - lastTime;
      lastTime = now;
      this.animationFrameId = requestAnimationFrame(animate);

      const { scrollY } = window;
      for (const task of this.tasks) {
        task.measure(scrollY);
      }
      for (const task of this.tasks) {
        task.update(dt);
      }
    };
    this.animationFrameId = requestAnimationFrame(animate);
  }

  private stopRAF(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
}

export default AnimationManager.getInstance();

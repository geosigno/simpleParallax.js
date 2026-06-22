import PassiveScrollManager from "./passive-scroll-manager.js";

class AnimationManager {
  private static instance: AnimationManager;
  private readonly callbacks: Set<() => void> = new Set();
  private animationFrameId: number | null = null;
  private visibleElementsCount = 0;
  private isScrolling = false;

  private constructor() {
    PassiveScrollManager.onScrollingChange((isScrolling) => {
      this.isScrolling = isScrolling;
      this.updateRAFState();
    });
  }

  static getInstance(): AnimationManager {
    if (!AnimationManager.instance) {
      AnimationManager.instance = new AnimationManager();
    }
    return AnimationManager.instance;
  }

  register(callback: () => void): void {
    this.callbacks.add(callback);
    this.visibleElementsCount++;
    this.updateRAFState();
  }

  unregister(callback: () => void): void {
    if (this.callbacks.has(callback)) {
      this.callbacks.delete(callback);
      this.visibleElementsCount = Math.max(0, this.visibleElementsCount - 1);
      this.updateRAFState();
    }
  }

  private updateRAFState(): void {
    const shouldRun = this.isScrolling && this.visibleElementsCount > 0;

    if (shouldRun && this.animationFrameId === null) {
      this.startRAF();
    } else if (!shouldRun && this.animationFrameId !== null) {
      this.stopRAF();
    }
  }

  private startRAF(): void {
    const animate = () => {
      for (const callback of this.callbacks) {
        callback();
      }

      this.animationFrameId = requestAnimationFrame(animate);
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

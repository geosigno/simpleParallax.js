import PassiveScrollManager from "./PassiveScrollManager";

class AnimationManager {
	private static instance: AnimationManager;
	private callbacks: Set<() => void> = new Set();
	private animationFrameId: number | null = null;
	private visibleElementsCount: number = 0;
	private isScrolling: boolean = false;

	private constructor() {
		PassiveScrollManager.onScrollingChange((isScrolling) => {
			this.isScrolling = isScrolling;
			this.updateRAFState();
		});
	}

	public static getInstance(): AnimationManager {
		if (!AnimationManager.instance) {
			AnimationManager.instance = new AnimationManager();
		}
		return AnimationManager.instance;
	}

	public register(callback: () => void): void {
		this.callbacks.add(callback);
		this.visibleElementsCount++;
		this.updateRAFState();
	}

	public unregister(callback: () => void): void {
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
			this.callbacks.forEach((callback) => callback());

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

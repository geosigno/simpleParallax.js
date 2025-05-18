class PassiveScrollManager {
	private static instance: PassiveScrollManager;
	private currentScrollY: number = 0;
	private isScrolling: boolean = false;
	private scrollTimeoutId: number | null = null;
	private scrollingListener: ((isScrolling: boolean) => void) | null = null;

	private constructor() {
		window.addEventListener("scroll", this.handleScroll, { passive: true });
		this.currentScrollY = window.scrollY;
	}

	public static getInstance(): PassiveScrollManager {
		if (!PassiveScrollManager.instance) {
			PassiveScrollManager.instance = new PassiveScrollManager();
		}
		return PassiveScrollManager.instance;
	}

	private handleScroll = (): void => {
		this.currentScrollY = window.scrollY;

		if (!this.isScrolling) {
			this.isScrolling = true;
			this.notifyScrollingState(true);
		}

		if (this.scrollTimeoutId !== null) {
			clearTimeout(this.scrollTimeoutId);
		}

		this.scrollTimeoutId = window.setTimeout(() => {
			this.isScrolling = false;
			this.notifyScrollingState(false);
		}, 100);
	};

	private notifyScrollingState(isScrolling: boolean): void {
		if (this.scrollingListener) {
			this.scrollingListener(isScrolling);
		}
	}

	public onScrollingChange(listener: (isScrolling: boolean) => void): void {
		this.scrollingListener = listener;
		listener(this.isScrolling);
	}

	public getScrollY(): number {
		return this.currentScrollY;
	}
}

export default PassiveScrollManager.getInstance();

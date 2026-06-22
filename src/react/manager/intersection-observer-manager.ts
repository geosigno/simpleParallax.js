class IntersectionObserverManager {
  private static instance: IntersectionObserverManager;
  private readonly observer: IntersectionObserver;
  private readonly callbacks = new Map<Element, (isVisible: boolean) => void>();
  private readonly visibilityStates = new Map<Element, boolean>();

  private constructor() {
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const element = entry.target;
          const callback = this.callbacks.get(element);
          const wasVisible = this.visibilityStates.get(element);
          const isVisible = entry.isIntersecting;

          if (callback && wasVisible !== isVisible) {
            this.visibilityStates.set(element, isVisible);
            callback(isVisible);
          }
        }
      },
      {
        threshold: 0,
        rootMargin: "16px",
      }
    );
  }

  static getInstance(): IntersectionObserverManager {
    if (!IntersectionObserverManager.instance) {
      IntersectionObserverManager.instance = new IntersectionObserverManager();
    }
    return IntersectionObserverManager.instance;
  }

  observe(element: Element, callback: (isVisible: boolean) => void): void {
    this.callbacks.set(element, callback);
    this.visibilityStates.set(element, false);

    this.observer.observe(element);
  }

  unobserve(element: Element): void {
    this.callbacks.delete(element);
    this.visibilityStates.delete(element);
    this.observer.unobserve(element);
  }

  disconnect(): void {
    this.observer.disconnect();
    this.callbacks.clear();
    this.visibilityStates.clear();
  }
}

export default IntersectionObserverManager.getInstance();

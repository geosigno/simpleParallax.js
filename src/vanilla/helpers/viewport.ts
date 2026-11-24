interface ViewportPositions {
  height: number;
  top: number;
}

class Viewport {
  positions: ViewportPositions = { top: 0, height: 0 };

  setViewportTop(container?: HTMLElement | null): ViewportPositions {
    this.positions.top = container ? container.scrollTop : window.scrollY;
    return this.positions;
  }

  setViewportAll(container?: HTMLElement | null): ViewportPositions {
    this.positions.top = container ? container.scrollTop : window.scrollY;
    this.positions.height = container
      ? container.clientHeight
      : document.documentElement.clientHeight;
    return this.positions;
  }
}

export const viewport = new Viewport();

interface ViewportPositions {
	top: number;
	bottom: number;
	height: number;
}

class Viewport {
	positions: ViewportPositions = { top: 0, bottom: 0, height: 0 };

	setViewportTop(container?: HTMLElement | null): ViewportPositions {
		this.positions.top = container ? container.scrollTop : window.scrollY;
		return this.positions;
	}

	setViewportBottom(): ViewportPositions {
		this.positions.bottom = this.positions.top + this.positions.height;
		return this.positions;
	}

	setViewportAll(container?: HTMLElement | null): ViewportPositions {
		this.positions.top = container ? container.scrollTop : window.scrollY;
		this.positions.height = container
			? container.clientHeight
			: document.documentElement.clientHeight;
		this.positions.bottom = this.positions.top + this.positions.height;
		return this.positions;
	}
}

export const viewport = new Viewport();
export default viewport;

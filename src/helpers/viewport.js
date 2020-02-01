class Viewport {
    constructor() {
        this.positions = {
            top: 0,
            bottom: 0,
            height: 0,
        };
    }

    setViewportTop(container) {
        // if this is a custom container, user the scrollTop
        this.positions.top = container ? container.scrollTop : window.pageYOffset;
        return this.positions;
    }

    setViewportBottom() {
        this.positions.bottom = this.positions.top + this.positions.height;
        return this.positions;
    }

    setViewportAll(container) {
        // if this is a custom container, user the scrollTop
        this.positions.top = container ? container.scrollTop : window.pageYOffset;
        // if this is a custom container, get the height from the custom container itself
        this.positions.height = container ? container.clientHeight : document.documentElement.clientHeight;
        this.positions.bottom = this.positions.top + this.positions.height;

        return this.positions;
    }
}

export const viewport = new Viewport();
export { viewport as default };

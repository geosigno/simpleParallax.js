class Viewport {
    constructor() {
        this.positions = {
            top: 0,
            bottom: 0,
            height: 0
        };
    }

    setViewportTop() {
        this.positions.top = window.pageYOffset;
        return this.positions;
    }

    setViewportBottom() {
        this.positions.bottom = this.positions.top + this.positions.height;
        return this.positions;
    }

    setViewportHeight() {
        this.positions.height = document.documentElement.clientHeight;
        return this.positions;
    }

    setViewportAll() {
        this.positions.top = window.pageYOffset;
        this.positions.bottom = this.positions.top + this.positions.height;
        this.positions.height = document.documentElement.clientHeight;
        return this.positions;
    }
}

export default Viewport;

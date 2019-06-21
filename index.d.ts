declare module 'simple-parallax-js' {
    interface IParallaxSettings {
        orientation?: 'up' | 'down' | 'left' | 'right';
        scale?: number;
        overflow?: boolean;
        delay?: number;
        transition?: string;
        breakpoint?: number;
    }

    export default class SimpleParallax {
        constructor(images: Element | Element[], settings?: IParallaxSettings);
        public destroy: () => void;
    }
}

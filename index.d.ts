declare module 'simple-parallax-js' {
    interface IParallaxSettings {
        orientation?: 'up' | 'down' | 'left' | 'right';
        scale?: number;
        overflow?: boolean;
        delay?: number;
        transition?: string;
        breakpoint?: number;
        customContainer?: boolean | string | HTMLElement;
        customWrapper?: boolean | string | HTMLElement;
        maxTransition?: number;

    }

    export default class SimpleParallax {
        constructor(images: Element | Element[], settings?: IParallaxSettings);
        public refresh: () => void;
        public destroy: () => void;
    }
}

declare module 'simple-parallax-js' {
    interface IParallaxSettings {
        orientation?: 'up' | 'down' | 'left' | 'right';
        scale?: number;
        overflow?: boolean;
        delay?: number;
        transition?: string;
        breakpoint?: number;
        customContainer?: string | HTMLElement;
        customWrapper?: string;
        maxTransition?: number;
    }

    export default class SimpleParallax {
        constructor(images: Element | Element[] | HTMLCollectionOf<Element>, settings?: IParallaxSettings);
        public refresh: () => void;
        public destroy: () => void;
    }
}
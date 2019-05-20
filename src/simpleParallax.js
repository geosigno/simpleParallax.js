import Viewport from './helpers/viewport';
export const viewport = new Viewport();

import ParallaxInstance from './instances/parallax';

let isInit = false,
    instances = [],
    instancesLength,
    frameID;

export default class SimpleParallax {
    constructor(elements, options) {
        this.elements = typeof elements !== 'undefined' && NodeList.prototype.isPrototypeOf(elements) ? elements : [elements];
        this.defaults = {
            delay: 0.6,
            orientation: 'up',
            scale: 1.3,
            overflow: false,
            transition: 'cubic-bezier(0,0,0,1)',
            breakpoint: false
        };
        this.settings = Object.assign(this.defaults, options);

        //check if breakpoint is set and superior to user browser width
        if (this.settings.breakpoint && document.documentElement.clientWidth <= this.settings.breakpoint) {
            return;
        }

        this.lastPosition = -1;

        //this.init = this.init.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.proceedRequestAnimationFrame = this.proceedRequestAnimationFrame.bind(this);

        this.init();
    }

    init() {
        viewport.setViewportAll();

        for (let i = this.elements.length - 1; i >= 0; i--) {
            let instance = new ParallaxInstance(this.elements[i], this.settings);
            instances.push(instance);
        }

        //update the instance length
        instancesLength = instances.length;

        //only if this is the first simpleParallax init
        if (!isInit) {
            //init the frame
            this.proceedRequestAnimationFrame();

            window.addEventListener('resize', this.handleResize);

            isInit = true;
        }
    }

    //when resize, some coordonates need to be re-calculate
    handleResize() {
        //re-get all the viewport positions
        viewport.setViewportAll();

        if (this.settings.breakpoint && document.documentElement.clientWidth <= this.settings.breakpoint) {
            this.destroy();
        }

        for (let i = instancesLength - 1; i >= 0; i--) {
            //re-get the current element offset
            instances[i].getElementOffset();

            //re-get the range if the current element
            instances[i].getRangeMax();
        }
    }

    //animation frame
    proceedRequestAnimationFrame() {
        //get the offset top of the viewport
        viewport.setViewportTop();

        if (this.lastPosition === viewport.positions.top) {
            //if last position if the same than the curent one
            //callback the animationFrame and exit the current loop
            frameID = window.requestAnimationFrame(this.proceedRequestAnimationFrame);

            return;
        }

        //get the offset bottom of the viewport
        viewport.setViewportBottom();

        //proceed with the current element
        for (let i = instancesLength - 1; i >= 0; i--) {
            this.proceedElement(instances[i]);
        }

        //callback the animationFrame
        frameID = window.requestAnimationFrame(this.proceedRequestAnimationFrame);

        //store the last position
        this.lastPosition = viewport.positions.top;
    }

    //proceed the element
    proceedElement(instance) {
        if (!instance.isVisible) {
            return;
        }

        //if percentage is equal to the last one, no need to continue
        if (!instance.getTranslateValue()) {
            return;
        }

        //animate the image
        instance.animate();
    }

    destroy() {
        let instancesToDestroy = [];

        //get all instance indexes that need to be destroyed
        for (let i = instancesLength - 1; i >= 0; i--) {
            for (let j = this.elements.length - 1; j >= 0; j--) {
                if (instances[i].element === this.elements[j]) {
                    instancesToDestroy.push(i);
                    break;
                }
            }
        }

        for (let i = 0; i < instancesToDestroy.length; i++) {
            let instanceToDestroy = instancesToDestroy[i];

            //remove all style added from simpleParallax
            instances[instanceToDestroy].unSetStyle();

            if (this.settings.overflow === false) {
                //if overflow option is set to false
                //unwrap the element from .simpleParallax wrapper container
                instances[instanceToDestroy].unWrapElement();
            }

            //remove the instance to destroy from the instance array
            instances = instances.slice(0, instanceToDestroy).concat(instances.slice(instanceToDestroy + 1, instances.length));
        }

        //update the instance length var
        instancesLength = instances.length;

        //if no instances left, remove the raf and resize event = simpleParallax fully destroyed
        if (!instancesLength) {
            //cancel the animation frame
            window.cancelAnimationFrame(frameID);

            //detach the resize event
            window.removeEventListener('resize', this.handleResize);
        }
    }
}

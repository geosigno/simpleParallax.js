import { viewport } from './helpers/viewport';
import convertToArray from './helpers/convertToArray';

import ParallaxInstance from './instances/parallax';

let intersectionObserverAvailable = true;
let isInit = false;
let instances = [];
let instancesLength;
let frameID;
let resizeID;

export default class SimpleParallax {
    constructor(elements, options) {
        if (!elements) return;
        this.elements = convertToArray(elements);
        this.defaults = {
            delay: 0.4,
            orientation: 'up',
            scale: 1.3,
            overflow: false,
            transition: 'cubic-bezier(0,0,0,1)',
            customContainer: false,
            maxTransition: 0,
        };

        this.settings = Object.assign(this.defaults, options);

        // check if the browser handle the Intersection Observer API
        if (!('IntersectionObserver' in window)) intersectionObserverAvailable = false;

        if (this.settings.customContainer) {
            console.log(convertToArray(this.settings.customContainer)[0]);
            this.customContainer = convertToArray(this.settings.customContainer)[0];
        }

        this.lastPosition = -1;

        this.resizeIsDone = this.resizeIsDone.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.proceedRequestAnimationFrame = this.proceedRequestAnimationFrame.bind(this);

        this.init();
    }

    init() {
        viewport.setViewportAll(this.customContainer);

        instances = [...this.elements.map((element) => new ParallaxInstance(element, this.settings)), ...instances];

        // update the instance length
        instancesLength = instances.length;

        // only if this is the first simpleParallax init
        if (!isInit) {
            // init the frame
            this.proceedRequestAnimationFrame();

            window.addEventListener('resize', this.resizeIsDone);

            isInit = true;
        }
    }

    // wait for resize to be completely done
    resizeIsDone() {
        clearTimeout(resizeID);
        resizeID = setTimeout(this.handleResize, 500);
    }

    // handle the resize process, some coordonates need to be re-calculate
    handleResize() {
        // re-get all the viewport positions
        viewport.setViewportAll(this.customContainer);

        for (let i = instancesLength - 1; i >= 0; i--) {
            // re-get the current element offset
            instances[i].getElementOffset();

            // re-get the range if the current element
            instances[i].getRangeMax();
        }

        // force the request animation frame to fired
        this.lastPosition = -1;
    }

    // animation frame
    proceedRequestAnimationFrame() {
        // get the offset top of the viewport
        viewport.setViewportTop(this.customContainer);

        if (this.lastPosition === viewport.positions.top) {
            // if last position if the same than the curent one
            // callback the animationFrame and exit the current loop
            frameID = window.requestAnimationFrame(this.proceedRequestAnimationFrame);

            return;
        }

        // get the offset bottom of the viewport
        viewport.setViewportBottom();

        // proceed with the current element
        for (let i = instancesLength - 1; i >= 0; i--) {
            this.proceedElement(instances[i]);
        }

        // callback the animationFrame
        frameID = window.requestAnimationFrame(this.proceedRequestAnimationFrame);

        // store the last position
        this.lastPosition = viewport.positions.top;
    }

    // proceed the element
    proceedElement(instance) {
        let isVisible = false;

        // is not support for Intersection Observer API
        // or if this is a custom container
        // use old function to check if element visible
        if (!intersectionObserverAvailable || this.customContainer) {
            isVisible = instance.checkIfVisible();
            // if support
            // use response from Intersection Observer API Callback
        } else {
            isVisible = instance.isVisible;
        }

        // if element not visible, stop it
        if (!isVisible) return;

        // if percentage is equal to the last one, no need to continue
        if (!instance.getTranslateValue()) {
            return;
        }

        // animate the image
        instance.animate();
    }

    destroy() {
        const instancesToDestroy = [];

        // remove all instances that need to be destroyed from the instances array
        instances = instances.filter((instance) => {
            if (this.elements.includes(instance.element)) {
                // push instance that need to be destroyed into instancesToDestroy
                instancesToDestroy.push(instance);
                return false;
            }
            return instance;
        });

        for (let i = instancesToDestroy.length - 1; i >= 0; i--) {
            // unset style
            instancesToDestroy[i].unSetStyle();

            if (this.settings.overflow === false) {
                // if overflow option is set to false
                // unwrap the element from .simpleParallax wrapper container
                instancesToDestroy[i].unWrapElement();
            }
        }

        // update the instance length var
        instancesLength = instances.length;

        // if no instances left, remove the raf and resize event = simpleParallax fully destroyed
        if (!instancesLength) {
            // cancel the animation frame
            window.cancelAnimationFrame(frameID);

            // detach the resize event
            window.removeEventListener('resize', this.handleResize);
        }
    }
}

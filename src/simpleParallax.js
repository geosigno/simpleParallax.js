import isSupportedBrowser from './helpers/isSupportedBrowser';
import { viewport } from './helpers/viewport';
import convertToArray from './helpers/convertToArray';

import ParallaxInstance from './instances/parallax';

let isInit = false;
let instances = [];
let frameID;
let resizeID;

export default class SimpleParallax {
    constructor(elements, options) {
        if (!elements) return;

        // check if the browser support simpleParallax
        if (!isSupportedBrowser()) return;

        this.elements = convertToArray(elements);
        this.defaults = {
            delay: 0,
            orientation: 'up',
            scale: 1.3,
            overflow: false,
            transition: 'cubic-bezier(0,0,0,1)',
            customContainer: '',
            customWrapper: '',
            maxTransition: 0
        };

        this.settings = Object.assign(this.defaults, options);

        if (this.settings.customContainer) {
            [this.customContainer] = convertToArray(this.settings.customContainer);
        }

        this.lastPosition = -1;

        this.resizeIsDone = this.resizeIsDone.bind(this);
        this.refresh = this.refresh.bind(this);
        this.proceedRequestAnimationFrame = this.proceedRequestAnimationFrame.bind(this);

        this.init();
    }

    init() {
        viewport.setViewportAll(this.customContainer);

        instances = [...this.elements.map((element) => new ParallaxInstance(element, this.settings)), ...instances];

        // update the instance length
        // instancesLength = instances.length;

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
        resizeID = setTimeout(this.refresh, 200);
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
        instances.forEach((instance) => {
            this.proceedElement(instance);
        });

        // callback the animationFrame
        frameID = window.requestAnimationFrame(this.proceedRequestAnimationFrame);

        // store the last position
        this.lastPosition = viewport.positions.top;
    }

    // proceed the element
    proceedElement(instance) {
        let isVisible = false;

        // if this is a custom container
        // use old function to check if element visible
        if (this.customContainer) {
            isVisible = instance.checkIfVisible();
            // else, use response from Intersection Observer API Callback
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

    refresh() {
        // re-get all the viewport positions
        viewport.setViewportAll(this.customContainer);

        instances.forEach((instance) => {
            // re-get the current element offset
            instance.getElementOffset();

            // re-get the range if the current element
            instance.getRangeMax();
        });

        // force the request animation frame to fired
        this.lastPosition = -1;
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

        instancesToDestroy.forEach((instance) => {
            // unset style
            instance.unSetStyle();

            if (this.settings.overflow === false) {
                // if overflow option is set to false
                // unwrap the element from .simpleParallax wrapper container
                instance.unWrapElement();
            }
        });

        // if no instances left, remove the raf and resize event = simpleParallax fully destroyed
        if (!instances.length) {
            // cancel the animation frame
            window.cancelAnimationFrame(frameID);

            // detach the resize event
            window.removeEventListener('resize', this.refresh);

            // Reset isInit
            isInit = false;
        }
    }
}

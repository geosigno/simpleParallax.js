import { DEFAULTS } from "../core/constants";
import {
  onReducedMotionChange,
  prefersReducedMotion,
} from "../shared/reduced-motion";
import convertToArray from "./helpers/convert-to-array";
import isSupportedBrowser from "./helpers/is-supported-browser";
import { viewport } from "./helpers/viewport";

import ParallaxInstance from "./instances/parallax";

let isInit = false;
let instances: ParallaxInstance[] = [];
let frameID: number;
let resizeID: ReturnType<typeof setTimeout>;

export default class SimpleParallax {
  prefersReducedMotion = false;
  unsubscribeReducedMotion?: () => void;
  elements: Element[] = [];
  settings!: ParallaxInstance["settings"];
  customContainer?: Element;
  lastPosition = -1;

  constructor(
    elements: string | Element | NodeList | HTMLCollection | Element[],
    options?: Partial<ParallaxInstance["settings"]>
  ) {
    if (!elements) {
      return;
    }

    // check if the browser support simpleParallax
    if (!isSupportedBrowser()) {
      return;
    }

    // Check if user prefers reduced motion
    this.prefersReducedMotion = prefersReducedMotion();

    // React to changes of the reduced motion preference
    this.unsubscribeReducedMotion = onReducedMotionChange((reduced) => {
      this.prefersReducedMotion = reduced;

      if (reduced) {
        // If user now prefers reduced motion, remove all parallax effects
        this.destroy();
      } else {
        // If user no longer prefers reduced motion, reinitialize
        this.init();
      }
    });

    // If reduced motion is preferred, don't initialize parallax effects
    if (this.prefersReducedMotion) {
      return;
    }

    this.elements = convertToArray(elements);

    this.settings = {
      ...DEFAULTS,
      customContainer: "",
      customWrapper: "",
      ...options,
    };

    if (this.settings.customContainer) {
      [this.customContainer] = convertToArray(this.settings.customContainer);
    }

    this.lastPosition = -1;

    this.resizeIsDone = this.resizeIsDone.bind(this);
    this.refresh = this.refresh.bind(this);
    this.proceedRequestAnimationFrame =
      this.proceedRequestAnimationFrame.bind(this);

    this.init();
  }

  init() {
    // Don't initialize if reduced motion is preferred
    if (this.prefersReducedMotion) {
      return;
    }

    viewport.setViewportAll(this.customContainer as HTMLElement | undefined);

    instances = [
      ...this.elements.map(
        (element) =>
          new ParallaxInstance(
            element as HTMLElement,
            this.settings,
            this.prefersReducedMotion
          )
      ),
      ...instances,
    ];

    // only if this is the first simpleParallax init
    if (!isInit) {
      // init the frame
      this.proceedRequestAnimationFrame();

      window.addEventListener("resize", this.resizeIsDone);

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
    viewport.setViewportTop(this.customContainer as HTMLElement | undefined);

    if (this.lastPosition === viewport.positions.top) {
      // if last position if the same than the curent one
      // callback the animationFrame and exit the current loop
      frameID = window.requestAnimationFrame(this.proceedRequestAnimationFrame);

      return;
    }

    // get the offset bottom of the viewport
    viewport.setViewportBottom();

    // proceed with the current element
    for (const instance of instances) {
      this.proceedElement(instance);
    }

    // callback the animationFrame
    frameID = window.requestAnimationFrame(this.proceedRequestAnimationFrame);

    // store the last position
    this.lastPosition = viewport.positions.top;
  }

  // proceed the element
  proceedElement(instance: ParallaxInstance) {
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
    if (!isVisible) {
      return;
    }

    // if percentage is equal to the last one, no need to continue
    if (!instance.getTranslateValue()) {
      return;
    }

    // animate the image
    instance.animate();
  }

  refresh() {
    // re-get all the viewport positions
    viewport.setViewportAll(this.customContainer as HTMLElement | undefined);

    for (const instance of instances) {
      // re-get the current element offset
      instance.getElementOffset();

      // re-get the range if the current element
      instance.getRangeMax();
    }

    // force the request animation frame to fired
    this.lastPosition = -1;
  }

  destroy() {
    // Remove reduced motion listener
    this.unsubscribeReducedMotion?.();

    const instancesToDestroy: ParallaxInstance[] = [];

    // remove all instances that need to be destroyed from the instances array
    instances = instances.filter((instance) => {
      if (this.elements?.includes(instance.element)) {
        // push instance that need to be destroyed into instancesToDestroy
        instancesToDestroy.push(instance);
        return false;
      }
      return true;
    });

    for (const instance of instancesToDestroy) {
      // unset style
      instance.unSetStyle();

      if (this.settings && this.settings.overflow === false) {
        // if overflow option is set to false
        // unwrap the element from .simpleParallax wrapper container
        instance.unWrapElement();
      }
    }

    // if no instances left, remove the raf and resize event = simpleParallax fully destroyed
    if (!instances.length) {
      // cancel the animation frame
      window.cancelAnimationFrame(frameID);

      // detach the resize event
      window.removeEventListener("resize", this.refresh);

      // Reset isInit
      isInit = false;
    }
  }
}

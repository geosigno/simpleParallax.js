import { DEFAULTS } from "../core/constants.js";
import {
  onReducedMotionChange,
  prefersReducedMotion,
} from "../shared/reduced-motion.js";
import convertToArray from "./helpers/convert-to-array.js";
import { viewport } from "./helpers/viewport.js";

import ParallaxInstance from "./instances/parallax.js";

let isInit = false;
let instances: ParallaxInstance[] = [];
let frameID: number;
let resizeID: ReturnType<typeof setTimeout>;
let lastFrameTime = 0;
// position de scroll de la frame précédente, et image encore en mouvement ?
let lastTop = -1;
let isAnimating = false;

export default class SimpleParallax {
  prefersReducedMotion = false;
  unsubscribeReducedMotion?: () => void;
  elements: Element[] = [];
  settings!: ParallaxInstance["settings"];
  customContainer?: Element;

  constructor(
    elements: string | Element | NodeList | HTMLCollection | Element[],
    options?: Partial<ParallaxInstance["settings"]>
  ) {
    if (!elements) {
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
  proceedRequestAnimationFrame(now = performance.now()) {
    const dt = now - lastFrameTime;
    lastFrameTime = now;

    // get the offset top of the viewport
    const { top } = viewport.setViewportTop(
      this.customContainer as HTMLElement | undefined
    );

    // au repos (pas de scroll, toutes les images posées) : rien à faire
    if (top !== lastTop || isAnimating) {
      lastTop = top;
      isAnimating = false;

      // met à jour la cible de chaque image puis la rapproche de celle-ci, même
      // hors écran, pour qu'elle termine son mouvement
      for (const instance of instances) {
        instance.getTranslateValue();

        if (instance.step(dt)) {
          instance.animate();
        }
        isAnimating ||= !instance.isSettled();
      }
    }

    // callback the animationFrame
    frameID = window.requestAnimationFrame(this.proceedRequestAnimationFrame);
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

    // force le recalcul des cibles à la prochaine frame
    lastTop = -1;
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
      window.removeEventListener("resize", this.resizeIsDone);

      // Reset isInit
      isInit = false;
    }
  }
}

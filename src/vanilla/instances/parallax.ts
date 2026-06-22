import {
  applyMaxTransition,
  getProgress,
  getRange,
  getTranslate,
} from "../../core/math";
import { buildTransform, buildTransition } from "../../core/transform";
import { isImageLoaded } from "../../shared/image-loaded";
import cssTransform from "../helpers/css-transform";
import { viewport } from "../helpers/viewport";

class ParallaxInstance {
  element: HTMLElement;
  elementContainer: HTMLElement;
  settings: import("../../core/types").ParallaxOptions & {
    customContainer?: string | HTMLElement;
    customWrapper?: string;
  };
  isVisible = true;
  isInit = false;
  oldTranslateValue = -1;
  oldProgress?: number;
  translateValue = 0;
  rangeMax: number | null = null;
  elementHeight = 0;
  elementTop = 0;
  elementBottom = 0;
  prefersReducedMotion: boolean;
  customWrapper: HTMLElement | null;
  observer?: IntersectionObserver;

  constructor(
    element: HTMLElement,
    options: ParallaxInstance["settings"],
    prefersReducedMotion = false
  ) {
    // set the element & settings
    this.element = element;
    this.elementContainer = element;
    this.settings = options;
    this.isVisible = true;
    this.isInit = false;
    this.oldTranslateValue = -1;
    this.prefersReducedMotion = prefersReducedMotion;

    this.init = this.init.bind(this);

    this.customWrapper =
      this.settings.customWrapper &&
      this.element.closest(this.settings.customWrapper)
        ? (this.element.closest(this.settings.customWrapper) as HTMLElement)
        : null;

    // Don't initialize if reduced motion is preferred
    if (this.prefersReducedMotion) {
      return;
    }

    // check if images has not been loaded yet
    if (isImageLoaded(element)) {
      this.init();
    } else {
      this.element.addEventListener("load", () => {
        // timeout to ensure the image is fully loaded into the DOM
        setTimeout(() => {
          this.init(true);
        }, 50);
      });
    }
  }

  init(asyncInit?: boolean) {
    // Don't initialize if reduced motion is preferred
    if (this.prefersReducedMotion) {
      return;
    }

    // for some reason, <picture> are init an infinite time on windows OS
    if (this.isInit) {
      return;
    }

    if (asyncInit) {
      // in case the image is lazy loaded, the rangemax should be cleared
      // so it will be updated in the next getTranslateValue()
      this.rangeMax = null;
    }

    // check if element has not been already initialized with simpleParallax
    if (this.element.closest(".simpleParallax")) {
      return;
    }

    if (this.settings.overflow === false) {
      // if overflow option is set to false
      // wrap the element into a div to apply overflow
      this.wrapElement();
    }

    // apply the transform style on the image
    this.setTransformCSS();

    // get the current element offset
    this.getElementOffset();

    // init the Intesection Observer
    this.intersectionObserver();

    // get its translated value
    this.getTranslateValue();

    // apply its translation even if not visible for the first init
    this.animate();

    // if a delay has been set
    if (this.settings.delay > 0) {
      // apply a timeout to avoid buggy effect
      setTimeout(() => {
        // apply the transition style on the image
        this.setTransitionCSS();

        //add isInit class
        this.elementContainer.classList.add("simple-parallax-initialized");
      }, 10);
    } else {
      //add isInit class
      this.elementContainer.classList.add("simple-parallax-initialized");
    }

    // for some reason, <picture> are init an infinite time on windows OS
    this.isInit = true;
  }

  // if overflow option is set to false
  // wrap the element into a .simpleParallax div and apply overflow hidden to hide the image excedant (result of the scale)
  wrapElement() {
    // check is current image is in a <picture> tag
    const elementToWrap = this.element.closest("picture") || this.element;

    // create a .simpleParallax wrapper container
    // if there is a custom wrapper
    // override the wrapper with it
    const wrapper: HTMLElement =
      this.customWrapper || document.createElement("div");

    wrapper.classList.add("simpleParallax");
    wrapper.style.overflow = "hidden";

    // append the image inside the new wrapper
    if (!this.customWrapper) {
      elementToWrap.parentNode?.insertBefore(wrapper, elementToWrap);
      wrapper.appendChild(elementToWrap);
    }

    this.elementContainer = wrapper;
  }

  // unwrap the element from .simpleParallax wrapper container
  unWrapElement() {
    const wrapper = this.elementContainer;

    // if there is a custom wrapper, we jusy need to remove the class and style
    if (this.customWrapper) {
      wrapper.classList.remove("simpleParallax");
      wrapper.style.overflow = "";
    } else {
      wrapper.replaceWith(...wrapper.childNodes);
    }
  }

  // apply default style on element
  setTransformCSS() {
    if (this.settings.overflow === false) {
      // if overflow option is set to false
      // add scale style so the image can be translated without getting out of its container
      (this.element.style as CSSStyleDeclaration & Record<string, string>)[
        cssTransform
      ] = `scale(${this.settings.scale})`;
    }

    // add will-change CSS property to improve perfomance
    this.element.style.willChange = "transform";
  }

  // apply the transition effect
  setTransitionCSS() {
    // add transition option
    this.element.style.transition = buildTransition(
      this.settings.delay,
      this.settings.transition
    );
  }

  // remove style of the element
  unSetStyle() {
    // remove will change inline style
    this.element.style.willChange = "";
    (this.element.style as CSSStyleDeclaration & Record<string, string>)[
      cssTransform
    ] = "";
    this.element.style.transition = "";
  }

  // get the current element offset
  getElementOffset() {
    // get position of the element
    const positions = this.elementContainer.getBoundingClientRect();
    // get height
    this.elementHeight = positions.height;
    // get offset top
    this.elementTop = positions.top + viewport.positions.top;
    // if there is a custom container
    if (this.settings.customContainer) {
      // we need to do some calculation to get the position from the parent rather than the viewport
      const parentPositions = (
        this.settings.customContainer as HTMLElement
      ).getBoundingClientRect();
      this.elementTop =
        positions.top - parentPositions.top + viewport.positions.top;
    }
    // get offset bottom
    this.elementBottom = this.elementHeight + this.elementTop;
  }

  // build the Threshold array to cater change for every pixel scrolled
  buildThresholdList() {
    const thresholds: number[] = [];
    for (let i = 1.0; i <= this.elementHeight; i++) {
      const ratio = i / this.elementHeight;
      thresholds.push(ratio);
    }
    return thresholds;
  }

  // create the Intersection Observer
  intersectionObserver() {
    const options = {
      root: null,
      threshold: this.buildThresholdList(),
    };
    this.observer = new IntersectionObserver(
      this.intersectionObserverCallback.bind(this),
      options
    );
    this.observer.observe(this.element);
  }

  // Intersection Observer Callback to set the element at visible state or not
  intersectionObserverCallback(entries: IntersectionObserverEntry[]) {
    for (const entry of entries) {
      this.isVisible = entry.isIntersecting;
    }
  }

  // check if the current element is visible in the Viewport
  // for browser that not support Intersection Observer API
  checkIfVisible() {
    return (
      this.elementBottom > viewport.positions.top &&
      this.elementTop < viewport.positions.bottom
    );
  }

  // calculate the range between image will be translated
  getRangeMax() {
    // range basé sur la hauteur réelle de l'image (sans scale)
    this.rangeMax = getRange(this.element.clientHeight, this.settings.scale);
  }

  // get the percentage and the translate value to apply on the element
  getTranslateValue() {
    // top viewport-relatif, dérivé du cache (pas de getBoundingClientRect par frame)
    const top = this.elementTop - viewport.positions.top;
    const progress = applyMaxTransition(
      getProgress(top, viewport.positions.height, this.elementHeight),
      this.settings.maxTransition
    );

    if (this.oldProgress === progress) {
      return false;
    }

    if (!this.rangeMax) {
      this.getRangeMax();
    }

    this.translateValue = getTranslate(progress, this.rangeMax ?? 0);

    if (this.oldTranslateValue === this.translateValue) {
      return false;
    }

    this.oldProgress = progress;
    this.oldTranslateValue = this.translateValue;

    return true;
  }

  // animate the image
  animate() {
    (this.element.style as CSSStyleDeclaration & Record<string, string>)[
      cssTransform
    ] = buildTransform(
      this.translateValue,
      this.settings.orientation,
      this.settings.scale,
      this.settings.overflow
    );
  }
}

export default ParallaxInstance;

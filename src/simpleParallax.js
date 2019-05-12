import cssTransform from './helpers/cssTransform';

//global variables
let instances = [],
    lastPosition = -1,
    viewportTop,
    viewportBottom,
    viewportHeight,
    frameID,
    parallaxActive = false;

class Parallax {
    constructor(element, options) {
        //set the element & settings
        this.element = element;
        this.elementContainer = element;
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

        this.init = this.init.bind(this);
        this.animationFrame = this.animationFrame.bind(this);
        this.handleResize = this.handleResize.bind(this);

        this.isVisible = false;

        //check if images has not been loaded yet
        if (this.isImageLoaded(this.element)) {
            this.init();
        } else {
            this.element.addEventListener('load', this.init);
        }

        //push the instance into the array of all instances
        instances.push(this);

        // Only do this once for all instances
        if (!parallaxActive) {
            parallaxActive = true;
            //get the document height
            this.getViewportOffsetHeight();

            //proceed with the loop
            this.animationFrame();
        }
    }

    init() {
        //return is instance already init
        if (this.isInit) return;

        if (this.settings.overflow === false) {
            //if overflow option is set to false
            //wrap the element into a div to apply overflow
            this.wrapElement();
        }

        //apply the default style on the image
        this.setStyle();

        //get the current element offset
        this.getElementOffset();

        //init the Intesection Observer
        this.intersectionObserver();

        //get its translated value
        this.getTranslateValue();

        //apply its translation even if not visible for the first init
        this.animate();

        window.addEventListener('resize', this.handleResize);

        this.isInit = true;
    }

    //check if image is fully loaded
    isImageLoaded() {
        //check if image has been fully loaded
        if (!this.element.complete) {
            return false;
        }

        //check if the image is displayed
        if (typeof this.element.naturalWidth !== 'undefined' && this.element.naturalWidth === 0) {
            return false;
        }

        return true;
    }

    buildThresholdList() {
        let thresholds = [];
        for (var i = 1.0; i <= this.elementHeight; i++) {
            let ratio = i / this.elementHeight;
            thresholds.push(ratio);
        }
        return thresholds;
    }

    intersectionObserver() {
        const options = {
            root: null,
            threshold: this.buildThresholdList()
        };
        this.observer = new IntersectionObserver(this.intersectionObserverCallback.bind(this), options);
        this.observer.observe(this.element);
    }

    intersectionObserverCallback(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.isVisible = true;
            } else {
                this.isVisible = false;
            }
        });
    }

    // if overflow option is set to false
    // wrap the element into a .simpleParallax div and apply overflow hidden to hide the image excedant (result of the scale)
    wrapElement() {
        //check is current image is in a <picture> tag
        let element = this.element.closest('picture') || this.element;

        // create a .simpleParallax wrapper container
        const wrapper = document.createElement('div');
        wrapper.classList.add('simpleParallax');
        wrapper.style.overflow = 'hidden';

        //append the image inside the new wrapper
        element.parentNode.insertBefore(wrapper, element);
        wrapper.appendChild(element);

        //set the container for calculation
        this.elementContainer = wrapper;
    }

    //unwrap the element from .simpleParallax wrapper container
    unWrapElement() {
        // get .simpleParallax wrapper container
        let parent = this.elementContainer.parentNode;

        // If the parent doesn't exist then the
        // image no longer exists in the DOM
        // e.g. a SPA `destroy()`ing the
        // instance after changing the route.
        if (!parent) return;

        // move all children out of .simpleParallax wrapper container
        while (this.elementContainer.firstChild) {
            parent.insertBefore(this.elementContainer.firstChild, this.elementContainer);
        }

        // remove .simpleParallax wrapper container
        parent.removeChild(this.elementContainer);
    }

    //apply default style on element
    setStyle() {
        if (this.settings.overflow === false) {
            //if overflow option is set to false
            //add scale style so the image can be translated without getting out of its container
            this.element.style[cssTransform] = 'scale(' + this.settings.scale + ')';
        }

        if (this.settings.delay > 0) {
            //if delay option is set to true
            //add transition option
            this.element.style.transition = 'transform ' + this.settings.delay + 's ' + this.settings.transition;
        }

        //add will-change CSS property to improve perfomance
        this.element.style.willChange = 'transform';
    }

    //remove style of the element
    unSetStyle() {
        //remove will change inline style
        this.element.style.willChange = '';
        this.element.style[cssTransform] = '';
        this.element.style.transition = '';
    }

    //get the current element offset
    getElementOffset() {
        //get position of the element
        let pos = this.elementContainer.getBoundingClientRect();
        //get height
        this.elementHeight = pos.height;
        //get offset top
        this.elementTopX = pos.top + window.pageYOffset;
    }

    //get the viewport offset top
    getViewportOffsetTop() {
        viewportTop = window.pageYOffset;
    }

    //get other viewport height
    getViewportOffsetHeight() {
        viewportHeight = document.documentElement.clientHeight;
    }

    //get other viewport offset bottom
    getViewportOffsetBottom() {
        viewportBottom = viewportTop + viewportHeight;
    }

    handleResize() {
        //when resize, some coordonates need to be re-calculate
        //re-get the document height
        this.getViewportOffsetHeight();

        //re-get the current element offset
        this.getElementOffset();

        //re-get the range if the current element
        this.getRangeMax();
    }

    //calculate the range between image will be translated
    getRangeMax() {
        //get the real height of the image without scale
        let elementImageHeight = this.element.clientHeight;

        //range is calculate with the image height by the scale
        this.rangeMax = elementImageHeight * this.settings.scale - elementImageHeight;

        //if orientation option is down or right
        //inverse the range max to translate in the other way
        if (this.settings.orientation === 'down' || this.settings.orientation === 'right') {
            this.rangeMax *= -1;
        }
    }

    //get the percentage and the translate value to apply on the element
    getTranslateValue() {
        //calculate the % position of the element comparing to the viewport
        //rounding percentage to a 1 number float to avoid unn unnecessary calculation
        let percentage = ((viewportBottom - this.elementTopX) / ((viewportHeight + this.elementHeight) / 100)).toFixed(1);

        //sometime the percentage exceeds 100 or goes below 0
        percentage = Math.min(100, Math.max(0, percentage));

        //sometime the same percentage is returned
        //if so we don't do aything
        if (this.oldPercentage === percentage) {
            return false;
        }

        //if not range max is set, recalculate it
        if (!this.rangeMax) {
            this.getRangeMax();
        }

        //transform this % into the max range of the element
        //rounding translateValue to a non float int - as minimum pixel for browser to render is 1 (no 0.5)
        this.translateValue = ((percentage / 100) * this.rangeMax - this.rangeMax / 2).toFixed(0);

        //sometime the same translate value is returned
        //if so we don't do aything
        if (this.oldTranslateValue === this.translateValue) {
            return false;
        }
        //store the current percentage
        this.oldPercentage = percentage;
        this.oldTranslateValue = this.translateValue;

        return true;
    }

    //animate the image
    animate() {
        let translateValueY = 0,
            translateValueX = 0,
            inlineCss;

        if (this.settings.orientation === 'left' || this.settings.orientation === 'right') {
            //if orientation option is left or right
            //use horizontal axe - X axe
            translateValueX = this.translateValue + 'px';
        } else {
            //if orientation option is left or right
            //use vertical axe - Y axe
            translateValueY = this.translateValue + 'px';
        }

        //set style to apply to the element
        if (this.settings.overflow === false) {
            //if overflow option is set to false
            //add the scale style
            inlineCss = 'translate3d(' + translateValueX + ', ' + translateValueY + ', 0) scale(' + this.settings.scale + ')';
        } else {
            inlineCss = 'translate3d(' + translateValueX + ', ' + translateValueY + ', 0)';
        }

        //add style on the element using the adequate CSS transform
        this.element.style[cssTransform] = inlineCss;
    }

    //proceed the element
    proceedElement(element) {
        if (!element.isVisible) {
            return;
        }

        //if percentage is equal to the last one, no need to continue
        if (!element.getTranslateValue()) {
            return;
        }

        //animate the image
        element.animate();
    }

    //animation frame
    animationFrame() {
        //get the offset top of the viewport
        this.getViewportOffsetTop();

        if (lastPosition === viewportTop) {
            //if last position if the same than the curent one
            //callback the animationFrame and exit the current loop
            frameID = window.requestAnimationFrame(this.animationFrame);

            return;
        }

        //get the offset bottom of the viewport
        this.getViewportOffsetBottom();

        //proceed with the current element
        for (let i = 0; i < instances.length; i++) {
            this.proceedElement(instances[i]);
        }

        //callback the animationFrame
        frameID = window.requestAnimationFrame(this.animationFrame);

        //store the last position
        lastPosition = viewportTop;
    }

    // Returns true if the instance has been destroyed.
    get isDestroyed() {
        return instances.indexOf(this) === -1;
    }

    //destroy the simpleParallax instance
    destroy() {
        // Make sure we don't re-destroy an instance.
        if (this.isDestroyed) return;

        //remove all style added from simpleParallax
        this.unSetStyle();

        if (this.settings.overflow === false) {
            //if overflow option is set to false
            //unwrap the element from .simpleParallax wrapper container
            this.unWrapElement();
        }

        // Remove this instance from the array
        instances.splice(instances.indexOf(this), 1);

        // If there aren't any more active parallax
        // images then we can clean up even more.
        if (!instances.length) {
            // Make sure that if `new simpleParallax()` is called
            // after this point that the animation frame will
            // restart.
            parallaxActive = false;

            //cancel the animation frame
            window.cancelAnimationFrame(frameID);
        }

        //detach the resize event
        window.removeEventListener('resize', this.handleResize);
    }
}

export default Parallax;

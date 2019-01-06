(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], function() {
            return factory(root);
        });
    } else if (typeof exports === 'object') {
        module.exports = factory(root);
    } else {
        root.simpleParallax = factory(root);
    }
})(typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this, function(window) {
    'use strict';

    // Detect css transform
    var cssTransform = (function() {
        var prefixes = 'transform webkitTransform mozTransform oTransform msTransform'.split(' '),
            cssTransform,
            i = 0;
        while (cssTransform === undefined) {
            cssTransform = document.createElement('div').style[prefixes[i]] != undefined ? prefixes[i] : undefined;
            i++;
        }
        return cssTransform;
    })();

    //requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
    //via: https://gist.github.com/paulirish/1579671
    (function() {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = function(callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function() {
                    callback(currTime + timeToCall);
                }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };

        if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
    })();

    //closest polyfill for IE 11
    //https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill
    if (!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
    }

    if (!Element.prototype.closest) {
        Element.prototype.closest = function(s) {
            var el = this;
            if (!document.documentElement.contains(el)) return null;
            do {
                if (el.matches(s)) return el;
                el = el.parentElement || el.parentNode;
            } while (el !== null && el.nodeType === 1);
            return null;
        };
    }

    function handle(element, options) {
        if (element.length) {
            for (var i = 0; i < element.length; i++) { 
                new SimpleParallax(element[i], options);
            }
        } else {
            new SimpleParallax(element, options);
        }
    }

    class SimpleParallax {
        constructor(element, options) {
            //set the element & settings
            this.element = element;
            this.elementContainer = element;
            this.lastPosition = -1;
            this.gap = 200;
            this.defaults = {
                delay: 0.6,
                orientation: 'up',
                scale: 1.3,
                overflow: false,
                transition: 'cubic-bezier(0,0,0,1)',
                breakpoint: false
            };
            this.settings = Object.assign(this.defaults, options);
            this.init = this.init.bind(this);
            this.animationFrame = this.animationFrame.bind(this);
            this.handleResize = this.handleResize.bind(this);

            //check if images has not been loaded yet
            if (this.isImageLoaded(this.element)) {
                this.init();
            } else {
                this.element.addEventListener('load', this.init);
            }
        }

        init() {
            if (this.settings.overflow === false) {
                //if overflow option is set to false
                //wrap the element into a div to apply overflow
                this.wrapElement();
            }

            //apply the default style on the image
            this.setStyle();

            //get the current element offset
            this.getElementOffset();

            //get the document height
            this.getViewportOffsetHeight();

            //proceed with the loop
            this.animationFrame();

            window.addEventListener('resize', this.handleResize);
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

        //check if the current element is visible in the Viewport
        isVisible() {
            // add a gap in order to translate the image before the user see the image
            // to avoid visible init translation
            return this.elementBottomX > this.viewportTop - this.gap && this.elementTopX < this.viewportBottom + this.gap;
        }

        // if overflow option is set to false
        // wrap the element into a .simpleParallax div and apply overflow hidden to hide the image excedant (result of the scale)
        wrapElement() {
            //check if image is inside a picture tag
            let elementToWrap = this.element.closest('picture') || this.element;

            // create a .simpleParallax wrapper container
            const wrapper = document.createElement('div');
            wrapper.classList.add('simpleParallax');
            wrapper.style.overflow = 'hidden';
            elementToWrap.parentNode.insertBefore(wrapper, elementToWrap);
            wrapper.appendChild(elementToWrap);

            //set the container for calculation
            this.elementContainer = wrapper;
        }

        //unwrap the element from .simpleParallax wrapper container
        unWrapElement() {
            // get .simpleParallax wrapper container
            let parent = this.elementContainer.parentNode;

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
            //get offset bottom
            this.elementBottomX = this.elementHeight + this.elementTopX;
        }

        //get the viewport offset top
        getViewportOffsetTop() {
            this.viewportTop = window.pageYOffset;
        }

        //get other viewport height
        getViewportOffsetHeight() {
            this.viewportHeight = document.documentElement.clientHeight;
        }

        //get other viewport offset bottom
        getViewportOffsetBottom() {
            this.viewportBottom = this.viewportTop + this.viewportHeight;
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
            let percentage = ((this.viewportBottom - this.elementTopX) / ((this.viewportHeight + this.elementHeight) / 100)).toFixed(1);

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
                inlineCss = 'scale(' + this.settings.scale + ') translate3d(' + translateValueX + ', ' + translateValueY + ', 0)';
            } else {
                inlineCss = 'translate3d(' + translateValueX + ', ' + translateValueY + ', 0)';
            }

            //add style on the element using the adequate CSS transform
            this.element.style[cssTransform] = inlineCss;
        }

        //proceed the element
        proceedElement() {
            //if element not visible, no need to continue
            if (!this.isVisible()) {
                return;
            }

            //if percentage is equal to the last one, no need to continue
            if (!this.getTranslateValue()) {
                return;
            }

            //animate the image
            this.animate();
        }

        //animation frame
        animationFrame() {
            //get the offset top of the viewport
            this.getViewportOffsetTop();

            if (this.lastPosition === this.viewportTop) {
                //if last position if the same than the curent one
                //callback the animationFrame and exit the current loop
                this.frameID = window.requestAnimationFrame(this.animationFrame);

                return;
            }

            //get the offset bottom of the viewport
            this.getViewportOffsetBottom();

            //proceed with the current element
            this.proceedElement();

            //callback the animationFrame
            this.frameID = window.requestAnimationFrame(this.animationFrame);

            //store the last position
            this.lastPosition = this.viewportTop;

        }

        //destroy the simpleParallax instance
        destroy() {

            //remove all style added from simpleParallax
            this.unSetStyle();

            if (this.settings.overflow === false) {
                //if overflow option is set to false
                //unwrap the element from .simpleParallax wrapper container
                this.unWrapElement();
            }

            //cancel the animation frame
            window.cancelAnimationFrame(this.frameID);

            //detach the resize event
            window.removeEventListener('resize', this.handleResize);
        }

    }

    return handle;
});

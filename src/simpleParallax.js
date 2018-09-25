(function(factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        factory(require('jquery'), window, document);
    } else {
        factory(jQuery, window, document);
    }
})(function($, window, document, undefined) {
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

    //simpleParallax PLUGIN
    var pluginName = 'simpleParallax',
        lastPosition = -1,
        gap = 200,
        length,
        //occurence array - will contains every occurence of simpleParallax
        occurence = [];

    function SimpleParallax(element, options) {
        var plugin = this;

        plugin.element = element;
        plugin.elementContainer = element;
        plugin.options = $.extend({}, $.fn.simpleParallax.defaults, options);

        //check if breakpoint is set and superior to user browser width
        if (plugin.options.breakpoint && document.documentElement.clientWidth <= plugin.options.breakpoint) {
            return;
        }

        //check if images has not been loaded yet
        if (plugin.checkImage(plugin.element)) {
            plugin.init();
        } else {
            plugin.element.addEventListener('load', plugin.init.bind(plugin));
        }
    }

    $.extend(SimpleParallax, {
        //get the viewport offset top
        getViewportOffsetTop: function() {
            this.viewportTop = window.pageYOffset;
        },

        //get other viewport height
        getViewportOffsetHeight: function() {
            this.viewportHeight = document.documentElement.clientHeight;
        },

        //get other viewport offset bottom
        getViewportOffsetBottom: function() {
            this.viewportBottom = SimpleParallax.viewportTop + SimpleParallax.viewportHeight;
        }
    });

    $.extend(SimpleParallax.prototype, {
        //initialization of elements
        init: function() {
            var plugin = this;

            if (plugin.isInit == true) return;

            if (plugin.options.overflow == false) {
                //if overflow option is set to false
                //wrap the element into a div to apply overflow
                plugin.wrapElement();
            }

            //store to 0 the axe that will not be use
            if (plugin.options.orientation == 'left' || plugin.options.orientation == 'right') {
                plugin.translateValueY = 0;
            } else {
                plugin.translateValueX = 0;
            }

            //apply the default style on the image
            plugin.setStyle();

            //get the current element offset
            plugin.getElementOffset();

            //push the current occurence into an array
            occurence.push(plugin);

            plugin.isInit = true;

            //check if this the last instance to init
            if (length == occurence.length) {
                //when all occurences have been initialized
                //add a resize event on the window
                plugin.bindEvent();

                //get the document height
                SimpleParallax.getViewportOffsetHeight();

                //proceed with the loop
                plugin.proceedLoop();
            }
        },

        //check if image is fully loaded
        checkImage: function() {

            var plugin = this;

            //check if image has been fully loaded
            if (!plugin.element.complete) {
                return false;
            }

            //check if the image is displayed
            if (typeof plugin.element.naturalWidth != 'undefined' && plugin.element.naturalWidth == 0) {
                return false;
            }

            return true;
        },

        //bind resize event
        bindEvent: function() {
            //when resize, some coordonates need to be re-calculate
            $(window).on('resize.simpleParallax', function() {
                setTimeout(function() {
                    //re-get the document height
                    SimpleParallax.getViewportOffsetHeight();

                    for (var i = 0; i < occurence.length; i++) {
                        //re-get the current element offset
                        occurence[i].getElementOffset();

                        //put the rangeMax at 0 to force a recalculation
                        occurence[i].calculateRange();
                    }
                }, 500);
            });
        },

        //if overflow option is set to false
        // wrap the element into a .simpleParallax div and apply overflow hidden to hide the image excedant (result of the scale)
        wrapElement: function() {
            var plugin = this;

            //check if image is inside a picture tag
            if (plugin.element.closest('picture')) {
                plugin.elementToWrap = plugin.element.closest('picture');
            } else {
                plugin.elementToWrap = plugin.element;
            }

            // create a .simpleParallax wrapper container
            var wrapper = document.createElement('div');
            wrapper.classList.add('simpleParallax');
            wrapper.style.overflow = 'hidden';
            plugin.elementToWrap.parentNode.insertBefore(wrapper, plugin.elementToWrap);
            wrapper.appendChild(plugin.elementToWrap);

            //set the container for calculation
            plugin.elementContainer = plugin.element.closest('.simpleParallax');
        },

        setStyle: function() {
            var plugin = this;

            if (plugin.options.overflow == false) {
                //if overflow option is set to false
                //add scale style so the image can be translated without getting out of its container
                plugin.element.style[cssTransform] = 'scale(' + plugin.options.scale + ')';
            }

            //add will-change CSS property to improve perfomance
            plugin.element.style.willChange = 'transform';

            if (plugin.options.delay > 0) {
                //if delay option is set to true
                //add transition option
                plugin.element.style.transition = 'transform ' + plugin.options.delay + 's ' + plugin.options.transition;
            }
        },

        //unbind resize event
        unBindEvent: function() {
            $(window).off('resize.simpleParallax');
        },

        //unwrap the element from .simpleParallax wrapper container
        unWrapElement: function() {
            var plugin = this;

            // get .simpleParallax wrapper container
            var parent = plugin.elementContainer.parentNode;

            // move all children out of .simpleParallax wrapper container
            while (plugin.elementContainer.firstChild) parent.insertBefore(plugin.elementContainer.firstChild, plugin.elementContainer);

            // remove .simpleParallax wrapper container
            parent.removeChild(plugin.elementContainer);
        },

        unSetStyle: function() {
            var plugin = this;

            //remove will change inline style
            plugin.element.style.willChange = '';

            if (plugin.options.overflow == false) {
                //if overflow option is set to false
                //remove transform inline style
                plugin.element.style[cssTransform] = '';
            }

            if (plugin.options.delay > 0) {
                //if delay option is set to true
                //remove transition inline style
                plugin.element.style.transition = '';
            }
        },

        //get the current element offset
        getElementOffset: function() {
            var plugin = this;

            //get position of the element
            var pos = plugin.elementContainer.getBoundingClientRect();

            //get height
            plugin.elementHeight = pos.height;
            //get offset top
            plugin.elementTopX = pos.top + window.pageYOffset;
            //get offset bottom
            plugin.elementBottomX = plugin.elementTopX + plugin.elementHeight;
        },

        //check if the current element is visible in the Viewport
        isVisible: function() {
            var plugin = this;
            // add a gap in order to translate the image before the user see the image
            // to avoid visible init translation
            return plugin.elementBottomX > SimpleParallax.viewportTop - gap && plugin.elementTopX < SimpleParallax.viewportBottom + gap;
        },

        //calculate the range between image will be translated
        calculateRange: function() {
            var plugin = this;

            //get the real height of the image without scale
            plugin.elementImageHeight = plugin.element.clientHeight;

            //range is calculate with the image height by the scale
            plugin.rangeMax = plugin.elementImageHeight * plugin.options.scale - plugin.elementImageHeight;

            //if orientation option is down or right
            //inverse the range max to translate in the other way
            if (plugin.options.orientation === 'down' || plugin.options.orientation === 'right') {
                plugin.rangeMax *= -1;
            }
        },

        //calculate the percentage and the translate value to apply on the element
        calculate: function() {
            var plugin = this;

            //calculate the % position of the element comparing to the viewport
            //rounding percentage to a 1 number float to avoid unn unnecessary calculation
            var percentage = ((SimpleParallax.viewportBottom - plugin.elementTopX) / ((SimpleParallax.viewportHeight + plugin.elementHeight) / 100)).toFixed(1);

            //sometime the percentage exceeds 100 or goes below 0
            //if so, remove the extra
            if (percentage > 100) {
                percentage = 100;
            } else if (percentage < 0) {
                percentage = 0;
            }

            //sometime the same percentage is returned
            //if so we don't do aything
            if (plugin.oldPercentage === percentage) return false;

            //if not range max is set, recalculate it
            if (!plugin.rangeMax) plugin.calculateRange();

            //transform this % into the max range of the element
            //rounding translateValue to a non float int - as minimum pixel for browser to render is 1 (no 0.5)
            plugin.translateValue = ((percentage / 100) * plugin.rangeMax - plugin.rangeMax / 2).toFixed(0);

            //store the current percentage
            plugin.oldPercentage = percentage;

            return true;
        },

        //animate the image
        animate: function() {
            var plugin = this,
                inlineCss;

            if (plugin.options.orientation == 'left' || plugin.options.orientation == 'right') {
                //if orientation option is left or right
                //use horizontal axe - X axe
                plugin.translateValueX = plugin.translateValue + 'px';
            } else {
                //if orientation option is left or right
                //use vertical axe - Y axe
                plugin.translateValueY = plugin.translateValue + 'px';
            }

            //set style to apply to the element
            if (plugin.options.overflow == false) {
                //if overflow option is set to false
                //add the scale style
                inlineCss = 'scale(' + plugin.options.scale + ') translate3d(' + plugin.translateValueX + ', ' + plugin.translateValueY + ', 0)';
            } else {
                inlineCss = 'translate3d(' + plugin.translateValueX + ', ' + plugin.translateValueY + ', 0)';
            }

            //add style on the element using the adequate CSS transform
            plugin.element.style[cssTransform] = inlineCss;
        },

        //proceed the element
        proceedElement: function(elem) {
            //if element not visible, no need to continue
            if (!elem.isVisible()) {
                return;
            }

            //if percentage is equal to the last one, no need to continue
            if (!elem.calculate()) {
                return;
            }

            //animate the image
            elem.animate();
        },

        //proceed Loop with all occurences
        proceedLoop: function() {
            var plugin = this;

            //get the offset top of the viewport
            SimpleParallax.getViewportOffsetTop();

            if (lastPosition === SimpleParallax.viewportTop) {
                //if last position if the same than the curent one
                //callback the proceedLoop and exit the current loop
                plugin.frameID = window.requestAnimationFrame(plugin.proceedLoop.bind(plugin));

                return;
            } else {
                //get the offset bottom of the viewport
                SimpleParallax.getViewportOffsetBottom();

                //for each occurence, proceed with the element
                for (var i = 0; i < occurence.length; i++) {
                    //proceed with the current element
                    plugin.proceedElement(occurence[i]);
                }

                //callback the proceedLoop
                plugin.frameID = window.requestAnimationFrame(plugin.proceedLoop.bind(plugin));

                //store the last position
                lastPosition = SimpleParallax.viewportTop;
            }
        },

        //destroy the simpleParallax instance
        destroy: function() {
            var plugin = this;

            for (var i = 0; i < occurence.length; i++) {
                //remove jQuery Plugin datas
                $(occurence[i].element).removeData();

                //remove all style added from simpleParallax
                occurence[i].unSetStyle();

                if (plugin.options.overflow == false) {
                    //if overflow option is set to false
                    //unwrap the element from .simpleParallax wrapper container
                    occurence[i].unWrapElement();
                }

                //cancel the animation frame
                window.cancelAnimationFrame(occurence[i].frameID);
            }

            //detach the resize event
            plugin.unBindEvent();
        }
    });

    //initiliaze elements with simpleParallax plugin
    $.fn.simpleParallax = function(options) {
        length = this.length;
        this.each(function() {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new SimpleParallax(this, options));
            }
        });

        return this;
    };

    //simpleParallax default options
    $.fn.simpleParallax.defaults = {
        delay: 0.6,
        orientation: 'up',
        scale: 1.3,
        overflow: false,
        transition: 'cubic-bezier(0,0,0,1)',
        breakpoint: false
    };
});

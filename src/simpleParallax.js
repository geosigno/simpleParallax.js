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

    var pluginName = 'simpleParallax',
        lastPosition = -1,
        isInitialized = false;

    function SimpleParallax(element, options) {
        this.element = element;
        this.$element = $(this.element);
        this._name = pluginName;
        this._defaults = $.fn.simpleParallax.defaults;
        this.options = $.extend({}, this._defaults, options);
        this.init();
    }

    $.extend(SimpleParallax, {
        //get the viewport offset top
        getViewportOffsetTop: function() {
            this.viewportTop = window.pageYOffset;
        },

        //get other viewport offsets ( height and bottom )
        getViewportOffset: function() {
            this.viewportHeight = document.documentElement.clientHeight;
            this.viewportBottom = SimpleParallax.viewportTop + this.viewportHeight;
        }
    });

    $.extend(SimpleParallax.prototype, {
        occurence: [],

        //initialization of elements
        init: function() {
            var plugin = this;

            //wrap the element into a div to apply overflow - if overflow is set to true
            plugin.wrapElement();

            //apply the dfault style on the image
            plugin.setStyle();

            this.occurence.push(plugin);

            if (isInitialized) {
                $(window).on('resize.simpleParallax', function() {
                    plugin.rangeMax = 0;
                });
                plugin.proceedLoop();
            }
        },

        //if overflow is set to true
        // wrap the element into a .simpleParallax div and apply overflow hidden to hide the image excedant (result of the scale)
        wrapElement: function() {
            var plugin = this;

            if (plugin.options.overflow == true) {
                //check if image is inside a picture tag
                if (plugin.element.closest('picture')) {
                    plugin.elementToWrap = plugin.element.closest('picture');
                } else {
                    plugin.elementToWrap = plugin.element;
                }

                // create wrapper container
                var wrapper = document.createElement('div');
                wrapper.classList.add('simpleParallax');
                wrapper.style.overflow = 'hidden';
                plugin.elementToWrap.parentNode.insertBefore(wrapper, plugin.elementToWrap);
                wrapper.appendChild(plugin.elementToWrap);

                //set the container for calculation
                plugin.elementContainer = plugin.element.closest('.simpleParallax');
            } else {
                //set the container for calculation - elemnt itself when overflow is set to false
                plugin.elementContainer = plugin.element;
            }
        },

        setStyle: function() {
            var plugin = this;

            if (plugin.options.overflow == true) {
                //add scale option to ensure correct calculation of the rangeMax value
                plugin.element.style[cssTransform] = 'scale(' + plugin.options.scale + ')';
            }

            //add will-change CSS property to improve perfomance
            plugin.element.style.willChange = 'transform';

            //if animation is set, add a transition CSS
            if (plugin.options.delay > 0) {
                plugin.element.style.transition = 'transform ' + plugin.options.delay + 's cubic-bezier(0,0,0,1)';
            }
        },

        //unwrap the element from the .simpleParallax div
        unWrapElement: function() {
            var plugin = this;

            if (plugin.options.overflow == true) {
                // get the element's parent node
                var parent = plugin.elementContainer.parentNode;

                // move all children out of the element
                while (plugin.elementContainer.firstChild) parent.insertBefore(plugin.elementContainer.firstChild, plugin.elementContainer);

                // remove the empty element
                parent.removeChild(plugin.elementContainer);
            }
        },

        unSetStyle: function() {
            var plugin = this;

            //remove all style added by simple Parallax
            plugin.element.removeAttribute('style');
        },

        //calculate the current element offset
        getElementOffset: function() {
            var plugin = this;

            plugin.elementHeight = plugin.elementContainer.offsetHeight;
            plugin.elementTopX = plugin.elementContainer.offsetTop;
            plugin.elementBottomX = plugin.elementTopX + plugin.elementHeight;
        },

        //check if the current element is visible in the Viewport
        isVisible: function() {
            var plugin = this;

            return plugin.elementBottomX > SimpleParallax.viewportTop && plugin.elementTopX < SimpleParallax.viewportBottom;
        },

        calculateRange: function() {
            var plugin = this;

            //get the real height of the image with the scaling apply to it
            plugin.elementImageHeight = plugin.element.getBoundingClientRect().height;

            //range is calculate with the image height by the scale
            plugin.rangeMax = plugin.elementImageHeight * plugin.options.scale - plugin.elementImageHeight;

            if (plugin.options.orientation === 'down' || plugin.options.orientation === 'right') {
                plugin.rangeMax *= -1;
            }

            console.log(plugin.rangeMax);
        },

        //calculate the percentage and the translate value to apply on the element
        calculate: function() {
            var plugin = this;

            //calculate the % position of the element comparing to the viewport
            //rounding percentage to a 1 number float to avoid unn unnecessary calculation
            var percentage = ((SimpleParallax.viewportBottom - plugin.elementTopX) / ((SimpleParallax.viewportHeight + plugin.elementHeight) / 100)).toFixed(1);

            //sometime the percentage exceeds 100 or goes below 0
            if (percentage > 100) percentage = 100;
            else if (percentage < 0) percentage = 0;

            //sometime the same percentage if returned, to avoid this if the old percentage is equal to the new one, we don't do aything
            if (plugin.oldPercentage === percentage) return false;

            //is not range max has been set yet, recalculate it
            if (!plugin.rangeMax) plugin.calculateRange();

            //transform this % into the max range of the element
            //rounding translateValue to a non float int - as minimum pixel for browser to render to 1 (no 0.5)
            plugin.translateValue = ((percentage / 100) * plugin.rangeMax - plugin.rangeMax / 2).toFixed(0);

            plugin.oldPercentage = percentage;

            return true;
        },

        animate: function() {
            var plugin = this,
                inlineCss,
                translateValueY,
                translateValueX;

            //check the orientation to know which of X or Y axe should we use
            if (plugin.options.orientation == 'left' || plugin.options.orientation == 'right') {
                translateValueY = 0;
                translateValueX = plugin.translateValue + 'px';
            } else {
                (translateValueY = plugin.translateValue + 'px'), (translateValueX = 0);
            }

            //prepare style to apply to the element
            if (plugin.options.overflow == true) {
                inlineCss = 'scale(' + plugin.options.scale + ') translate3d(' + translateValueX + ', ' + translateValueY + ', 0)';
            } else {
                inlineCss = 'translate3d(' + translateValueX + ', ' + translateValueY + ', 0)';
            }

            //add style depending the current vendor CSS of the browser
            plugin.element.style[cssTransform] = inlineCss;
        },

        proceedElement: function(elem) {
            elem.getElementOffset();

            //if element not visible, no need to continue
            if (!elem.isVisible()) return;

            //if percentage is equal to the last, no need to continue
            if (!elem.calculate()) return;

            //else animate the image
            elem.animate();
        },

        proceedLoop: function() {
            var plugin = this;

            SimpleParallax.getViewportOffsetTop();

            if (lastPosition === SimpleParallax.viewportTop) {
                plugin.frameID = window.requestAnimationFrame(plugin.proceedLoop.bind(plugin));
                return;
            } else {
                lastPosition = SimpleParallax.viewportTop;

                for (var i = 0; i < this.occurence.length; i++) {
                    if (i === 0) SimpleParallax.getViewportOffset();
                    plugin.proceedElement(this.occurence[i]);
                }

                plugin.frameID = window.requestAnimationFrame(plugin.proceedLoop.bind(plugin));
            }
        },

        destroy: function() {
            for (var i = 0; i < this.occurence.length; i++) {
                this.occurence[i].$element.removeData();

                this.occurence[i].unSetStyle();

                this.occurence[i].unWrapElement();

                window.cancelAnimationFrame(this.occurence[i].frameID);
            }

            $(window).off('resize.simpleParallax');
        }
    });

    $.fn.simpleParallax = function(options) {
        var length = this.length;
        this.each(function(index) {
            if (!$.data(this, pluginName)) {
                if (length - 1 == index) isInitialized = true;
                $.data(this, pluginName, new SimpleParallax(this, options));
            }
        });

        return this;
    };

    $.fn.simpleParallax.defaults = {
        delay: 0.6,
        orientation: 'up',
        scale: 1.2,
        overflow: true
    };
});

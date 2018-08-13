/**
 * simpleParallax
 * ------------
 * Version : 2.4.0
 * Website : https://anakao-theme.com/simpleparallax/
 * Repo    : https://github.com/geosenna/simpleParallax
 * Author  : Geoffrey Signorato (@geosenna)
 */

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
        edge = 20,
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
        getViewportOffsetTop: function() {
            this.viewportTop = window.pageYOffset;
        },

        getViewportOffset: function() {
            var win = $(window);

            (this.viewportHeight = win.outerHeight()), (this.viewportBottom = SimpleParallax.viewportTop + SimpleParallax.viewportHeight);
        }
    });

    $.extend(SimpleParallax.prototype, {
        occurence: [],

        //initialization of elements
        init: function() {
            var plugin = this;

            plugin.wrapElement();

            this.occurence.push(plugin);

            if (isInitialized) plugin.proceedLoop();
        },

        //wrap the element with the .simpleParallax div and apply overflow hidden to hide the image excedant (cause of the scale)
        wrapElement: function() {
            var plugin = this;

            //wrap into a div only if overflow is set to true
            if (plugin.options.overflow == true) {
                plugin.$elementToWrap = plugin.$element;

                if (plugin.$element.closest('picture').length) plugin.$elementToWrap = plugin.$element.parent('picture');

                plugin.$elementToWrap.wrap('<div class="simpleParallax" style="overflow:hidden"></div>');

                plugin.$elementContainer = plugin.$element.closest('.simpleParallax');

                //add scale option to ensure correct calculation of the rangeMax value
                plugin.$element[0].style[cssTransform] = 'scale(' + plugin.options.scale + ')';
            } else {
                plugin.$elementContainer = plugin.$element;
            }

            //add will-change CSs property to improve persomance
            plugin.$element[0].style.willChange = 'transform';

            //if animation is set, add a transition CSS
            if (plugin.options.delay > 0) {
                plugin.$element[0].style.transition = 'transform ' + plugin.options.delay + 's cubic-bezier(0,0,0,1)';
            }
        },

        //unwrap the element from the .simpleParallax div
        unWrapElement: function() {
            var plugin = this;

            if (plugin.options.overflow == true) {
                plugin.$elementToWrap.unwrap('.simpleParallax');
            }
        },

        //calculate the current element offset
        getElementOffset: function() {
            var plugin = this;

            plugin.elementHeight = plugin.$elementContainer[0].offsetHeight;
            plugin.elementTopX = plugin.$elementContainer.offset().top;
            plugin.elementBottomX = plugin.elementTopX + plugin.elementHeight;
        },

        //check if the current element is visible in the Viewport
        isVisible: function() {
            var plugin = this;

            return plugin.elementBottomX > SimpleParallax.viewportTop - edge && plugin.elementTopX < SimpleParallax.viewportBottom + edge;
        },

        calculateRange: function() {
            var plugin = this;

            //get the real height of the image with the scaling apply to it
            plugin.elementImageHeight = plugin.$element[0].getBoundingClientRect().height;

            if (plugin.options.overflow == true) {
                //range is calculate with the extra space of the scaled image comparing to its container
                plugin.rangeMax = Math.abs(plugin.elementHeight - plugin.elementImageHeight);
            } else {
                //range is calculate with the image height by the scale
                plugin.rangeMax = plugin.elementImageHeight * plugin.options.scale - plugin.elementImageHeight;
            }

            if (plugin.options.orientation === 'down' || plugin.options.orientation === 'right') {
                plugin.rangeMax *= -1;
            }
        },

        //calculate the percentage and the translate value to apply on the element
        calculate: function() {
            var plugin = this,
                //calculate the % position of the element comparing to the viewport
                percentage = (SimpleParallax.viewportBottom - plugin.elementTopX) / ((SimpleParallax.viewportHeight + plugin.elementHeight) / 100);

            //Rounded to percentage to the nearest 0.1 to increase perfomance
            percentage = Number(percentage.toFixed(1));

            //sometime the same percentage if returned, to avoid this if the old percentage is equal to the new one, we don't do aything
            if (plugin.oldPercentage === percentage) return false;

            //sometime the percentage exceeds 100 or goes below 0
            if (percentage > 100) percentage = 100;
            else if (percentage < 0) percentage = 0;

            plugin.calculateRange();

            //transform this % into the max range of the element
            plugin.translateValue = (percentage / 100) * plugin.rangeMax - plugin.rangeMax / 2;

            plugin.oldPercentage = percentage;

            return true;
        },

        animate: function() {
            var plugin = this,
                inlineCss,
                translateValueY = plugin.translateValue,
                translateValueX = 0;

            //check the orientation to know which of X or Y axe should we use
            if (plugin.options.orientation == 'left' || plugin.options.orientation == 'right') {
                translateValueY = 0;
                translateValueX = plugin.translateValue;
            }

            //prepare style to apply to the element
            if (plugin.options.overflow == true) {
                inlineCss = 'scale(' + plugin.options.scale + ') translate3d(' + translateValueX + 'px, ' + translateValueY + 'px, 0)';
            } else {
                inlineCss = 'translate3d(' + translateValueX + 'px, ' + translateValueY + 'px, 0)';
            }

            //add style depending the current vendor CSS of the browser
            plugin.$element[0].style[cssTransform] = inlineCss;
        },

        proceedElement: function(elem) {
            elem.getElementOffset();

            if (!elem.isVisible()) return;

            if (!elem.calculate()) return;

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

                this.occurence[i].$element[0].style[cssTransform] = '';

                this.occurence[i].unWrapElement();

                window.cancelAnimationFrame(this.occurence[i].frameID);
            }
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

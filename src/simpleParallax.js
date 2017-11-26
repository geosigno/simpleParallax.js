/**
 * simpleParallax
 * ------------
 * Version : 1.0.3
 * Website : https://anakao-theme.com/simpleparallax/
 * Repo    : https://github.com/geosenna/simpleParallax
 * Author  : Geoffrey Signorato (@geosenna)
 */

;(function (factory) {

    if(typeof module === "object" && typeof module.exports === "object") {
        factory(require("jquery"), window, document);
    } else {
        factory(jQuery, window, document);
    }
    
}(function($, window, document, undefined) {
    
    'use strict';
    
    // requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
    // via: https://gist.github.com/paulirish/1579671
    (function() {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                       || window[vendors[x]+'CancelRequestAnimationFrame'];
        }
     
        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = function(callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
                  timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
     
        if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
    }());

    // Detect Vendor Prefix
    // via: https://davidwalsh.name/vendor-prefix
    var vendor = (function () {
        var styles = window.getComputedStyle(document.documentElement, ''),
            pre = (Array.prototype.slice
                .call(styles)
                .join('') 
                .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
            )[1];
        if (pre == 'moz') return 'Moz';
        else return pre;
    })();

    $.fn.simpleParallax = function(options) {

        var pluginName = 'simpleParallax',
            defaultOptions = {
                'orientation': 'up',
                'scale': '1.2'
            },
            params = $.extend(defaultOptions, options);

        var isInit = false;

        function simpleParallax(element) {

            this.name = pluginName;
            this.$element = element;
            this.$elementContainer = this.$element.closest('.easy-parallax');

            this.init();

            this.scrollEvent = this.scrollEvent.bind(this);

            $(window).on('scroll', this.scrollEvent);

        }

        $.extend(simpleParallax.prototype, {

            init: function() {

                var self = this;

                if (!isInit) {
                    self.getViewportOffset();
                    isInit = true;
                }

                //apply scale to every image for the first calculation
                self.$element[0].style[vendor+'Transform'] = 'scale('+params.scale+')';

                this.proceedElement();

            },

            //calculate the current viewport offset
            getViewportOffset: function() {

                //edge is use to increase the viewport size 
                //so the translation effect can appear before element is getting visible
                //and avoid any visual inconveniance when the image will suddently move from its axe 
                var self = this,
                    edge = 20;

                self.viewportHeight = $(window).height();
                self.viewportTopX = $(window).scrollTop();
                self.viewportBottomX = self.viewportTopX + self.viewportHeight;
                self.viewportTopX -= edge;
                self.viewportBottomX += edge;

            },

            //calculate the current element offset
            getElementOffset: function() {

                var self = this;

                self.elementHeight = self.$elementContainer.outerHeight();
                self.elementTopX = self.$elementContainer.offset().top;
                self.elementBottomX = self.elementTopX + self.elementHeight;

            },

            //calculate the current element dimension
            getElementDimension: function() {

                var self = this;

                //get the real height of the image with the scaling apply to it
                self.elementImageHeight = self.$element[0].getBoundingClientRect().height;
                //get the range where the image can be translate without going out of its container
                self.elementRange = Math.abs(self.elementHeight - self.elementImageHeight);

            },

            isVisible: function() {

                var self = this;

                //return if the current element is visible in the Viewport
                return ( 
                    //if elementTopX is visible in the Viewport
                    (self.elementTopX > self.viewportTopX && self.elementTopX < self.viewportBottomX)
                    || 
                    //if elementBottomX is visible in the viewport
                    (self.elementBottomX < self.viewportBottomX && self.elementBottomX > self.viewportTopX)
                    ||
                    //if elementTopX is above the viewport and elementBottomX is below the viewport
                    (self.elementTopX < self.viewportTopX && self.elementBottomX > self.viewportBottomX)
                );

            },

            calculate: function() {

                var self = this;

                //range is calculate with the extra space of the scaled image comparing to its container
                var rangeMax = self.elementRange;

                if ( params.orientation === 'down' ) {
                    rangeMax *= -1;
                }

                //calculate the % position of the element comparing to the viewport
                var percentage = (self.viewportBottomX - self.elementTopX) / ((self.viewportHeight + self.elementHeight) / 100);

                //transform this % into the max range of the element
                self.translateValue = ((percentage / 100) * rangeMax) - (rangeMax / 2);
                
            },

            animate: function() {

                var self = this,
                    inlineCss;

                //prepare style to apply to the element
                inlineCss = 'scale('+params.scale+') translateY('+self.translateValue+'px)';

                //add style depending the current vendor CSS of the browser
                self.$element[0].style[vendor+'Transform'] = inlineCss;
            
            },

            scrollEvent: function() {

                var self = this;

                self.getViewportOffset();

                self.proceedElement();

            },

            proceedElement: function() {
                
                var self = this;
                
                self.getElementOffset();

                if (!self.isVisible()) return;

                self.getElementDimension();

                self.calculate();

                window.requestAnimationFrame( function() { self.animate(); } );

            },

        });

        return this.each(function() {
            
            var $elementToWrap = $(this);

            if ( $elementToWrap.closest('picture').length  ) $elementToWrap = $(this).closest('picture');

            $elementToWrap.wrap('<div class="easy-parallax" style="overflow:hidden"></div>');

            new simpleParallax($(this));

        });

    }

}));
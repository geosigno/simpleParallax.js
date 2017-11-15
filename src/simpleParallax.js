;(function ( $, window, document, undefined ) {
    
    'use strict';

    // Detect Vendor Prefix
    // via: https://davidwalsh.name/vendor-prefix
    var vendor = (function () {
        var styles = window.getComputedStyle(document.documentElement, ''),
            pre = (Array.prototype.slice
                .call(styles)
                .join('') 
                .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
            )[1];
        return pre;
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

            if (!isInit) this.init();

            this.proceedElement();

            this.scrollEvent = this.scrollEvent.bind(this);

            $(window).on('scroll', this.scrollEvent);

        }

        $.extend(simpleParallax.prototype, {

            init: function() {

                if (isInit) return;

                var self = this;

                self.getViewportOffset();

                isInit = true;

            },

            //calculate the current viewport offset
            getViewportOffset: function() {

                //edge is use to increase the viewport size 
                //so the translation effect can appear before element is getting visible
                //and avoid any visual inconveniance when the image will suddently move from its axe 
                var self = this,
                    edge = 20;

                self.viewportHeight = $(window).height();
                self.viewportTopX = $(window).scrollTop() - edge;
                self.viewportBottomX = self.viewportTopX + self.viewportHeight + edge;

            },

            //calculate the current element offset
            getElementOffset: function() {

                var self = this;

                self.elementHeight = self.$elementContainer.outerHeight();
                self.elementTopX = self.$elementContainer.offset().top;
                self.elementBottomX = self.elementTopX + self.elementHeight;
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

                if ( params['orientation'] === 'down' ) {
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

                if (self.isVisible()) {

                    self.calculate();

                    self.animate();
                }

            },

        });

        return this.each(function() {
            
            var $elementToWrap = $(this);

            if ( $elementToWrap.closest('picture').length ) $elementToWrap = $(this).parent('picture');

            $elementToWrap.wrap('<div class="easy-parallax" style="overflow:hidden"></div>');

            new simpleParallax($(this));

        });

    }

})( jQuery, window, document );
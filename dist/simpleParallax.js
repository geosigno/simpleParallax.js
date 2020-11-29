/*!
 * simpleParallax - simpleParallax is a simple JavaScript library that gives your website parallax animations on any images or videos,
 * @date: 16-11-2020 22:37:35,
 * @version: 5.6.2,
 * @link: https://simpleparallax.com/
 */
var simpleParallax;simpleParallax =
/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 524:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ SimpleParallax; }
});

// CONCATENATED MODULE: ./src/helpers/isSupportedBrowser.js
// need closest support
// https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill
// need Intersection Observer support
// https://github.com/w3c/IntersectionObserver/tree/master/polyfill
var isSupportedBrowser = function isSupportedBrowser() {
  return Element.prototype.closest && 'IntersectionObserver' in window;
};

/* harmony default export */ var helpers_isSupportedBrowser = (isSupportedBrowser);
// CONCATENATED MODULE: ./src/helpers/viewport.js
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Viewport = /*#__PURE__*/function () {
  function Viewport() {
    _classCallCheck(this, Viewport);

    this.positions = {
      top: 0,
      bottom: 0,
      height: 0
    };
  }

  _createClass(Viewport, [{
    key: "setViewportTop",
    value: function setViewportTop(container) {
      // if this is a custom container, user the scrollTop
      this.positions.top = container ? container.scrollTop : window.pageYOffset;
      return this.positions;
    }
  }, {
    key: "setViewportBottom",
    value: function setViewportBottom() {
      this.positions.bottom = this.positions.top + this.positions.height;
      return this.positions;
    }
  }, {
    key: "setViewportAll",
    value: function setViewportAll(container) {
      // if this is a custom container, user the scrollTop
      this.positions.top = container ? container.scrollTop : window.pageYOffset; // if this is a custom container, get the height from the custom container itself

      this.positions.height = container ? container.clientHeight : document.documentElement.clientHeight;
      this.positions.bottom = this.positions.top + this.positions.height;
      return this.positions;
    }
  }]);

  return Viewport;
}();

var viewport = new Viewport();

// CONCATENATED MODULE: ./src/helpers/convertToArray.js
// check whether the element is a Node List, a HTML Collection or an array
// return an array of nodes
var convertToArray = function convertToArray(elements) {
  if (NodeList.prototype.isPrototypeOf(elements) || HTMLCollection.prototype.isPrototypeOf(elements)) return Array.from(elements);
  if (typeof elements === 'string' || elements instanceof String) return document.querySelectorAll(elements);
  return [elements];
};

/* harmony default export */ var helpers_convertToArray = (convertToArray);
// CONCATENATED MODULE: ./src/helpers/cssTransform.js
// Detect css transform
var cssTransform = function cssTransform() {
  var prefixes = 'transform webkitTransform mozTransform oTransform msTransform'.split(' ');
  var transform;
  var i = 0;

  while (transform === undefined) {
    transform = document.createElement('div').style[prefixes[i]] !== undefined ? prefixes[i] : undefined;
    i += 1;
  }

  return transform;
};

/* harmony default export */ var helpers_cssTransform = (cssTransform());
// CONCATENATED MODULE: ./src/helpers/isImageLoaded.js
// check if media is fully loaded
var isImageLoaded = function isImageLoaded(media, callback) {
  // if the media is a video, return true
  if (media.tagName.toLowerCase() !== 'img') {
    return callback();
  } // check if media has been 100% loaded
  // check if the media is displayed


  if (!media.complete || typeof media.naturalWidth !== 'undefined' && media.naturalWidth === 0) {
    return media.addEventListener('load', function () {
      // timeout to ensure the image is fully painted into the DOM
      setTimeout(function () {
        return callback();
      }, 10);
    });
  }

  return callback();
};

/* harmony default export */ var helpers_isImageLoaded = (isImageLoaded);
// CONCATENATED MODULE: ./src/helpers/getImage.js
var getImage = function getImage(element) {
  if (element.tagName.toLowerCase() === 'picture') return element.querySelector('img');else return element;
};

/* harmony default export */ var helpers_getImage = (getImage);
// CONCATENATED MODULE: ./src/instances/parallax.js
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function parallax_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function parallax_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function parallax_createClass(Constructor, protoProps, staticProps) { if (protoProps) parallax_defineProperties(Constructor.prototype, protoProps); if (staticProps) parallax_defineProperties(Constructor, staticProps); return Constructor; }






var ParallaxInstance = /*#__PURE__*/function () {
  function ParallaxInstance(element, options) {
    parallax_classCallCheck(this, ParallaxInstance);

    // set the element & settings
    this.element = helpers_getImage(element);
    if (!this.element) return;
    this.elementContainer = element;
    this.settings = options;
    this.isVisible = true;
    this.isInit = false;
    this.oldTranslateValue = -1;
    this.init = this.init.bind(this);
    this.customWrapper = this.settings.customWrapper && this.element.closest(this.settings.customWrapper) ? this.element.closest(this.settings.customWrapper) : null;
    helpers_isImageLoaded(element, this.init);
  }

  parallax_createClass(ParallaxInstance, [{
    key: "init",
    value: function init() {
      var _this = this;

      // for some reason, <picture> are init an infinite time on windows OS
      if (this.isInit) return; // check if element has not been already initialized with simpleParallax

      if (this.element.closest('.simpleParallax')) return;

      if (this.settings.overflow === false) {
        // if overflow option is set to false
        // wrap the element into a div to apply overflow
        this.wrapElement(this.element);
      } // apply the transform style on the image


      this.setTransformCSS(); // get the current element offset

      this.getElementOffset(); // init the Intesection Observer

      this.intersectionObserver(); // get its translated value

      this.getTranslateValue(); // apply its translation even if not visible for the first init

      this.animate(); // if a delay has been set

      if (this.settings.delay > 0) {
        // apply a timeout to avoid buggy effect
        setTimeout(function () {
          // apply the transition style on the image
          _this.setTransitionCSS(); //add isInit class


          _this.elementContainer.classList.add('simple-parallax-initialized');
        }, 10);
      } else {
        //add isInit class
        this.elementContainer.classList.add('simple-parallax-initialized');
      } // for some reason, <picture> are init an infinite time on windows OS


      this.isInit = true;
    } // if overflow option is set to false
    // wrap the element into a .simpleParallax div and apply overflow hidden to hide the image excedant (result of the scale)

  }, {
    key: "wrapElement",
    value: function wrapElement() {
      // check is current image is in a <picture> tag
      var elementToWrap = this.element.closest('picture') || this.element; // create a .simpleParallax wrapper container
      // if there is a custom wrapper
      // override the wrapper with it

      var wrapper = this.customWrapper || document.createElement('div');
      wrapper.classList.add('simpleParallax');
      wrapper.style.overflow = 'hidden'; // append the image inside the new wrapper

      if (!this.customWrapper) {
        elementToWrap.parentNode.insertBefore(wrapper, elementToWrap);
        wrapper.appendChild(elementToWrap);
      }

      this.elementContainer = wrapper;
    } // unwrap the element from .simpleParallax wrapper container

  }, {
    key: "unWrapElement",
    value: function unWrapElement() {
      var wrapper = this.elementContainer; // if there is a custom wrapper, we jusy need to remove the class and style

      if (this.customWrapper) {
        wrapper.classList.remove('simpleParallax');
        wrapper.style.overflow = '';
      } else {
        wrapper.replaceWith.apply(wrapper, _toConsumableArray(wrapper.childNodes));
      }
    } // apply default style on element

  }, {
    key: "setTransformCSS",
    value: function setTransformCSS() {
      if (this.settings.overflow === false) {
        // if overflow option is set to false
        // add scale style so the image can be translated without getting out of its container
        this.element.style[helpers_cssTransform] = "scale(".concat(this.settings.scale, ")");
      } // add will-change CSS property to improve perfomance


      this.element.style.willChange = 'transform';
    } // apply the transition effet

  }, {
    key: "setTransitionCSS",
    value: function setTransitionCSS() {
      // add transition option
      this.element.style.transition = "transform ".concat(this.settings.delay, "s ").concat(this.settings.transition);
    } // remove style of the element

  }, {
    key: "unSetStyle",
    value: function unSetStyle() {
      // remove will change inline style
      this.element.style.willChange = '';
      this.element.style[helpers_cssTransform] = '';
      this.element.style.transition = '';
    } // get the current element offset

  }, {
    key: "getElementOffset",
    value: function getElementOffset() {
      // get position of the element
      var positions = this.elementContainer.getBoundingClientRect(); // get height

      this.elementHeight = positions.height; // get offset top

      this.elementTop = positions.top + viewport.positions.top; // if there is a custom container

      if (this.settings.customContainer) {
        // we need to do some calculation to get the position from the parent rather than the viewport
        var parentPositions = this.settings.customContainer.getBoundingClientRect();
        this.elementTop = positions.top - parentPositions.top + viewport.positions.top;
      } // get offset bottom


      this.elementBottom = this.elementHeight + this.elementTop;
    } // build the Threshold array to cater change for every pixel scrolled

  }, {
    key: "buildThresholdList",
    value: function buildThresholdList() {
      var thresholds = [];

      for (var i = 1.0; i <= this.elementHeight; i++) {
        var ratio = i / this.elementHeight;
        thresholds.push(ratio);
      }

      return thresholds;
    } // create the Intersection Observer

  }, {
    key: "intersectionObserver",
    value: function intersectionObserver() {
      var options = {
        root: null,
        threshold: this.buildThresholdList()
      };
      this.observer = new IntersectionObserver(this.intersectionObserverCallback.bind(this), options);
      this.observer.observe(this.element);
    } // Intersection Observer Callback to set the element at visible state or not

  }, {
    key: "intersectionObserverCallback",
    value: function intersectionObserverCallback(entries) {
      var _this2 = this;

      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          _this2.isVisible = true;
        } else {
          _this2.isVisible = false;
        }
      });
    } // check if the current element is visible in the Viewport
    // for browser that not support Intersection Observer API

  }, {
    key: "checkIfVisible",
    value: function checkIfVisible() {
      return this.elementBottom > viewport.positions.top && this.elementTop < viewport.positions.bottom;
    } // calculate the range between image will be translated

  }, {
    key: "getRangeMax",
    value: function getRangeMax() {
      // get the real height of the image without scale
      var elementImageHeight = this.element.clientHeight; // range is calculate with the image height by the scale

      this.rangeMax = elementImageHeight * this.settings.scale - elementImageHeight;
    } // get the percentage and the translate value to apply on the element

  }, {
    key: "getTranslateValue",
    value: function getTranslateValue() {
      // calculate the % position of the element comparing to the viewport
      // rounding percentage to a 1 number float to avoid unn unnecessary calculation
      var percentage = ((viewport.positions.bottom - this.elementTop) / ((viewport.positions.height + this.elementHeight) / 100)).toFixed(1); // sometime the percentage exceeds 100 or goes below 0

      percentage = Math.min(100, Math.max(0, percentage)); // if a maxTransition has been set, we round the percentage to that number

      if (this.settings.maxTransition !== 0 && percentage > this.settings.maxTransition) {
        percentage = this.settings.maxTransition;
      } // sometime the same percentage is returned
      // if so we don't do anything


      if (this.oldPercentage === percentage) {
        return false;
      } // if not range max is set, recalculate it


      if (!this.rangeMax) {
        this.getRangeMax();
      } // transform this % into the max range of the element
      // rounding translateValue to a non float int - as minimum pixel for browser to render is 1 (no 0.5)


      this.translateValue = (percentage / 100 * this.rangeMax - this.rangeMax / 2).toFixed(0); // sometime the same translate value is returned
      // if so we don't do anything

      if (this.oldTranslateValue === this.translateValue) {
        return false;
      } // store the current percentage


      this.oldPercentage = percentage;
      this.oldTranslateValue = this.translateValue;
      return true;
    } // animate the image

  }, {
    key: "animate",
    value: function animate() {
      var translateValueY = 0;
      var translateValueX = 0;

      if (this.settings.orientation.includes('left') || this.settings.orientation.includes('right')) {
        // if orientation option is left or right
        // use horizontal axe - X axe
        translateValueX = "".concat(this.settings.orientation.includes('left') ? this.translateValue * -1 : this.translateValue, "px");
      }

      if (this.settings.orientation.includes('up') || this.settings.orientation.includes('down')) {
        // if orientation option is up or down
        // use vertical axe - Y axe
        translateValueY = "".concat(this.settings.orientation.includes('up') ? this.translateValue * -1 : this.translateValue, "px");
      }

      var transform = {
        transform: ["translate3d(".concat(this.oldTranslateValueX, ", ").concat(this.oldTranslateValueY, ", 0) scale(").concat(this.settings.scale, ")"), "translate3d(".concat(translateValueX, ", ").concat(translateValueY, ", 0) scale(").concat(this.settings.scale, ")")]
      };
      var options = {
        duration: this.settings.delay,
        easing: this.settings.transition,
        fill: 'forwards'
      };
      this.element.animate(transform, options);
      this.oldTranslateValueY = translateValueY;
      this.oldTranslateValueX = translateValueX;
    }
  }]);

  return ParallaxInstance;
}();

/* harmony default export */ var parallax = (ParallaxInstance);
// CONCATENATED MODULE: ./src/simpleParallax.js
function simpleParallax_toConsumableArray(arr) { return simpleParallax_arrayWithoutHoles(arr) || simpleParallax_iterableToArray(arr) || simpleParallax_unsupportedIterableToArray(arr) || simpleParallax_nonIterableSpread(); }

function simpleParallax_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function simpleParallax_iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function simpleParallax_arrayWithoutHoles(arr) { if (Array.isArray(arr)) return simpleParallax_arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || simpleParallax_unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function simpleParallax_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return simpleParallax_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return simpleParallax_arrayLikeToArray(o, minLen); }

function simpleParallax_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function simpleParallax_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function simpleParallax_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function simpleParallax_createClass(Constructor, protoProps, staticProps) { if (protoProps) simpleParallax_defineProperties(Constructor.prototype, protoProps); if (staticProps) simpleParallax_defineProperties(Constructor, staticProps); return Constructor; }





var isInit = false;
var instances = [];
var frameID;
var resizeID;

var SimpleParallax = /*#__PURE__*/function () {
  function SimpleParallax(elements, options) {
    simpleParallax_classCallCheck(this, SimpleParallax);

    if (!elements) return; // check if the browser support simpleParallax

    if (!helpers_isSupportedBrowser()) return;
    this.elements = helpers_convertToArray(elements);
    this.defaults = {
      delay: 0,
      orientation: 'up',
      scale: 1.3,
      overflow: false,
      transition: 'cubic-bezier(0,0,0,1)',
      customContainer: '',
      customWrapper: '',
      maxTransition: 0
    };
    this.settings = Object.assign(this.defaults, options);

    if (this.settings.customContainer) {
      var _convertToArray = helpers_convertToArray(this.settings.customContainer);

      var _convertToArray2 = _slicedToArray(_convertToArray, 1);

      this.customContainer = _convertToArray2[0];
    }

    this.lastPosition = -1;
    this.resizeIsDone = this.resizeIsDone.bind(this);
    this.refresh = this.refresh.bind(this);
    this.proceedRequestAnimationFrame = this.proceedRequestAnimationFrame.bind(this);
    this.init();
  }

  simpleParallax_createClass(SimpleParallax, [{
    key: "init",
    value: function init() {
      var _this = this;

      viewport.setViewportAll(this.customContainer);
      instances = [].concat(simpleParallax_toConsumableArray(this.elements.map(function (element) {
        return new parallax(element, _this.settings);
      })), simpleParallax_toConsumableArray(instances)); // only if this is the first simpleParallax init

      if (!isInit) {
        // init the frame
        this.proceedRequestAnimationFrame();
        window.addEventListener('resize', this.resizeIsDone);
        isInit = true;
      }
    } // wait for resize to be completely done

  }, {
    key: "resizeIsDone",
    value: function resizeIsDone() {
      clearTimeout(resizeID);
      resizeID = setTimeout(this.refresh, 200);
    } // animation frame

  }, {
    key: "proceedRequestAnimationFrame",
    value: function proceedRequestAnimationFrame() {
      var _this2 = this;

      // get the offset top of the viewport
      viewport.setViewportTop(this.customContainer);

      if (this.lastPosition === viewport.positions.top) {
        // if last position if the same than the curent one
        // callback the animationFrame and exit the current loop
        frameID = window.requestAnimationFrame(this.proceedRequestAnimationFrame);
        return;
      } // get the offset bottom of the viewport


      viewport.setViewportBottom(); // proceed with the current element

      instances.forEach(function (instance) {
        _this2.proceedElement(instance);
      }); // callback the animationFrame

      frameID = window.requestAnimationFrame(this.proceedRequestAnimationFrame); // store the last position

      this.lastPosition = viewport.positions.top;
    } // proceed the element

  }, {
    key: "proceedElement",
    value: function proceedElement(instance) {
      var isVisible = false; // if this is a custom container
      // use old function to check if element visible

      if (this.customContainer) {
        isVisible = instance.checkIfVisible(); // else, use response from Intersection Observer API Callback
      } else {
        isVisible = instance.isVisible;
      } // if element not visible, stop it


      if (!isVisible) return; // if percentage is equal to the last one, no need to continue

      if (!instance.getTranslateValue()) {
        return;
      } // animate the image


      instance.animate();
    }
  }, {
    key: "refresh",
    value: function refresh() {
      // re-get all the viewport positions
      viewport.setViewportAll(this.customContainer);
      instances.forEach(function (instance) {
        // re-get the current element offset
        instance.getElementOffset(); // re-get the range if the current element

        instance.getRangeMax();
      }); // force the request animation frame to fired

      this.lastPosition = -1;
    }
  }, {
    key: "destroy",
    value: function destroy() {
      var _this3 = this;

      var instancesToDestroy = []; // remove all instances that need to be destroyed from the instances array

      instances = instances.filter(function (instance) {
        if (_this3.elements.includes(instance.element)) {
          // push instance that need to be destroyed into instancesToDestroy
          instancesToDestroy.push(instance);
          return false;
        }

        return instance;
      });
      instancesToDestroy.forEach(function (instance) {
        // unset style
        instance.unSetStyle();

        if (_this3.settings.overflow === false) {
          // if overflow option is set to false
          // unwrap the element from .simpleParallax wrapper container
          instance.unWrapElement();
        }
      }); // if no instances left, remove the raf and resize event = simpleParallax fully destroyed

      if (!instances.length) {
        // cancel the animation frame
        window.cancelAnimationFrame(frameID); // detach the resize event

        window.removeEventListener('resize', this.refresh); // Reset isInit

        isInit = false;
      }
    }
  }]);

  return SimpleParallax;
}();



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(524);
/******/ })()
;
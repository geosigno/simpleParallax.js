//Polyfills
import './polyfills/raf';
import './polyfills/closest';

//Parallax class
import Parallax from './simpleParallax';

//handle function
const simpleParallax = (elements, options) => {
    for (var i = 0; i < elements.length; i++) {
        new Parallax(elements[i], options)
    }
}

//export simpleParallax Method
export default simpleParallax;
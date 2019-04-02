import simpleParallax from './simpleParallax';

let images = document.querySelectorAll('img');
var myPluginInstance = new simpleParallax(images, {
    orientation: 'up'
});

import SimpleParallax from '../src/simpleParallax';

let images = document.querySelectorAll('img');
const options = {
    breakpoint: '480'
    // orientation: 'down',
    // scale: 1.5,
    // overflow: true
};

let instance = new SimpleParallax(images, options);

// setTimeout(() => {
//     instance.destroy();
// }, 3000);

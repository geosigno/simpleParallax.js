import simpleParallax from '../src/simpleParallax';
// var simpleParallax = require('../dist/simpleParallax');


// let images = document.querySelectorAll('img'),
//     instance;

let instanceUp;
const optionUp = {
    orientation: 'up',
    scale: 1.3,
    // customWrapper: '.customWrapper'
    // customContainer: document.querySelector('.container')
};
const imageUp = document.getElementsByTagName('img');

const images = document.querySelectorAll('video, img');
// images.forEach((image) => {
const instance = new simpleParallax(images, optionUp);
// });

// setTimeout(() => {
//     instance.destroy();
// }, 3000);


// instanceUp = new SimpleParallax('img', optionUp);

// let instanceDown,
//     optionDown = {
//         orientation: 'down'
//     },
//     imageDown = document.querySelectorAll('img.down');

// instanceDown = new SimpleParallax(imageDown, optionDown);

// setTimeout(() => {
//     instanceDown.destroy();
// }, 3000);

// setTimeout(() => {
//     instanceDown.destroy();
// }, 6000);

// images.forEach(image => {
//     let options = {
//         breakpoint: '480'
//         // orientation: 'down',
//         // scale: 1.5,
//         // overflow: true
//     };
//     if (image.classList.contains('up')) {
//         options.orientation = 'up';
//     }
//     if (image.classList.contains('down')) {
//         options.orientation = 'down';
//     }
//     if (image.classList.contains('right')) {
//         options.orientation = 'right';
//     }
//     if (image.classList.contains('left')) {
//         options.orientation = 'left';
//     }

//     // console.log(options);
//     instance = new SimpleParallax(image, options);
//     // console.log(instance);
// });

// setTimeout(() => {
//     instance.destroy();
// }, 3000);

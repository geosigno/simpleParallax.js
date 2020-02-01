import SimpleParallax from '../src/simpleParallax';

// let images = document.querySelectorAll('img'),
//     instance;

let instanceUp;
const optionUp = {
    orientation: 'up',
    maxTransition: 50,
    scale: 1.5,
    overflow: true
    // customContainer: document.querySelector('.container')
};
const imageUp = document.getElementsByTagName('img');

const images = document.querySelectorAll('img');
// images.forEach((image) => {
new SimpleParallax(images, optionUp);
// });

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

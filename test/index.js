import SimpleParallax from '../src/simpleParallax';

// let images = document.querySelectorAll('img'),
//     instance;

let instanceUp,
    optionUp = {
        orientation: 'down'
    },
    imageUp = document.querySelectorAll('img.up');

instanceUp = new SimpleParallax(imageUp, optionUp);

let instanceDown,
    optionDown = {
        orientation: 'left'
    },
    imageDown = document.querySelectorAll('img.down');

instanceDown = new SimpleParallax(imageDown, optionDown);

// setTimeout(() => {
//     instanceUp.destroy();
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

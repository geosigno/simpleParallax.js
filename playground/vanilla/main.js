import SimpleParallax from '../../src/vanilla/';

// Ensure the DOM content is fully loaded before initializing the plugin
document.addEventListener('DOMContentLoaded', function() {
    // Select all elements with the class 'parallax'
    const elements = document.querySelectorAll('img');
    
    for (let i = 0; i < elements.length; i++) {
        new SimpleParallax(elements[i], {
            // You can add plugin options here
            delay: 0.6,
            orientation: 'up',
            scale: 1.2,
            transition: 'cubic-bezier(0,0,0,1)',
            customContainer: '',
            customWrapper: '',
          });
    }
});
  
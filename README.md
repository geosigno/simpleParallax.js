![simpleParallax logo](https://simpleparallax.b-cdn.net/images/logo.png?new=new)

[![GitHub version](https://badge.fury.io/gh/geosenna%2FsimpleParallax.svg)](https://badge.fury.io/gh/geosenna%2FsimpleParallax) [![Only 32 Kb](https://badge-size.herokuapp.com/geosigno/simpleParallax.js/master/dist/simpleParallax.min.js)](https://github.com/geosigno/simpleParallax.js/blob/master/strapdown.min.js) [![](https://img.shields.io/npm/dm/simple-parallax-js)](https://www.npmjs.com/package/simple-parallax-js) [![GitHub issues](https://img.shields.io/github/issues/geosigno/simpleParallax.js.svg)](https://GitHub.com/geosigno/simpleParallax.js/issues/) [![](https://data.jsdelivr.com/v1/package/npm/simple-parallax-js/badge?style=rounded)](https://www.jsdelivr.com/package/npm/simple-parallax-js) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# simpleParallax.js

simpleParallax.js is a very simple and tiny Vanilla JS library that adds parallax animations on any images.

Where it may be laborious to get results through other plugins, simpleParallax.js stands out for its ease and its visual rendering. The parallax effect is directly applied to image tags, there is no need to use background images. More info on the case study [here](https://medium.com/@geoffrey.signorato/case-study-create-a-parallax-effect-directly-on-img-tags-with-javascript-35b8daf81471).

Any image will fit. Try it out!


## Installation

### Old way

Simply copy/paste the below snippet just before your closing `</body>` tag:

```html
<script src="simpleParallax.js"></script>
```

or use the below CDN link provided by [jsDelivr.com](https://www.jsdelivr.com/package/npm/simple-parallax-js):

```html
<script src="https://cdn.jsdelivr.net/npm/simple-parallax-js@5.6.1/dist/simpleParallax.min.js"></script>
```

### Via [npm/yarn](https://www.npmjs.com/package/simple-parallax-js)

You can also install it via:

```sh
#npm
npm install simple-parallax-js

#yarn
yarn add simple-parallax-js
```

and then import it as follows:

```javascript
//ES6 import
import simpleParallax from 'simple-parallax-js';

//CommonJS
const simpleParallax = require('simple-parallax-js');
```

## Initialization

Giving the following HTML:

```html
 <img class="thumbnail" src="image.jpg" alt="image">
```

simply add the following JavaScript code:

```javascript
const image = document.getElementsByClassName('thumbnail');
new simpleParallax(image);
```

and voilà!

___

You can also choose to apply the parallax on multiple images:

```javascript
const images = document.querySelectorAll('img');
new simpleParallax(images);
```

Once simpleparallax has been correctly initialized, it adds the ```simple-parallax-initialized``` class on the container.

simpleParallax now works with video:

```html
<video>
  <source src="video.mp4" type="video/mp4">
</video>
```

```javascript
var video = document.getElementsByTagName('video');
new simpleParallax(video);
```

## Settings

Setting | Type | Default | Hint
--- | --- | --- | ---
orientation | String | up | up - right - down - left - up left - up right - down left - down right
scale | Number | 1.3 | need to be above 1
overflow | Boolean | false | 
delay | Number | 0 | the delay is in second **Watch out, sometimes this delay is causing issue on iOS devices [#47](https://github.com/geosigno/simpleParallax.js/issues/47)**
transition | String | '' | any CSS transition
customContainer | String or Node | '' | 
customWrapper | String | '' | the selector of the custom wrapper
maxTransition | Number | 0 | it should be a percentage between 1 and 99

You can apply these settings with the following JS code:

```javascript
var images = document.querySelectorAll('.thumbnail');
new simpleParallax(images, {
    delay: 0,
    orientation: 'down',
    scale: 1.3,
    overflow: true,
    customContainer: '.container',
    customWrapper: '.wrapper'
});
```

### orientation - *String* - see [example](https://simpleparallax.com#example-orientation)
This is the orientation (or direction) of the parallax effect. Choose *up* and when scrolling down, the image will translate from the bottom to the top (so the image will translate up). When scrolling up, the image will translate from the top to the bottom. Same logic applies for all others orientations (*right*, *down*, *left*, *up left*, *up right*, *down left* or *down right*). When 2 directions are combined (for example *down right*), the image will translate diagonally.

### scale - *Number* - see [example](https://simpleparallax.com#example-scale)
The higher the scale is set, the more visible the parallax effect will be. In return, the image will lose in quality. To reduce the lossless effect, if the scale is set at 1.5 and your image is 500px width, do the simple math 500 * 1.5 = 750. So you can choose a 750px image to replace your 500px one, and don't see any quality leak. More information is available if you read the case study [here](https://medium.com/@geoffrey.signorato/case-study-create-a-parallax-effect-directly-on-img-tags-with-javascript-35b8daf81471).

### overflow - *Boolean* - see [example](https://simpleparallax.com#example-overflow)
By default, the image is scaled to apply a parallax effect without any overflow on the layout - you can check the [case study](https://medium.com/@geoffrey.signorato/case-study-create-a-parallax-effect-directly-on-img-tags-with-javascript-35b8daf81471) to have a better understanding. When *overflow* is set to true, the image will translate out of its natural flow (so it may overlap with your content).

### delay - *Number* - see [example](https://simpleparallax.com#example-delay-transition)
When a *delay* is set, the translation of the image will continue during that delay when the user stops scrolling. That gives a very nice effect. The delay is in second. **Watch out, sometimes this delay is causing issue on iOS devices [#47](https://github.com/geosigno/simpleParallax.js/issues/47)**

### transition - *String* - see [example](https://simpleparallax.com#example-delay-transition)
The *transition* setting works closely with the *delay* setting. This setting will add any CSS transition to the delay setting. For example, you can use *ease* or *ease-in-out*.

### customContainer - *String or Node*
By default, the parallax calculation is done with the body scroll percentage. In some cases, the images may be in a container that has its own scroll area, so to have an accurate calculation, the custom container should be set.

### customWrapper - *String*
In some cases, you want to use your own wrapper instead of the one created by the plugin. If you specify your custom wrapper, the plugin will add the "simpleParallax" class along with an "overflow: hidden" style.

### maxTransition - *Number* - see [example](https://simpleparallax.com#example-max-transition)
The maxTransition setting should be used to stop the parallax animation after a given percentage. By default, it translates from 0% to 100% of the user viewport. You can change it here to any percentage you want.

## Methods

### refresh
Refresh a simpleParallax instance (to recalculate all the positions): 

```javascript
var images = document.querySelectorAll('img');
var instance = new simpleParallax(images);
instance.refresh();
```

By default, the refresh method is fired at every window resize.

### destroy
Destroy a simpleParallax instance:

```javascript
var images = document.querySelectorAll('img');
var instance = new simpleParallax(images);
instance.destroy();
```

## Examples
You can find all the examples [here](https://simpleparallax.com/#examples).

## Compatibility
| IE | Edge | Firefox | Chrome | Safari | Opera | iOS Safari |
|---|---|---|---|---|---|---|
| no support | 16+ | 55+ | 58+ | 12.1+ | 45+ | 12.2+ |

Even though old browsers are not supported, the page won't crash. Simply, there will be no parallax.

If you want to support older browsers such as IE, you will need a polyfill for [cloest()](https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill) and [Intersection Observer](https://github.com/w3c/IntersectionObserver/tree/master/polyfill). Please note that even with polyfills, the parallax effect will not seem fluid.

## Author

[Geoffrey Signorato](https://github.com/geosigno/)

## Contributing

Open an issue or a pull request to suggest changes or additions.


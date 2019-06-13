![simpleParallax logo](https://simpleparallax.com/images/logo.png?new)

[![GitHub version](https://badge.fury.io/gh/geosenna%2FsimpleParallax.svg)](https://badge.fury.io/gh/geosenna%2FsimpleParallax)
[![](https://data.jsdelivr.com/v1/package/npm/simple-parallax-js/badge?style=rounded)](https://www.jsdelivr.com/package/npm/simple-parallax-js)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# What is simpleParallax?

simpleParallax is a very simple and tiny Vanilla JS library which adds parallax animations on any images.

Where it may be laborious to get results through other plugins, simpleParallax stands out for its ease and its visual rendering. The parallax effect is directly applied on image tags, there is no need to use background images. You can read one case study [here](https://medium.com/@geoffrey.signorato/case-study-create-a-parallax-effect-directly-on-img-tags-with-javascript-35b8daf81471).

Any image will fit. Try it out!


## Installation

Simply copy/paste the below snippet just before your closing `</body>` tag:

```html
<script src="simpleParallax.js"></script>
```

or use the below CDN link provided by [jsDelivr.com](https://www.jsdelivr.com/package/npm/simple-parallax-js):

```html
<script src="https://cdn.jsdelivr.net/npm/simple-parallax-js@5.1.0/dist/simpleParallax.min.js"></script>
```

or you can install it via [npm/yarn](https://www.npmjs.com/package/simple-parallax-js):

```sh
#npm
npm install simple-parallax-js

#yarn
yarn add simple-parallax-js
```

You can import it as follow:

```javascript
import simpleParallax from 'simple-parallax-js';
```

## Initialization

Giving the following HTML:

```html
 <img class="thumbnail" src="image.jpg" alt="image">
```

Simply add the following JavaScript code:

```javascript
var image = document.getElementsByClassName('thumbnail');
new simpleParallax(image);
```

This also work with several images:

```javascript
var images = document.querySelectorAll('img');
new simpleParallax(images);
```
## Settings

Setting | Type | Default | Hint
--- | --- | --- | ---
orientation | string | up | up - right - down - left - up left - up right - down left - down right
scale | int | 1.3 | need to be above 1.0
overflow | boolean | false | 
delay | int | 0.4 | the delay is in second
transition | string | false | any CSS transition
breakpoint | int | false | the breakpoint is in pixel

You can apply these settings with the following JS code:

```javascript
var images = document.querySelectorAll('.thumbnail');
new simpleParallax(images, {
    delay: 0,
    orientation: 'down',
    scale: 1.3,
    overfow: true
});
```

### orientation - *string*
This is the direction of the parallax effect. Choose *up* and when scrolling down, the image will translate from bottom to top. When scroll up, the image will translate from top to bottom.

### scale - *int*
The higher the scale is set, the more visible the parallax effect will be. In return, the image will lose in quality. To reduce the lossless effect, if the scale is set at 1.5 and you image is 500px width, do the simple math 500 * 1.5 = 750. So you can choose a 750px image to replace your 500px one, and don't see any quality leak.

### overflow - *boolean*
By default, the image is scaled to apply a parallax effect without any overflow on the layout (you can check the [case study](https://medium.com/@geoffrey.signorato/case-study-create-a-parallax-effect-directly-on-img-tags-with-javascript-35b8daf81471) to have a better understanding). when overflow is set to true, the image will translate out of its natural flow.

### delay - *int*
When a delay is set, the translation of the image will slightly continue when the user stop scrolling. That gives a very nice effect.

### transition - *string*
The transition works closely with the delay setting. The transition will add any CSS effect to the delay setting.

### breakpoint - *int*
The minimum breakpoint from where simpleParallax should be initialized and to where simpleParallax should be destroyed.

## Methods
Destroy a simpleParallax instance:

```javascript
var images = document.querySelectorAll('img');
var instance = new simpleParallax(images);
instance.destroy();
```
## Examples
You can find some examples [here](https://simpleparallax.com/#examples).

## Compatibility
You can apply simpleParallax on picture tags/srcset images.

## Author

[Geoffrey Signorato](https://github.com/geosigno/)

## Contributing

Open an issue or a pull request to suggest changes or additions.


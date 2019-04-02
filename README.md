![simpleParallax logo](https://anakao-theme.com/build/images/logo.png)

[![GitHub version](https://badge.fury.io/gh/geosenna%2FsimpleParallax.svg)](https://badge.fury.io/gh/geosenna%2FsimpleParallax)
[![](https://data.jsdelivr.com/v1/package/npm/simple-parallax-js/badge?style=rounded)](https://www.jsdelivr.com/package/npm/simple-parallax-js)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# Why use simpleParallax?

simpleParallax is a very simple and lightweight Vanilla JS plugin that improve your website with parallax animations on your images.

Where it may be laborious to get results through other plugins, simpleParallax stands out for its ease and its visual rendering. The parallax effect is directly applied on image tags, there is no need to use background images.

Any image will fit. Try it out!

# How to use it?

## 1. Install the plugin

### Copy/paste

Simply copy/paste the below snippet just before your closing `<body>` tag:

```html
<script src="simpleParallax.js"></script>
```

or use the below CDN link provided by jsDelivr.com

```html
<script src="https://cdn.jsdelivr.net/npm/simple-parallax-js@4.2.0/dist/simpleParallax.min.js"></script>
```

or

### Module

```sh
#npm
npm install simple-parallax-js

#yarn
yarn add simple-parallax-js
```

Then you can simply import it:

```sh
import simpleParallax from 'simple-parallax-js';
```

## 2. Initialize the plugin

Giving the following HTML:

```html
<img class="thumbnail" src="image.jpg" alt="image" />
```

Simply add the following JS code:

```javascript
var images = document.getElementsByClassName('thumbnail');
var instances = new simpleParallax(images);
// or
var instance = new simpleParallax(images[0]);
```

## 3. Settings

Find below the different settings you can apply to simpleParallax:

| setting     | default               |                                                                                                                                                                                                                      |
| ----------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| delay       | 0.6                   | add some delay for parallax animations - in second                                                                                                                                                                   |
| orientation | up                    | choose the parallax orientation effect - _up_, _right_, _down_ or _left_                                                                                                                                             |
| scale       | 1.2                   | choose the scale ratio - need to be above _1.0_                                                                                                                                                                      |
| overflow    | false                 | by default, the image is scaled to apply a parallax effect without any overflow on the original image container. If overflow is set to true, the image will be translated out of its natural flow without any scale. |
| transition  | cubic-bezier(0,0,0,1) | choose the css transition (will work only if delay is different that 0) - _ease_, _linear_, _ease-in_, etc.                                                                                                          |
| breakpoint  | false                 | choose the minimum breakpoint (in pixel) where simpleParallax will be initialized - _768_                                                                                                                            |

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

## 4. Methods

### Destroy

destroy a single instance

```javascript
instance.destroy();
```

destroy several instances

```javascript
instances.forEach(instance => instance.destroy());
```

# Good to know

-   The higher the scale setting is set, the more visible the parallax effect will be. In return, the image will lose in quality (no loss of quality if overlow option is set to false)

-   This plugin apply parallax on the image tag and not the background image. This gives you a lot of flexibility and can be added to any image.

-   You can apply simpleParallax on picture/srcset images

# Author

[Geoffrey Signorato](https://github.com/geosenna/)

# Contributing

Open an issue or a pull request to suggest changes or additions.

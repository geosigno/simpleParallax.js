<div align="center">
<picture>
  <source srcset="https://simpleparallax.com/logo/logo-dark.svg" media="(prefers-color-scheme: dark)">
  <source srcset="https://simpleparallax.com/logo/logo-light.svg" media="(prefers-color-scheme: light)">
  <img src="https://simpleparallax.com/logo/logo-light.svg" alt="simpleParallax.js" width="391" height="64">
</picture>
</div>

# simpleParallax.js

[![npm version](https://img.shields.io/npm/v/simple-parallax-js.svg)](https://www.npmjs.com/package/simple-parallax-js)
[![npm downloads](https://img.shields.io/npm/dm/simple-parallax-js.svg)](https://www.npmjs.com/package/simple-parallax-js)
[![types included](https://img.shields.io/npm/types/simple-parallax-js.svg)](https://www.npmjs.com/package/simple-parallax-js)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/simple-parallax-js.svg)](https://bundlephobia.com/package/simple-parallax-js)
[![license](https://img.shields.io/npm/l/simple-parallax-js.svg)](./LICENSE)

**simpleParallax.js** is a lightweight, easy-to-use **React** and vanilla-JavaScript library that adds a parallax effect to any image. It works out of the box with **React**, **Next.js**, and plain JavaScript — the effect is applied directly to your `<img>` tags, with no background images needed.

While other plugins can be complex, simpleParallax.js is notable for its simplicity and impressive visual effects. Any image can be used. More info in the case study [here](https://medium.com/@geoffrey.signorato/case-study-create-a-parallax-effect-directly-on-img-tags-with-javascript-35b8daf81471).

Give it a try!

## Installation

Install the package with your favourite package manager:

```sh
npm install simple-parallax-js
yarn add simple-parallax-js
pnpm add simple-parallax-js
bun add simple-parallax-js
```

For the React version, `react` and `react-dom` are peer dependencies (`>= 17`) — they use the React already installed in your project.

The package is written in TypeScript and ships type definitions for **both** entry points (React and vanilla), so no extra `@types` package is needed.

Import it:

```javascript
//React version
import SimpleParallax from 'simple-parallax-js';

//Vanilla Version
import SimpleParallax from "simple-parallax-js/vanilla";
```

## Initialization

### React

Simply add the following JavaScript code:

```javascript

import SimpleParallax from "simple-parallax-js";

const Component = () => (
  <SimpleParallax>
    <img src={"thumbnail.jpg"} alt={"image"} />
  </SimpleParallax>
)

```
### Vanilla

Giving the following HTML :

```html
 <img class="thumbnail" src="image.jpg" alt="image">
```

simply add the following JavaScript code :

```javascript
const image = document.getElementsByClassName('thumbnail');
new SimpleParallax(image);
```

You can also choose to apply the parallax on multiple images :

```javascript
const images = document.querySelectorAll('img');
new SimpleParallax(images);
```

Once simpleparallax has been correctly initialized, it adds the ```simple-parallax-initialized``` class on the container.

## Settings

Setting | Type | Default | Hint
--- | --- | --- | ---
orientation | String | up | up - right - down - left - up left - up right - down left - down right
scale | Number | 1.5 | need to be above 1
overflow | Boolean | false | 
delay | Number | 0.4 | in seconds, the time the image takes to catch up with the scroll (0 = no smoothing)
easing | String | smooth | smooth - spring - bounce
maxTransition | Number | 0 | it should be a percentage between 1 and 99
customContainer | String or Node | '' | (Vanilla version only)
customWrapper | String | '' | the selector of the custom wrapper (Vanilla version only)

You can apply these settings with the following JS code :

### React

```javascript
import SimpleParallax from "simple-parallax-js";

const Component = () => (
  <SimpleParallax 
    delay={0}
    orientation={"down"}
    scale={1.5}
    overflow
    maxTransition={60}
  >
    <img src={"thumbnail.jpg"} alt={"image"} />
  </SimpleParallax>
)
```

### Next

In the App Router, use it inside a Client Component:

```javascript
"use client";

import SimpleParallax from "simple-parallax-js";
import Image from "next/image";

const Component = () => (
  <SimpleParallax 
    delay={0}
    orientation={"down"}
    scale={1.5}
    overflow
    maxTransition={60}
  >
    <Image src={"thumbnail.jpg"} alt={"image"} width={1920} height={1024} />
  </SimpleParallax>
)
```

### Vanilla

```javascript
var images = document.querySelectorAll('.thumbnail');
new SimpleParallax(images, {
    delay: 0,
    orientation: 'down',
    scale: 1.5,
    overflow: true,
    customContainer: '.container',
    customWrapper: '.wrapper'
});
```

### orientation - *String* - see [example](https://simpleparallax.com#example-orientation)
The parallax effect's orientation, or direction, can be customized. If you choose *up*, the image will move from bottom to top as you scroll down, and from top to bottom as you scroll up. This same logic applies for all other orientations, including *right*, *down*, *left*, *up left*, *up right*, *down left*, and *down right*. If two directions are combined, such as *down right*, the image will move diagonally.

### scale - *Number* - see [example](https://simpleparallax.com#example-scale)
The higher the *scale* setting, the more pronounced the parallax effect becomes. However, this can cause the image quality to diminish. To mitigate this, if the *scale* is set at 1.5 and your image width is 500px, simply multiply 500 by 1.5 to get 750. You can then use a 750px image in place of your 500px one to maintain image quality. More information can be found in the case study linked [here](https://medium.com/@geoffrey.signorato/case-study-create-a-parallax-effect-directly-on-img-tags-with-javascript-35b8daf81471).

### overflow - *Boolean* - see [example](https://simpleparallax.com#example-overflow)
By default, the image scales to create a parallax effect without any overflow on the layout - for a better understanding, review the [case study](https://medium.com/@geoffrey.signorato/case-study-create-a-parallax-effect-directly-on-img-tags-with-javascript-35b8daf81471). When overflow is set to true, the image will translate beyond its natural flow, potentially overlapping your content.

### delay - *Number* - see [example](https://simpleparallax.com#example-delay)
Setting a delay prolongs the image's translation even after the user has stopped scrolling, creating a pleasing effect. This delay is measured in seconds: it is roughly the time the image takes to catch up with the scroll. With a delay of 0, the image follows the scroll exactly, with no smoothing.

The smoothing is computed by the plugin on every frame rather than with a CSS transition, so it stays fluid with a mouse wheel and on touch devices. For that reason the plugin sets `transition: none` on the image: do not rely on a CSS transition of your own on its `transform`.

### easing - *String* - see [example](https://simpleparallax.com#example-delay)
The easing setting defines how the image catches up with the scroll during the delay. It has no effect when the delay is 0.

- `smooth` (default): starts fast and slows down progressively.
- `spring`: starts and ends gently, without overshooting.
- `bounce`: slightly overshoots the target before coming back. The faster the scroll, the more visible the bounce.

### maxTransition - *Number* - see [example](https://simpleparallax.com#example-maxTransition)
The maxTransition setting controls the extent of the parallax animation. By default, it translates from 0% to 100% of the user's viewport. You can adjust this to any percentage.

### customContainer - *String or Node* - Vanilla version only
Parallax calculations default to the body scroll percentage. However, images may be in a container with its own scroll area. For accurate calculations, set a custom container.

### customWrapper - *String* - Vanilla version only
In some instances, you might want to use your own wrapper instead of the plugin's. Specifying a custom wrapper will add the simpleParallax class and an overflow: hidden style.

## Methods

The methods are available in the Vanilla version only.

### refresh
Refresh a simpleParallax instance (to recalculate all the positions) : 

```javascript
var images = document.querySelectorAll('img');
var instance = new SimpleParallax(images);
instance.refresh();
```

By default, the refresh method is fired at every window resize.

### destroy
Destroy a simpleParallax instance:

```javascript
var images = document.querySelectorAll('img');
var instance = new SimpleParallax(images);
instance.destroy();
```

## Examples
You can find all the examples [here](https://simpleparallax.com/#examples).

## Accessibility

The parallax effect is turned off when the user prefers reduced motion (`prefers-reduced-motion: reduce`).

## Compatibility

simpleParallax.js works in all modern browsers: the latest versions of Chrome, Edge, Firefox, Safari and Opera, on desktop and mobile. The library ships modern **ES2020** code; if you need to support older browsers, transpile it with your bundler.

## Author

[Geoffrey Signorato](https://github.com/geosigno/)

## Contributing

Open an issue or a pull request to suggest changes or additions.


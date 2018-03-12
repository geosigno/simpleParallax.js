![simpleParallax logo](https://anakao-theme.com/simpleparallax/img/social/base-github.png)

# Why use simpleParallax?

simpleParallax is a very simple and lightweight jQuery plugin that improve your website with parallax animations on your images.

Where it may be laborious to get results through other plugins, simpleParallax stands out for its ease and its visual rendering. The parallax effect is directly applied on image tags, there is no need to use background images.

Any image will fit. Try it out!

# How to use it?

## 1. Install the plugin

Make sure jQuery library is loaded before the plugin.

### Copy/paste

Simply copy/paste the below snippet just before your closing `<body>` tag:

```html
<script src="jquery.js"></script>
<script src="simpleParallax.js"></script>
```

or use the below CDN link provided by jsDelivr.com

```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/simple-parallax-jquery@2.0.0/src/simpleParallax.min.js"></script>
```

### Install it via Package Managers

```sh
#npm
npm install simple-parallax-jquery

#yarn
yarn add simple-parallax-jquery

#bower
bower install simpleParallax
```

## 2. Initialize the plugin

Giving the following HTML:

```html
<img class="thumbnail" src="image.jpg" alt="image">
```

Simply add the following jQuery code:

```javascript
$('.thumbnail').simpleParallax();
```

## 3. Settings

Find below the different settings you can apply to simpleParallax:

| setting     | default |   |
|-------------|---------|---|
| orientation | up      | choose the parallax orientation effect - *up*, *right*, *down* or *left* |
| scale       | 1.2     | choose the scale ratio - need to be above *1.0*  |

You can apply these settings with the following jQuery code:

```javascript
$('img').simpleParallax({scale: '1.30', orientation: 'down'});
```

## 4. Good to know

* The higher the scale setting is set, the more visible the parallax effect will be. In return, the image will lose in quality.

* This plugin apply parallax on the image tag and not the background image. This gives you a lot of flexibility and can be added to any image.

* You can apply simpleParallax on picture/srcset images

## Author

[Geoffrey Signorato](https://github.com/geosenna/)

## Contributing

Open an issue or a pull request to suggest changes or additions.



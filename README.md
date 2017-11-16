# SimpleParallax

simpleParallax is a simple and lightweight jQuery plugin that gives your website parallax animations on the images.

# How to use it

## 1. Getting started

Make sure jQuery library is loaded before the plugin.

### Copy/paste

Simply copy/paste the below snippet just before your closing `<body>` tag:

```html
<script src=""></script>
```

### Install it via Bower

```sh
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
| orientation | up      | choose the parallax orientation effect - *up* or *down* |
| scale       | 1.2     | choose the scale ratio - need to be above *1.0*  |

You can apply these settings with the following jQuery code:

```javascript
$('img').simpleParallax({scale: '1.30', orientation: 'down'});
```

## 4. Good to know

* Higher the scale setting is set, the more the parallax effect will be visible. In return, the image will lose in quality.

* This plugin is defined directly on the image tag instead of background image. This gives you a lot of flexibility and can be added to any image.

* You can apply simpleParallax on image tags even inside a picture tag. It also works with srcset function.

# SimpleParallax

Apply a nice Parallax effect on image in a minute.

# How to use it

## 1. Getting started

Make sure jQuery is loaded before the plugin

### Copy/paste

Simply copy/paste the snippet below juste before the closing `<body>` tag

```
<script src=""></script>
```

### Use Bower

Or enter the following commande line in your terminal

```
bower install simpleParallax
```

## 2. Initialize the plugin

Giving this simple HTML markup

```
<section>
    <img src="image01.jpg" alt="image 01">
    <img src="image02.jpg" alt="image 02">
    <img src="image03.jpg" alt="image 03">
</section>
```

Simply add the following JS code

```
$('img').easyParallax();
```

## 3. Settings

Here are the different settings you can apply to simpleParallax

| setting     | default |   |
|-------------|---------|---|
| orientation | up      | choose the orientation of the parallax effect (*up* or *down*) |
| scale       | 1.2     | choose the scale ratio (need to be above *1.0*)  |

Please note that more the scale setting will be high, more the effect parallax will be visible. In return, the image will lose quality.

```
$('img').easyParallax({scale: '1.30', orientation: 'down'});
```
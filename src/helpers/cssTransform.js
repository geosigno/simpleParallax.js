// Detect css transform
const cssTransform = () => {
    var prefixes = 'transform webkitTransform mozTransform oTransform msTransform'.split(' '),
        cssTransform,
        i = 0;
    while (cssTransform === undefined) {
        cssTransform = document.createElement('div').style[prefixes[i]] != undefined ? prefixes[i] : undefined;
        i++;
    }
    return cssTransform;
}

export default cssTransform();
// Detect css transform
const cssTransform = () => {
    const prefixes = 'transform webkitTransform mozTransform oTransform msTransform'.split(' ');
    let transform;
    let i = 0;
    while (transform === undefined) {
        transform = document.createElement('div').style[prefixes[i]] !== undefined ? prefixes[i] : undefined;
        i += 1;
    }
    return transform;
};

export default cssTransform();

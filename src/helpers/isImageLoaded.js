// check if image is fully loaded
const isImageLoaded = (image) => {
    // check if image is set as the parameter
    if (!image) {
        return false;
    }

    // check if image has been 100% loaded
    if (!image.complete) {
        return false;
    }

    // check if the image is displayed
    if (typeof image.naturalWidth !== 'undefined' && image.naturalWidth === 0) {
        return false;
    }

    return true;
};

export default isImageLoaded;
